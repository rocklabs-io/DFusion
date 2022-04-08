import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import ExperimentalStableMemory "mo:base/ExperimentalStableMemory";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Memory "./memory";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import TrieMap "mo:base/TrieMap";
import TrieSet "mo:base/TrieSet";
import Types "./types";

shared(init_msg) actor class Bucket(registry_: Principal) {
    type Entry = Types.Entry;
    type EntryStore = Types.EntryStore;
    type EntryExt = Types.EntryExt;
    type EntryDigest = Types.EntryDigest;

    // private let registry: Registry.DFusion = actor(Principal.toText(registry_));
    private stable let registry: Principal = registry_;

    private stable var stable_offset: Nat64 = 0;
    private stable var stable_capacity: Nat64 = 0;
    private let stable_memory =  Memory.StableMemory(stable_offset, stable_capacity);

    private stable var entry_upgrade: [(Nat, EntryStore)] = [];
    private let entry_index = TrieMap.fromEntries<Nat, EntryStore>(entry_upgrade.vals(), Nat.equal, Hash.hash);
    // private let entries = Buffer.Buffer<EntryStore>(entry_upgrade.size());

    private func _authorized(caller: Principal): Bool {
        caller == registry
    };

    private func _storeToDigest(store: EntryStore) : EntryDigest {
        let content = stable_memory.read(store.content.offset, store.content.len);
        {
            id = store.id;
            creator = store.creator;
            title = store.title;
            contentDigest = Types.substr(content, 50);
            createAt = store.createAt;
            var likesNum = TrieSet.size(store.likes)
        }
    };

    private func _storeToExt(store: EntryStore) : EntryExt {
        let content = stable_memory.read(store.content.offset, store.content.len);
        {
			id = store.id;
			creator = store.creator;
            title = store.title;
			content = content;
			createAt = store.createAt;
			likes = TrieSet.toArray(store.likes);
			deleted = store.deleted;
		}
    };

    // create an article entry
	public shared(msg) func createEntry(entry: EntryExt): async Result.Result<Nat, Text> {
		let caller = msg.caller;
        if (_authorized(caller) == false) {
            Debug.trap("Unauthorized");
        };
        let position = stable_memory.write(Text.encodeUtf8(entry.content));
        let entry_store = Types.extToStore(entry, position);
        entry_index.put(entry_store.id, entry_store);
        #ok(entry_store.id)
	};

    // like an article,  or unlike an article if called twice
	// turn true if like, otherwise unlike
	public shared(msg) func like(entryId: Nat, liker: Principal): async Result.Result<Bool, Text> {
        let caller = msg.caller;
        if (_authorized(caller) == false) {
            Debug.trap("Unauthorized");
        };
		
		let entry = switch (entry_index.get(entryId)) {
            case (null) {
                return #err("Entry not exist");
            };
            case (?e) {
                e
            };
        };	
		if (TrieSet.mem(entry.likes, caller, Principal.hash(caller),  Principal.equal)) {
			// already liked this article, unlike
			entry.likes :=  TrieSet.delete(entry.likes, caller, Principal.hash(liker), Principal.equal);
			#ok(false)
		} else {
			// like this article
			entry.likes :=  TrieSet.put(entry.likes, caller, Principal.hash(liker), Principal.equal);
			#ok(true)
		};
	};

    public query func getEntry(entryId: Nat) : async Result.Result<EntryExt, Text> {        
        let entry_store = switch (entry_index.get(entryId)) {
            case (null) {
                return #err("Entry not exist");
            };
            case (?e) {
                e
            };
        };
        #ok(_storeToExt(entry_store))
	};

    public query func getStableSize() : async Nat64 {
        ExperimentalStableMemory.size()
    };

    system func preupgrade() {
        let res: (Nat64, Nat64) = stable_memory.toStable();
        stable_offset := res.0;
        stable_capacity := res.1;
        entry_upgrade := Iter.toArray(entry_index.entries());
    };

    system func postupgrade() {
        // for (e in entry_upgrade.vals()) {
        //     entries.add(e);
        // };
        entry_upgrade := [];
    };
};