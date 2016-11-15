import {Component, NgZone, OnInit} from "@angular/core";
import {zScore} from "../../shared/detection_algorithms/zscore";
import {KalmanFilter} from "../../shared/detection_algorithms/kalmanjs";
import {startAccelerometerUpdates, AccelerometerData} from "nativescript-accelerometer";
import {TNSPlayer, AudioPlayerOptions} from 'nativescript-audio';

@Component({
    selector: "game",
    templateUrl: "pages/game/game.html"
})
export class GameComponent implements OnInit {
    public scoreModel: number;
    public score: number;

    lastValue: number = 0;
    buffer: Array<number> = [];
    zscore = new zScore(5, 3.5, 0.1);
    kalman = new KalmanFilter({R: 5, Q: 0.01});

    private player: TNSPlayer;

    constructor(private zone: NgZone) {
    }

    ngOnInit() {

        this.score = 0;
        this.scoreModel = 0;

        this.player = new TNSPlayer();
        this.playAudio('~/audio/faded.mp3', 'localFile');

        startAccelerometerUpdates((data: AccelerometerData) => {
            this.zone.run(() => {
                var result = this.naiveFilter(data.z);
                var output = this.detectSignalHigh(result);
                if (output == 1) {
                    this.scoreModel += 50;
                }
                //console.log(data.z);
            });
        });

        // score on the view must be manually updated every 100ms, or it overuses the cpu and no update is processed
        setInterval(() => {
            this.score = this.scoreModel;
        }, 100);

    }

    playAudio(filepath: string, fileType: string) {
        try {
            var playerOptions: AudioPlayerOptions = {
                audioFile: filepath,
                loop: true,
                completeCallback: () => {
                    this.player.dispose().then(() => {
                        console.log('DISPOSED');
                    }, (err) => {
                        console.log('ERROR disposePlayer: ' + err);
                    });
                },

                errorCallback: (err) => {
                    console.log(err);
                },

                infoCallback: (info) => {
                    console.log("what: " + info);
                }
            };


            if (fileType === 'localFile') {
                this.player.playFromFile(playerOptions).then(() => {
                }, (err) => {
                    console.log(err);
                });
            } else if (fileType === 'remoteFile') {
                this.player.playFromUrl(playerOptions).then(() => {
                }, (err) => {
                    console.log(err);
                });
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    /**
     * Input must be new single value.
     * @param input
     */
    kalmanFilter(input) {
        return this.kalman.filter(input);
    }

    /**
     * Input must be an array of all values until now.
     * @param input
     */
    zscoreFilter(input) {
        this.buffer.push(input);
        var result = this.zscore.filter(this.buffer);
        return result[result.length - 1];
    }

    naiveFilter(input) {
        if (input > 0.25) {
            return 1;
        } else {
            return 0;
        }
    }

    detectSignalHigh(input) {
        var result;
        if (this.lastValue == 0 && input == 1) {
            result = 1;
        } else {
            result = 0;
        }
        this.lastValue = input;
        return result;
    }
}