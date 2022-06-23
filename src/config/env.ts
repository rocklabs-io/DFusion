export const ENV = {
  host: process.env.HOST || "https://ic0.app",
  canisterIds: {
    dfusion: process.env.DFUSION_CANISTER_ID || 
    'br67l-yiaaa-aaaai-qkjra-cai',
    index: process.env.INDEX_CANISTER_ID || 
    "dsgd3-3yaaa-aaaai-qmuua-cai",
    nft: process.env.NFT_CANISTER_ID ||
    "wrciq-pqaaa-aaaai-qleya-cai", 
    notify: process.env.NOTIFY_CANISTER_ID ||
    "c2k5h-zqaaa-aaaai-qlm6q-cai",
    reverse_registrar: process.env.REVERSE_TRGISTRAR_CANISTER_ID || 
    'etiyd-ciaaa-aaaan-qabbq-cai',
  },
};