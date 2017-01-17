"use strict";
var core_1 = require("@angular/core");
var label_1 = require("ui/label");
var stack_layout_1 = require("ui/layouts/stack-layout");
var page_1 = require("ui/page");
var detection_component_1 = require("../../shared/detection.component");
var tutorial_services_1 = require("./tutorial.services");
var nativescript_audio_1 = require("nativescript-audio");
var nativescript_angular_1 = require("nativescript-angular");
var enums_1 = require("ui/enums");
var absolute_layout_1 = require("ui/layouts/absolute-layout");
var platform_1 = require("platform");
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
    TutorialComponent.prototype.ngOnDestroy = function () {
        this.player.pause();
        this.gestureDetection.destroy();
    };
    TutorialComponent.prototype.getNgZone = function () {
        return this.zone;
    };
    TutorialComponent.prototype.ngOnInit = function () {
        this.gestureDetection = new detection_component_1.QuickGestureDetection(this);
        this.tutorialLayout = this.page.getViewById("tutorialLayout");
        this.updateState();
    };
    TutorialComponent.prototype.createGestureDetectedLabel = function (text, correctDetection, duration, minimumOpacity, expand) {
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
        this.tutorialLayout.addChild(label);
        var animation = label.createAnimation({
            opacity: minimumOpacity,
            duration: duration,
            curve: enums_1.AnimationCurve.easeIn
        });
        return animation.play();
    };
    TutorialComponent.prototype.createAbsoluteLabel = function (text, left, top) {
        var label = new label_1.Label();
        label.textWrap = true;
        label.style.fontSize = 24;
        label.style.textAlignment = 'left';
        label.text = text;
        label.style.zIndex = 1000;
        absolute_layout_1.AbsoluteLayout.setLeft(label, left);
        absolute_layout_1.AbsoluteLayout.setTop(label, top);
        this.tutorialLayout.addChild(label);
        return label;
    };
    TutorialComponent.prototype.createLabel = function (layout, text, delay) {
        if (delay === void 0) { delay = 0; }
        var label = new label_1.Label();
        label.textWrap = true;
        label.style.opacity = 0;
        label.style.fontSize = 24;
        label.style.textAlignment = "left";
        label.text = text;
        label.style.margin = "10";
        label.style.width = platform_1.screen.mainScreen.widthDIPs - 10;
        if (delay != 0) {
            label.style.fontWeight = "bold";
            label.style.fontSize = 32;
        }
        layout.addChild(label);
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
                this.createGestureDetectedLabel("Movement detected!", true, 1500, 1, 0.5)
                    .then(function () {
                    _this.nextState();
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
                var actualBeatExists = false;
                var timeSinceStartInSeconds = (new Date().getTime() - this.startTime) / 1000;
                var beats = this.selectedSong['beats'].split(",").map(function (value) {
                    return +value;
                });
                for (var _i = 0, beats_1 = beats; _i < beats_1.length; _i++) {
                    var beat = beats_1[_i];
                    // beat at current time detected
                    var diff = Math.abs(beat - timeSinceStartInSeconds);
                    if (diff < 0.25) {
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
                break;
        }
    };
    TutorialComponent.prototype.updateState = function () {
        var _this = this;
        switch (this.currentState) {
            case TutorialState.INTRO:
                var stackLayout = new stack_layout_1.StackLayout();
                this.tutorialLayout.addChild(stackLayout);
                this.createLabel(stackLayout, "Want to dance with your crush?", 0)
                    .then(function () {
                    return _this.createLabel(stackLayout, "Want to experience and listen to music in a completely new way?", 0);
                })
                    .then(function () {
                    return _this.createLabel(stackLayout, "Want to learn an instrument?", 0);
                })
                    .then(function () {
                    return _this.createLabel(stackLayout, "You need to learn rhythm first!", 1000);
                });
                break;
            case TutorialState.MOVEMENT_SINGLE:
                this.tutorialLayout.removeChildren();
                var stackLayout = new stack_layout_1.StackLayout();
                this.tutorialLayout.addChild(stackLayout);
                this.createLabel(stackLayout, "Make a quick movement with your phone in any direction. Marker will appear on the screen when the movement is detected.", 0);
                break;
            case TutorialState.MOVEMENT_LEARNING_START:
                this.tutorialLayout.removeChildren();
                var stackLayout = new stack_layout_1.StackLayout();
                this.tutorialLayout.addChild(stackLayout);
                this.createLabel(stackLayout, "Good job! Make a few more movements to get familiar with the movements that are detected.", 0);
                break;
            case TutorialState.MUSIC:
                this.tutorialLayout.removeChildren();
                var stackLayout = new stack_layout_1.StackLayout();
                this.tutorialLayout.addChild(stackLayout);
                this.createLabel(stackLayout, "Well done! Now lets add some music. Make the movement, when you hear a beat.", 0);
                this.player = new nativescript_audio_1.TNSPlayer();
                this.tutorialService.getData().map(function (json) { return json.content; }).subscribe(function (result) {
                    _this.selectedSong = result[0];
                    _this.playAudio(_this.selectedSong['url_music']);
                }, function (error) { return console.log(error); });
                break;
            case TutorialState.MUSIC_STARTED:
                this.tutorialLayout.removeChildren();
                var scoreLabel = this.createAbsoluteLabel("", 0, 0);
                var timeLabel = this.createAbsoluteLabel("", platform_1.screen.mainScreen.widthDIPs - 50, 0);
                setInterval(function () {
                    scoreLabel.text = "Score: " + _this.score;
                    timeLabel.text = (_this.songDuration - ((new Date().getTime() - _this.startTime) / 1000)).toFixed(0) + "s";
                }, 100);
                break;
            case TutorialState.FINISH:
                this.tutorialLayout.removeChildren();
                var stackLayout = new stack_layout_1.StackLayout();
                this.tutorialLayout.addChild(stackLayout);
                this.createLabel(stackLayout, "Nice beats! You are now ready to rock'n'roll!", 0);
                this.createLabel(stackLayout, "Score: " + this.score, 0);
                break;
        }
    };
    TutorialComponent.prototype.nextState = function () {
        if (this.currentState + 1 == 7) {
            // redirect back
            this.routerExtensions.navigate([""], { clearHistory: true });
            return;
        }
        this.currentState = TutorialState[TutorialState[this.currentState + 1]];
        this.updateState();
    };
    TutorialComponent.prototype.playAudio = function (filepath) {
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
    TutorialState[TutorialState["MUSIC_STARTED"] = 5] = "MUSIC_STARTED";
    TutorialState[TutorialState["FINISH"] = 6] = "FINISH";
})(TutorialState || (TutorialState = {}));
//# sourceMappingURL=tutorial.component.js.map