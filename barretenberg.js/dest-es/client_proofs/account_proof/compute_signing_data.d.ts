/// <reference types="node" />
import { GrumpkinAddress } from '../../address';
import { Pedersen } from '../../crypto/pedersen';
import { AccountAliasId } from '../account_alias_id';
export declare function computeSigningData(accountAliasId: AccountAliasId, accountPublicKey: GrumpkinAddress, newAccountPublicKey: GrumpkinAddress, newSigningPublicKey1: GrumpkinAddress, newSigningPublicKey2: GrumpkinAddress, pedersen: Pedersen): Buffer;
//# sourceMappingURL=compute_signing_data.d.ts.map