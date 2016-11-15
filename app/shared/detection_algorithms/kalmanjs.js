"use strict";
var KalmanFilter = (function () {
    /**
     * Create 1-dimensional kalman filter
     * @param  {Number} options.R Process noise
     * @param  {Number} options.Q Measurement noise
     * @param  {Number} options.A State vector
     * @param  {Number} options.B Control vector
     * @param  {Number} options.C Measurement vector
     * @return {KalmanFilter}
     */
    function KalmanFilter(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.R, R = _c === void 0 ? 1 : _c, _d = _b.Q, Q = _d === void 0 ? 1 : _d, _e = _b.A, A = _e === void 0 ? 1 : _e, _f = _b.B, B = _f === void 0 ? 0 : _f, _g = _b.C, C = _g === void 0 ? 1 : _g;
        this.R = R; // noise power desirable
        this.Q = Q; // noise power estimated
        this.A = A;
        this.C = C;
        this.B = B;
        this.cov = NaN;
        this.x = NaN; // estimated signal without noise
    }
    /**
     * Filter a new value
     * @param  {Number} z Measurement
     * @param  {Number} u Control
     * @return {Number}
     */
    KalmanFilter.prototype.filter = function (z, u) {
        if (u === void 0) { u = 0; }
        if (isNaN(this.x)) {
            this.x = (1 / this.C) * z;
            this.cov = (1 / this.C) * this.Q * (1 / this.C);
        }
        else {
            // Compute prediction
            var predX = (this.A * this.x) + (this.B * u);
            var predCov = ((this.A * this.cov) * this.A) + this.R;
            // Kalman gain
            var K = predCov * this.C * (1 / ((this.C * predCov * this.C) + this.Q));
            // Correction
            this.x = predX + K * (z - (this.C * predX));
            this.cov = predCov - (K * this.C * predCov);
        }
        return this.x;
    };
    return KalmanFilter;
}());
exports.KalmanFilter = KalmanFilter;
//# sourceMappingURL=kalmanjs.js.map