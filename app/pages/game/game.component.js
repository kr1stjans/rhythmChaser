"use strict";
var core_1 = require("@angular/core");
var page_1 = require("ui/page");
var nativescript_audio_1 = require('nativescript-audio');
var label_1 = require("ui/label");
var list_picker_1 = require("ui/list-picker");
var detection_component_1 = require("../../shared/detection.component");
var music_services_1 = require("./music.services");
var GameComponent = (function () {
    function GameComponent(musicService, zone, page) {
        this.musicService = musicService;
        this.zone = zone;
        this.page = page;
        // score variables
        this.score = 0;
        this.scoreMultiplier = 1;
    }
    /**
     * Clear song picker and init gesture & audio player.
     */
    GameComponent.prototype.play = function () {
        var _this = this;
        this.quickGestureDetection = new detection_component_1.QuickGestureDetection(this);
        this.player = new nativescript_audio_1.TNSPlayer();
        this.selectedSong = this.songs[this.songPicker.selectedIndex];
        this.playAudio(this.selectedSong['url_music'], "remoteFile", function () {
            _this.startTime = new Date().getTime();
        });
        this.scoresLayout.removeChildren();
    };
    /**
     * Init song picker and fetch songs from backend.
     */
    GameComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.scoresLayout = this.page.getViewById("scoresLayout");
        this.songPicker = new list_picker_1.ListPicker();
        this.songPicker.cssClass = "song-picker";
        this.scoresLayout.addChild(this.songPicker);
        this.musicService.getData().map(function (json) { return json.content; }).subscribe(function (result) {
            _this.songs = result;
            _this.songPicker.items = result.map(function (item) {
                return item['author'] + " - " +
                    item['title'] +
                    "(Your best: " +
                    (item['user_score'] != null ? item['user_score'] : 0) +
                    ", World best: " +
                    (item['high_score'] != null ? item['high_score'] : 0);
            });
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
            if (diff < 0.13) {
                actualBeatExists = true;
                break;
            }
        }
        this.scoresLayout.removeChildren();
        if (actualBeatExists) {
            this.createGestureDetectedLabel("x " + this.scoreMultiplier);
            this.score += this.scoreMultiplier;
            this.scoreMultiplier++;
        }
        else {
            this.scoreMultiplier = 0;
        }
    };
    GameComponent.prototype.createGestureDetectedLabel = function (text) {
        var label = new label_1.Label();
        label.textWrap = true;
        label.cssClass = "gesture-detected";
        label.text = text;
        this.scoresLayout.addChild(label);
        var animation = label.createAnimation({
            duration: 1500,
            scale: { x: 0.1, y: 0.1 },
        });
        return animation.play();
    };
    GameComponent.prototype.ngOnDestroy = function () {
        this.player.pause();
        this.quickGestureDetection.destroy();
    };
    GameComponent.prototype.getNgZone = function () {
        return this.zone;
    };
    GameComponent.prototype.playAudio = function (filepath, fileType, callback) {
        var _this = this;
        try {
            var playerOptions = {
                audioFile: filepath,
                loop: false,
                completeCallback: function () {
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
            if (fileType === 'localFile') {
                this.player.playFromFile(playerOptions).then(function () {
                }, function (err) {
                    console.log(err);
                });
            }
            else if (fileType === 'remoteFile') {
                this.player.playFromUrl(playerOptions).then(callback, function (err) {
                    console.log(err);
                });
            }
        }
        catch (ex) {
            console.log(ex);
        }
    };
    GameComponent = __decorate([
        core_1.Component({
            selector: "game",
            templateUrl: "pages/game/game.html",
            providers: [music_services_1.MusicService]
        }), 
        __metadata('design:paramtypes', [music_services_1.MusicService, core_1.NgZone, page_1.Page])
    ], GameComponent);
    return GameComponent;
}());
exports.GameComponent = GameComponent;
//# sourceMappingURL=game.component.js.map