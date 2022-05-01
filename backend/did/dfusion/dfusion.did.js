export const idlFactory = ({ IDL }) => {
  const CreateEntryRequest = IDL.Record({
    'title' : IDL.Text,
    'content' : IDL.Text,
    'cover' : IDL.Opt(IDL.Text),
  });
  const Result_3 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text });
  const Time = IDL.Int;
  const EntryDigest = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'creator' : IDL.Principal,
    'deleted' : IDL.Bool,
    'createAt' : Time,
    'favorites' : IDL.Vec(IDL.Principal),
    'cover' : IDL.Opt(IDL.Text),
    'likes' : IDL.Vec(IDL.Principal),
    'contentDigest' : IDL.Text,
  });
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
  const Result_2 = IDL.Variant({ 'ok' : EntryExt, 'err' : IDL.Text });
  const UserExt = IDL.Record({
    'id' : IDL.Principal,
    'bio' : IDL.Opt(IDL.Text),
    'favorites' : IDL.Vec(IDL.Nat),
    'name' : IDL.Opt(IDL.Text),
    'likes' : IDL.Vec(IDL.Nat),
    'entries' : IDL.Vec(IDL.Nat),
    'followers' : IDL.Vec(IDL.Principal),
    'following' : IDL.Vec(IDL.Principal),
  });
  const SetConfigRequest = IDL.Record({
    'coverLimit' : IDL.Opt(IDL.Nat),
    'contentLimit' : IDL.Opt(IDL.Nat),
    'bioLimit' : IDL.Opt(IDL.Nat),
    'nameLimit' : IDL.Opt(IDL.Nat),
    'bucketLimit' : IDL.Opt(IDL.Nat),
    'titleLimit' : IDL.Opt(IDL.Nat),
    'digestLimit' : IDL.Opt(IDL.Nat),
  });
  const SetUserRequest = IDL.Record({
    'bio' : IDL.Opt(IDL.Text),
    'name' : IDL.Opt(IDL.Text),
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const DFusion = IDL.Service({
    'addAuth' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'addControllerToBucket' : IDL.Func(
        [IDL.Principal, IDL.Vec(IDL.Principal)],
        [],
        ['oneway'],
      ),
    'createEntry' : IDL.Func([CreateEntryRequest], [Result_3], []),
    'favor' : IDL.Func([IDL.Nat], [Result_1], []),
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
    'getEntry' : IDL.Func([IDL.Nat], [Result_2], []),
    'getUser' : IDL.Func([IDL.Principal], [IDL.Opt(UserExt)], ['query']),
    'getUserEntries' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(EntryDigest)],
        ['query'],
      ),
    'getUserFavorites' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(EntryDigest)],
        ['query'],
      ),
    'like' : IDL.Func([IDL.Nat], [Result_1], []),
    'removeAuth' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setLimit' : IDL.Func([SetConfigRequest], [IDL.Bool], []),
    'setUserInfo' : IDL.Func([SetUserRequest], [Result], []),
  });
  return DFusion;
};
export const init = ({ IDL }) => { return [IDL.Principal]; };
