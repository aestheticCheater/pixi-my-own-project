import { GameController } from "../GameController";
import { BaseGameState } from "./BaseGameState";
import { StartState } from './StartState';

export class VictoryState extends BaseGameState {

    constructor(controller: GameController) {
        super(controller);
    }

    public gameStart(): void {
        
        this.controllerRef.hideVictoryScreen();
        const newState: StartState = new StartState(this.controllerRef);
        newState.gameStart();
        this.controllerRef.changeGameState(newState);
    }

    public gameWon(): void {
        this.controllerRef.showVictoryScreen();
    }
}