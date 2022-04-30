import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Memory "./memory";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import TrieSet "mo:base/TrieSet";

module {
    public type User = {
        id: Principal;
        var name: ?Text; // <= 32 characters
        var bio: ?Text; // <= 256 characters
		var entries: TrieSet.Set<Nat>; // article indexes
		var followers: TrieSet.Set<Principal>;
		var following: TrieSet.Set<Principal>;
        var likes: TrieSet.Set<Nat>;
    };

    public type UserExt = {
        id: Principal;
        name: ?Text; // <= 32 characters
        bio: ?Text; // <= 256 characters
        entries: [Nat]; // sorted
		followers: [Principal];
		following: [Principal];
        likes: [Nat];
    };

    public type Entry = {
		id: Nat;
		creator: Principal;
        title: Text;
		content: Text;
		createAt: Time.Time;
		var likes: TrieSet.Set<Principal>;
		var deleted: Bool;
	};

    public type EntryStore = {
        id: Nat;
		creator: Principal;
        title: Text;
		content: Memory.Position;
		createAt: Time.Time;
		var likes: TrieSet.Set<Principal>;
		var deleted: Bool;
    };

	public type EntryExt = {
		id: Nat;
		creator: Principal;
        title: Text;
		content: Text;
		createAt: Time.Time;
		likes: [Principal];
		deleted : Bool;
	};

    public type EntryDigest = {
        id: Nat;
        creator: Principal;
        title: Text;
        contentDigest: Text;
        createAt: Time.Time;
        var likesNum: Nat;
    };

    public type EntryDigestExt = {
        id: Nat;
        creator: Principal;
        title: Text;
        contentDigest: Text;
        createAt: Time.Time;
        likesNum: Nat;
    };

    public type Config = {
        var titleLimit: Nat;
		var contentLimit: Nat;
		var bucketLimit: Nat;
        var nameLimit: Nat;
        var bioLimit: Nat;
    };

    public type SetConfigRequest = {
        titleLimit: ?Nat;
        contentLimit: ?Nat;
        bucketLimit: ?Nat;
        nameLimit: ?Nat;
        bioLimit: ?Nat;
    };

    public type SetUserRequest = {
        name: ?Text;
        bio: ?Text;
    };

    public func userToExt(user: User) : UserExt {
		{
			id  = user.id;
            name = user.name;
            bio = user.bio;
			entries = Array.sort(TrieSet.toArray(user.entries), Nat.compare);
			followers = TrieSet.toArray(user.followers);
			following = TrieSet.toArray(user.following);
            likes = TrieSet.toArray(user.likes);
		}
	};

    public func entryToExt(entry: Entry) : EntryExt {
		{
			id = entry.id;
			creator = entry.creator;
            title = entry.title;
			content = entry.content;
			createAt = entry.createAt;
			likes = TrieSet.toArray(entry.likes);
			deleted = entry.deleted;
		}
	};

    public func entryToDigest(entry: Entry) : EntryDigest {
        {
            id = entry.id;
            creator = entry.creator;
            title = entry.title;
            contentDigest = substr(entry.content, 50);
            createAt = entry.createAt;
            var likesNum = TrieSet.size(entry.likes);
        }
    };

    public func entryToStore(entry: Entry, position: Memory.Position) : EntryStore {
        {
            id = entry.id;
            creator = entry.creator;
            title = entry.title;
            content = position;
            createAt = entry.createAt;
            var likes = entry.likes;
            var deleted = entry.deleted;
        }
    };

    public func extToStore(entry: EntryExt, position: Memory.Position) : EntryStore {
        {
            id = entry.id;
            creator = entry.creator;
            title = entry.title;
            content = position;
            createAt = entry.createAt;
            var likes = TrieSet.fromArray<Principal>(entry.likes, Principal.hash,  Principal.equal);
            var deleted = entry.deleted;
        }
    };

    public func digestToExt(entry: EntryDigest) : EntryDigestExt {
        {
            id = entry.id;
            creator = entry.creator;
            title = entry.title;
            contentDigest = entry.contentDigest;
            createAt = entry.createAt;
            likesNum = entry.likesNum;
        }
    };

    public func substr(text: Text, len: Nat) : Text {
        if (Text.size(text) <= len) {
            return text;
        };
        var res: Text = "";
        Iter.iterate<Char>(Text.toIter(text), func(x, _index) {
            if (_index < len) {
                res #= Text.fromChar(x);
            };
        });
        res
    };
}