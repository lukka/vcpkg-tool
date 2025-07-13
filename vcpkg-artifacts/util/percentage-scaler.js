"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.PercentageScaler = void 0;
const assert_1 = require("assert");
class PercentageScaler {
    lowestDomain;
    highestDomain;
    lowestPercentage;
    highestPercentage;
    scaledDomainMax;
    scaledPercentMax;
    static clamp(test, min, max) {
        if (test < min) {
            return min;
        }
        if (test > max) {
            return max;
        }
        return test;
    }
    constructor(lowestDomain, highestDomain, lowestPercentage = 0, highestPercentage = 100) {
        this.lowestDomain = lowestDomain;
        this.highestDomain = highestDomain;
        this.lowestPercentage = lowestPercentage;
        this.highestPercentage = highestPercentage;
        assert_1.strict.ok(lowestDomain <= highestDomain);
        assert_1.strict.ok(lowestPercentage <= highestPercentage);
        this.scaledDomainMax = highestDomain - lowestDomain;
        this.scaledPercentMax = highestPercentage - lowestPercentage;
    }
    scalePosition(domain) {
        if (this.scaledDomainMax === 0 || this.scaledPercentMax === 0) {
            return this.highestPercentage;
        }
        const domainClamped = PercentageScaler.clamp(domain, this.lowestDomain, this.highestDomain);
        const domainScaled = domainClamped - this.lowestDomain;
        const domainProportion = domainScaled / this.scaledDomainMax;
        const partialPercent = this.scaledPercentMax * domainProportion;
        const percentage = this.lowestPercentage + partialPercent;
        return Math.round(percentage * 10) / 10;
    }
}
exports.PercentageScaler = PercentageScaler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyY2VudGFnZS1zY2FsZXIuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21pY3Jvc29mdC92Y3BrZy10b29sL21haW4vdmNwa2ctYXJ0aWZhY3RzLyIsInNvdXJjZXMiOlsidXRpbC9wZXJjZW50YWdlLXNjYWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBRWxDLG1DQUFnQztBQUVoQyxNQUFhLGdCQUFnQjtJQVVDO0lBQXNDO0lBQ2hEO0lBQXNDO0lBVnZDLGVBQWUsQ0FBVTtJQUN6QixnQkFBZ0IsQ0FBVTtJQUVuQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQVksRUFBRSxHQUFXLEVBQUUsR0FBVTtRQUN4RCxJQUFJLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUFDLE9BQU8sR0FBRyxDQUFDO1FBQUMsQ0FBQztRQUMvQixJQUFJLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUFDLE9BQU8sR0FBRyxDQUFDO1FBQUMsQ0FBQztRQUMvQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxZQUE0QixZQUFvQixFQUFrQixhQUFxQixFQUNyRSxtQkFBbUIsQ0FBQyxFQUFrQixvQkFBb0IsR0FBRztRQURuRCxpQkFBWSxHQUFaLFlBQVksQ0FBUTtRQUFrQixrQkFBYSxHQUFiLGFBQWEsQ0FBUTtRQUNyRSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQUk7UUFBa0Isc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFNO1FBQzdFLGVBQU0sQ0FBQyxFQUFFLENBQUMsWUFBWSxJQUFJLGFBQWEsQ0FBQyxDQUFDO1FBQ3pDLGVBQU0sQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLElBQUksaUJBQWlCLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsZUFBZSxHQUFHLGFBQWEsR0FBRyxZQUFZLENBQUM7UUFDcEQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGlCQUFpQixHQUFHLGdCQUFnQixDQUFDO0lBQy9ELENBQUM7SUFFRCxhQUFhLENBQUMsTUFBYztRQUMxQixJQUFJLElBQUksQ0FBQyxlQUFlLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUM5RCxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztRQUNoQyxDQUFDO1FBQ0QsTUFBTSxhQUFhLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM1RixNQUFNLFlBQVksR0FBRyxhQUFhLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUN2RCxNQUFNLGdCQUFnQixHQUFHLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO1FBQzdELE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztRQUNoRSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsY0FBYyxDQUFDO1FBQzFELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzFDLENBQUM7Q0FDRjtBQTdCRCw0Q0E2QkMifQ==