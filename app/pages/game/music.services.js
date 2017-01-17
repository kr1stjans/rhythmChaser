"use strict";
// >> http-get-service
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
require("rxjs/add/operator/do");
var platform_1 = require("platform");
var MusicService = (function () {
    function MusicService(http) {
        this.http = http;
        this.serverUrl = "https://php-citadell.rhcloud.com/v1/music/";
    }
    MusicService.prototype.getData = function () {
        var headers = this.createRequestHeader();
        return this.http.get(this.serverUrl + platform_1.device.uuid, { headers: headers })
            .map(function (res) { return res.json(); });
    };
    MusicService.prototype.createRequestHeader = function () {
        var headers = new http_1.Headers();
        // set headers here e.g.
        headers.append("Content-Type", "application/json");
        return headers;
    };
    return MusicService;
}());
MusicService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], MusicService);
exports.MusicService = MusicService;
// << http-get-service 
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVzaWMuc2VydmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtdXNpYy5zZXJ2aWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsc0JBQXNCO0FBQ3RCLHNDQUF5QztBQUN6QyxzQ0FBc0Q7QUFHdEQsaUNBQStCO0FBQy9CLGdDQUE4QjtBQUM5QixxQ0FBZ0M7QUFHaEMsSUFBYSxZQUFZO0lBR3JCLHNCQUFvQixJQUFVO1FBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUZ0QixjQUFTLEdBQUcsNENBQTRDLENBQUM7SUFHakUsQ0FBQztJQUVELDhCQUFPLEdBQVA7UUFDSSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUN6QyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxpQkFBTSxDQUFDLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUMsQ0FBQzthQUNqRSxHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQVYsQ0FBVSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVPLDBDQUFtQixHQUEzQjtRQUNJLElBQUksT0FBTyxHQUFHLElBQUksY0FBTyxFQUFFLENBQUM7UUFDNUIsd0JBQXdCO1FBQ3hCLE9BQU8sQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFDbkQsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBQ0wsbUJBQUM7QUFBRCxDQUFDLEFBbEJELElBa0JDO0FBbEJZLFlBQVk7SUFEeEIsaUJBQVUsRUFBRTtxQ0FJaUIsV0FBSTtHQUhyQixZQUFZLENBa0J4QjtBQWxCWSxvQ0FBWTtBQW1CekIsc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gPj4gaHR0cC1nZXQtc2VydmljZVxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHtIdHRwLCBIZWFkZXJzLCBSZXNwb25zZX0gZnJvbSBcIkBhbmd1bGFyL2h0dHBcIjtcbmltcG9ydCB7T2JzZXJ2YWJsZSBhcyBSeE9ic2VydmFibGV9IGZyb20gXCJyeGpzL1J4XCI7XG5cbmltcG9ydCBcInJ4anMvYWRkL29wZXJhdG9yL21hcFwiO1xuaW1wb3J0IFwicnhqcy9hZGQvb3BlcmF0b3IvZG9cIjtcbmltcG9ydCB7ZGV2aWNlfSBmcm9tIFwicGxhdGZvcm1cIjtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE11c2ljU2VydmljZSB7XG4gICAgcHJpdmF0ZSBzZXJ2ZXJVcmwgPSBcImh0dHBzOi8vcGhwLWNpdGFkZWxsLnJoY2xvdWQuY29tL3YxL211c2ljL1wiO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwKSB7XG4gICAgfVxuXG4gICAgZ2V0RGF0YSgpIHtcbiAgICAgICAgbGV0IGhlYWRlcnMgPSB0aGlzLmNyZWF0ZVJlcXVlc3RIZWFkZXIoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQodGhpcy5zZXJ2ZXJVcmwgKyBkZXZpY2UudXVpZCwge2hlYWRlcnM6IGhlYWRlcnN9KVxuICAgICAgICAgICAgLm1hcChyZXMgPT4gcmVzLmpzb24oKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVSZXF1ZXN0SGVhZGVyKCkge1xuICAgICAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XG4gICAgICAgIC8vIHNldCBoZWFkZXJzIGhlcmUgZS5nLlxuICAgICAgICBoZWFkZXJzLmFwcGVuZChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgIHJldHVybiBoZWFkZXJzO1xuICAgIH1cbn1cbi8vIDw8IGh0dHAtZ2V0LXNlcnZpY2UiXX0=