import {startAccelerometerUpdates, AccelerometerData, stopAccelerometerUpdates} from "nativescript-accelerometer";
import {zScore} from "./detection_algorithms/zscore";

export interface QuickGestureDetectable {
    quickGestureDetected();
    getNgZone();
}

export class QuickGestureDetection {
    private startTime: number;
    private gestureMade: boolean = false;
    private pulseDetectable: QuickGestureDetectable;
    private zScore: zScore;

    constructor(pulseDetectable) {
        this.zScore = new zScore(10, 3.6, 0.035);
        this.pulseDetectable = pulseDetectable;

        this.startTime = new Date().getTime();

        // start accelerometer updates
        startAccelerometerUpdates((data: AccelerometerData) => {
            this.pulseDetectable.getNgZone().run(() => {
                if (this.filter(data.x + data.y + data.z)) {
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

    private filter(input) {
        return this.zScore.filter(input);
    }
}