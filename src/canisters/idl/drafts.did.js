export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Time = IDL.Int;
  const Draft = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'content' : IDL.Text,
    'time' : Time,
  });
  const SetConfigRequest = IDL.Record({
    'countLimit' : IDL.Opt(IDL.Nat),
    'contentLimit' : IDL.Opt(IDL.Nat),
    'titleLimit' : IDL.Opt(IDL.Nat),
  });
  const Drafts = IDL.Service({
    'addAuth' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'deleteDraft' : IDL.Func([IDL.Nat], [Result], []),
    'getUserDraft' : IDL.Func([], [IDL.Vec(Draft)], []),
    'removeAuth' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'reset' : IDL.Func([], [], ['oneway']),
    'setDraft' : IDL.Func([Draft], [Result], []),
    'setLimit' : IDL.Func([SetConfigRequest], [IDL.Bool], []),
  });
  return Drafts;
};
export const init = ({ IDL }) => { return [IDL.Principal]; };
