export const idlFactory = ({ IDL }) => {
  const Result_2 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Time = IDL.Int;
  const EntryDigest = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'creator' : IDL.Principal,
    'createAt' : Time,
    'contentDigest' : IDL.Text,
  });
  const EntryExt = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'creator' : IDL.Principal,
    'deleted' : IDL.Bool,
    'content' : IDL.Text,
    'createAt' : Time,
    'likes' : IDL.Vec(IDL.Principal),
  });
  const Result_1 = IDL.Variant({ 'ok' : EntryExt, 'err' : IDL.Text });
  const UserExt = IDL.Record({
    'id' : IDL.Principal,
    'likes' : IDL.Vec(IDL.Nat),
    'entries' : IDL.Vec(IDL.Nat),
    'followers' : IDL.Vec(IDL.Principal),
    'following' : IDL.Vec(IDL.Principal),
  });
  const Result = IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text });
  const DFusion = IDL.Service({
    'addAuth' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'createEntry' : IDL.Func([IDL.Text, IDL.Text], [Result_2], []),
    'follow' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'getBucketInfo' : IDL.Func(
        [],
        [IDL.Vec(IDL.Nat), IDL.Vec(IDL.Nat), IDL.Vec(IDL.Principal)],
        ['query'],
      ),
    'getBucketStableSize' : IDL.Func([IDL.Principal], [IDL.Nat64], []),
    'getEntries' : IDL.Func(
        [IDL.Nat32, IDL.Nat32],
        [IDL.Vec(EntryDigest)],
        ['query'],
      ),
    'getEntry' : IDL.Func([IDL.Nat], [Result_1], []),
    'getUser' : IDL.Func([IDL.Principal], [IDL.Opt(UserExt)], ['query']),
    'getUserEntries' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(EntryDigest)],
        ['query'],
      ),
    'like' : IDL.Func([IDL.Nat], [Result], []),
    'removeAuth' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setLimit' : IDL.Func([IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)], [IDL.Bool], []),
  });
  return DFusion;
};
export const init = ({ IDL }) => { return [IDL.Principal]; };
