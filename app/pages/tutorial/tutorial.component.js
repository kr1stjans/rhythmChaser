"use strict";
var core_1 = require("@angular/core");
var label_1 = require("ui/label");
var page_1 = require("ui/page");
var detection_component_1 = require("../../shared/detection.component");
var tutorial_services_1 = require("./tutorial.services");
var nativescript_audio_1 = require("nativescript-audio");
var nativescript_angular_1 = require("nativescript-angular");
var TutorialComponent = (function () {
    function TutorialComponent(routerExtensions, tutorialService, zone, page) {
        this.routerExtensions = routerExtensions;
        this.tutorialService = tutorialService;
        this.zone = zone;
        this.page = page;
        this.currentState = TutorialState.INTRO;
        this.gestureCount = 1;
        // score variables
        this.score = 0;
        this.scoreMultiplier = 1;
    }
    TutorialComponent.prototype.getNgZone = function () {
        return this.zone;
    };
    TutorialComponent.prototype.ngOnInit = function () {
        this.gestureDetection = new detection_component_1.QuickGestureDetection(this);
        this.tutorialLayout = this.page.getViewById("tutorialLayout");
        this.updateState();
    };
    TutorialComponent.prototype.createGestureDetectedLabel = function (text, correctDetection) {
        if (correctDetection === void 0) { correctDetection = true; }
        var label = new label_1.Label();
        label.textWrap = true;
        label.cssClass = correctDetection ? "correct-detection" : "false-detection";
        label.text = text;
        this.tutorialLayout.addChild(label);
        var animation = label.createAnimation({
            opacity: 0,
            duration: 3000,
        });
        return animation.play();
    };
    TutorialComponent.prototype.createLabel = function (text, delay) {
        if (delay === void 0) { delay = 0; }
        var label = new label_1.Label();
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
        var animation = label.createAnimation({
            opacity: 1,
            duration: 750,
            delay: delay
        });
        return animation.play();
    };
    TutorialComponent.prototype.quickGestureDetected = function () {
        var _this = this;
        switch (this.currentState) {
            case TutorialState.MOVEMENT_SINGLE:
                this.tutorialLayout.removeChildren();
                this.createGestureDetectedLabel("Movement detected!")
                    .then(function () {
                    _this.nextState();
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
                var actualBeatExists = false;
                var timeSinceStartInSeconds = (new Date().getTime() - this.startTime) / 1000;
                var beats = this.selectedSong['beats'].split(",").map(function (value) {
                    return +value;
                });
                for (var _i = 0, beats_1 = beats; _i < beats_1.length; _i++) {
                    var beat = beats_1[_i];
                    // beat at current time detected
                    var diff = Math.abs(beat - timeSinceStartInSeconds);
                    if (diff < 0.2) {
                        actualBeatExists = true;
                        break;
                    }
                }
                this.tutorialLayout.removeChildren();
                this.createGestureDetectedLabel(actualBeatExists ? "x " + this.scoreMultiplier : "Missed!", actualBeatExists);
                if (actualBeatExists) {
                    this.score += this.scoreMultiplier;
                    this.scoreMultiplier++;
                }
                else {
                    this.scoreMultiplier = 0;
                }
                break;
        }
    };
    TutorialComponent.prototype.updateState = function () {
        var _this = this;
        switch (this.currentState) {
            case TutorialState.INTRO:
                this.createLabel("Want to dance with your crush?")
                    .then(function () {
                    return _this.createLabel("Want to experience and listen to music in a completely new way?");
                })
                    .then(function () {
                    return _this.createLabel("Want to learn an instrument?");
                })
                    .then(function () {
                    return _this.createLabel("You need to learn rhythm!", 1000);
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
                this.player = new nativescript_audio_1.TNSPlayer();
                this.tutorialService.getData().map(function (json) { return json.content; }).subscribe(function (result) {
                    _this.selectedSong = result[0];
                    _this.playAudio(_this.selectedSong['url_music'], "remoteFile", function () {
                        _this.startTime = new Date().getTime();
                    });
                }, function (error) { return console.log(error); });
                break;
            case TutorialState.FINISH:
                this.tutorialLayout.removeChildren();
                this.createLabel("Good job! You are now ready to rock'n'roll!", 1);
                break;
        }
    };
    TutorialComponent.prototype.nextState = function () {
        if (this.currentState + 1 == 6) {
            // redirect back
            this.routerExtensions.navigate([""], { clearHistory: true });
            return;
        }
        this.currentState = TutorialState[TutorialState[this.currentState + 1]];
        this.updateState();
    };
    TutorialComponent.prototype.playAudio = function (filepath, fileType, callback) {
        var _this = this;
        try {
            var playerOptions = {
                audioFile: filepath,
                loop: false,
                completeCallback: function () {
                    _this.nextState();
                    _this.player.dispose().then(function () {
                        console.log('TNSPlayer disposed.');
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
    TutorialComponent = __decorate([
        core_1.Component({
            selector: "tutorial",
            templateUrl: "pages/tutorial/tutorial.html",
            providers: [tutorial_services_1.TutorialService]
        }), 
        __metadata('design:paramtypes', [nativescript_angular_1.RouterExtensions, tutorial_services_1.TutorialService, core_1.NgZone, page_1.Page])
    ], TutorialComponent);
    return TutorialComponent;
}());
exports.TutorialComponent = TutorialComponent;
var TutorialState;
(function (TutorialState) {
    TutorialState[TutorialState["INTRO"] = 1] = "INTRO";
    TutorialState[TutorialState["MOVEMENT_SINGLE"] = 2] = "MOVEMENT_SINGLE";
    TutorialState[TutorialState["MOVEMENT_LEARNING_START"] = 3] = "MOVEMENT_LEARNING_START";
    TutorialState[TutorialState["MUSIC"] = 4] = "MUSIC";
    TutorialState[TutorialState["FINISH"] = 5] = "FINISH";
})(TutorialState || (TutorialState = {}));
//# sourceMappingURL=tutorial.component.js.map