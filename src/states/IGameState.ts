import { GameController } from "../GameController";

export interface IGameState {

    gameStart(): void;

    gameLost(): void;

    gameWon(): void;

    gameEnter(): void;

    
}