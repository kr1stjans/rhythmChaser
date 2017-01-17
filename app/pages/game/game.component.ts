import {Component, NgZone, OnInit, OnDestroy} from "@angular/core";
import {Page} from "ui/page";

import {TNSPlayer, AudioPlayerOptions} from 'nativescript-audio';

import {Label} from "ui/label";
import {AbsoluteLayout} from "ui/layouts/absolute-layout";
import {Animation} from "ui/animation";
import {QuickGestureDetectable, QuickGestureDetection} from "../../shared/detection.component";
import {MusicService} from "./music.services";
import {StackLayout} from "ui/layouts/stack-layout";
import {screen, device} from "platform";
import {AnimationCurve} from "ui/enums";
import {ItemEventData} from "ui/list-view";
import {RouterExtensions} from "nativescript-angular";
import {ScoreService} from "./score.services";


@Component({
    selector: "game",
    templateUrl: "pages/game/game.html",
    providers: [MusicService, ScoreService]
})
export class GameComponent implements OnInit, OnDestroy, QuickGestureDetectable {
    private player: TNSPlayer;
    private scoresLayout: AbsoluteLayout;

    private quickGestureDetection: QuickGestureDetection;

    // score variables
    private score: number = 0;
    private scoreMultiplier: number = 1;

    private selectedSong;

    // beat variables
    private startTime: number;
    private songDuration: number;

    private songList: Array<Object> = [];

    private updateCallback;

    constructor(private scoreService: ScoreService, private routerExtensions: RouterExtensions, private musicService: MusicService, private zone: NgZone, private page: Page) {
    }

    /**
     * Clear song picker and init gesture & audio player.
     */
    private listViewItemTap(args) {

        this.quickGestureDetection = new QuickGestureDetection(this);
        this.player = new TNSPlayer();
        this.selectedSong = this.songList[args.index];
        this.playAudio(this.selectedSong['url_music']);

        this.scoresLayout.removeChildren();
        var scoreLabel = this.createAbsoluteLabel("", 0, 0);
        var timeLabel = this.createAbsoluteLabel("", screen.mainScreen.widthDIPs - 60, 0);
        this.updateCallback = setInterval(() => {
            scoreLabel.text = "Score: " + this.score;
            if (this.songDuration != null) {
                timeLabel.text = (this.songDuration - ((new Date().getTime() - this.startTime) / 1000)).toFixed(0) + "s";
            }
        }, 100);

        this.scoresLayout.on("tap", () => {
            this.quickGestureDetected();
        });
    }

    public onItemLoading(args: ItemEventData) {
        if (args.ios) {
            // args.ios is instance of UITableViewCell
            args.ios.selectionStyle = 0;  // UITableViewCellSelectionStyle.UITableViewCellSelectionStyleNone;
        }
    }

    /**
     * Init song picker and fetch songs from backend.
     */
    public ngOnInit() {
        this.scoresLayout = <StackLayout> this.page.getViewById("scoresLayout");
        this.musicService.getData().map(json => json.content).subscribe(
            (result) => {
                this.songList = result;
            },
            (error) => console.log(error)
        );
    }

    public quickGestureDetected() {
        var actualBeatExists: boolean = false;
        var timeSinceStartInSeconds: number = (new Date().getTime() - this.startTime) / 1000;

        var beats = this.selectedSong['beats'].split(",").map(function (value) {
            return +value;
        });

        for (let beat of beats) {
            // beat at current time detected
            var diff = Math.abs(beat - timeSinceStartInSeconds);
            if (diff < 0.12) {
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
        this.scoresLayout.addChild(label);

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
        this.scoresLayout.addChild(label);
        return label;
    }

    public ngOnDestroy() {
        this.player.pause();
        this.quickGestureDetection.destroy();
    }

    public getNgZone() {
        return this.zone;
    }

    private playAudio(filepath: string) {
        try {
            var playerOptions: AudioPlayerOptions = {
                audioFile: filepath,
                loop: false,
                completeCallback: () => {
                    clearInterval(this.updateCallback);
                    this.scoreService.updateScore(device.uuid, this.selectedSong['id'], this.score);
                    this.player.dispose().then(() => {
                        console.log('DISPOSED');
                    }, (err) => {
                        console.log('ERROR disposePlayer: ' + err);
                    });
                    this.routerExtensions.navigate([""], {clearHistory: true});
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