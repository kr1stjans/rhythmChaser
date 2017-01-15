"use strict";
var play_component_1 = require("./pages/play/play.component");
var game_component_1 = require("./pages/game/game.component");
var tutorial_component_1 = require("./pages/tutorial/tutorial.component");
var highscore_component_1 = require("./pages/highscore/highscore.component");
exports.routes = [
    { path: "", component: play_component_1.PlayComponent },
    { path: "game", component: game_component_1.GameComponent },
    { path: "highscore", component: highscore_component_1.HighscoreComponent },
    { path: "tutorial", component: tutorial_component_1.TutorialComponent }
];
exports.navigatableComponents = [
    play_component_1.PlayComponent,
    game_component_1.GameComponent,
    highscore_component_1.HighscoreComponent,
    tutorial_component_1.TutorialComponent
];
//# sourceMappingURL=app.routing.js.map