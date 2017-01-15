"use strict";
var core_1 = require("@angular/core");
var HighscoreComponent = (function () {
    function HighscoreComponent() {
        this.highscoreList = [];
    }
    HighscoreComponent.prototype.ngOnInit = function () {
        this.highscoreList.push({ name: "Kristjan", score: 2342342 });
        this.highscoreList.push({ name: "Rok", score: 12342 });
        this.highscoreList.push({ name: "Klemen", score: 2342 });
    };
    HighscoreComponent.prototype.onItemLoading = function (args) {
        if (args.ios) {
            // args.ios is instance of UITableViewCell
            args.ios.selectionStyle = 0; // UITableViewCellSelectionStyle.UITableViewCellSelectionStyleNone;
        }
    };
    HighscoreComponent = __decorate([
        core_1.Component({
            selector: "highscore",
            templateUrl: "pages/highscore/highscore.html"
        }), 
        __metadata('design:paramtypes', [])
    ], HighscoreComponent);
    return HighscoreComponent;
}());
exports.HighscoreComponent = HighscoreComponent;
//# sourceMappingURL=highscore.component.js.map