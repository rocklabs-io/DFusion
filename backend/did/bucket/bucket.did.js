export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const EntryExt = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'creator' : IDL.Principal,
    'deleted' : IDL.Bool,
    'content' : IDL.Text,
    'createAt' : Time,
    'likes' : IDL.Vec(IDL.Principal),
  });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'ok' : EntryExt, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text });
  const Bucket = IDL.Service({
    'createEntry' : IDL.Func([EntryExt], [Result_2], []),
    'getEntry' : IDL.Func([IDL.Nat], [Result_1], ['query']),
    'getStableSize' : IDL.Func([], [IDL.Nat64], ['query']),
    'like' : IDL.Func([IDL.Nat, IDL.Principal], [Result], []),
  });
  return Bucket;
};
export const init = ({ IDL }) => { return [IDL.Principal]; };
