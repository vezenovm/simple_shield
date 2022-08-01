"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldState = void 0;
const tslib_1 = require("tslib");
const merkle_tree_1 = require("../merkle_tree");
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = debug_1.default('bb:world_state');
class WorldState {
    constructor(db, pedersen) {
        this.db = db;
        this.pedersen = pedersen;
    }
    async init() {
        try {
            this.tree = await merkle_tree_1.MerkleTree.fromName(this.db, this.pedersen, 'data');
        }
        catch (e) {
            this.tree = await merkle_tree_1.MerkleTree.new(this.db, this.pedersen, 'data', 32);
        }
        debug(`data size: ${this.tree.getSize()}`);
        debug(`data root: ${this.tree.getRoot().toString('hex')}`);
    }
    async processRollup(rollup) {
        const { rollupId, dataStartIndex, innerProofData } = rollup;
        debug(`processing rollup ${rollupId}...`);
        const leaves = innerProofData.map(p => [p.newNote1, p.newNote2]).flat();
        await this.tree.updateElements(dataStartIndex, leaves);
        debug(`data size: ${this.tree.getSize()}`);
        debug(`data root: ${this.tree.getRoot().toString('hex')}`);
    }
    async processRollups(rollups) {
        debug(`processing ${rollups.length} rollups from rollup ${rollups[0].rollupId}...`);
        let dataStartIndex = rollups[0].dataStartIndex;
        let leaves = [];
        for (const rollup of rollups) {
            const endIndex = dataStartIndex + leaves.length;
            if (rollup.dataStartIndex > endIndex) {
                const padding = rollup.dataStartIndex - endIndex;
                leaves.push(...new Array(padding).fill(Buffer.alloc(64, 0)));
            }
            leaves.push(...rollup.innerProofData.map(p => [p.newNote1, p.newNote2]).flat());
        }
        // Slice off any entries that already exist. Assumes that the values being removed are the same as already existing.
        const currentSize = this.tree.getSize();
        if (currentSize > dataStartIndex) {
            leaves = leaves.slice(currentSize - dataStartIndex);
            dataStartIndex = currentSize;
        }
        debug(`inserting ${leaves.length} leaves at index ${dataStartIndex}`);
        await this.tree.updateElements(dataStartIndex, leaves);
        debug(`data size: ${this.tree.getSize()}`);
        debug(`data root: ${this.tree.getRoot().toString('hex')}`);
    }
    async syncFromDb() {
        await this.tree.syncFromDb();
    }
    async getHashPath(index) {
        return await this.tree.getHashPath(index);
    }
    getRoot() {
        return this.tree.getRoot();
    }
    getSize() {
        return this.tree.getSize();
    }
}
exports.WorldState = WorldState;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvd29ybGRfc3RhdGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLGdEQUE0QztBQUk1QywwREFBZ0M7QUFFaEMsTUFBTSxLQUFLLEdBQUcsZUFBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFFNUMsTUFBYSxVQUFVO0lBR3JCLFlBQW9CLEVBQVcsRUFBVSxRQUFrQjtRQUF2QyxPQUFFLEdBQUYsRUFBRSxDQUFTO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVTtJQUFHLENBQUM7SUFFeEQsS0FBSyxDQUFDLElBQUk7UUFDZixJQUFJO1lBQ0YsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLHdCQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUN2RTtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLHdCQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDdEU7UUFDRCxLQUFLLENBQUMsY0FBYyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMzQyxLQUFLLENBQUMsY0FBYyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVNLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBdUI7UUFDaEQsTUFBTSxFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLEdBQUcsTUFBTSxDQUFDO1FBRTVELEtBQUssQ0FBQyxxQkFBcUIsUUFBUSxLQUFLLENBQUMsQ0FBQztRQUUxQyxNQUFNLE1BQU0s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