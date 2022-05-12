import Blob "mo:base/Blob";
import Debug "mo:base/Debug";
import ExperimentalStableMemory "mo:base/ExperimentalStableMemory";
import Nat64 "mo:base/Nat64";
import Text "mo:base/Text";

module {
    public type Position = {
        offset: Nat64;
        len: Nat64;
    };

    public class StableMemory(offset_: Nat64, capacity_: Nat64) {
        public var offset: Nat64 = offset_; // memory offset
        public var capacity: Nat64 = capacity_; // page count

        public func size(): Nat64 {
            capacity << 16
        };

        public func grow(pages: Nat64) {
            let old_pages = ExperimentalStableMemory.grow(pages);
            capacity := old_pages + pages;
        };

        public func read(offset_: Nat64, size: Nat64) : Text {
            if (offset_ + size > offset) {
                Debug.trap("Read overflow");
            };
            let content = ExperimentalStableMemory.loadBlob(offset_, Nat64.toNat(size));
            switch (Text.decodeUtf8(content)) {
                case (null) {
                    Debug.trap("Invalid utf-8 content");
                };
                case (?c) {
                    c
                }
            }
        };

        public func write(content: Blob) : Position {
            let len = Nat64.fromNat(content.size());
            if (offset + len > size()) {
                grow((len >> 16) + 1);
            };
            ExperimentalStableMemory.storeBlob(offset, content);
            let ret: Position = {
                offset = offset;
                len = len;
            };
            offset := offset + len;
            ret
        };

        public func toStable() : (Nat64,  Nat64) {
            (offset, capacity)
        };
    };
};