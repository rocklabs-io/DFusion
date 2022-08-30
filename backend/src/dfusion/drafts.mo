import Bool "mo:base/Bool";
import Debug "mo:base/Debug";
import Hash "mo:base/Hash";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import TrieMap "mo:base/TrieMap";
import Iter "mo:base/Iter";
import TrieSet "mo:base/TrieSet";

import Types "./types";

shared(init_msg) actor class Drafts(
  owner_: Principal
) = this{
  public type Draft = {
    id: Nat;
    title: Text;
    content: Text;
    time: Time.Time;
  };
  public type SetConfigRequest = {
    countLimit: ?Nat;
    titleLimit: ?Nat;
    contentLimit: ?Nat;
  };
  public type Config = {
    var countLimit: Nat;
    var titleLimit: Nat;
    var contentLimit: Nat;
  };
  // init
	private let owner: Principal = owner_;
  // map from user to drafts
  private stable var userDraftsArray: [(Principal, TrieSet.Set<Draft>)] = [];
  private var userDraftsMap = TrieMap.fromEntries<Principal, TrieSet.Set<Draft>>(userDraftsArray.vals(), Principal.equal, Principal.hash);
  private stable var counter: Nat = 0;
  private stable var authEntries : [(Principal, Bool)] = [(owner, true)];
	private var auths = TrieMap.fromEntries<Principal, Bool>(authEntries.vals(), Principal.equal, Principal.hash);

  public shared(msg) func reset() {
		assert(_checkAuth(msg.caller));
    counter := 0;
    userDraftsMap := TrieMap.TrieMap<Principal, TrieSet.Set<Draft>>(Principal.equal, Principal.hash);
  };

	private stable let config: Config = {
    var countLimit = 3;
    var titleLimit = 256;
		var contentLimit = 2 * 1024 * 1024;
  };

  system func preupgrade() {
    userDraftsArray := Iter.toArray(userDraftsMap.entries());
		authEntries := Iter.toArray(auths.entries());
  	};

	system func postupgrade() {
		userDraftsArray := [];
		authEntries := [];
	};


  // reuse
  private func _checkAuth(id: Principal) : Bool {
		switch (auths.get(id)) {
			case (?v) { v };
			case (_) { false };
		};
	};
  // reuse
  public shared(msg) func addAuth(id: Principal) : async Bool {
		assert (msg.caller == owner);
		auths.put(id, true);
		return true;
	};
  // reuse
	public shared(msg) func removeAuth(id: Principal) : async Bool {
		assert (msg.caller == owner);
		auths.delete(id);
		return true;
	};

  public shared(msg) func setLimit(setConfigRequest: SetConfigRequest) : async Bool {
		assert(_checkAuth(msg.caller));
    config.titleLimit := Option.get(setConfigRequest.titleLimit, config.titleLimit);
		config.contentLimit := Option.get(setConfigRequest.contentLimit, config.contentLimit);
		config.countLimit := Option.get(setConfigRequest.countLimit, config.contentLimit);
    true
  };

  // reuse
  private func userRegister(user: Principal) : TrieSet.Set<Draft> {
		if (Principal.isAnonymous(user)) {
			Debug.trap("Anonymous user");
		};
		switch (userDraftsMap.get(user)) {
			case null {
				userDraftsMap.put(user, TrieSet.empty<Draft>());
				TrieSet.empty<Draft>()
			};
			case (?u) { 
				u
			};
		};
	};

  // Get user drafts
  public shared(msg) func getUserDraft(): async [Draft]{
    let caller = msg.caller;
    switch (userDraftsMap.get(caller)){
      case (?u) {
        TrieSet.toArray(u)
      };
      case null {
        []
      };
    };
  };

  // compare two articles
  private func draftEqual(draftA: Draft, draftB: Draft): Bool{
    draftA.id == draftB.id
  };

  // set user drafts with id
  public shared(msg) func setDraft(newDraft: Draft): async Result.Result<Nat, Text>{
    if(Text.size(newDraft.title) == 0){
      return #err("Title can not be empty")
    };
    if(Text.size(newDraft.content) == 0){
      return #err("Content can not be empty")
    };
    if (Text.size(newDraft.title) > config.titleLimit) {
			return #err("Title length over limit");
		};
		if (Text.size(newDraft.content) > config.contentLimit) {
			return #err("Content length over limit");
		};

    let caller = msg.caller;
	  var drafts = userRegister(caller);
    if ( newDraft.id == 0 ) {
      // check draft number limit
      if (TrieSet.size(drafts) > config.countLimit) {
        return #err("Drafts over limit");
      };
      counter += 1;
      let draft = {
        id = counter;
        title = newDraft.title;
        content = newDraft.content;
        time = Time.now();
      };
      drafts := TrieSet.put(drafts, draft, Hash.hash(counter), draftEqual);
      userDraftsMap.put(caller, drafts);
      #ok(counter)
    } else if (TrieSet.mem(drafts, newDraft, Hash.hash(newDraft.id), draftEqual)){
      // edit draft
      let draft = {
        id = newDraft.id;
        title = newDraft.title;
        content = newDraft.content;
        time = Time.now();
      };
      drafts := TrieSet.delete(drafts, draft, Hash.hash(draft.id), draftEqual);
      drafts := TrieSet.put(drafts, draft, Hash.hash(draft.id), draftEqual);
      userDraftsMap.put(caller, drafts);
      #ok(newDraft.id)
    } else {
      #err("Drafts not found!")
    }
  };

  private func createDraft(id: Nat): Draft{
    {
      id = id;
      title = "";
      content = "";
      time = Time.now();
    }
  };

  public shared(msg) func deleteDraft(id: Nat): async Result.Result<Nat, Text>{
    let caller = msg.caller;
		var drafts = userRegister(msg.caller);
    let target = createDraft(id);
    if (TrieSet.mem(drafts, target, Hash.hash(id), draftEqual)){
      drafts := TrieSet.delete(drafts, target, Hash.hash(id), draftEqual);
      userDraftsMap.put(caller, drafts);
      #ok(id)
    } else {
      #err("Draft doesn't exist")
    }
  };


}