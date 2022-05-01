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
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
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

shared(init_msg) actor class DFusion(owner_: Principal) = this {
	type Entry = Types.Entry;
	type EntryExt = Types.EntryExt;
	type EntryDigest = Types.EntryDigest;
	type User = Types.User;
	type UserExt = Types.UserExt;
	type Config = Types.Config;
	type SetConfigRequest = Types.SetConfigRequest;
	type SetUserRequest = Types.SetUserRequest;

	private let owner: Principal = owner_;

	private stable var authEntries : [(Principal, Bool)] = [(owner, true)];
	private let auths = TrieMap.fromEntries<Principal, Bool>(authEntries.vals(), Principal.equal, Principal.hash);

	// incremental id 
	private stable var id_count = 0;
	private stable var entryEntries : [(Nat, Entry)] = [];
	private let entries = TrieMap.fromEntries<Nat, Entry>(entryEntries.vals(), Nat.equal, Hash.hash);
	// ignore performance issue of Array.append it would be called few times
	private stable var index: [Nat] = [];
	private stable var consume: [Nat] = [];
	private stable var table: [Principal] = [];

	private stable var userEntries : [(Principal, User)] = [];
	private let allUsers = TrieMap.fromEntries<Principal, User>(userEntries.vals(), Principal.equal, Principal.hash);

	private var creating: Bool = false;

	private stable let config: Config  = {
		var titleLimit = 256;
		var contentLimit = 2 * 1024 * 1024;
		var bucketLimit = 4 * 1024 * 1024 * 1024;
		var nameLimit = 32;
		var bioLimit = 256;
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
		}
	};

	private func _newEntry(creator: Principal, title: Text, content : Text) : Entry {
		let id = id_count;
		let entry = {
			id = id;
			creator = creator;
			title = title;
			content = content;
			createAt = Time.now();
			var likes = TrieSet.empty<Principal>();
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
	public shared(msg) func createEntry(title: Text, content: Text): async Result.Result<Nat, Text> {
		if (creating) {
			return #err("Creating bucket");
		};
		let caller = msg.caller;
		let user = userRegister(caller);
		if (Text.size(title) > config.titleLimit) {
			return #err("Title length over limit");
		};
		if (Text.size(content) > config.contentLimit) {
			return #err("Content length over limit");
		};
		let content_length = Text.encodeUtf8(content).size();
		let entry = _newEntry(caller, title, content);
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

		entries.put(ret, Types.digestEntry(entry));
		user.entries := TrieSet.put(user.entries, ret, Hash.hash(ret), Nat.equal);
		#ok(ret)
	};

	// msg.caller like an article,  or unlike an article if called twice
	// turn true if like, otherwise unlike
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
		if (TrieSet.mem(entry.likes, caller, Principal.hash(caller),  Principal.equal)) {
			// already liked this article, unlike
			entry.likes :=  TrieSet.delete(entry.likes, caller, Principal.hash(caller), Principal.equal);
			#ok(false)
		} else {
			// like this article
			entry.likes :=  TrieSet.put(entry.likes, caller, Principal.hash(caller), Principal.equal);
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
				user.name := ?name;
			};
		};
		switch(info.bio) {
			case (null) {};
			case (?bio) {
				if (Text.size(bio) > config.bioLimit) {
					return #err("bio length must less than " # Nat.toText(config.bioLimit));
				};
				user.bio := ?bio;
			};
		};
		#ok()
	};

	public func getEntry(entryId: Nat) : async Result.Result<EntryExt, Text> {
		switch(entries.get(entryId)) {
			case (null) { 
				return #err("entry not exist"); 
			};
			case (?e) {};
		};
		let bucket_principal = getBucket(entryId);
		let bucket: Bucket.Bucket = actor(Principal.toText(bucket_principal));
		let res = await bucket.getEntry(entryId);
		res
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
		config.contentLimit := Option.get(setConfigRequest.contentLimit, config.contentLimit);
		config.bucketLimit := Option.get(setConfigRequest.bucketLimit, config.bucketLimit);
		config.nameLimit := Option.get(setConfigRequest.nameLimit, config.nameLimit);
		config.bioLimit := Option.get(setConfigRequest.bioLimit, config.bioLimit);
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
		let user_entries = user.entries;
		Array.mapFilter(
			TrieSet.toArray(user.entries), 
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

	system func preupgrade() {
    	userEntries := Iter.toArray(allUsers.entries());
		authEntries := Iter.toArray(auths.entries());
		entryEntries := Iter.toArray(entries.entries());
  	};

	system func postupgrade() {
		userEntries := [];
		authEntries := [];
		entryEntries := [];
	};
}
