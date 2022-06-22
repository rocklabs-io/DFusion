export const idlFactory = ({ IDL }) => {
  const NotifyRequest = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'authorName' : IDL.Text,
    'author' : IDL.Principal,
    'contentDigest' : IDL.Text,
  });
  const MessitySendResult = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const SubscribeRequest = IDL.Record({ 'subscribee' : IDL.Principal });
  const Result = IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text });
  const Notification = IDL.Service({
    'getSubscribees' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Principal)],
        ['query'],
      ),
    'getSubscribers' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Principal)],
        ['query'],
      ),
    'isSubscribed' : IDL.Func(
        [IDL.Principal, IDL.Principal],
        [IDL.Bool],
        ['query'],
      ),
    'notify' : IDL.Func([NotifyRequest], [MessitySendResult], []),
    'subscribe' : IDL.Func([SubscribeRequest], [Result], []),
  });
  return Notification;
};
export const init = ({ IDL }) => { return [IDL.Principal]; };
