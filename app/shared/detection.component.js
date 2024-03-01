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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV0ZWN0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRldGVjdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHlFQUFrSDtBQU9sSDtJQU1JLCtCQUFZLGVBQWU7UUFBM0IsaUJBeUJDO1FBOUJPLGNBQVMsR0FBVyxDQUFDLENBQUM7UUFFdEIsZ0JBQVcsR0FBWSxLQUFLLENBQUM7UUFJakMsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7UUFFdkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRXRDLDhCQUE4QjtRQUM5QixzREFBeUIsQ0FBQyxVQUFDLElBQXVCO1lBQzlDLEtBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDO2dCQUNqQyx3Q0FBd0M7Z0JBQ3hDLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDaEMsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7Z0JBQzVCLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBRUgsOEZBQThGO1FBQzlGLFdBQVcsQ0FBQztZQUNSLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixLQUFJLENBQUMsZUFBZSxDQUFDLG9CQUFvQixFQUFFLENBQUM7Z0JBQzVDLDhCQUE4QjtnQkFDOUIsS0FBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFDN0IsQ0FBQztRQUNMLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUVaLENBQUM7SUFFTSx1Q0FBTyxHQUFkO1FBQ0kscURBQXdCLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBRU8sMkNBQVcsR0FBbkIsVUFBb0IsS0FBSztRQUNyQixFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztJQUNMLENBQUM7SUFFTyxnREFBZ0IsR0FBeEIsVUFBeUIsS0FBSztRQUMxQixJQUFJLE1BQU0sQ0FBQztRQUNYLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbEIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNuQixDQUFDO1FBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBQ0wsNEJBQUM7QUFBRCxDQUFDLEFBdkRELElBdURDO0FBdkRZLHNEQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7c3RhcnRBY2NlbGVyb21ldGVyVXBkYXRlcywgQWNjZWxlcm9tZXRlckRhdGEsIHN0b3BBY2NlbGVyb21ldGVyVXBkYXRlc30gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hY2NlbGVyb21ldGVyXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUXVpY2tHZXN0dXJlRGV0ZWN0YWJsZSB7XG4gICAgcXVpY2tHZXN0dXJlRGV0ZWN0ZWQoKTtcbiAgICBnZXROZ1pvbmUoKTtcbn1cblxuZXhwb3J0IGNsYXNzIFF1aWNrR2VzdHVyZURldGVjdGlvbiB7XG4gICAgcHJpdmF0ZSBsYXN0VmFsdWU6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSBzdGFydFRpbWU6IG51bWJlcjtcbiAgICBwcml2YXRlIGdlc3R1cmVNYWRlOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBwdWxzZURldGVjdGFibGU6IFF1aWNrR2VzdHVyZURldGVjdGFibGU7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWxzZURldGVjdGFibGUpIHtcbiAgICAgICAgdGhpcy5wdWxzZURldGVjdGFibGUgPSBwdWxzZURldGVjdGFibGU7XG5cbiAgICAgICAgdGhpcy5zdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgICAgICAvLyBzdGFydCBhY2NlbGVyb21ldGVyIHVwZGF0ZXNcbiAgICAgICAgc3RhcnRBY2NlbGVyb21ldGVyVXBkYXRlcygoZGF0YTogQWNjZWxlcm9tZXRlckRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMucHVsc2VEZXRlY3RhYmxlLmdldE5nWm9uZSgpLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhLnggKyBkYXRhLnkgKyBkYXRhLnopO1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSB0aGlzLm5haXZlRmlsdGVyKGRhdGEueCArIGRhdGEueSArIGRhdGEueik7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGV0ZWN0U2lnbmFsSGlnaChyZXN1bHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2VzdHVyZU1hZGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyB2aWV3IG11c3QgYmUgbWFudWFsbHkgdXBkYXRlZCBldmVyeSAxMDBtcyBvciBpdCBvdmVydXNlcyB0aGUgY3B1IGFuZCBubyB1cGRhdGUgaXMgcHJvY2Vzc2VkXG4gICAgICAgIHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdlc3R1cmVNYWRlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wdWxzZURldGVjdGFibGUucXVpY2tHZXN0dXJlRGV0ZWN0ZWQoKTtcbiAgICAgICAgICAgICAgICAvLyByZXNldCBiZWF0IGRldGVjdGlvbiBzdGF0ZXNcbiAgICAgICAgICAgICAgICB0aGlzLmdlc3R1cmVNYWRlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMCk7XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgZGVzdHJveSgpIHtcbiAgICAgICAgc3RvcEFjY2VsZXJvbWV0ZXJVcGRhdGVzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBuYWl2ZUZpbHRlcihpbnB1dCkge1xuICAgICAgICBpZiAoaW5wdXQgPiAtMC4yNSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZGV0ZWN0U2lnbmFsSGlnaChpbnB1dCkge1xuICAgICAgICB2YXIgcmVzdWx0O1xuICAgICAgICBpZiAodGhpcy5sYXN0VmFsdWUgPT0gMCAmJiBpbnB1dCA9PSAxKSB7XG4gICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sYXN0VmFsdWUgPSBpbnB1dDtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59Il19