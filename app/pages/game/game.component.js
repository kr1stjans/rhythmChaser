"use strict";
var core_1 = require("@angular/core");
var page_1 = require("ui/page");
var nativescript_audio_1 = require('nativescript-audio');
var label_1 = require("ui/label");
var dialogs_1 = require("ui/dialogs");
var absolute_layout_1 = require("ui/layouts/absolute-layout");
var detection_component_1 = require("../../shared/detection.component");
var music_services_1 = require("./music.services");
var platform_1 = require("platform");
var enums_1 = require("ui/enums");
var nativescript_angular_1 = require("nativescript-angular");
var score_services_1 = require("./score.services");
var GameComponent = (function () {
    function GameComponent(scoreService, routerExtensions, musicService, zone, page) {
        this.scoreService = scoreService;
        this.routerExtensions = routerExtensions;
        this.musicService = musicService;
        this.zone = zone;
        this.page = page;
        // score variables
        this.score = 0;
        this.scoreMultiplier = 1;
        this.songList = [];
    }
    /**
     * Clear song picker and init gesture & audio player.
     */
    GameComponent.prototype.listViewItemTap = function (args) {
        var _this = this;
        this.quickGestureDetection = new detection_component_1.QuickGestureDetection(this);
        this.player = new nativescript_audio_1.TNSPlayer();
        this.selectedSong = this.songList[args.index];
        this.playAudio(this.selectedSong['url_music']);
        this.scoresLayout.removeChildren();
        var scoreLabel = this.createAbsoluteLabel("", 0, 0);
        var timeLabel = this.createAbsoluteLabel("", platform_1.screen.mainScreen.widthDIPs - 60, 0);
        this.updateCallback = setInterval(function () {
            scoreLabel.text = "Score: " + _this.score;
            if (_this.songDuration != null) {
                timeLabel.text = (_this.songDuration - ((new Date().getTime() - _this.startTime) / 1000)).toFixed(0) + "s";
            }
        }, 100);
    };
    GameComponent.prototype.onItemLoading = function (args) {
        if (args.ios) {
            // args.ios is instance of UITableViewCell
            args.ios.selectionStyle = 0; // UITableViewCellSelectionStyle.UITableViewCellSelectionStyleNone;
        }
    };
    /**
     * Init song picker and fetch songs from backend.
     */
    GameComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.scoresLayout = this.page.getViewById("scoresLayout");
        this.musicService.getData().map(function (json) { return json.content; }).subscribe(function (result) {
            _this.songList = result;
        }, function (error) { return console.log(error); });
    };
    GameComponent.prototype.quickGestureDetected = function () {
        var actualBeatExists = false;
        var timeSinceStartInSeconds = (new Date().getTime() - this.startTime) / 1000;
        var beats = this.selectedSong['beats'].split(",").map(function (value) {
            return +value;
        });
        for (var _i = 0, beats_1 = beats; _i < beats_1.length; _i++) {
            var beat = beats_1[_i];
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
        }
        else {
            this.scoreMultiplier = 0;
        }
        this.createGestureDetectedLabel(actualBeatExists ? "+" + this.scoreMultiplier : "Missed!", actualBeatExists, 2500, 0, this.scoreMultiplier / 10);
    };
    GameComponent.prototype.createGestureDetectedLabel = function (text, correctDetection, duration, minimumOpacity, expand) {
        if (correctDetection === void 0) { correctDetection = true; }
        if (duration === void 0) { duration = 2500; }
        if (minimumOpacity === void 0) { minimumOpacity = 0; }
        if (expand === void 0) { expand = 0; }
        var minimum = Math.min(platform_1.screen.mainScreen.widthDIPs, platform_1.screen.mainScreen.heightDIPs);
        var label = new label_1.Label();
        label.textWrap = true;
        label.cssClass = correctDetection ? "correct-detection" : "false-detection";
        label.text = text;
        label.style.width = minimum / 2 * (1 + expand);
        label.style.height = minimum / 2 * (1 + expand);
        label.style.borderRadius = minimum / 4 * (1 + expand);
        label.style.fontSize = 35 * (1 + expand / 2);
        absolute_layout_1.AbsoluteLayout.setLeft(label, platform_1.screen.mainScreen.widthDIPs / 2 - (label.style.width / 2));
        absolute_layout_1.AbsoluteLayout.setTop(label, platform_1.screen.mainScreen.heightDIPs / 2 - (label.style.height / 2));
        this.scoresLayout.addChild(label);
        var animation = label.createAnimation({
            opacity: minimumOpacity,
            duration: duration,
            curve: enums_1.AnimationCurve.easeIn
        });
        return animation.play();
    };
    GameComponent.prototype.createAbsoluteLabel = function (text, left, top) {
        var label = new label_1.Label();
        label.textWrap = true;
        label.style.fontSize = 24;
        label.style.textAlignment = 'left';
        label.text = text;
        label.style.zIndex = 1000;
        absolute_layout_1.AbsoluteLayout.setLeft(label, left);
        absolute_layout_1.AbsoluteLayout.setTop(label, top);
        this.scoresLayout.addChild(label);
        return label;
    };
    GameComponent.prototype.ngOnDestroy = function () {
        this.player.pause();
        this.quickGestureDetection.destroy();
    };
    GameComponent.prototype.getNgZone = function () {
        return this.zone;
    };
    GameComponent.prototype.playAudio = function (filepath) {
        var _this = this;
        try {
            var playerOptions = {
                audioFile: filepath,
                loop: false,
                completeCallback: function () {
                    clearInterval(_this.updateCallback);
                    dialogs_1.prompt({
                        title: "Score: " + _this.score,
                        message: "Enter your name",
                        okButtonText: "Ok",
                        cancelButtonText: "Cancel",
                        defaultText: "Kristjan",
                        inputType: dialogs_1.inputType.text
                    }).then(function (r) {
                        console.log("Dialog result: " + r.result + ", text: " + r.text);
                        _this.scoreService.updateScore(r.text, _this.selectedSong['id'], _this.score);
                        _this.routerExtensions.navigate([""], { clearHistory: true });
                    });
                    _this.player.dispose().then(function () {
                        console.log('DISPOSED');
                    }, function (err) {
                        console.log('ERROR disposePlayer: ' + err);
                    });
                },
                errorCallback: function (err) {
                    console.log(err);
                },
                infoCallback: function (info) {
                    console.log("what: " + info);
                }
            };
            this.player.playFromUrl(playerOptions).then(function () {
                _this.startTime = new Date().getTime();
                _this.player.getAudioTrackDuration().then(function (result) {
                    _this.songDuration = +result;
                });
            }, function (err) {
                console.log(err);
            });
        }
        catch (ex) {
            console.log(ex);
        }
    };
    GameComponent = __decorate([
        core_1.Component({
            selector: "game",
            templateUrl: "pages/game/game.html",
            providers: [music_services_1.MusicService, score_services_1.ScoreService]
        }), 
        __metadata('design:paramtypes', [score_services_1.ScoreService, nativescript_angular_1.RouterExtensions, music_services_1.MusicService, core_1.NgZone, page_1.Page])
    ], GameComponent);
    return GameComponent;
}());
exports.GameComponent = GameComponent;
//# sourceMappingURL=game.component.js.map