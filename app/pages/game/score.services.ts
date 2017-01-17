// >> http-get-service
import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {Observable as RxObservable} from "rxjs/Rx";

import "rxjs/add/operator/map";
import "rxjs/add/operator/do";

@Injectable()
export class ScoreService {
    private serverUrl = "https://php-citadell.rhcloud.com/v1/highScore";

    constructor(private http: Http) {
    }

    updateScore(user: string, songId: string, score: number) {
        return this.http.post(this.serverUrl, {
            "name": user,
            "song_id": songId,
            "score": score
        }).subscribe(response => console.log(response.json()));
    }
}
// << http-get-service