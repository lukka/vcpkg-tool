"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
exports.anyWhere = anyWhere;
const assert_1 = require("assert");
const manual_promise_1 = require("./manual-promise");
/** a precrafted failed Promise */
const waiting = Promise.reject(0xDEFACED);
waiting.catch(() => { });
/**
 * Does a Promise.any(), and accept the one that first matches the predicate, or if all resolve, and none match, the first.
 *
 * @remarks WARNING - this requires Node 15+
 * @param from
 * @param predicate
 */
async function anyWhere(from, predicate) {
    let unfulfilled = new Array();
    const failed = new Array();
    const completed = new Array();
    // wait for something to succeed. if nothing suceeds, then this will throw.
    const first = await Promise.any(from);
    let success;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        //
        for (const each of from) {
            // if we had a winner, return now.
            await Promise.any([each, waiting]).then(antecedent => {
                if (predicate(antecedent)) {
                    success = antecedent;
                    return antecedent;
                }
                completed.push(antecedent);
                return undefined;
            }).catch(r => {
                if (r === 0xDEFACED) {
                    // it's not done yet.
                    unfulfilled.push(each);
                }
                else {
                    // oh, it returned and it was a failure.
                    failed.push(each);
                }
                return undefined;
            });
        }
        // we found one that passes muster!
        if (success) {
            return success;
        }
        if (unfulfilled.length) {
            // something completed successfully, but nothing passed the predicate yet.
            // so hope remains eternal, lets rerun whats left with the unfulfilled.
            from = unfulfilled;
            unfulfilled = [];
            continue;
        }
        // they all finished
        // but nothing hit the happy path.
        break;
    }
    // if we get here, then we're
    // everything completed, but nothing passed the predicate
    // give them the first to suceed
    return first;
}
class Queue {
    maxConcurency;
    total = 0;
    active = 0;
    queue = new Array();
    whenZero;
    rejections = new Array();
    constructor(maxConcurency = 8) {
        this.maxConcurency = maxConcurency;
    }
    get count() {
        return this.total;
    }
    get done() {
        return this.zero();
    }
    /** Will block until the queue hits the zero mark */
    async zero() {
        if (this.active) {
            this.whenZero = this.whenZero || new manual_promise_1.ManualPromise();
            await this.whenZero;
        }
        if (this.rejections.length > 0) {
            throw new AggregateError(this.rejections);
        }
        this.whenZero = undefined;
        return this.total;
    }
    next() {
        (--this.active) || this.whenZero?.resolve(0);
        if (this.queue.length) {
            this.queue.pop()?.execute().catch(async (e) => { this.rejections.push(e); throw e; }).finally(() => this.next());
        }
    }
    /**
     * Queues up actions for throttling the number of concurrent async tasks running at a given time.
     *
     * If the process has reached max concurrency, the action is deferred until the last item
     * The last item
     * @param action
     */
    async enqueue(action) {
        assert_1.strict.ok(!this.whenZero, 'items may not be added to the queue while it is being awaited');
        this.active++;
        this.total++;
        if (this.queue.length || this.active >= this.maxConcurency) {
            const result = new manual_promise_1.LazyPromise(action);
            this.queue.push(result);
            return result;
        }
        return action().catch(async (e) => { this.rejections.push(e); throw e; }).finally(() => this.next());
    }
    enqueueMany(iterable, fn) {
        for (const each of iterable) {
            void this.enqueue(() => fn(each));
        }
        return this;
    }
}
exports.Queue = Queue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbWlzZS5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJ1dGlsL3Byb21pc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7OztBQWdCbEMsNEJBdURDO0FBckVELG1DQUFnQztBQUNoQyxxREFBOEQ7QUFFOUQsa0NBQWtDO0FBQ2xDLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDMUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBVSxDQUFDLENBQUMsQ0FBQztBQUVoQzs7Ozs7O0dBTUc7QUFDSSxLQUFLLFVBQVUsUUFBUSxDQUFJLElBQTBCLEVBQUUsU0FBZ0M7SUFDNUYsSUFBSSxXQUFXLEdBQUcsSUFBSSxLQUFLLEVBQWMsQ0FBQztJQUMxQyxNQUFNLE1BQU0sR0FBRyxJQUFJLEtBQUssRUFBYyxDQUFDO0lBQ3ZDLE1BQU0sU0FBUyxHQUFHLElBQUksS0FBSyxFQUFLLENBQUM7SUFFakMsMkVBQTJFO0lBQzNFLE1BQU0sS0FBSyxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QyxJQUFJLE9BQXNCLENBQUM7SUFFM0IsaURBQWlEO0lBQ2pELE9BQU8sSUFBSSxFQUFFLENBQUM7UUFFWixFQUFFO1FBQ0YsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUN4QixrQ0FBa0M7WUFDbEMsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFO2dCQUNuRCxJQUFJLFNBQVMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO29CQUMxQixPQUFPLEdBQUcs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