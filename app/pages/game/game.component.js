"use strict";
var core_1 = require("@angular/core");
var zscore_1 = require("../../shared/detection_algorithms/zscore");
var kalmanjs_1 = require("../../shared/detection_algorithms/kalmanjs");
var nativescript_accelerometer_1 = require("nativescript-accelerometer");
var nativescript_audio_1 = require('nativescript-audio');
var GameComponent = (function () {
    function GameComponent(zone) {
        this.zone = zone;
        this.lastValue = 0;
        this.buffer = [];
        this.zscore = new zscore_1.zScore(5, 3.5, 0.1);
        this.kalman = new kalmanjs_1.KalmanFilter({ R: 5, Q: 0.01 });
    }
    GameComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.score = 0;
        this.scoreModel = 0;
        this.player = new nativescript_audio_1.TNSPlayer();
        this.playAudio('~/audio/faded.mp3', 'localFile');
        nativescript_accelerometer_1.startAccelerometerUpdates(function (data) {
            _this.zone.run(function () {
                var result = _this.naiveFilter(data.z);
                var output = _this.detectSignalHigh(result);
                if (output == 1) {
                    _this.scoreModel += 50;
                }
                //console.log(data.z);
            });
        });
        // score on the view must be manually updated every 100ms, or it overuses the cpu
        setInterval(function () {
            _this.score = _this.scoreModel;
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
        if (input > 0.25) {
            return 1;
        }
        else {
            return 0;
        }
    };
    GameComponent.prototype.detectSignalHigh = function (input) {
        var result;
        if (this.lastValue == 0 && input == 1) {
            result = 1;
        }
        else {
            result = 0;
        }
        this.lastValue = input;
        return result;
    };
    GameComponent = __decorate([
        core_1.Component({
            selector: "game",
            templateUrl: "pages/game/game.html"
        }), 
        __metadata('design:paramtypes', [core_1.NgZone])
    ], GameComponent);
    return GameComponent;
}());
exports.GameComponent = GameComponent;
//# sourceMappingURL=game.component.js.map