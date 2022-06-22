export const idlFactory = ({ IDL }) => {
  const SearchResult = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'score' : IDL.Float32,
  });
  return IDL.Service({
    'add' : IDL.Func([IDL.Nat64, IDL.Text, IDL.Text], [], []),
    'search' : IDL.Func([IDL.Text], [IDL.Vec(SearchResult)], ['query']),
  });
};
export const init = ({ IDL }) => { return [IDL.Principal]; };
