"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlockchainStatus = exports.getServiceName = void 0;
const blockchain_1 = require("../blockchain");
const iso_fetch_1 = require("../iso_fetch");
async function getServiceName(baseUrl) {
    const response = await iso_fetch_1.fetch(baseUrl);
    try {
        const body = await response.json();
        return body.serviceName;
    }
    catch (err) {
        throw new Error(`Bad response from: ${baseUrl}`);
    }
}
exports.getServiceName = getServiceName;
async function getBlockchainStatus(baseUrl) {
    const response = await iso_fetch_1.fetch(`${baseUrl}/status`);
    try {
        const body = await response.json();
        return blockchain_1.blockchainStatusFromJson(body.blockchainStatus);
    }
    catch (err) {
        throw new Error(`Bad response from: ${baseUrl}`);
    }
}
exports.getBlockchainStatus = getBlockchainStatus;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4Q0FBeUQ7QUFDekQsNENBQXFDO0FBRTlCLEtBQUssVUFBVSxjQUFjLENBQUMsT0FBZTtJQUNsRCxNQUFNLFFBQVEsR0FBRyxNQUFNLGlCQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdEMsSUFBSTtRQUNGLE1BQU0sSUFBSSxHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ25DLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztLQUN6QjtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsT0FBTyxFQUFFLENBQUMsQ0FBQztLQUNsRDtBQUNILENBQUM7QUFSRCx3Q0FRQztBQUVNLEtBQUssVUFBVSxtQkFBbUIsQ0FBQyxPQUFlO0lBQ3ZELE1BQU0sUUFBUSxHQUFHLE1BQU0saUJBQUssQ0FBQyxHQUFHLE9BQU8sU0FBUyxDQUFDLENBQUM7SUFDbEQsSUFBSTtRQUNGLE1BQU0sSUFBSSxHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ25DLE9BQU8scUNBQXdCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7S0FDeEQ7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLE9BQU8sRUFBRSxDQUFDLENBQUM7S0FDbEQ7QUFDSCxDQUFDO0FBUkQsa0RBUUMifQ==