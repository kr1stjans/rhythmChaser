"use strict";
var core_1 = require("@angular/core");
var page_1 = require("ui/page");
var nativescript_accelerometer_1 = require("nativescript-accelerometer");
var nativescript_audio_1 = require('nativescript-audio');
var zscore_1 = require("../../shared/detection_algorithms/zscore");
var kalmanjs_1 = require("../../shared/detection_algorithms/kalmanjs");
var label_1 = require("ui/label");
var absolute_layout_1 = require("ui/layouts/absolute-layout");
var file_system_1 = require("file-system");
var GameComponent = (function () {
    function GameComponent(zone, page) {
        this.zone = zone;
        this.page = page;
        this.lastValue = 0;
        this.buffer = [];
        this.zscore = new zscore_1.zScore(5, 3.5, 0.1);
        this.kalman = new kalmanjs_1.KalmanFilter({ R: 5, Q: 0.01 });
        // animation variables
        this.animationPositions = [20, 60, 100, 140, 180, 220];
        this.animationDirection = AnimationDirection.INCREASING;
        this.animationPosition = this.animationPositions.length / 2;
        // score variables
        this.score = 0;
        this.scoreMultiplier = 1;
        this.gestureMade = false;
    }
    GameComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.scoresLayout = this.page.getViewById("scoresLayout");
        this.player = new nativescript_audio_1.TNSPlayer();
        // read beats file
        file_system_1.knownFolders.currentApp().getFile("/audio/faded.csv").readText().then(function (text) {
            _this.beatArray = text.split(",").map(function (value) {
                return +value;
            });
        }).then(function () {
            // start playing song
            _this.playAudio("~/audio/faded.mp3", "localFile");
            _this.startTime = new Date().getTime();
            // start accelerometer updates
            nativescript_accelerometer_1.startAccelerometerUpdates(function (data) {
                _this.zone.run(function () {
                    var result = _this.naiveFilter(data.z);
                    var signalHigh = _this.detectSignalHigh(result);
                    if (signalHigh) {
                        _this.gestureMade = true;
                    }
                    //console.log(data.z);
                });
            });
        });
        // view must be manually updated every 100ms or it overuses the cpu and no update is processed
        setInterval(function () {
            // if gesture was made check if actual beat exists
            if (_this.gestureMade) {
                var actualBeatExists = false;
                var timeSinceStartInSeconds = (new Date().getTime() - _this.startTime) / 1000;
                for (var _i = 0, _a = _this.beatArray; _i < _a.length; _i++) {
                    var beat = _a[_i];
                    // beat at current time detected
                    var diff = Math.abs(beat - timeSinceStartInSeconds);
                    if (diff < 0.11) {
                        actualBeatExists = true;
                        break;
                    }
                }
                var label = new label_1.Label();
                label.cssClass = "big-text score-label";
                label.text = "+" + (actualBeatExists ? _this.scoreMultiplier : 0);
                absolute_layout_1.AbsoluteLayout.setLeft(label, _this.animationPositions[_this.animationPosition]);
                absolute_layout_1.AbsoluteLayout.setTop(label, 425);
                _this.scoresLayout.addChild(label);
                var animation = label.createAnimation({
                    translate: { x: 0, y: -425 },
                    opacity: 0.5,
                    duration: 2000,
                    scale: { x: 0.5, y: 0.5 },
                });
                animation.play().then(function () {
                    _this.scoresLayout.removeChild(label);
                });
                if (actualBeatExists) {
                    _this.score += _this.scoreMultiplier;
                    _this.scoreMultiplier++;
                }
                else {
                    _this.scoreMultiplier = 1;
                }
                // adjust position
                if (_this.animationDirection == AnimationDirection.INCREASING && _this.animationPosition < _this.animationPositions.length - 1) {
                    _this.animationPosition++;
                }
                else if (_this.animationDirection == AnimationDirection.INCREASING && _this.animationPosition == _this.animationPositions.length - 1) {
                    _this.animationPosition--;
                    _this.animationDirection = AnimationDirection.DECREASING;
                }
                else if (_this.animationDirection == AnimationDirection.DECREASING && _this.animationPosition > 0) {
                    _this.animationPosition--;
                }
                else if (_this.animationDirection == AnimationDirection.DECREASING && _this.animationPosition == 0) {
                    _this.animationPosition++;
                    _this.animationDirection = AnimationDirection.INCREASING;
                }
                // reset beat detection states
                _this.gestureMade = false;
            }
        }, 100);
    };
    GameComponent.prototype.playAudio = function (filepath, fileType) {
        var _this = this;
        try {
            var playerOptions = {
                audioFile: filepath,
                loop: true,
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
                this.player.playFromUrl(playerOptions).then(function () {
                }, function (err) {
                    console.log(err);
                });
            }
        }
        catch (ex) {
            console.log(ex);
        }
    };
    /**
     * Input must be new single value.
     * @param input
     */
    GameComponent.prototype.kalmanFilter = function (input) {
        return this.kalman.filter(input);
    };
    /**
     * Input must be an array of all values until now.
     * @param input
     */
    GameComponent.prototype.zscoreFilter = function (input) {
        this.buffer.push(input);
        var result = this.zscore.filter(this.buffer);
        return result[result.length - 1];
    };
    GameComponent.prototype.naiveFilter = function (input) {
        if (input > 0.185) {
            return 1;
        }
        else {
            return 0;
        }
    };
    GameComponent.prototype.detectSignalHigh = function (input) {
        var result;
        if (this.lastValue == 0 && input == 1) {
            result = true;
        }
        else {
            result = false;
        }
        this.lastValue = input;
        return result;
    };
    GameComponent = __decorate([
        core_1.Component({
            selector: "game",
            templateUrl: "pages/game/game.html"
        }), 
        __metadata('design:paramtypes', [core_1.NgZone, page_1.Page])
    ], GameComponent);
    return GameComponent;
}());
exports.GameComponent = GameComponent;
var AnimationDirection;
(function (AnimationDirection) {
    AnimationDirection[AnimationDirection["INCREASING"] = 0] = "INCREASING";
    AnimationDirection[AnimationDirection["DECREASING"] = 1] = "DECREASING";
})(AnimationDirection || (AnimationDirection = {}));
//# sourceMappingURL=game.component.js.map