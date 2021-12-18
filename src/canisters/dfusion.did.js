export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const EntryExt = IDL.Record({
    'id' : IDL.Nat,
    'creator' : IDL.Principal,
    'content' : IDL.Text,
    'createAt' : Time,
    'likes' : IDL.Vec(IDL.Principal),
    'deleted' : IDL.Bool,
  });
  const UserExt = IDL.Record({
    'id' : IDL.Principal,
    'entries' : IDL.Vec(IDL.Nat),
    'followers' : IDL.Vec(IDL.Principal),
    'following' : IDL.Vec(IDL.Principal),
  });
  const DFusion = IDL.Service({
    'createEntry' : IDL.Func([IDL.Text], [IDL.Nat], []),
    'follow' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'getAllEntries' : IDL.Func([], [IDL.Vec(EntryExt)], ['query']),
    'getEntry' : IDL.Func([IDL.Nat], [IDL.Opt(EntryExt)], ['query']),
    'getUser' : IDL.Func([IDL.Principal], [UserExt], ['query']),
    'getUserEntries' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(EntryExt)],
        ['query'],
      ),
    'like' : IDL.Func([IDL.Nat], [IDL.Bool], []),
  });
  return DFusion;
};
export const init = ({ IDL }) => { return [IDL.Principal]; };
