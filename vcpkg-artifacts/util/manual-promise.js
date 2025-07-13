"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.LazyPromise = exports.ManualPromise = void 0;
/**
* A manually (or externally) controlled asynchronous Promise implementation
*/
class ManualPromise {
    /**
      * Attaches callbacks for the resolution and/or rejection of the Promise.
      * @param onfulfilled The callback to execute when the Promise is resolved.
      * @param onrejected The callback to execute when the Promise is rejected.
      * @returns A Promise for the completion of which ever callback is executed.
      */
    then(onfulfilled, onrejected) {
        return this.p.then(onfulfilled, onrejected);
    }
    /**
    * Attaches a callback for only the rejection of the Promise.
    * @param onrejected The callback to execute when the Promise is rejected.
    * @returns A Promise for the completion of the callback.
    */
    catch(onrejected) {
        return this.p.catch(onrejected);
    }
    finally(onfinally) {
        return this.p.finally(onfinally);
    }
    [Symbol.toStringTag] = 'Promise';
    p;
    /**
     * A method to manually resolve the Promise.
     */
    resolve = (v) => { };
    /**
     *  A method to manually reject the Promise
     */
    reject = (e) => { };
    state = 'pending';
    /**
     * Returns true of the Promise has been Resolved or Rejected
     */
    get isCompleted() {
        return this.state !== 'pending';
    }
    /**
     * Returns true if the Promise has been Resolved.
     */
    get isResolved() {
        return this.state === 'resolved';
    }
    /**
     * Returns true if the Promise has been Rejected.
     */
    get isRejected() {
        return this.state === 'rejected';
    }
    constructor() {
        this.p = new Promise((r, j) => {
            this.resolve = (v) => { this.state = 'resolved'; r(v); };
            this.reject = (e) => { this.state = 'rejected'; j(e); };
        });
    }
}
exports.ManualPromise = ManualPromise;
class LazyPromise extends ManualPromise {
    action;
    constructor(action) {
        super();
        this.action = action;
    }
    execute() {
        this.action().then(v => this.resolve(v), e => this.reject(e));
        return this;
    }
}
exports.LazyPromise = LazyPromise;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFudWFsLXByb21pc2UuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21pY3Jvc29mdC92Y3BrZy10b29sL21haW4vdmNwa2ctYXJ0aWZhY3RzLyIsInNvdXJjZXMiOlsidXRpbC9tYW51YWwtcHJvbWlzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBRWxDOztFQUVFO0FBQ0YsTUFBYSxhQUFhO0lBQ3hCOzs7OztRQUtJO0lBQ0osSUFBSSxDQUFpQyxXQUFpRixFQUFFLFVBQW1GO1FBQ3pNLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFDRDs7OztNQUlFO0lBQ0YsS0FBSyxDQUFrQixVQUFpRjtRQUN0RyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFDRCxPQUFPLENBQUMsU0FBMkM7UUFDakQsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBQ2xDLENBQUMsQ0FBYTtJQUV0Qjs7T0FFRztJQUNJLE9BQU8sR0FBcUQsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFTLENBQUMsQ0FBQztJQUVwRjs7T0FFRztJQUNJLE1BQU0sR0FBcUIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFTLENBQUMsQ0FBQztJQUUzQyxLQUFLLEdBQXdDLFNBQVMsQ0FBQztJQUUvRDs7T0FFRztJQUNILElBQVcsV0FBVztRQUNwQixPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDO0lBQ2xDLENBQUM7SUFFRDs7T0FFRztJQUNILElBQVcsVUFBVTtRQUNuQixPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssVUFBVSxDQUFDO0lBQ25DLENBQUM7SUFFRDs7T0FFRztJQUNILElBQVcsVUFBVTtRQUNuQixPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssVUFBVSxDQUFDO0lBQ25DLENBQUM7SUFFRDtRQUNFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxPQUFPLENBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDL0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQWlDLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlGLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFNLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9ELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBaEVELHNDQWdFQztBQUVELE1BQWEsV0FBZSxTQUFRLGFBQWdCO0lBQ3ZCO0lBQTNCLFlBQTJCLE1BQXdCO1FBQ2pELEtBQUssRUFBRSxDQUFDO1FBRGlCLFdBQU0sR0FBTixNQUFNLENBQWtCO0lBRW5ELENBQUM7SUFFRCxPQUFPO1FBQ0wsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0Y7QUFURCxrQ0FTQyJ9