export class zScore {

    private lag: number;
    private threshold: number;
    private influence: number;
    private y;


    constructor(lag: number, threshold: number, influence: number) {
        this.lag = lag;
        this.threshold = threshold;
        this.influence = influence;
        this.y = [];
    }

    average(data: Array<number>) {
        let sum = data.reduce(function (sum, value) {
            return sum + value;
        }, 0);

        return sum / data.length;
    }

    standardDeviation(values) {
        let avg = this.average(values);

        var squareDiffs = values.map(function (value) {
            var diff = value - avg;
            var sqrDiff = diff * diff;
            return sqrDiff;
        });

        var avgSquareDiff = this.average(squareDiffs);

        var stdDev = Math.sqrt(avgSquareDiff);
        return stdDev;
    }

    emptyArray(length: number) {
        return Array.apply(null, Array(length)).map(Number.prototype.valueOf, 0)
    }

    filter(input: number) {
        this.y.push(input);
        if (this.y.length <= this.lag) {
            return 0;
        }

        let signals = this.emptyArray(this.y.length);
        var tmpThreshold = this.average(this.y.slice(0, this.lag)) + this.standardDeviation(this.y.slice(0, this.lag));
        var PEAK = 0;
        var zaznanPeak = 0;

        //  Loop over all datapoints y(lag+2),...,y(t)
        for (var i = this.lag + 1; i < this.y.length; i++) {
            if (this.y[i] > tmpThreshold) {
                zaznanPeak = 1;
                if (PEAK < this.y[i]) {
                    PEAK = this.y[i];
                }
            }
            else if (this.y[i] < tmpThreshold && zaznanPeak == 1) {
                zaznanPeak = 0;
                tmpThreshold = 0.05 * 0.15 * PEAK + (1 - 0.05) * tmpThreshold;
                PEAK = 0;
            }
            signals[i] = zaznanPeak;
        }
        return signals[signals.length - 1];
    }
}    