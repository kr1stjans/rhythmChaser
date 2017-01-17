"use strict";
// >> http-get-service
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
require("rxjs/add/operator/do");
var ScoreService = (function () {
    function ScoreService(http) {
        this.http = http;
        this.serverUrl = "https://php-citadell.rhcloud.com/v1/highScore";
    }
    ScoreService.prototype.updateScore = function (user, songId, score) {
        return this.http.post(this.serverUrl, {
            "name": user,
            "song_id": songId,
            "score": score
        }).subscribe(function (response) { return console.log(response.json()); });
    };
    ScoreService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ScoreService);
    return ScoreService;
}());
exports.ScoreService = ScoreService;
// << http-get-service 
//# sourceMappingURL=score.services.js.map