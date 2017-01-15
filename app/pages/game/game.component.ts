import {Component, NgZone, OnInit, OnDestroy} from "@angular/core";
import {Page} from "ui/page";

import {TNSPlayer, AudioPlayerOptions} from 'nativescript-audio';

import {Label} from "ui/label";
import {AbsoluteLayout} from "ui/layouts/absolute-layout";
import {Animation} from "ui/animation";
import {ListPicker} from "ui/list-picker";
import {QuickGestureDetectable, QuickGestureDetection} from "../../shared/detection.component";
import {MusicService} from "./music.services";
import {StackLayout} from "ui/layouts/stack-layout";

@Component({
    selector: "game",
    templateUrl: "pages/game/game.html",
    providers: [MusicService]
})
export class GameComponent implements OnInit, OnDestroy, QuickGestureDetectable {
    private player: TNSPlayer;
    private scoresLayout: AbsoluteLayout;

    private quickGestureDetection: QuickGestureDetection;
    private songPicker: ListPicker;

    // score variables
    private score: number = 0;
    private scoreMultiplier: number = 1;

    private songs: Array<any>;
    private selectedSong;

    // beat variables
    private startTime: number;

    constructor(private musicService: MusicService, private zone: NgZone, private page: Page) {
    }

    /**
     * Clear song picker and init gesture & audio player.
     */
    private play() {
        this.quickGestureDetection = new QuickGestureDetection(this);
        this.player = new TNSPlayer();
        this.selectedSong = this.songs[this.songPicker.selectedIndex];
        this.playAudio(this.selectedSong['url_music'], "remoteFile", () => {
            this.startTime = new Date().getTime();
        });

        this.scoresLayout.removeChildren();
    }

    /**
     * Init song picker and fetch songs from backend.
     */
    public ngOnInit() {
        this.scoresLayout = <StackLayout> this.page.getViewById("scoresLayout");

        this.songPicker = new ListPicker();
        this.songPicker.cssClass = "song-picker";
        this.scoresLayout.addChild(this.songPicker);

        this.musicService.getData().map(json => json.content).subscribe(
            (result) => {
                this.songs = result;
                this.songPicker.items = result.map(item =>
                item['author'] + " - " +
                item['title'] +
                "(Your best: " +
                (item['user_score'] != null ? item['user_score'] : 0) +
                ", World best: " +
                (item['high_score'] != null ? item['high_score'] : 0));
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
            if (diff < 0.13) { // 0.11 hard
                actualBeatExists = true;
                break;
            }
        }
        this.scoresLayout.removeChildren();
        if (actualBeatExists) {
            this.createGestureDetectedLabel("x " + this.scoreMultiplier);
            this.score += this.scoreMultiplier;
            this.scoreMultiplier++;
        } else {
            this.scoreMultiplier = 0;
        }
    }

    private createGestureDetectedLabel(text: string) {
        var label = new Label();
        label.textWrap = true;
        label.cssClass = "gesture-detected";
        label.text = text;

        this.scoresLayout.addChild(label);

        var animation: Animation = label.createAnimation({
            duration: 1500,
            scale: {x: 0.1, y: 0.1},
        });

        return animation.play();
    }

    public ngOnDestroy() {
        this.player.pause();
        this.quickGestureDetection.destroy();
    }

    public getNgZone() {
        return this.zone;
    }

    private playAudio(filepath: string, fileType: string, callback) {
        try {
            var playerOptions: AudioPlayerOptions = {
                audioFile: filepath,
                loop: false,
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
                this.player.playFromUrl(playerOptions).then(callback, (err) => {
                    console.log(err);
                });
            }
        } catch (ex) {
            console.log(ex);
        }
    }
}