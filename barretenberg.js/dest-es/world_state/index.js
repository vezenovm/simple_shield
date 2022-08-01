import { MerkleTree } from '../merkle_tree';
import createDebug from 'debug';
const debug = createDebug('bb:world_state');
export class WorldState {
    constructor(db, pedersen) {
        this.db = db;
        this.pedersen = pedersen;
    }
    async init() {
        try {
            this.tree = await MerkleTree.fromName(this.db, this.pedersen, 'data');
        }
        catch (e) {
            this.tree = await MerkleTree.new(this.db, this.pedersen, 'data', 32);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvd29ybGRfc3RhdGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSTVDLE9BQU8sV0FBVyxNQUFNLE9BQU8sQ0FBQztBQUVoQyxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUU1QyxNQUFNLE9BQU8sVUFBVTtJQUdyQixZQUFvQixFQUFXLEVBQVUsUUFBa0I7UUFBdkMsT0FBRSxHQUFGLEVBQUUsQ0FBUztRQUFVLGFBQVEsR0FBUixRQUFRLENBQVU7SUFBRyxDQUFDO0lBRXhELEtBQUssQ0FBQyxJQUFJO1FBQ2YsSUFBSTtZQUNGLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUN2RTtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztTQUN0RTtRQUNELEtBQUssQ0FBQyxjQUFjLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLEtBQUssQ0FBQyxjQUFjLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUF1QjtRQUNoRCxNQUFNLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsR0FBRyxNQUFNLENBQUM7UUFFNUQsS0FBSyxD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