import * as PIXI from "pixi.js";
import { EventDispatcher } from "./EventDispatcher";
import { GameView } from "./views/GameView";
import { GameEvents } from "./GameEvents";
import { StartScreen } from "./views/StartScreen";
import { IGameState } from './states/IGameState';
import { EnterState } from "./states/EnterState";
import { ScoreView } from './views/ScoreView';
import { NbrBallView } from './views/NbrBallView';
import { SoundView } from './views/SoundView';
import { Model } from './Model';
import { BrickType } from './game/level/BrickType';
import { EndScreen } from './views/EndScreen';
import { LostState } from "./states/LostState";
import { VictoryScreen } from './views/VictoryScreen';
import { VictoryState } from './states/VictoryState';
import {CollisionManager} from "./CollisionManager";
import { BallBehavior } from "./game/behavior/BallBehavior";
import { GameControlsScreen } from './views/GameControlsScreen';
import { BeforeStartState } from "./states/BeforeStartState";
import { Howl } from "howler";

export class GameController extends PIXI.Container {

    private endScreen: EndScreen;
    private startScreen: StartScreen;
    private victoryScreen: VictoryScreen;
    private gameControlsScreen: GameControlsScreen;
    private game: GameView;
    private scoreView: ScoreView;
    private nbrBallView: NbrBallView;
    private soundView: SoundView;
    private currentState: IGameState;
    private gameContainer: PIXI.Container;
    private uiContainer: PIXI.Container;
    private sound: Howl;
    
    

    constructor() {
        super();
        this.init();
    }

    public changeGameState(newState: IGameState) {
        this.currentState = newState;
    }

    public showStartScreen() {
        this.startScreen.show();
    }

    public hideStartScreen() {
        this.startScreen.hide();
    }

    public showEndScreen() {
        this.endScreen.show();
    }

    public hideEndScreen() {
        this.endScreen.hide();
    }

    public showVictoryScreen() {
        
        this.victoryScreen.show();
    }

    public hideVictoryScreen() {
        this.victoryScreen.hide();
    }

    public showGameControlsScreen() {
        this.gameControlsScreen.show();
    }

    public hideGameControlsScreen() {
        this.gameControlsScreen.hide();
    }

    public showGame() {
        this.game.show();
        EventDispatcher.getInstance().getDispatcher().emit(GameEvents.NEXT_LEVEL, { level: 1 });
    }

    public showSound() {
        this.soundView.show();
    }

    public hideSound() {
        this.soundView.hide();
    }

    public showScore() {
        this.scoreView.show();
    }

    public hideScore() {
        this.scoreView.hide();
    }

    public showNbrBall() {
        this.nbrBallView.show();
    }

    public hideNbrBall() {
        this.nbrBallView.hide();
    }

    public hideGame() {
        this.game.hide();
    }

    private init() {
        this.createContainers();
        this.createViews();
        this.resetGame();
        this.setInitialGameState();
        this.addKeyUpListener();

        EventDispatcher.getInstance().getDispatcher().on(GameEvents.BALL_LOST, this.onBallLost, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.BRICK_HIDE, this.checkEndOfLevel, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.BRICK_HIDE, this.updateScore, this);
    }

    private addKeyUpListener() {
        this.onKeyUp = this.onKeyUp.bind(this);
        document.addEventListener('keyup', this.onKeyUp);
    }

    private setInitialGameState() {
        this.changeGameState(new EnterState(this));
        this.currentState.gameEnter();
    }


    private createContainers() {
        this.uiContainer = new PIXI.Container();
        this.gameContainer = new PIXI.Container();
        // this.bricksContainer = new PIXI.Container();

        this.addChild(this.uiContainer);
        this.addChild(this.gameContainer);
        // this.addChild(this.bricksContainer);
    }

    private createViews() {
        this.game = new GameView();
        this.addChild(this.game);

        this.scoreView = new ScoreView();
        this.addChild(this.scoreView);

        this.nbrBallView = new NbrBallView();
        this.addChild(this.nbrBallView);

        this.soundView = new SoundView();
        this.addChild(this.soundView);

        this.startScreen = new StartScreen();
        this.addChild(this.startScreen);

        this.endScreen = new EndScreen();
        this.addChild(this.endScreen);

        this.gameControlsScreen = new GameControlsScreen();
        this.addChild(this.gameControlsScreen);

        this.victoryScreen = new VictoryScreen();
        this.addChild(this.victoryScreen);
    }

    private resetGame() {
        Model.getInstance().resetGame();
        this.scoreView.setScore(0);
        this.nbrBallView.setNbrBall(Model.getInstance().getTotalNbrBall());
        
    }

    private updateScore(e: any) {
        if (e.ctrlKey) {
            Model.getInstance().substractScore(1);
       }
        switch (e.brickType) {
            case BrickType.TYPE_1:
                Model.getInstance().addScore(1);
                break;
            case BrickType.TYPE_2:
                Model.getInstance().addScore(3);
                break;
            case BrickType.TYPE_3:
                Model.getInstance().addScore(5);
                break;
            case BrickType.TYPE_4:
                Model.getInstance().substractScore(2);
                break;
        }


        this.scoreView.setScore(Model.getInstance().getScore());
        
        if (Model.getInstance().getScore() % 10 === 0) {
            
         
            this.scoreView.getScoreText().style = {
                fontFamily: 'Minecraft',
                fontSize: 35,
                fill: 0xff0000
          }
        }
        else {
           
            setTimeout(() => {
                this.scoreView.getScoreText().style = {
                    fontFamily: 'Minecraft',
                    fontSize: 30,
                    fill: 0x00ff00
           }

            },5000)
          
        }
    }

    private checkEndOfLevel() {
        Model.getInstance().decrementTotalNbrBrick();
        
        // if (Model.getInstance().getScore() < 300) {

        if (Model.getInstance().getTotalNbrBrick() <= 0) {
            if (Model.getInstance().getCurrentLevel() >= 4 && Model.getInstance().getScore() >= 100) {
            
                this.currentState.gameWon();
                this.sound = new Howl({
                    src: ['/assets/sounds/game-win.mp3']
                });
                this.sound.play();
                this.resetGame();
            }
              
        

            else if (Model.getInstance().getCurrentLevel() >= 4 && Model.getInstance().getScore() < 100) {
                    this.sound = new Howl({
                        src: ['/assets/sounds/game-over.mp3']
                    });
                    this.sound.play();
                    this.resetGame(); 
                    this.currentState.gameLost();
            }
            else {
                // this.nbrBallView.getBallGraphicImage().tint = 0x00ff00;
                // setTimeout(() => {
                //     this.nbrBallView.getBallGraphicImage().tint = 0xffffff;
                // },500)
                
                         Model.getInstance().incrementLevel();
                         Model.getInstance().incrementNbrBall();
                         this.nbrBallView.setNbrBall(Model.getInstance().getTotalNbrBall());
                         
                         EventDispatcher.getInstance().getDispatcher().emit(GameEvents.NEXT_LEVEL, { level: Model.getInstance().getCurrentLevel() });
            }
        }
    }

    private onKeyUp() {
        if (this.currentState instanceof EnterState ||
            this.currentState instanceof BeforeStartState ||
            this.currentState instanceof LostState ||
            this.currentState instanceof VictoryState) {
            this.currentState.gameStart();
            this.resetGame();
            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.GAME_START);
        }
    }

    private onBallLost() {
        this.nbrBallView.getBallGraphicImage().tint = 0xff0000;
        setTimeout(() => {
            this.nbrBallView.getBallGraphicImage().tint = 0xffffff;
            
        },500)
        
        Model.getInstance().decrementNbrBall();
        if (Model.getInstance().getTotalNbrBall() <= 0) {
            this.sound = new Howl({
                src: ['/assets/sounds/game-over.mp3']
            });
            this.sound.play();
            this.resetGame();
            this.currentState.gameLost();
        }
        this.nbrBallView.setNbrBall(Model.getInstance().getTotalNbrBall());
    }

    
}