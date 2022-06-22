use std::cell::{Cell, RefCell};
use ic_cdk::export::Principal;
use ic_cdk::export::candid::{candid_method, CandidType, Deserialize, Nat};
use ic_cdk_macros::{init, post_upgrade, pre_upgrade, query, update};

use inverted_index::InvertedIndex;

#[derive(CandidType, Deserialize)]
struct SearchResult {
    pub id: Nat,
    pub title: String,
    pub score: f32,
}

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

#[update(guard  = "is_registry")]
#[candid_method(update)]
async fn add(id: u64, title: String, content: String) {
    INDEX.with(|index| {
        let mut index = index.borrow_mut();
        index.index(id as usize, title, content);
    });
}

#[query]
#[candid_method(query)]
fn search(q: String) -> Vec<SearchResult> {
    INDEX.with(|index| {
        let index = index.borrow();
        index.search(q.as_ref())
            .into_iter()
            .map(|r| {
                SearchResult {
                    id: r.doc.id.into(),
                    title: r.doc.title.clone(),
                    score: r.score
                }
            })
            .collect()
    })
}

#[pre_upgrade]
fn pre_upgrade() {
    let inverted_index = INDEX.with(|index| {
        index.replace(InvertedIndex::new())
    });
    let registry = REGISTRY.with(|r| {
        r.replace(Principal::management_canister())
    });
    ic_cdk::storage::stable_save::<(InvertedIndex, Principal, )>((inverted_index, registry, )).expect("pre upgrade error");
}

#[post_upgrade]
fn post_upgrade() {
    let (inverted_index, registry, ) = ic_cdk::storage::stable_restore::<(InvertedIndex, Principal, )>().expect("post upgrade error");
    REGISTRY.with(|r| {
        r.replace(registry);
    });
    INDEX.with(|index| {
        index.replace(inverted_index);
    });
}

fn is_registry() -> Result<(), String> {
    let caller = ic_cdk::caller();
    REGISTRY.with(|r| {
        let r = r.get();
        if r == caller {
            Ok(())
        } else {
            Err("Unauthorized".into())
        }
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