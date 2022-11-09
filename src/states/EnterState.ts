import { GameController } from "../GameController";
import { BaseGameState } from "./BaseGameState";
import { StartState } from './StartState';
import { BeforeStartState } from './BeforeStartState';

export class EnterState extends BaseGameState {

    constructor(controller: GameController) {
        super(controller);
    }

    public gameStart(): void {
        this.controllerRef.hideStartScreen();
        this.controllerRef.showGameControlsScreen();
        const newState: BeforeStartState = new BeforeStartState(this.controllerRef);
        newState.gameEnter();
        this.controllerRef.changeGameState(newState);
    }

    public gameEnter(): void {
        this.controllerRef.showStartScreen();
    }

    public gameLost(): void {
        
    }
}