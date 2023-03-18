import { Keyring } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { ed25519PairFromSeed } from '@polkadot/util-crypto';
import { mnemonicGenerate, mnemonicToMiniSecret, mnemonicValidate } from '@polkadot/util-crypto/mnemonic';
import { useMemo } from 'react';

export function useAccount(): KeyringPair {
  if (localStorage.getItem('account') === null || localStorage.getItem('account') === undefined) {
    const mnemonic = mnemonicGenerate();
    const keyring = new Keyring({ type: 'sr25519' });
    const acc = keyring.addFromUri(mnemonic, { name: 'Default' });
    localStorage.setItem('account', JSON.stringify(acc));
    console.log(keyring.encodeAddress(acc.publicKey));
    return acc;
  }
  return JSON.parse(localStorage.getItem('account')!) as KeyringPair;
}