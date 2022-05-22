import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
import Map "mo:base/TrieMap";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import TrieSet "mo:base/TrieSet";

import Types "./types";

shared(init_msg) actor class Notification(registry_: Principal) {
    type MessageType = { 
        #mail;
        #notification;
        #chat;
        #comment;
    };

    type MessageInput = {
        externalId: ?Text;
        from: ?Principal;
        to: [Principal];
        subject: ?Text;
        body: Text;
        references: ?[Text];
        messageType: ?MessageType;
    };

    type MessitySendResult = {#err: Text; #ok: ();};

    type SubscribeRequest = Types.SubscribeRequest;
    type NotifyRequest = Types.NotifyRequest;
    
    private func createMessityActor() : actor { sendMessage: (messageInput : MessageInput) -> async MessitySendResult } {
        let _actor = actor("2btax-iaaaa-aaaai-acjia-cai"): actor { sendMessage: (messageInput : MessageInput) -> async MessitySendResult };
        return _actor;
    };

    private let messity = createMessityActor();
    private let dfusion: Principal = registry_;
    // subscribee => [subscribers]
    private stable var subscriberEntries: [(Principal, TrieSet.Set<Principal>)] = [];
    private let subscribers = Map.fromEntries<Principal, TrieSet.Set<Principal>>(subscriberEntries.vals(), Principal.equal, Principal.hash);
    // subscriber => [subscribees]
    private stable var subscribeeEntries: [(Principal, TrieSet.Set<Principal>)] = [];
    private let subscribees = Map.fromEntries<Principal, TrieSet.Set<Principal>>(subscribeeEntries.vals(), Principal.equal, Principal.hash);

    public shared(msg) func subscribe(req: SubscribeRequest): async Result.Result<Bool, Text> {
        // return true if subscribe, otherwise unsubscribe
        let subscriber = msg.caller;
        let subscribee = req.subscribee;

        let subscribeeSet = switch (subscribees.get(subscriber)) {
            case (null) {
                TrieSet.empty()
            };
            case (?s) {
                s
            };
        };
        let subscriberSet = switch (subscribers.get(subscribee)) {
            case (null) {
                TrieSet.empty()
            };
            case (?s) {
                s
            };
        };
        if (TrieSet.mem(subscribeeSet, subscriber, Principal.hash(subscriber), Principal.equal)) {
            // unsubscribe
            let newSubscribeeSet = TrieSet.delete(subscribeeSet, subscribee, Principal.hash(subscribee), Principal.equal);
            let newSubscriberSet = TrieSet.delete(subscriberSet, subscriber, Principal.hash(subscriber), Principal.equal);
            subscribees.put(subscriber, newSubscribeeSet);
            subscribers.put(subscribee, newSubscriberSet);
            return #ok(false);
        } else {
            // subscribe
            let newSubscribeeSet = TrieSet.put(subscribeeSet, subscribee, Principal.hash(subscribee), Principal.equal);
            let newSubscriberSet = TrieSet.put(subscriberSet, subscriber, Principal.hash(subscriber), Principal.equal);
            subscribees.put(subscriber, newSubscribeeSet);
            subscribers.put(subscribee, newSubscriberSet);
            return #ok(true);
        };
    };

    // var sent = false;
    // var send_result: ?MessitySendResult = null;
    public shared(msg) func notify(req: NotifyRequest): async MessitySendResult {
        if (msg.caller != dfusion) {
            Debug.trap("Unauthorized");
        };
        let author = req.author;
        // find all subscribers
        let to: [Principal] = switch(subscribers.get(author)) {
            case (null) {
                []
            };
            case (?s) {
                TrieSet.toArray(s)
            };
        };
        if (to.size() == 0) {
            return #ok;
        };
        // send mail to them
        let message = _createMessage(req.id, req.authorName, req.title, req.contentDigest);
        // sent := true;
        let res = await messity.sendMessage({
            externalId = null;
            from = null;
            to = to;
            subject = ?"DFusion subscribe";
            body = message;
            messageType = ?#mail;
            references = null;
        });
        // send_result := ?res;
        res
    };

    private func _createMessage(id: Nat, author: Text, title: Text, contentDigest: Text): Text {
        let message = 
            "<p>🔔 Hi~ </p><p></p><p>" 
            # author #
            " has published a new article:</p><hr style=\"margin: 2rem 0\"><strong>" # title # 
            "<p>" # contentDigest # 
            " ... </p> <p><a href=\"https://dfusion.io/entry/" # Nat.toText(id) # 
            "\" rel=\"noopener noreferrer\" target=\"_blank\">read full article</a></p> <hr style=\"margin: 2rem 0\"> <p>DFusion</p> " ;
        message
    };

    // get the persions who user subscribe
    public query func getSubscribers(user: Principal): async [Principal] {
        switch (subscribers.get(user)) {
            case(null) {
                []
            };
            case(?s) {
                TrieSet.toArray(s)
            };
        }
    };

    // get the users' subscribed person
    public query func getSubscribees(user: Principal): async [Principal] {
        switch (subscribees.get(user)) {
            case(null) {
                []
            };
            case(?s) {
                TrieSet.toArray(s)
            };
        }
    };

    public query func isSubscribed(from: Principal, to: Principal): async Bool {
        switch(subscribers.get(from)) {
            case (null) {
                false
            };
            case (?s) {
                TrieSet.mem(s, to, Principal.hash(to), Principal.equal)
            };
        }
    };

    // public query func getDebugInfo() : async (Bool, Text) {
    //     (sent, debug_show(send_result))
    // };

    system func preupgrade() {
        subscriberEntries := Iter.toArray(subscribers.entries());
        subscribeeEntries := Iter.toArray(subscribees.entries());
    };
    
    system func postupgrade() {
        subscriberEntries := [];
        subscribeeEntries := [];
    };
}