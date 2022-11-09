import { GameController } from "../GameController";
import { Model } from "../Model";
import { BaseGameState } from "./BaseGameState";
import { LostState } from './LostState';
import { BeforeStartState } from "./BeforeStartState";
import { VictoryState } from "./VictoryState";

export class StartState extends BaseGameState {

    constructor(controller: GameController) {
        super(controller);
    }

    public gameStart(): void {
        this.controllerRef.showGame();
        this.controllerRef.showScore();
        this.controllerRef.showNbrBall();
        this.controllerRef.showSound();
    }

    public gameLost(): void {
        this.controllerRef.hideGame();
        this.controllerRef.hideScore();
        this.controllerRef.hideNbrBall();
        this.controllerRef.hideSound();
        const newState: LostState = new LostState(this.controllerRef);
        newState.gameLost();
        this.controllerRef.changeGameState(newState);
    }

    public gameWon(): void {
        this.controllerRef.showVictoryScreen();
        this.controllerRef.hideGame();
        this.controllerRef.hideScore();
        this.controllerRef.hideNbrBall();
        this.controllerRef.hideSound();
        const newState: VictoryState = new VictoryState(this.controllerRef);
        newState.gameWon();
        this.controllerRef.changeGameState(newState);
    }

    public gameEnter(): void {
   
    }
}