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
        var favorites: TrieSet.Set<Nat>;
    };

    public type UserExt = {
        id: Principal;
        name: ?Text; // <= 32 characters
        bio: ?Text; // <= 256 characters
        entries: [Nat]; // sorted
		followers: [Principal];
		following: [Principal];
        likes: [Nat];
        favorites: [Nat];
    };

    public type Entry = {
		id: Nat;
		creator: Principal;
        title: Text;
        cover: ?Text;
		content: Text;
		createAt: Time.Time;
		var likes: TrieSet.Set<Principal>;
        var favorites: TrieSet.Set<Principal>;
		var deleted: Bool;
	};

    public type EntryStore = {
        id: Nat;
		creator: Principal;
        title: Text;
        cover: ?Text;
		content: Memory.Position;
		createAt: Time.Time;
		var deleted: Bool;
    };

	public type EntryExt = {
		id: Nat;
		creator: Principal;
        title: Text;
        cover: ?Text;
		content: Text;
		createAt: Time.Time;
		likes: [Principal];
        favorites: [Principal];
		deleted : Bool;
	};

    public type EntryDigest = {
		id: Nat;
		creator: Principal;
        title: Text;
        cover: ?Text;
		contentDigest: Text;
		createAt: Time.Time;
		likes: [Principal];
        favorites: [Principal];
		deleted : Bool;
	};

    public type Config = {
        var titleLimit: Nat;
        var coverLimit: Nat;
		var contentLimit: Nat;
		var bucketLimit: Nat;
        var nameLimit: Nat;
        var bioLimit: Nat;
        var digestLimit: Nat;
    };

    public type SetConfigRequest = {
        titleLimit: ?Nat;
        coverLimit: ?Nat;
        contentLimit: ?Nat;
        bucketLimit: ?Nat;
        nameLimit: ?Nat;
        bioLimit: ?Nat;
        digestLimit: ?Nat;
    };

    public type SetUserRequest = {
        name: ?Text;
        bio: ?Text;
    };

    public type CreateEntryRequest = {
        title: Text;
        content: Text;
        cover: ?Text;
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
            favorites = TrieSet.toArray(user.favorites);
		}
	};

    public func entryToExt(entry: Entry) : EntryExt {
		{
			id = entry.id;
			creator = entry.creator;
            title = entry.title;
            cover = entry.cover;
			content = entry.content;
			createAt = entry.createAt;
			likes = TrieSet.toArray(entry.likes);
            favorites = TrieSet.toArray(entry.favorites);
			deleted = entry.deleted;
		}
	};

    public func entryToStore(entry: Entry, position: Memory.Position) : EntryStore {
        {
            id = entry.id;
            creator = entry.creator;
            title = entry.title;
            cover = entry.cover;
            content = position;
            createAt = entry.createAt;
            var deleted = entry.deleted;
        }
    };

    public func extToStore(entry: EntryExt, position: Memory.Position) : EntryStore {
        {
            id = entry.id;
            creator = entry.creator;
            title = entry.title;
            cover = entry.cover;
            content = position;
            createAt = entry.createAt;
            var deleted = entry.deleted;
        }
    };

    public func digestEntry(entry: Entry, digestEntry: Nat) : Entry {
        {
            id = entry.id;
            creator = entry.creator;
            title = entry.title;
            cover = entry.cover;
            content = substr(entry.content, digestEntry);
            createAt = entry.createAt;
            var likes = entry.likes;
            var favorites = entry.favorites;
            var deleted = entry.deleted;
        }
    };

    public func entryToDigest(entry: Entry) : EntryDigest {
        {
			id = entry.id;
			creator = entry.creator;
            title = entry.title;
            cover = entry.cover;
			contentDigest = entry.content;
			createAt = entry.createAt;
			likes = TrieSet.toArray(entry.likes);
            favorites = TrieSet.toArray(entry.favorites);
			deleted = entry.deleted;
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

    public type SubscribeRequest = {
        subscribee: Principal;
    };

    public type NotifyRequest = {
        author: Principal;
        authorName: Text;
        id: Nat;
        title: Text;
        contentDigest: Text;
    };
}