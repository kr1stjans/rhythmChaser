import {Component, OnInit, NgZone, OnDestroy} from "@angular/core";
import {Label} from "ui/label";
import {StackLayout} from "ui/layouts/stack-layout";
import {Page} from "ui/page";
import {Animation} from "ui/animation";
import {QuickGestureDetection, QuickGestureDetectable} from "../../shared/detection.component"
import {ActionItem} from "ui/action-bar";
import {TutorialService} from "./tutorial.services";
import {TNSPlayer, AudioPlayerOptions} from "nativescript-audio";
import {RouterExtensions} from "nativescript-angular";
import {AnimationCurve} from "ui/enums";
import {AbsoluteLayout} from "ui/layouts/absolute-layout";
import {screen} from "platform";
import {LayoutBase} from "ui/layouts/layout-base";


@Component({
    selector: "tutorial",
    templateUrl: "pages/tutorial/tutorial.html",
    providers: [TutorialService]
})
export class TutorialComponent implements OnInit, QuickGestureDetectable, OnDestroy {
    private currentState: TutorialState = TutorialState.INTRO;
    private tutorialLayout: AbsoluteLayout;

    private gestureDetection: QuickGestureDetection;

    private gestureCount = 1;

    private player: TNSPlayer;

    private tutorialActionItem: ActionItem;

    private songDuration: number;

    // score variables
    private score: number = 0;
    private scoreMultiplier: number = 1;

    // beat variables
    private startTime: number;
    private selectedSong;

    constructor(private routerExtensions: RouterExtensions, private tutorialService: TutorialService, private zone: NgZone, private page: Page) {
    }

    public ngOnDestroy() {
        this.player.pause();
        this.gestureDetection.destroy();
    }

    public getNgZone() {
        return this.zone;
    }

    public ngOnInit() {
        this.gestureDetection = new QuickGestureDetection(this);
        this.tutorialLayout = <AbsoluteLayout> this.page.getViewById("tutorialLayout");
        this.updateState();
    }

    private createGestureDetectedLabel(text: string, correctDetection: boolean = true, duration: number = 2500, minimumOpacity = 0, expand: number = 0) {
        var minimum = Math.min(screen.mainScreen.widthDIPs, screen.mainScreen.heightDIPs);

        var label = new Label();
        label.textWrap = true;
        label.cssClass = correctDetection ? "correct-detection" : "false-detection";
        label.text = text;
        label.style.width = minimum / 2 * (1 + expand);
        label.style.height = minimum / 2 * (1 + expand);
        label.style.borderRadius = minimum / 4 * (1 + expand);
        label.style.fontSize = 35 * (1 + expand / 2);

        AbsoluteLayout.setLeft(label, screen.mainScreen.widthDIPs / 2 - (label.style.width / 2));
        AbsoluteLayout.setTop(label, screen.mainScreen.heightDIPs / 2 - (label.style.height / 2));
        this.tutorialLayout.addChild(label);

        var animation: Animation = label.createAnimation({
            opacity: minimumOpacity,
            duration: duration,
            curve: AnimationCurve.easeIn
        });

        return animation.play();
    }

    private createAbsoluteLabel(text: string, left: number, top: number) {
        var label = new Label();
        label.textWrap = true;
        label.style.fontSize = 24;
        label.style.textAlignment = 'left';
        label.text = text;
        label.style.zIndex = 1000;

        AbsoluteLayout.setLeft(label, left);
        AbsoluteLayout.setTop(label, top);
        this.tutorialLayout.addChild(label);
        return label;
    }

    private createLabel(layout: LayoutBase, text: string, delay: number = 0) {
        var label = new Label();
        label.textWrap = true;
        label.style.opacity = 0;
        label.style.fontSize = 24;
        label.style.textAlignment = "left";
        label.text = text;
        label.style.margin = "10";
        label.style.width = screen.mainScreen.widthDIPs - 10;

        if (delay != 0) {
            label.style.fontWeight = "bold";
            label.style.fontSize = 32;
        }

        layout.addChild(label);

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
                this.createGestureDetectedLabel("Movement detected!", true, 1500, 1, 0.5)
                    .then(() => {
                        this.nextState();
                    });
                break;
            case TutorialState.MOVEMENT_LEARNING_START:
                this.tutorialLayout.removeChildren();
                this.gestureCount++;
                this.createGestureDetectedLabel(this.gestureCount + " / 10", true, 2500, 0, 0);
                if (this.gestureCount == 10) {
                    this.nextState();
                }
                break;
            case TutorialState.MUSIC:
                this.nextState();
                this.quickGestureDetected();
                break;
            case TutorialState.MUSIC_STARTED:
                var actualBeatExists: boolean = false;
                var timeSinceStartInSeconds: number = (new Date().getTime() - this.startTime) / 1000;

                var beats = this.selectedSong['beats'].split(",").map(function (value) {
                    return +value;
                });

                for (let beat of beats) {
                    // beat at current time detected
                    var diff = Math.abs(beat - timeSinceStartInSeconds);
                    if (diff < 0.25) { // easy mode
                        actualBeatExists = true;
                        break;
                    }
                }
                if (actualBeatExists) {
                    this.score += this.scoreMultiplier;
                    this.scoreMultiplier++;
                } else {
                    this.scoreMultiplier = 0;
                }
                this.createGestureDetectedLabel(actualBeatExists ? "+" + this.scoreMultiplier : "Missed!", actualBeatExists, 2500, 0, this.scoreMultiplier / 10);
                break;
        }
    }

    private updateState() {
        switch (this.currentState) {
            case TutorialState.INTRO:
                var stackLayout = new StackLayout();
                this.tutorialLayout.addChild(stackLayout);
                this.createLabel(stackLayout, "Want to dance with your crush?", 0)
                    .then(() => {
                        return this.createLabel(stackLayout, "Want to experience and listen to music in a completely new way?", 0);
                    })
                    .then(() => {
                        return this.createLabel(stackLayout, "Want to learn an instrument?", 0);
                    })
                    .then(() => {
                        return this.createLabel(stackLayout, "You need to learn rhythm first!", 1000);
                    });
                break;
            case TutorialState.MOVEMENT_SINGLE:
                this.tutorialLayout.removeChildren();
                var stackLayout = new StackLayout();
                this.tutorialLayout.addChild(stackLayout);
                this.createLabel(stackLayout, "Make a quick movement with your phone in any direction. Marker will appear on the screen when the movement is detected.", 0);
                break;
            case TutorialState.MOVEMENT_LEARNING_START:
                this.tutorialLayout.removeChildren();
                var stackLayout = new StackLayout();
                this.tutorialLayout.addChild(stackLayout);
                this.createLabel(stackLayout, "Good job! Make a few more movements to get familiar with the movements that are detected.", 0);
                break;
            case TutorialState.MUSIC:
                this.tutorialLayout.removeChildren();
                var stackLayout = new StackLayout();
                this.tutorialLayout.addChild(stackLayout);
                this.createLabel(stackLayout, "Well done! Now lets add some music. Make the movement, when you hear a beat.", 0);
                this.player = new TNSPlayer();
                this.tutorialService.getData().map(json => json.content).subscribe(
                    (result) => {
                        this.selectedSong = result[0];
                        this.playAudio(this.selectedSong['url_music']);
                    },
                    (error) => console.log(error)
                );
                break;
            case TutorialState.MUSIC_STARTED:
                this.tutorialLayout.removeChildren();
                var scoreLabel = this.createAbsoluteLabel("", 0, 0);
                var timeLabel = this.createAbsoluteLabel("", screen.mainScreen.widthDIPs - 50, 0);
                setInterval(() => {
                    scoreLabel.text = "Score: " + this.score;
                    timeLabel.text = (this.songDuration - ((new Date().getTime() - this.startTime) / 1000)).toFixed(0) + "s";
                }, 100);
                break;
            case TutorialState.FINISH:
                this.tutorialLayout.removeChildren();
                var stackLayout = new StackLayout();
                this.tutorialLayout.addChild(stackLayout);
                this.createLabel(stackLayout, "Nice beats! You are now ready to rock'n'roll!", 0);
                this.createLabel(stackLayout, "Score: " + this.score, 0);
                break;
        }
    }

    private nextState() {
        if (this.currentState + 1 == 7) {
            // redirect back
            this.routerExtensions.navigate([""], {clearHistory: true});
            return;
        }
        this.currentState = TutorialState[TutorialState[this.currentState + 1]];
        this.updateState();
    }

    private playAudio(filepath: string) {
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


            this.player.playFromUrl(playerOptions).then(() => {
                this.startTime = new Date().getTime();
                this.player.getAudioTrackDuration().then((result) => {
                    this.songDuration = +result;
                });
            }, (err) => {
                console.log(err);
            });
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
    MUSIC_STARTED = 5,
    FINISH = 6
}