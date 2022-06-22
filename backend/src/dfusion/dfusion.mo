/**
 * Module     : dfusion.mo
 * Copyright  : 2021 Rocklabs
 * License    : Apache 2.0 with LLVM Exception
 * Maintainer : Rocklabs <hello@rocklabs.io>
 * Stability  : Experimental
 */

import Array "mo:base/Array";
import Bool "mo:base/Bool";
import Bucket "./bucket";
import Buffer "mo:base/Buffer";
import Cycle "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import Hash "mo:base/Hash";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Option "mo:base/Option";
import Order "mo:base/Order";
import Prelude "mo:base/Prelude";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Trie "mo:base/Trie";
import TrieMap "mo:base/TrieMap";
import TrieSet "mo:base/TrieSet";
import Types "./types";
import ICNFT "../ic-nft/motoko/src/main";
import NFTypes "../ic-nft/motoko/src/types";
import Notify "./notify";

shared(init_msg) actor class DFusion(
	owner_: Principal, 
	nft_: Principal, 
	notification_: Principal,
	index_: Principal
	) = this {
	type Entry = Types.Entry;
	type EntryExt = Types.EntryExt;
	type EntryDigest = Types.EntryDigest;
	type User = Types.User;
	type UserExt = Types.UserExt;
	type Config = Types.Config;
	type SetConfigRequest = Types.SetConfigRequest;
	type SetUserRequest = Types.SetUserRequest;
	type CreateEntryRequest = Types.CreateEntryRequest;

	public type MintResult = {
        #Ok: (Nat, Nat);
        #Err: Errors;
    };
	public type Errors = {
        #Unauthorized;
        #TokenNotExist;
        #InvalidOperator;
    };

	private let owner: Principal = owner_;
	private let nft_canister: ICNFT.NFToken = actor(Principal.toText(nft_));
	private let notification: Notify.Notification = actor(Principal.toText(notification_));
	private let inverted_index: Types.InvertedIndex = actor(Principal.toText(index_));

	private stable var authEntries : [(Principal, Bool)] = [(owner, true)];
	private var auths = TrieMap.fromEntries<Principal, Bool>(authEntries.vals(), Principal.equal, Principal.hash);

	// incremental id 
	private stable var id_count = 0;
	private stable var entryEntries : [(Nat, Entry)] = [];
	private var entries = TrieMap.fromEntries<Nat, Entry>(entryEntries.vals(), Nat.equal, Hash.hash);
	
	private stable var nftEntries: [(Nat, Int)] = [];
	private var nftMaps = TrieMap.fromEntries<Nat, Int>(nftEntries.vals(), Nat.equal, Hash.hash);
	
	// ignore performance issue of Array.append it would be called few times
	private stable var index: [Nat] = [];
	private stable var consume: [Nat] = [];
	private stable var table: [Principal] = [];

	private stable var userEntries : [(Principal, User)] = [];
	private var allUsers = TrieMap.fromEntries<Principal, User>(userEntries.vals(), Principal.equal, Principal.hash);

	private var creating: Bool = false;

	private stable let config: Config  = {
		var titleLimit = 256;
		var coverLimit = 256;
		var contentLimit = 2 * 1024 * 1024;
		var bucketLimit = 4 * 1024 * 1024 * 1024;
		var nameLimit = 32;
		var bioLimit = 256;
		var digestLimit = 128;
	};

	private func _newUser(id : Principal) : User {
		{
			id = id;
			var name = null;
			var bio = null;
			var entries = TrieSet.empty<Nat>();
			var followers = TrieSet.empty<Principal>();
			var following = TrieSet.empty<Principal>();
			var likes = TrieSet.empty<Nat>();
			var favorites = TrieSet.empty<Nat>();
		}
	};

	private func _newEntry(creator: Principal, title: Text, content : Text, cover: ?Text) : Entry {
		let id = id_count;
		let entry = {
			id = id;
			creator = creator;
			title = title;
			cover = cover;
			content = content;
			createAt = Time.now();
			var likes = TrieSet.empty<Principal>();
			var favorites = TrieSet.empty<Principal>();
			var deleted = false;
		};
		id_count += 1;
		entry
	};

	private func userRegister(user: Principal) : User {
		if (Principal.isAnonymous(user)) {
			Debug.trap("Anonymous user");
		};
		switch (allUsers.get(user)) {
			case null {
				let newUser = _newUser(user);
				allUsers.put(user, newUser);
				newUser
			};
			case (?u) { 
				u
			};
		};
	};

	private func _checkAuth(id: Principal) : Bool {
		switch (auths.get(id)) {
			case (?v) { v };
			case (_) { false };
		};
	};

	private func createBucket(entryId: Nat) : async Principal {
		creating := true;
		Cycle.add(1_000_000_000_000); // 1T cycles
		let res = await Bucket.Bucket(Principal.fromActor(this));
		consume := Array.append(consume, [0]);
		index := Array.append(index, [entryId]);
		table := Array.append(table, [Principal.fromActor(res)]);
		creating := false;
		Principal.fromActor(res)
	};

	private func getBucket(entryId: Nat) : Principal {
		var idx = 0;
		label l for (i in index.keys()) {
			if (entryId >= index[i]) {
				idx := i;
			} else {
				break l;
			};
		};
		table[idx]
	};

	public shared(msg) func addAuth(id: Principal) : async Bool {
		assert (msg.caller == owner);
		auths.put(id, true);
		return true;
	};

	public shared(msg) func removeAuth(id: Principal) : async Bool {
		assert (msg.caller == owner);
		auths.delete(id);
		return true;
	};

	// create an article entry of user msg.caller
	public shared(msg) func createEntry(request: CreateEntryRequest): async Result.Result<Nat, Text> {
		if (creating) {
			return #err("Creating bucket");
		};
		if (Text.size(request.title) == 0) {
			return #err("Title can not be empty");
		};
		if (Text.size(request.title) > config.titleLimit) {
			return #err("Title length over limit");
		};
		if (Text.size(request.content) == 0) {
			return #err("Content can not be empty");
		};
		if (Text.size(request.content) > config.contentLimit) {
			return #err("Content length over limit");
		};
		switch (request.cover) {
			case (null) {};
			case (?c) {
				if (Text.size(c) > config.coverLimit) {
					return #err("Cover length over limit");
				};
			};
		};
		let caller = msg.caller;
		let user = userRegister(caller);
		let content_length = Text.encodeUtf8(request.content).size();
		let entry = _newEntry(caller, request.title, request.content, request.cover);
		let bucket_principal = if (table.size() == 0) {
			await createBucket(entry.id)
		} else if (consume[table.size() -1] + content_length >= config.contentLimit) {
			await createBucket(entry.id)
		} else {
			table[table.size() - 1]
		};
		let bucket: Bucket.Bucket = actor(Principal.toText(bucket_principal));
		let consume_mut = Array.thaw<Nat>(consume);
		consume_mut[consume.size() - 1] += content_length;
		consume := Array.freeze(consume_mut);
		let ret = switch (await bucket.createEntry(Types.entryToExt(entry))) {
			case (#err(e)) {
				return #err(e);
			};
			case (#ok(o)) {
				o
			};
		};

		let entryDigest = Types.digestEntry(entry, config.digestLimit);
		entries.put(ret, entryDigest);
		user.entries := TrieSet.put(user.entries, ret, Hash.hash(ret), Nat.equal);

		ignore notification.notify({
			author = caller;
			authorName = Option.get(user.name, Principal.toText(caller));
			id = ret;
			title = entryDigest.title;
			contentDigest = entryDigest.content;
		});
		ignore inverted_index.add(
			Nat64.fromNat(ret),
			request.title,
			request.content
		);
		#ok(ret)
	};

	public shared(msg) func mintNFT(entryId: Nat): async Result.Result<Nat, Text> {
		switch (nftMaps.get(entryId)) {
			case (?n) {
				return #err("Entry has been minted");
			};
			case (null) {};
		};
		let caller = msg.caller;
		let entry = switch(entries.get(entryId)) {
			case (null) { 
				return #err("entry not exist"); 
			};
			case (?e) {
				e
			};
		};
		if (caller != entry.creator) {
			return #err("Unauthorized!");
		};
		let tokenMetadata: NFTypes.TokenMetadata = {
			filetype = "text"; 
			location = #Web("https://dfusion.io/entry/" # Nat.toText(entryId));
			attributes = [];
		};
		nftMaps.put(entryId, -1);
		let res: MintResult = await nft_canister.mint(caller, ?tokenMetadata);
		switch (res) {
			case (#Ok((id, _))) {
				nftMaps.put(entryId, id);
				return #ok(id);
			};
			case (#Err(e)) {
				nftMaps.delete(entryId);
				return #err("Error in minting nft: " # debug_show(e));
			};
		}
	};

	// msg.caller like an article,  or unlike an article if called twice
	// return true if like, otherwise unlike
	public shared(msg) func like(entryId: Nat): async Result.Result<Bool, Text> {
		let caller = msg.caller;
		let entry = switch(entries.get(entryId)) {
			case (null) { 
				return #err("entry not exist"); 
			};
			case (?e) {
				e
			};
		};
		let user = userRegister(caller);
		if (TrieSet.mem(entry.likes, caller, Principal.hash(caller),  Principal.equal)) {
			// already liked this article, unlike
			entry.likes :=  TrieSet.delete(entry.likes, caller, Principal.hash(caller), Principal.equal);
			user.likes := TrieSet.delete(user.likes, entryId, Hash.hash(entryId), Nat.equal);
			#ok(false)
		} else {
			// like this article
			entry.likes :=  TrieSet.put(entry.likes, caller, Principal.hash(caller), Principal.equal);
			user.likes :=  TrieSet.put(user.likes, entryId, Hash.hash(entryId), Nat.equal);
			#ok(true)
		};
	};

	// collect the article into favorites
	// return true if favor, otherwise unfavor
	public shared(msg) func favor(entryId: Nat): async Result.Result<Bool, Text> {
		let caller = msg.caller;
		let entry = switch(entries.get(entryId)) {
			case (null) { 
				return #err("entry not exist"); 
			};
			case (?e) {
				e
			};
		};
		let user = userRegister(caller);
		if (TrieSet.mem(entry.favorites, caller, Principal.hash(caller),  Principal.equal)) {
			entry.favorites :=  TrieSet.delete(entry.favorites, caller, Principal.hash(caller), Principal.equal);
			user.favorites := TrieSet.delete(user.favorites, entryId, Hash.hash(entryId), Nat.equal);
			#ok(false)
		} else {
			entry.favorites :=  TrieSet.put(entry.favorites, caller, Principal.hash(caller), Principal.equal);
			user.favorites :=  TrieSet.put(user.favorites, entryId, Hash.hash(entryId), Nat.equal);
			#ok(true)
		};
	};

	public shared(msg) func follow(user: Principal): async Bool {
		let caller = msg.caller;
		let userFollowing = userRegister(caller);
		let userFollowed = userRegister(user);
		if (TrieSet.mem(userFollowing.following, user, Principal.hash(caller),  Principal.equal)) {
			// already followed this user, unfollow
			userFollowing.following := TrieSet.delete(userFollowing.following, user, Principal.hash(user), Principal.equal);
			userFollowed.followers := TrieSet.delete(userFollowed.followers, caller, Principal.hash(caller), Principal.equal);
			false
		} else {
			// follow this article
			userFollowing.following := TrieSet.put(userFollowing.following, user, Principal.hash(user), Principal.equal);
			userFollowed.followers := TrieSet.put(userFollowed.followers, caller, Principal.hash(caller), Principal.equal);
			true
		};
	};

	public shared(msg) func setUserInfo(info: SetUserRequest) : async Result.Result<(), Text> {
		let caller = msg.caller;
		let user = userRegister(caller);
		switch (info.name) {
			case (null) {};
			case (?name) {
				if (Text.size(name) > config.nameLimit) {
					return #err("name length must less than " # Nat.toText(config.nameLimit));
				};
				if (Text.size(name) == 0) {
					user.name := null;
				} else {
					user.name := ?name;
				};
			};
		};
		switch(info.bio) {
			case (null) {};
			case (?bio) {
				if (Text.size(bio) > config.bioLimit) {
					return #err("bio length must less than " # Nat.toText(config.bioLimit));
				};
				if (Text.size(bio) == 0) {
					user.bio := null;
				} else {
					user.bio := ?bio;
				};
			};
		};
		#ok()
	};

	public func getEntry(entryId: Nat) : async Result.Result<EntryExt, Text> {
		let entry = switch(entries.get(entryId)) {
			case (null) { 
				return #err("entry not exist"); 
			};
			case (?e) {
				e
			};
		};
		let bucket_principal = getBucket(entryId);
		let bucket: Bucket.Bucket = actor(Principal.toText(bucket_principal));
		let res = await bucket.getEntry(entryId);
		switch (res) {
			case (#err(err_info)) {
				return #err(err_info);
			};
			case (#ok(e)) {
				return #ok({
					id = entry.id;
					creator = entry.creator;
					title = entry.title;
					cover = entry.cover;
					content = e.content;
					createAt = entry.createAt;
					likes = TrieSet.toArray(entry.likes);
					favorites = TrieSet.toArray(entry.favorites);
					deleted = entry.deleted;
				});
			};
		};
	};

	// only administrator can delete an entry
	// return true if delete successfully, otherwise false
	// public shared(msg) func deleteEntry(entryId: Nat) : async Bool {
	// 	assert(_checkAuth(msg.caller));
	// 	if (entryId >= allEntries.size()) {
	// 		return false;
	// 	};
	// 	allEntries[entryId].deleted := true;
	// 	true
	// };

	// public shared(msg) func clearData() : async Bool {
	// 	assert(_checkAuth(msg.caller));
	// 	allEntries := [];
	// 	for (user in allUsers.vals()) {
	// 		user.entries := TrieSet.empty<Nat>();
	// 	};
	// 	true
	// };

	public shared(msg) func setLimit(setConfigRequest: SetConfigRequest) : async Bool {
		assert(_checkAuth(msg.caller));
		config.titleLimit := Option.get(setConfigRequest.titleLimit, config.titleLimit);
		config.coverLimit := Option.get(setConfigRequest.coverLimit, config.coverLimit);
		config.contentLimit := Option.get(setConfigRequest.contentLimit, config.contentLimit);
		config.bucketLimit := Option.get(setConfigRequest.bucketLimit, config.bucketLimit);
		config.nameLimit := Option.get(setConfigRequest.nameLimit, config.nameLimit);
		config.bioLimit := Option.get(setConfigRequest.bioLimit, config.bioLimit);
		config.digestLimit := Option.get(setConfigRequest.digestLimit, config.digestLimit);
		true
	};

	public query func getUserEntries(id: Principal): async [EntryDigest] {
		let user = switch (allUsers.get(id)) {
			case (null) { 
				return []; 
			};
			case (?u) {
				u
			};
		};
		Array.mapFilter(
			Array.sort(
				TrieSet.toArray(user.entries), 
				func (a: Nat, b: Nat): Order.Order {
					Nat.compare(b, a)
				}
			),
			func (e: Nat): ?EntryDigest {
				Option.map(entries.get(e), Types.entryToDigest)
			}
		)
	};

	public query func getUserFavorites(id: Principal): async [EntryDigest] {
		let user = switch (allUsers.get(id)) {
			case (null) { 
				return []; 
			};
			case (?u) {
				u
			};
		};
		
		Array.mapFilter(
			Array.sort(
				TrieSet.toArray(user.likes),
				func (a: Nat, b: Nat): Order.Order {
					Nat.compare(b, a)
				}
			),
			func (e: Nat): ?EntryDigest {
				Option.map(entries.get(e), Types.entryToDigest)
			}
		)	
	};

	public query func getUserFollowingEntries(id: Principal): async [EntryDigest] {
		let user = switch (allUsers.get(id)) {
			case (null) { 
				return []; 
			};
			case (?u) {
				u
			};
		};
		Array.mapFilter(
			Array.mapFilter(
				TrieSet.toArray(user.following),
				func (p: Principal): ?Nat {
					Option.chain<User, Nat>(allUsers.get(p), func (u: User): ?Nat {
						let arr = TrieSet.toArray(u.entries);
						if (arr.size() == 0) {
							return null;
						};
						?Array.foldLeft<Nat, Nat>(
							arr, 0,
							Nat.max
						)
					})
				}
			),
			func (e: Nat): ?EntryDigest {
				Option.map(entries.get(e), Types.entryToDigest)
			}
		)
	};

	public query func getEntries(first: Nat32, skip: Nat32): async [EntryDigest] {
		let buf = Buffer.Buffer<EntryDigest>(Nat32.toNat(skip));
		label pagination for (i in Iter.range(Nat32.toNat(skip), Nat32.toNat(first + skip))) {
			if (id_count <= i) {
				break pagination;
			};
			switch(entries.get(id_count - i - 1)) {
				case (null) { };
				case (?e) {
					buf.add(Types.entryToDigest(e))
				}
			};
		};
		buf.toArray()
	};

	public query func isNFT(entries: [Nat]) : async [Bool] {
		Array.map(entries, func (entry: Nat) : Bool {
			switch (nftMaps.get(entry)) {
				case (?e) {
					e >= 0
				};
				case (null) {
					false
				};
			}
		})
	};

	// get user
	public query func getUser(id: Principal): async ?UserExt {
		Option.map(allUsers.get(id), Types.userToExt)
	};

	public query func getBucketInfo() : async ([Nat], [Nat], [Principal]) {
		(index, consume, table)
	};

	public func getBucketStableSize(bucket_principal: Principal) : async Nat64 {
		let bucket: Bucket.Bucket = actor(Principal.toText(bucket_principal));
		let res = await bucket.getStableSize();
		res
	};

	type ICActor = actor {
        update_settings: shared(params: UpdateSettingsParams) -> async ();
    };
	type CanisterId = {
        canister_id: Principal;
    };
	type UpdateSettingsParams = {
        canister_id: Principal;
        settings: CanisterSettings;
    };
	type CanisterSettings = {
        controllers : ?[Principal];
        compute_allocation : ?Nat;
        memory_allocation : ?Nat;
        freezing_threshold : ?Nat;
    };
	public shared(msg) func addControllerToBucket(bucket_principal: Principal, controllers: [Principal]) {
		assert(_checkAuth(msg.caller));
		let ic : ICActor = actor("aaaaa-aa");
		await ic.update_settings({
			canister_id = bucket_principal;
			settings = {
				controllers = ?controllers;
				compute_allocation = null;
				memory_allocation = null;
				freezing_threshold = null;
			};
		});
	};

	public shared(msg) func reset() {
		assert(_checkAuth(msg.caller));
		id_count := 0;
		allUsers := TrieMap.TrieMap<Principal, User>(Principal.equal, Principal.hash);
		entries := TrieMap.TrieMap<Nat, Entry>(Nat.equal, Hash.hash);
		nftMaps := TrieMap.TrieMap<Nat, Int>(Nat.equal, Hash.hash);
		index := [0];
		consume := [0];
		table := [table[0]];
		let bucket: Bucket.Bucket = actor(Principal.toText(table[0]));
		bucket.reset();
	};

	system func preupgrade() {
    	userEntries := Iter.toArray(allUsers.entries());
		authEntries := Iter.toArray(auths.entries());
		entryEntries := Iter.toArray(entries.entries());
		nftEntries := Iter.toArray(nftMaps.entries());
  	};

	system func postupgrade() {
		userEntries := [];
		authEntries := [];
		entryEntries := [];
		nftEntries := [];
	};
}
