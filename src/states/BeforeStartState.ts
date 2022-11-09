import { GameController } from "../GameController";
import { BaseGameState } from "./BaseGameState";
import { StartState } from './StartState';
import { LostState } from "./LostState";
import { EnterState } from "./EnterState";

export class BeforeStartState extends BaseGameState {

    constructor(controller: GameController) {
        super(controller);
    }

    
    public gameStart(): void {
        this.controllerRef.hideGameControlsScreen();
        const newState: StartState = new StartState(this.controllerRef);
        this.controllerRef.changeGameState(newState);
        
        newState.gameStart();
    }

    public gameEnter(): void {
        this.controllerRef.showGameControlsScreen();
     
    }

}