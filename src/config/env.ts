export const ENV = {
  host: process.env.HOST || "https://ic0.app",
  canisterIds: {
    dfusion: process.env.DFUSION_CANISTER_ID || 
    'br67l-yiaaa-aaaai-qkjra-cai',
    reverse_registrar: process.env.REVERSE_TRGISTRAR_CANISTER_ID || 
    'etiyd-ciaaa-aaaan-qabbq-cai',
  },
};