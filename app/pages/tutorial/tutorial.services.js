"use strict";
// >> http-get-service
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
require("rxjs/add/operator/do");
var TutorialService = (function () {
    function TutorialService(http) {
        this.http = http;
        this.serverUrl = "https://php-citadell.rhcloud.com/v1/tutorial";
    }
    TutorialService.prototype.getData = function () {
        var headers = this.createRequestHeader();
        return this.http.get(this.serverUrl, { headers: headers })
            .map(function (res) { return res.json(); });
    };
    TutorialService.prototype.createRequestHeader = function () {
        var headers = new http_1.Headers();
        // set headers here e.g.
        headers.append("Content-Type", "application/json");
        return headers;
    };
    TutorialService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], TutorialService);
    return TutorialService;
}());
exports.TutorialService = TutorialService;
// << http-get-service 
//# sourceMappingURL=tutorial.services.js.map