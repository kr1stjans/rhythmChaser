// >> http-get-service
import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {Observable as RxObservable} from "rxjs/Rx";

import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import {device} from "platform";

@Injectable()
export class MusicService {
    private serverUrl = "https://php-citadell.rhcloud.com/v1/music/";

    constructor(private http: Http) {
    }

    getData() {
        let headers = this.createRequestHeader();
        return this.http.get(this.serverUrl + device.uuid, {headers: headers})
            .map(res => res.json());
    }

    private createRequestHeader() {
        let headers = new Headers();
        // set headers here e.g.
        headers.append("Content-Type", "application/json");
        return headers;
    }
}
// << http-get-service