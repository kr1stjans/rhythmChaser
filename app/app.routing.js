"use strict";
var play_component_1 = require("./pages/play/play.component");
var game_component_1 = require("./pages/game/game.component");
exports.routes = [
    { path: "", component: play_component_1.PlayComponent },
    { path: "game", component: game_component_1.GameComponent }
];
exports.navigatableComponents = [
    play_component_1.PlayComponent,
    game_component_1.GameComponent
];
//# sourceMappingURL=app.routing.js.map