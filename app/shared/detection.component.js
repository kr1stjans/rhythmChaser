"use strict";
var nativescript_accelerometer_1 = require("nativescript-accelerometer");
var QuickGestureDetection = (function () {
    function QuickGestureDetection(pulseDetectable) {
        var _this = this;
        this.lastValue = 0;
        this.gestureMade = false;
        this.pulseDetectable = pulseDetectable;
        this.startTime = new Date().getTime();
        // start accelerometer updates
        nativescript_accelerometer_1.startAccelerometerUpdates(function (data) {
            _this.pulseDetectable.getNgZone().run(function () {
                //console.log(data.x + data.y + data.z);
                var result = _this.naiveFilter(data.x + data.y + data.z);
                if (_this.detectSignalHigh(result)) {
                    _this.gestureMade = true;
                }
            });
        });
        // view must be manually updated every 100ms or it overuses the cpu and no update is processed
        setInterval(function () {
            if (_this.gestureMade) {
                _this.pulseDetectable.quickGestureDetected();
                // reset beat detection states
                _this.gestureMade = false;
            }
        }, 100);
    }
    QuickGestureDetection.prototype.destroy = function () {
        nativescript_accelerometer_1.stopAccelerometerUpdates();
    };
    QuickGestureDetection.prototype.naiveFilter = function (input) {
        if (input > -0.25) {
            return 1;
        }
        else {
            return 0;
        }
    };
    QuickGestureDetection.prototype.detectSignalHigh = function (input) {
        var result;
        if (this.lastValue == 0 && input == 1) {
            result = true;
        }
        else {
            result = false;
        }
        this.lastValue = input;
        return result;
    };
    return QuickGestureDetection;
}());
exports.QuickGestureDetection = QuickGestureDetection;
//# sourceMappingURL=detection.component.js.map