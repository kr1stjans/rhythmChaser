import {Component, OnInit} from "@angular/core";
import {ItemEventData} from "ui/list-view";

@Component({
    selector: "highscore",
    templateUrl: "pages/highscore/highscore.html"
})
export class HighscoreComponent implements OnInit {
    highscoreList: Array<Object> = [];

    ngOnInit() {
        this.highscoreList.push({name: "Kristjan", score: 2342342});
        this.highscoreList.push({name: "Rok", score: 12342});
        this.highscoreList.push({name: "Klemen", score: 2342});
    }

    onItemLoading(args: ItemEventData) {
        if (args.ios) {
            // args.ios is instance of UITableViewCell
            args.ios.selectionStyle = 0;  // UITableViewCellSelectionStyle.UITableViewCellSelectionStyleNone;
        }
    }
}