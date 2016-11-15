import {PlayComponent} from "./pages/play/play.component";
import {GameComponent} from "./pages/game/game.component";

export const routes = [
    {path: "", component: PlayComponent},
    {path: "game", component: GameComponent}
];

export const navigatableComponents = [
    PlayComponent,
    GameComponent
];