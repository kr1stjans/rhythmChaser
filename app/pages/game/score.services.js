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
    return ScoreService;
}());
ScoreService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], ScoreService);
exports.ScoreService = ScoreService;
// << http-get-service 
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NvcmUuc2VydmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzY29yZS5zZXJ2aWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsc0JBQXNCO0FBQ3RCLHNDQUF5QztBQUN6QyxzQ0FBc0Q7QUFHdEQsaUNBQStCO0FBQy9CLGdDQUE4QjtBQUc5QixJQUFhLFlBQVk7SUFHckIsc0JBQW9CLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO1FBRnRCLGNBQVMsR0FBRywrQ0FBK0MsQ0FBQztJQUdwRSxDQUFDO0lBRUQsa0NBQVcsR0FBWCxVQUFZLElBQVksRUFBRSxNQUFjLEVBQUUsS0FBYTtRQUNuRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQyxNQUFNLEVBQUUsSUFBSTtZQUNaLFNBQVMsRUFBRSxNQUFNO1lBQ2pCLE9BQU8sRUFBRSxLQUFLO1NBQ2pCLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUE1QixDQUE0QixDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUNMLG1CQUFDO0FBQUQsQ0FBQyxBQWJELElBYUM7QUFiWSxZQUFZO0lBRHhCLGlCQUFVLEVBQUU7cUNBSWlCLFdBQUk7R0FIckIsWUFBWSxDQWF4QjtBQWJZLG9DQUFZO0FBY3pCLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbIi8vID4+IGh0dHAtZ2V0LXNlcnZpY2VcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7SHR0cCwgSGVhZGVycywgUmVzcG9uc2V9IGZyb20gXCJAYW5ndWxhci9odHRwXCI7XG5pbXBvcnQge09ic2VydmFibGUgYXMgUnhPYnNlcnZhYmxlfSBmcm9tIFwicnhqcy9SeFwiO1xuXG5pbXBvcnQgXCJyeGpzL2FkZC9vcGVyYXRvci9tYXBcIjtcbmltcG9ydCBcInJ4anMvYWRkL29wZXJhdG9yL2RvXCI7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTY29yZVNlcnZpY2Uge1xuICAgIHByaXZhdGUgc2VydmVyVXJsID0gXCJodHRwczovL3BocC1jaXRhZGVsbC5yaGNsb3VkLmNvbS92MS9oaWdoU2NvcmVcIjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cCkge1xuICAgIH1cblxuICAgIHVwZGF0ZVNjb3JlKHVzZXI6IHN0cmluZywgc29uZ0lkOiBzdHJpbmcsIHNjb3JlOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHRoaXMuc2VydmVyVXJsLCB7XG4gICAgICAgICAgICBcIm5hbWVcIjogdXNlcixcbiAgICAgICAgICAgIFwic29uZ19pZFwiOiBzb25nSWQsXG4gICAgICAgICAgICBcInNjb3JlXCI6IHNjb3JlXG4gICAgICAgIH0pLnN1YnNjcmliZShyZXNwb25zZSA9PiBjb25zb2xlLmxvZyhyZXNwb25zZS5qc29uKCkpKTtcbiAgICB9XG59XG4vLyA8PCBodHRwLWdldC1zZXJ2aWNlIl19