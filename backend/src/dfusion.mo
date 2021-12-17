/**
 * Module     : dfusion.mo
 * Copyright  : 2021 Rocklabs
 * License    : Apache 2.0 with LLVM Exception
 * Maintainer : Rocklabs <hello@rocklabs.io>
 * Stability  : Experimental
 */

import Array "mo:base/Array";
import Error "mo:base/Error";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Order "mo:base/Order";
import Prelude "mo:base/Prelude";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";
import TrieSet "mo:base/TrieSet";
import Trie "mo:base/Trie";

shared(msg) actor class DFusion(owner_: Principal) {

	public type Entry = {
		id: Nat;
		creator: Principal;
		content: Text;
		createAt: Time.Time;
		var likes: TrieSet.Set<Principal>;
	};

	type EntryExt = {
		id: Nat;
		creator: Principal;
		content: Text;
		createAt: Time.Time;
		likes: [Principal];
	};

	public type User = {
		id: Principal;
		var entries: TrieSet.Set<Nat>; // article indexes
		var followers: TrieSet.Set<Principal>;
		var following: TrieSet.Set<Principal>;
	};

	type UserExt = {
		id: Principal;
		entries: [Nat];
		followers: [Principal];
		following: [Principal];
	};

	private stable var owner: Principal = owner_;
	// all articles
	private stable var allEntries: [Entry] = [];
	private stable var userEntries : [(Principal, User)] = [];
	private let allUsers = HashMap.fromIter<Principal, User>(userEntries.vals(), 1, Principal.equal, Principal.hash);
	
	private func _newUser(id : Principal) : User {
		{
			id = id;
			var entries = TrieSet.empty<Nat>();
			var followers = TrieSet.empty<Principal>();
			var following = TrieSet.empty<Principal>();
		}
	};

	private func _newEntry(creator: Principal, content : Text) : Entry {
		let id = allEntries.size();
		let entry = {
			id = id;
			creator = creator;
			content = content;
			createAt = Time.now();
			var likes = TrieSet.empty<Principal>();
		};
		allEntries := Array.append<Entry>(allEntries, [entry]);
		entry
	};

	private func _unwrap<T>(x : ?T) : T =
		switch x {
			case null { Prelude.unreachable() };
			case (?x_) { x_ };
		};

	private func _userToExt(user: User) : UserExt {
		{
			id  = user.id;
			entries = TrieSet.toArray(user.entries);
			followers = TrieSet.toArray(user.followers);
			following = TrieSet.toArray(user.following);
		}
	};

	private func _entryToExt(entry: Entry) : EntryExt {
		{
			id = entry.id;
			creator = entry.creator;
			content = entry.content;
			createAt = entry.createAt;
			likes = TrieSet.toArray(entry.likes);
		}
	};

	private func userRegister(user: Principal) : User {
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

	// create an article entry of user msg.caller
	public shared(msg) func createEntry(content: Text): async Bool {
		let caller = msg.caller;
		let user = userRegister(caller);
		let entry = _newEntry(caller, content);
		// user.entries := Array.append<Nat>(user.entries, [entry.id]);
		user.entries := TrieSet.put(user.entries, entry.id, Hash.hash(entry.id), Nat.equal);
		true
	};

	// msg.caller like an article,  or unlike an article if called twice
	// turn true if like, otherwise unlike
	public shared(msg) func like(entryId: Nat): async Bool {
		if (entryId >=  allEntries.size()) {
			return false;
		};
		
		let caller = msg.caller;
		let entry = allEntries[entryId];
		
		if (TrieSet.mem(entry.likes, caller, Principal.hash(caller),  Principal.equal)) {
			// already liked this article
			entry.likes :=  TrieSet.delete(entry.likes, caller, Principal.hash(caller), Principal.equal);
			false
		} else {
			// like this article
			entry.likes :=  TrieSet.put(entry.likes, caller, Principal.hash(caller), Principal.equal);
			true
		};
	};

	public shared(msg) func follow(user: Principal): async Bool {
		let caller = msg.caller;
		let userFollowing = userRegister(caller);
		let userFollowed = userRegister(user);
		if (TrieSet.mem(userFollowing.following, user, Principal.hash(caller),  Principal.equal)) {
			// already followed this user
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

	public query func getEntry(entryId: Nat) : async ?EntryExt {
		if (entryId >= allEntries.size()) {
			return null;
		};
		return ?_entryToExt(allEntries[entryId]);
	};

	public query func getUserEntries(id: Principal): async [EntryExt] {
		let user =  userRegister(id);
		let entries = user.entries;
		var res : [EntryExt] = [];
		for ((entryId, _) in Trie.iter(entries)) {
			let entry : Entry = allEntries[entryId];
			res := Array.append<EntryExt>(res, [_entryToExt(entry)]);
		};
		res
	};

	public query func getAllEntries(): async [EntryExt] {
		Array.map<Entry, EntryExt>(allEntries, _entryToExt)
	};

	// get user
	public query func getUser(id: Principal): async UserExt {
		switch (allUsers.get(id)) {
			case (?user) {
				_userToExt(user)
			};
			case _ {
				throw Error.reject("unauthorized");
			}
		}
	};

	system func preupgrade() {
    	userEntries := Iter.toArray(allUsers.entries());
  	};

	system func postupgrade() {
		userEntries := [];
	};
}
