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
    return HighscoreComponent;
}());
HighscoreComponent = __decorate([
    core_1.Component({
        selector: "highscore",
        templateUrl: "pages/highscore/highscore.html"
    })
], HighscoreComponent);
exports.HighscoreComponent = HighscoreComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlnaHNjb3JlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhpZ2hzY29yZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHNDQUFnRDtBQU9oRCxJQUFhLGtCQUFrQjtJQUovQjtRQUtJLGtCQUFhLEdBQWtCLEVBQUUsQ0FBQztJQWN0QyxDQUFDO0lBWkcscUNBQVEsR0FBUjtRQUNJLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRCwwQ0FBYSxHQUFiLFVBQWMsSUFBbUI7UUFDN0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDWCwwQ0FBMEM7WUFDMUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUUsbUVBQW1FO1FBQ3JHLENBQUM7SUFDTCxDQUFDO0lBQ0wseUJBQUM7QUFBRCxDQUFDLEFBZkQsSUFlQztBQWZZLGtCQUFrQjtJQUo5QixnQkFBUyxDQUFDO1FBQ1AsUUFBUSxFQUFFLFdBQVc7UUFDckIsV0FBVyxFQUFFLGdDQUFnQztLQUNoRCxDQUFDO0dBQ1csa0JBQWtCLENBZTlCO0FBZlksZ0RBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIE9uSW5pdH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7SXRlbUV2ZW50RGF0YX0gZnJvbSBcInVpL2xpc3Qtdmlld1wiO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJoaWdoc2NvcmVcIixcbiAgICB0ZW1wbGF0ZVVybDogXCJwYWdlcy9oaWdoc2NvcmUvaGlnaHNjb3JlLmh0bWxcIlxufSlcbmV4cG9ydCBjbGFzcyBIaWdoc2NvcmVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIGhpZ2hzY29yZUxpc3Q6IEFycmF5PE9iamVjdD4gPSBbXTtcblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLmhpZ2hzY29yZUxpc3QucHVzaCh7bmFtZTogXCJLcmlzdGphblwiLCBzY29yZTogMjM0MjM0Mn0pO1xuICAgICAgICB0aGlzLmhpZ2hzY29yZUxpc3QucHVzaCh7bmFtZTogXCJSb2tcIiwgc2NvcmU6IDEyMzQyfSk7XG4gICAgICAgIHRoaXMuaGlnaHNjb3JlTGlzdC5wdXNoKHtuYW1lOiBcIktsZW1lblwiLCBzY29yZTogMjM0Mn0pO1xuICAgIH1cblxuICAgIG9uSXRlbUxvYWRpbmcoYXJnczogSXRlbUV2ZW50RGF0YSkge1xuICAgICAgICBpZiAoYXJncy5pb3MpIHtcbiAgICAgICAgICAgIC8vIGFyZ3MuaW9zIGlzIGluc3RhbmNlIG9mIFVJVGFibGVWaWV3Q2VsbFxuICAgICAgICAgICAgYXJncy5pb3Muc2VsZWN0aW9uU3R5bGUgPSAwOyAgLy8gVUlUYWJsZVZpZXdDZWxsU2VsZWN0aW9uU3R5bGUuVUlUYWJsZVZpZXdDZWxsU2VsZWN0aW9uU3R5bGVOb25lO1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==