import '@polkadot/api-augment';
import { ApiPromise, WsProvider } from '@polkadot/api';
import React, { useEffect, useMemo, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

export interface ApiContextType {
  api: ApiPromise;
  apiReady: boolean;
}

export const ApiContext: React.Context<ApiContextType> = React.createContext(
  {} as ApiContextType
);

export interface ApiContextProviderProps {
  children?: React.ReactElement;
}

const WS_PROVIDER = process.env.REACT_APP_WS_PROVIDER || 'wss://rpc.shibuya.astar.network';

export function ApiContextProvider(
  props: ApiContextProviderProps
): React.ReactElement {
  const { children = null } = props;
  const [api, setApi] = useState<ApiPromise>();
  const [apiReady, setApiReady] = useState(false);
  const provider = useMemo(() => new WsProvider(WS_PROVIDER), []);

  useEffect(() => {
    new ApiPromise({ provider }).isReady.then((val) => {
      setApiReady(true);
      setApi(val);
    });
  }, [provider]);

  if (!api) {
    return (
      <Box className="min-h-screen flex justify-center items-center">
        <CircularProgress  />
      </Box>
    )
  }

  return (
    <ApiContext.Provider value={{ api, apiReady }}>
      {children}
    </ApiContext.Provider>
  );
}
