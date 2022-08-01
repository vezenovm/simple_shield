import { GrumpkinAddress } from '../../address';
import { Pedersen } from '../../crypto/pedersen';
import { AccountAliasId } from '../account_alias_id';

export function computeSigningData(
  accountAliasId: AccountAliasId,
  accountPublicKey: GrumpkinAddress,
  newAccountPublicKey: GrumpkinAddress,
  newSigningPublicKey1: GrumpkinAddress,
  newSigningPublicKey2: GrumpkinAddress,
  pedersen: Pedersen,
) {
  const toCompress = [
    accountAliasId.toBuffer(),
    accountPublicKey.x(),
    newAccountPublicKey.x(),
    newSigningPublicKey1.x(),
    newSigningPublicKey2.x(),
  ];
  return pedersen.compressInputs(toCompress);
}