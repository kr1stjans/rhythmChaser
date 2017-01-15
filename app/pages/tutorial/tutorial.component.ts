import {Component, OnInit, NgZone} from "@angular/core";
import {Label} from "ui/label";
import {StackLayout} from "ui/layouts/stack-layout";
import {Page} from "ui/page";
import {Animation} from "ui/animation";
import {QuickGestureDetection, QuickGestureDetectable} from "../../shared/detection.component"
import {ActionItem} from "ui/action-bar";
import {TutorialService} from "./tutorial.services";
import {TNSPlayer, AudioPlayerOptions} from "nativescript-audio";
import {RouterExtensions} from "nativescript-angular";

@Component({
    selector: "tutorial",
    templateUrl: "pages/tutorial/tutorial.html",
    providers: [TutorialService]
})
export class TutorialComponent implements OnInit, QuickGestureDetectable {
    private currentState: TutorialState = TutorialState.INTRO;
    private tutorialLayout: StackLayout;

    private gestureDetection: QuickGestureDetection;

    private gestureCount = 1;

    private player: TNSPlayer;

    private tutorialActionItem: ActionItem;


    // score variables
    private score: number = 0;
    private scoreMultiplier: number = 1;


    // beat variables
    private startTime: number;
    private selectedSong;

    constructor(private routerExtensions: RouterExtensions, private tutorialService: TutorialService, private zone: NgZone, private page: Page) {
    }

    public getNgZone() {
        return this.zone;
    }

    public ngOnInit() {
        this.gestureDetection = new QuickGestureDetection(this);
        this.tutorialLayout = <StackLayout> this.page.getViewById("tutorialLayout");
        this.updateState();
    }

    private createGestureDetectedLabel(text: string, correctDetection: boolean = true) {
        var label = new Label();
        label.textWrap = true;
        label.cssClass = correctDetection ? "correct-detection" : "false-detection";
        label.text = text;

        this.tutorialLayout.addChild(label);

        var animation: Animation = label.createAnimation({
            opacity: 0,
            duration: 3000,
        });

        return animation.play();
    }

    private createLabel(text: string, delay: number = 0) {
        var label = new Label();
        label.textWrap = true;
        label.style.opacity = 0;
        label.style.fontSize = 24;
        label.style.textAlignment = 'left';
        label.style.marginTop = 20;
        label.text = text;

        if (delay != 0) {
            label.style.fontWeight = 'bold';
            label.style.fontSize = 32;
        }

        this.tutorialLayout.addChild(label);

        var animation: Animation = label.createAnimation({
            opacity: 1,
            duration: 750,
            delay: delay
        });

        return animation.play();
    }

    public quickGestureDetected() {
        switch (this.currentState) {
            case TutorialState.MOVEMENT_SINGLE:
                this.tutorialLayout.removeChildren();
                this.createGestureDetectedLabel("Movement detected!")
                    .then(() => {
                        this.nextState();
                    });
                break;
            case TutorialState.MOVEMENT_LEARNING_START:
                this.tutorialLayout.removeChildren();
                this.gestureCount++;
                this.createGestureDetectedLabel(this.gestureCount + " / 10");
                if (this.gestureCount == 10) {
                    this.nextState();
                }
                break;
            case TutorialState.MUSIC:
                var actualBeatExists: boolean = false;
                var timeSinceStartInSeconds: number = (new Date().getTime() - this.startTime) / 1000;

                var beats = this.selectedSong['beats'].split(",").map(function (value) {
                    return +value;
                });

                for (let beat of beats) {
                    // beat at current time detected
                    var diff = Math.abs(beat - timeSinceStartInSeconds);
                    if (diff < 0.2) { // easy modegi
                        actualBeatExists = true;
                        break;
                    }
                }
                this.tutorialLayout.removeChildren();
                this.createGestureDetectedLabel(actualBeatExists ? "x " + this.scoreMultiplier : "Missed!", actualBeatExists);
                if (actualBeatExists) {
                    this.score += this.scoreMultiplier;
                    this.scoreMultiplier++;
                } else {
                    this.scoreMultiplier = 0;
                }
                break;
        }
    }

    private updateState() {
        switch (this.currentState) {
            case TutorialState.INTRO:
                this.createLabel("Want to dance with your crush?")
                    .then(() => {
                        return this.createLabel("Want to experience and listen to music in a completely new way?");
                    })
                    .then(() => {
                        return this.createLabel("Want to learn an instrument?");
                    })
                    .then(() => {
                        return this.createLabel("You need to learn rhythm!", 1000);
                    });
                break;
            case TutorialState.MOVEMENT_SINGLE:
                this.tutorialLayout.removeChildren();
                this.createLabel("Make a quick movement with your phone in any direction. Marker will appear on the screen when the movement is detected.");
                break;
            case TutorialState.MOVEMENT_LEARNING_START:
                this.tutorialLayout.removeChildren();
                this.createLabel("Good job! Make a few more movements to get familiar with the movements that are detected.");
                break;
            case TutorialState.MUSIC:
                this.tutorialLayout.removeChildren();
                this.createLabel("Well done! Now lets add some music. Make the movement, when you hear a beat.");
                this.player = new TNSPlayer();
                this.tutorialService.getData().map(json => json.content).subscribe(
                    (result) => {
                        this.selectedSong = result[0];
                        this.playAudio(this.selectedSong['url_music'], "remoteFile", () => {
                            this.startTime = new Date().getTime();
                        });
                    },
                    (error) => console.log(error)
                );
                break;
            case TutorialState.FINISH:
                this.tutorialLayout.removeChildren();
                this.createLabel("Good job! You are now ready to rock'n'roll!", 1);
                break;
        }
    }

    private nextState() {
        if (this.currentState + 1 == 6) {
            // redirect back
            this.routerExtensions.navigate([""], {clearHistory: true});
            return;
        }
        this.currentState = TutorialState[TutorialState[this.currentState + 1]];
        this.updateState();
    }

    private playAudio(filepath: string, fileType: string, callback) {
        try {
            var playerOptions: AudioPlayerOptions = {
                audioFile: filepath,
                loop: false,
                completeCallback: () => {
                    this.nextState();
                    this.player.dispose().then(() => {
                        console.log('TNSPlayer disposed.');
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
                this.player.playFromUrl(playerOptions).then(callback, (err) => {
                    console.log(err);
                });
            }
        } catch (ex) {
            console.log(ex);
        }
    }
}

enum TutorialState {
    INTRO = 1,
    MOVEMENT_SINGLE = 2,
    MOVEMENT_LEARNING_START = 3,
    MUSIC = 4,
    FINISH = 5
}