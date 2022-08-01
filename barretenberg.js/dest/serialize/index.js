"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeArrayFromVector = exports.serializeBufferArrayToVector = exports.deserializeField = exports.deserializeUInt32 = exports.deserializeBufferFromVector = exports.serializeBufferToVector = exports.numToUInt8 = exports.numToUInt32BE = void 0;
// For serializing numbers to 32 bit big-endian form.
function numToUInt32BE(n, bufferSize = 4) {
    const buf = Buffer.alloc(bufferSize);
    buf.writeUInt32BE(n, bufferSize - 4);
    return buf;
}
exports.numToUInt32BE = numToUInt32BE;
// For serializing numbers to 32 bit big-endian form.
function numToUInt8(n) {
    const bufferSize = 1;
    const buf = Buffer.alloc(bufferSize);
    buf.writeUInt8(n, 0);
    return buf;
}
exports.numToUInt8 = numToUInt8;
// For serializing a buffer as a vector.
function serializeBufferToVector(buf) {
    const lengthBuf = Buffer.alloc(4);
    lengthBuf.writeUInt32BE(buf.length, 0);
    return Buffer.concat([lengthBuf, buf]);
}
exports.serializeBufferToVector = serializeBufferToVector;
function deserializeBufferFromVector(vector, offset = 0) {
    const length = vector.readUInt32BE(offset);
    const adv = 4 + length;
    return { elem: vector.slice(offset + 4, offset + adv), adv };
}
exports.deserializeBufferFromVector = deserializeBufferFromVector;
function deserializeUInt32(buf, offset = 0) {
    const adv = 4;
    return { elem: buf.readUInt32BE(offset), adv };
}
exports.deserializeUInt32 = deserializeUInt32;
function deserializeField(buf, offset = 0) {
    const adv = 32;
    return { elem: buf.slice(offset, offset + adv), adv };
}
exports.deserializeField = deserializeField;
// For serializing an array of fixed length elements.
function serializeBufferArrayToVector(arr) {
    const lengthBuf = Buffer.alloc(4);
    lengthBuf.writeUInt32BE(arr.length, 0);
    return Buffer.concat([lengthBuf, ...arr]);
}
exports.serializeBufferArrayToVector = serializeBufferArrayToVector;
function deserializeArrayFromVector(deserialize, vector, offset = 0) {
    let startAt = offset;
    const size = vector.readUInt32BE(startAt);
    startAt += 4;
    const arr = [];
    for (let i = 0; i < size; ++i) {
        const { elem, adv } = deserialize(vector, startAt);
        startAt += adv;
        arr.push(elem);
    }
    return { elem: arr, adv: startAt - offset };
}
exports.deserializeArrayFromVector = deserializeArrayFromVector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VyaWFsaXplL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFEQUFxRDtBQUNyRCxTQUFnQixhQUFhLENBQUMsQ0FBUyxFQUFFLFVBQVUsR0FBRyxDQUFDO0lBQ3JELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDckMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEVBQUUsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQUpELHNDQUlDO0FBRUQscURBQXFEO0FBQ3JELFNBQWdCLFVBQVUsQ0FBQyxDQUFTO0lBQ2hDLE1BQU0sVUFBVSxHQUFHLENBQUMsQ0FBQztJQUNyQixNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3JDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3JCLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQUxILGdDQUtHO0FBRUgsd0NBQXdDO0FBQ3hDLFNBQWdCLHVCQUF1QixDQUFDLEdBQVc7SUFDakQsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQyxTQUFTLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDdkMsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDekMsQ0FBQztBQUpELDBEQUlDO0FBRUQsU0FBZ0IsMkJBQTJCLENBQUMsTUFBYyxFQUFFLE1BQU0sR0FBRyxDQUFDO0lBQ3BFLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0MsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUN2QixPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDL0QsQ0FBQztBQUpELGtFQUlDO0FBRUQsU0FBZ0IsaUJBQWlCLENBQUMsR0FBVyxFQUFFLE1BQU0sR0FBRyxDQUFDO0lBQ3ZELE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQztJQUNkLE9BQU8sRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNqRCxDQUFDO0FBSEQsOENBR0M7QUFFRCxTQUFnQixnQkFBZ0IsQ0FBQyxHQUFXLEVBQUUsTUFBTSxHQUFHLENBQUM7SUFDdEQsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2YsT0FBTyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDeEQsQ0FBQztBQUhELDRDQUdDO0FBRUQscURBQXFEO0FBQ3JELFNBQWdCLDRCQUE0QixDQUFDLEdBQWE7SUFDeEQsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQyxTQUFTLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDdkMsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM1QyxDQUFDO0FBSkQsb0VBSUM7QUFFRCxTQUFnQiwwQkFBMEIsQ0FDeEMsV0FBc0UsRUFDdEUsTUFBYyxFQUNkLE1BQU0sR0FBRyxDQUFDO0lBRVYsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDO0lBQ3JCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDMUMsT0FBTyxJQUFJLENBQUMsQ0FBQztJQUNiLE1BQU0sR0FBRyxHQUFRLEVBQUUsQ0FBQztJQUNwQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQzdCLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNuRCxPQUFPLElBQUksR0FBRyxDQUFDO1FBQ2YsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNoQjtJQUNELE9BQU8sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEdBQUcsTUFBTSxFQUFFLENBQUM7QUFDOUMsQ0FBQztBQWZELGdFQWVDIn0=