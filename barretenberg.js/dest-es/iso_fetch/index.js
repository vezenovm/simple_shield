import isNode from 'detect-node';
export function fetch(input, init) {
    if (isNode) {
        // eslint-disable-next-line
        const f = require('node-fetch').default;
        return f(input, init);
    }
    else {
        return window.fetch(input, init);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaXNvX2ZldGNoL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sTUFBTSxNQUFNLGFBQWEsQ0FBQztBQUVqQyxNQUFNLFVBQVUsS0FBSyxDQUFDLEtBQWtCLEVBQUUsSUFBa0I7SUFDMUQsSUFBSSxNQUFNLEVBQUU7UUFDViwyQkFBMkI7UUFDM0IsTUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUN4QyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDdkI7U0FBTTtRQUNMLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDbEM7QUFDSCxDQUFDIn0=