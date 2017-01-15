import {startAccelerometerUpdates, AccelerometerData, stopAccelerometerUpdates} from "nativescript-accelerometer";

export interface QuickGestureDetectable {
    quickGestureDetected();
    getNgZone();
}

export class QuickGestureDetection {
    private lastValue: number = 0;
    private startTime: number;
    private gestureMade: boolean = false;
    private pulseDetectable: QuickGestureDetectable;

    constructor(pulseDetectable) {
        this.pulseDetectable = pulseDetectable;

        this.startTime = new Date().getTime();

        // start accelerometer updates
        startAccelerometerUpdates((data: AccelerometerData) => {
            this.pulseDetectable.getNgZone().run(() => {
                //console.log(data.x + data.y + data.z);
                var result = this.naiveFilter(data.x + data.y + data.z);
                if (this.detectSignalHigh(result)) {
                    this.gestureMade = true;
                }
            });
        });

        // view must be manually updated every 100ms or it overuses the cpu and no update is processed
        setInterval(() => {
            if (this.gestureMade) {
                this.pulseDetectable.quickGestureDetected();
                // reset beat detection states
                this.gestureMade = false;
            }
        }, 100);

    }

    public destroy() {
        stopAccelerometerUpdates();
    }

    private naiveFilter(input) {
        if (input > -0.25) {
            return 1;
        } else {
            return 0;
        }
    }

    private detectSignalHigh(input) {
        var result;
        if (this.lastValue == 0 && input == 1) {
            result = true;
        } else {
            result = false;
        }
        this.lastValue = input;
        return result;
    }
}