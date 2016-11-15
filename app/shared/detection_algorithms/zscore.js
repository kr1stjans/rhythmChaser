"use strict";
var zScore = (function () {
    function zScore(lag, threshold, influence) {
        this.lag = lag;
        this.threshold = threshold;
        this.influence = influence;
    }
    zScore.prototype.average = function (data) {
        var sum = data.reduce(function (sum, value) {
            return sum + value;
        }, 0);
        return sum / data.length;
    };
    zScore.prototype.standardDeviation = function (values) {
        var avg = this.average(values);
        var squareDiffs = values.map(function (value) {
            var diff = value - avg;
            var sqrDiff = diff * diff;
            return sqrDiff;
        });
        var avgSquareDiff = this.average(squareDiffs);
        var stdDev = Math.sqrt(avgSquareDiff);
        return stdDev;
    };
    zScore.prototype.emptyArray = function (length) {
        return Array.apply(null, Array(length)).map(Number.prototype.valueOf, 0);
    };
    zScore.prototype.filter = function (y) {
        // Initialise signal results
        var signals = this.emptyArray(y.length);
        // Initialise filtered series
        var filteredY = y.slice(0, this.lag);
        // Initialise filters
        var avgFilter = this.emptyArray(y.length);
        var stdFilter = this.emptyArray(y.length);
        avgFilter[this.lag] = this.average(y.slice(0, this.lag));
        stdFilter[this.lag] = this.standardDeviation(y.slice(0, this.lag));
        //  Loop over all datapoints y(lag+2),...,y(t)
        for (var i = this.lag + 1; i < y.length; i++) {
            // If new value is a specified number of deviations away
            if (Math.abs(y[i] - avgFilter[i - 1]) > this.threshold * stdFilter[i - 1]) {
                if (y[i] > avgFilter[i - 1]) {
                    // Positive signal
                    signals[i] = 1;
                }
                else {
                    // Negative signal
                    signals[i] = 0;
                }
                // Adjust the filters
                filteredY[i] = this.influence * y[i] + (1 - this.influence) * filteredY[i - 1];
                avgFilter[i] = this.average(filteredY.slice(i - this.lag, i));
                stdFilter[i] = this.standardDeviation(filteredY.slice(i - this.lag, i));
            }
            else {
                // No signal
                signals[i] = 0;
                // Adjust the filters
                filteredY[i] = y[i];
                avgFilter[i] = this.average(filteredY.slice(i - this.lag, i));
                stdFilter[i] = this.standardDeviation(filteredY.slice(i - this.lag, i));
            }
        }
        return signals;
    };
    return zScore;
}());
exports.zScore = zScore;
//# sourceMappingURL=zscore.js.map