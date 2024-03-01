import {PlayComponent} from "./pages/play/play.component";
import {GameComponent} from "./pages/game/game.component";
import {TutorialComponent} from "./pages/tutorial/tutorial.component";
import {HighscoreComponent} from "./pages/highscore/highscore.component";

export const routes = [
    {path: "", component: PlayComponent},
    {path: "game", component: GameComponent},
    {path: "highscore", component: HighscoreComponent},
    {path: "tutorial", component: TutorialComponent}
];

export const navigatableComponents = [
    PlayComponent,
    GameComponent,
    HighscoreComponent,
    TutorialComponent
];