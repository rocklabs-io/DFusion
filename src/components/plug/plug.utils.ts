type RequestConnectArgs = {
  whitelist?: string[];
  host?: string;
};

// export const plug = window?.ic?.plug;

export const requestConnect = (args?: RequestConnectArgs) =>
  window.ic?.plug?.requestConnect(args);

export const checkIsConnected = (): Promise<boolean> => window.ic?.plug?.isConnected();

export const getPrincipal = () => window.ic?.plug?.getPrincipal();

export const requestBalance = (): Promise<Array<any>> => window.ic?.plug?.requestBalance();

export const disconnect = (): Promise<boolean> => window.ic?.plug?.disconnect();
