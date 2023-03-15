import { Keyring } from '@polkadot/api';
import { useMemo } from 'react';

export function useAccount(suri: string) {
  const account = useMemo(() => {
    const keyring = new Keyring({ type: 'sr25519' });
    const acc = keyring.addFromUri(suri, { name: 'Default' });
    console.log(keyring.encodeAddress(acc.publicKey));
    return acc;
  }, [suri]);

  return { account };
}