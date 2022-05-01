export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const EntryExt = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'creator' : IDL.Principal,
    'deleted' : IDL.Bool,
    'content' : IDL.Text,
    'createAt' : Time,
    'favorites' : IDL.Vec(IDL.Principal),
    'cover' : IDL.Opt(IDL.Text),
    'likes' : IDL.Vec(IDL.Principal),
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : EntryExt, 'err' : IDL.Text });
  const Bucket = IDL.Service({
    'createEntry' : IDL.Func([EntryExt], [Result_1], []),
    'getEntry' : IDL.Func([IDL.Nat], [Result], ['query']),
    'getStableSize' : IDL.Func([], [IDL.Nat64], ['query']),
  });
  return Bucket;
};
export const init = ({ IDL }) => { return [IDL.Principal]; };
