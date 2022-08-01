export function computeSigningData(accountAliasId, accountPublicKey, newAccountPublicKey, newSigningPublicKey1, newSigningPublicKey2, pedersen) {
    const toCompress = [
        accountAliasId.toBuffer(),
        accountPublicKey.x(),
        newAccountPublicKey.x(),
        newSigningPublicKey1.x(),
        newSigningPublicKey2.x(),
    ];
    return pedersen.compressInputs(toCompress);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcHV0ZV9zaWduaW5nX2RhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2xpZW50X3Byb29mcy9hY2NvdW50X3Byb29mL2NvbXB1dGVfc2lnbmluZ19kYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlBLE1BQU0sVUFBVSxrQkFBa0IsQ0FDaEMsY0FBOEIsRUFDOUIsZ0JBQWlDLEVBQ2pDLG1CQUFvQyxFQUNwQyxvQkFBcUMsRUFDckMsb0JBQXFDLEVBQ3JDLFFBQWtCO0lBRWxCLE1BQU0sVUFBVSxHQUFHO1FBQ2pCLGNBQWMsQ0FBQyxRQUFRLEVBQUU7UUFDekIsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFO1FBQ3BCLG1CQUFtQixDQUFDLENBQUMsRUFBRTtRQUN2QixvQkFBb0IsQ0FBQyxDQUFDLEVBQUU7UUFDeEIsb0JBQW9CLENBQUMsQ0FBQyxFQUFFO0tBQ3pCLENBQUM7SUFDRixPQUFPLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDN0MsQ0FBQyJ9