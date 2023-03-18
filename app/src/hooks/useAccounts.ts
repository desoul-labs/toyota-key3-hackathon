import { Keyring } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { mnemonicGenerate } from '@polkadot/util-crypto/mnemonic';

export function useAccount(): KeyringPair {
  let mnemonic = localStorage.getItem('mnemonic');
  if (mnemonic === null || mnemonic === undefined) {
    mnemonic = mnemonicGenerate();
    localStorage.setItem('mnemonic', mnemonic);
  }
  const keyring = new Keyring({ type: 'sr25519' });
  const acc = keyring.addFromUri(`${mnemonic}//Alice`, { name: 'Default' });
  console.log(keyring.encodeAddress(acc.publicKey));
  return acc;
}