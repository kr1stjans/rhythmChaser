import {Component, NgZone, OnInit} from "@angular/core";
import {Page} from "ui/page";

import {startAccelerometerUpdates, AccelerometerData} from "nativescript-accelerometer";
import {TNSPlayer, AudioPlayerOptions} from 'nativescript-audio';

import {zScore} from "../../shared/detection_algorithms/zscore";
import {KalmanFilter} from "../../shared/detection_algorithms/kalmanjs";
import {Label} from "ui/label";
import {AbsoluteLayout} from "ui/layouts/absolute-layout";
import {Animation} from "ui/animation";
import {knownFolders} from "file-system"

@Component({
    selector: "game",
    templateUrl: "pages/game/game.html"
})
export class GameComponent implements OnInit {
    private lastValue: number = 0;
    private buffer: Array<number> = [];
    private zscore = new zScore(5, 3.5, 0.1);
    private kalman = new KalmanFilter({R: 5, Q: 0.01});

    private player: TNSPlayer;
    private scoresLayout: AbsoluteLayout;

    // animation variables
    private animationPositions: Array<number> = [20, 60, 100, 140, 180, 220];
    private animationDirection: AnimationDirection = AnimationDirection.INCREASING;
    private animationPosition: number = this.animationPositions.length / 2;

    // score variables
    private score: number = 0;
    private scoreMultiplier: number = 1;

    // beat variables
    private beatArray: Array<number>;
    private startTime: number;
    private gestureMade: boolean = false;

    constructor(private zone: NgZone, private page: Page) {
    }

    ngOnInit() {
        this.scoresLayout = <AbsoluteLayout> this.page.getViewById("scoresLayout");
        this.player = new TNSPlayer();

        // read beats file
        knownFolders.currentApp().getFile("/audio/faded.csv").readText().then((text) => {
            this.beatArray = text.split(",").map(function (value) {
                return +value;
            });
        }).then(() => {

            // start playing song
            this.playAudio("~/audio/faded.mp3", "localFile");

            this.startTime = new Date().getTime();

            // start accelerometer updates
            startAccelerometerUpdates((data: AccelerometerData) => {
                this.zone.run(() => {
                    var result = this.naiveFilter(data.z);
                    var signalHigh: boolean = this.detectSignalHigh(result);
                    if (signalHigh) {
                        this.gestureMade = true;
                    }
                    //console.log(data.z);
                });
            });

        });

        // view must be manually updated every 100ms or it overuses the cpu and no update is processed
        setInterval(() => {

            // if gesture was made check if actual beat exists
            if (this.gestureMade) {

                var actualBeatExists: boolean = false;
                var timeSinceStartInSeconds: number = (new Date().getTime() - this.startTime) / 1000;
                for (let beat of this.beatArray) {
                    // beat at current time detected
                    var diff = Math.abs(beat - timeSinceStartInSeconds);
                    if (diff < 0.11) {
                        actualBeatExists = true;
                        break;
                    }
                }

                var label = new Label();
                label.cssClass = "big-text score-label";
                label.text = "+" + (actualBeatExists ? this.scoreMultiplier : 0);

                AbsoluteLayout.setLeft(label, this.animationPositions[this.animationPosition]);
                AbsoluteLayout.setTop(label, 425);

                this.scoresLayout.addChild(label);

                var animation: Animation = label.createAnimation({
                    translate: {x: 0, y: -425},
                    opacity: 0.5,
                    duration: 2000,
                    scale: {x: 0.5, y: 0.5},
                });

                animation.play().then(() => {
                    this.scoresLayout.removeChild(label);
                });

                if (actualBeatExists) {
                    this.score += this.scoreMultiplier;
                    this.scoreMultiplier++;
                } else {
                    this.scoreMultiplier = 1;
                }

                // adjust position
                if (this.animationDirection == AnimationDirection.INCREASING && this.animationPosition < this.animationPositions.length - 1) {
                    this.animationPosition++;
                } else if (this.animationDirection == AnimationDirection.INCREASING && this.animationPosition == this.animationPositions.length - 1) {
                    this.animationPosition--;
                    this.animationDirection = AnimationDirection.DECREASING;
                } else if (this.animationDirection == AnimationDirection.DECREASING && this.animationPosition > 0) {
                    this.animationPosition--;
                } else if (this.animationDirection == AnimationDirection.DECREASING && this.animationPosition == 0) {
                    this.animationPosition++;
                    this.animationDirection = AnimationDirection.INCREASING;
                }

                // reset beat detection states
                this.gestureMade = false;
            }
        }, 100);

    }

    private playAudio(filepath: string, fileType: string) {
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
    private kalmanFilter(input) {
        return this.kalman.filter(input);
    }

    /**
     * Input must be an array of all values until now.
     * @param input
     */
    private zscoreFilter(input) {
        this.buffer.push(input);
        var result = this.zscore.filter(this.buffer);
        return result[result.length - 1];
    }

    private naiveFilter(input) {
        if (input > 0.185) {
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

enum AnimationDirection {
    INCREASING,
    DECREASING
}