use std::cell::{Cell, RefCell};
use ic_cdk::export::Principal;
use ic_cdk::export::candid::{candid_method, CandidType, Deserialize, Nat};
use ic_cdk_macros::{init, post_upgrade, pre_upgrade, query, update};

use inverted_index::InvertedIndex;

thread_local! {
    static REGISTRY: Cell<Principal> = Cell::new(Principal::management_canister());
    static INDEX: RefCell<InvertedIndex> = RefCell::new(InvertedIndex::new());
}

#[init]
#[candid_method(init)]
fn init(registry: Principal) {
    REGISTRY.with(|r| {
        r.replace(registry);
    });
}

#[update]
#[candid_method(update)]
async fn add(id: u64, title: String, content: String) {
    INDEX.with(|index| {
        let mut index = index.borrow_mut();
        index.index(id as usize, format!("{} {}", title, content));
    });
}

#[query]
#[candid_method(query)]
fn search(q: String) -> Vec<u64> {
    INDEX.with(|index| {
        let index = index.borrow();
        index.search(q.as_ref())
            .into_iter()
            .map(|r| {
                r.doc.id as u64
            })
            .collect()
    })
} 

#[cfg(not(any(target_arch = "wasm32", test)))]
fn main() {
    // The line below generates did types and service definition from the
    // methods annotated with `candid_method` above. The definition is then
    // obtained with `__export_service()`.
    candid::export_service!();
    std::print!("{}", __export_service());
}

#[cfg(any(target_arch = "wasm32", test))]
fn main() {}