import { blockchainStatusFromJson } from '../blockchain';
import { fetch } from '../iso_fetch';
export async function getServiceName(baseUrl) {
    const response = await fetch(baseUrl);
    try {
        const body = await response.json();
        return body.serviceName;
    }
    catch (err) {
        throw new Error(`Bad response from: ${baseUrl}`);
    }
}
export async function getBlockchainStatus(baseUrl) {
    const response = await fetch(`${baseUrl}/status`);
    try {
        const body = await response.json();
        return blockchainStatusFromJson(body.blockchainStatus);
    }
    catch (err) {
        throw new Error(`Bad response from: ${baseUrl}`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUVyQyxNQUFNLENBQUMsS0FBSyxVQUFVLGNBQWMsQ0FBQyxPQUFlO0lBQ2xELE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3RDLElBQUk7UUFDRixNQUFNLElBQUksR0FBRyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNuQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7S0FDekI7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLE9BQU8sRUFBRSxDQUFDLENBQUM7S0FDbEQ7QUFDSCxDQUFDO0FBRUQsTUFBTSxDQUFDLEtBQUssVUFBVSxtQkFBbUIsQ0FBQyxPQUFlO0lBQ3ZELE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLEdBQUcsT0FBTyxTQUFTLENBQUMsQ0FBQztJQUNsRCxJQUFJO1FBQ0YsTUFBTSxJQUFJLEdBQUcsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbkMsT0FBTyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztLQUN4RDtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsT0FBTyxFQUFFLENBQUMsQ0FBQztLQUNsRDtBQUNILENBQUMifQ==