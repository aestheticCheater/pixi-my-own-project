import { GameObject } from '../GameObject';
import * as PIXI from 'pixi.js';
import { GameObjectBehavior } from './GameObjectBehavior';
import { GameApplication } from '../../GameApplication';
import { EventDispatcher } from '../../EventDispatcher';
import { GameEvents } from '../../GameEvents';
import { BrickType } from '../level/BrickType';
import { PaddleBehavior } from './PaddleBehavior';
import { ScoreView } from '../../views/ScoreView';
import { Model } from '../../Model';
import { LevelFactory } from '../level/LevelFactory';
import { Howl } from 'howler';
import { normalize } from 'path';
import { once } from 'events';

enum Wall {
    left,
    right,
    top,
    none
}

export class BallBehavior extends GameObjectBehavior {

    private paddleRef: GameObject;
    private ballImg: PIXI.Sprite;
    private isPlaying: boolean = false;
    private velocity: number = 0;
    private angle: number;
    public justHit: boolean = false;
    public timeoutId: NodeJS.Timeout;
    private paddle: PaddleBehavior;
    private paddleImg: PIXI.Sprite;
    private sound: Howl

    constructor(gameObjRef: GameObject) {
        super(gameObjRef)
    }

    public update(deltaTime: number) {
        if(!this.isPlaying) {
            this.followPaddle();
        } else {
            this.move(deltaTime);
        }
    }

    protected init() {
        this.ballImg = this.gameObjRef.getRenderableById("ballImg") as PIXI.Sprite;
        // this.paddleImg = this.gameObjRef.getRenderableById("paddleImg") as PIXI.Sprite; 
        this.paddleRef = this.gameObjRef.getGameViewRef().getGameObjectById("paddle") as GameObject;
        this.onKeyDown = this.onKeyDown.bind(this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.BRICK_HIT, this.onBrickHit  , this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.NEXT_LEVEL, () => this.isPlaying = false);
        document.addEventListener("keydown", this.onKeyDown);
    }

    private move(deltaTime: number) {
        const moveDist: PIXI.Point = new PIXI.Point(this.velocity * Math.sin(this.angle * Math.PI / 180), this.velocity * Math.cos(this.angle * Math.PI / 180));
        const bound: Wall = this.checkBound(moveDist);

        if(bound !== Wall.none) {
            this.changeAngle(bound);
            return;
        }

        if(this.checkOutOfBound(moveDist)) {
            this.ballLost();
        
            return;
        }

        if(this.checkPaddleCollision(moveDist)) {
            this.bouncePaddle();
            return;
        }

        this.gameObjRef.x += moveDist.x * deltaTime;
        this.gameObjRef.y += moveDist.y * deltaTime;
    }

    private ballLost() {
        this.sound = new Howl({
            src: ['/assets/sounds/level-lose.mp3']
        });
        this.sound.play();
        if (Model.getInstance().getTotalNbrBall() <= 1) {
            this.sound.stop();
        }
        clearTimeout(this.timeoutId);
        this.isPlaying = false;
        
        EventDispatcher.getInstance().getDispatcher().emit(GameEvents.BALL_LOST, {objId: this.gameObjRef.getId()});
    }

    private checkOutOfBound(moveDist: PIXI.Point): boolean {
        return (this.gameObjRef.y + (this.gameObjRef.height * 0.5) + moveDist.y > this.paddleRef.y + this.paddleRef.height) && ((this.gameObjRef.x + (this.gameObjRef.width * 0.5) < this.paddleRef.x) || (this.gameObjRef.x - (this.gameObjRef.width * 0.5) > this.paddleRef.x + this.paddleRef.width));
    }

    private checkPaddleCollision(moveDist: PIXI.Point): boolean {
        const ballRect: PIXI.Rectangle = new PIXI.Rectangle(this.gameObjRef.x - (this.gameObjRef.width * 0.5) + moveDist.x, this.gameObjRef.y - (this.gameObjRef.width * 0.5) + moveDist.y, this.gameObjRef.width, this.gameObjRef.height);
        const paddleRect: PIXI.Rectangle = new PIXI.Rectangle(this.paddleRef.x, this.paddleRef.y, this.paddleRef.width, this.paddleRef.height);

        return (ballRect.left <= paddleRect.right &&
            paddleRect.left <= ballRect.right &&
            ballRect.top <= paddleRect.bottom &&
            paddleRect.top <= ballRect.bottom);
    }

    private bouncePaddle() {
        if(this.angle == 45) {
            this.angle = 135;
            return;
        }

        if(this.angle == 315) {
            this.angle = 225;
            return;
        }
        else {
            this.ballLost();
        }
    }

    private bounceBrick() {

        switch(this.angle) {
            case 180:
                this.angle = Math.round(Math.random()) > 0 ? 45 : 315;
                break;
            case 225:
                this.angle = 315;
                break;
            case 135:
                this.angle = 45;
                break;
            case 45:
                this.angle = 135;
                break;
            case 315:
                this.angle = 225;
                break;

        }
    }

    private changeAngle(bound: Wall) {
        this.sound = new Howl({
            src: ['/assets/sounds/wall-bounce.mp3']
        });
        this.sound.play();

        //
        switch(bound) {
            case Wall.left:
                if(this.angle === 225){
                    this.angle = 135;
                    return;
                }

                if(this.angle === 315){
                    this.angle = 45;
                    return;
                }
            break;
            case Wall.right:
                if(this.angle === 45){
                    this.angle = 315;
                    return;
                }

                if(this.angle === 135){
                    this.angle = 225;
                    return;
                }
            break;
            case Wall.top:
                if(this.angle === 180){
                    this.angle = Math.round(Math.random()) > 0 ? 45 : 315;
                    return;
                }

                if(this.angle === 225) {
                    this.angle = 315; 
                    return;  
                }

                if(this.angle === 135) {
                    this.angle = 45; 
                    return;  
                }
            break;
        }
    }
    private increaseSpeedOnScore() {
        if (Model.getInstance().getScore() >= 30) {
            this.velocity = 8;
        }

        if (Model.getInstance().getScore() >= 60) {
            this.velocity = 10;
        }

        if (Model.getInstance().getScore() >= 90) {
            this.velocity = 12;
        }
    }
    private checkBound(moveDist: PIXI.Point): Wall {
        if((this.gameObjRef.x - (this.gameObjRef.width * 0.5) + moveDist.x < 0)) {
            return Wall.left;
        }

        if((this.gameObjRef.x + (this.gameObjRef.width * 0.5) + moveDist.x > GameApplication.STAGE_WIDTH)) {
            return Wall.right;
        }

        if((this.gameObjRef.y - (this.gameObjRef.height * 0.5) + moveDist.y < 0)) {
            return Wall.top;
        }

        return Wall.none
    }

    private followPaddle() {
        this.gameObjRef.x = this.paddleRef.x + (this.paddleRef.width * 0.5);
        this.gameObjRef.y = this.paddleRef.y - (this.gameObjRef.height * 0.5);
    }



    private onKeyDown(e: any) {
        if(!this.gameObjRef.isActive() || this.isPlaying) {
            return;
        }
        
        if (e.ctrlKey) { 
            if (Model.getInstance().getScore() <= 0 || Model.getInstance().getScore() < 20) {
                this.sound = new Howl({
                    src: ['/assets/sounds/not-enough-points-for-life.ogg.mp3']
                });
                    this.sound.play();
                return;
            }
            else {
                this.sound = new Howl({
                    src: ['/assets/sounds/buy-life.ogg.mp3']
                });
                this.sound.play();
        
                Model.getInstance().substractScore(20);
                Model.getInstance().incrementNbrBall();
                
            }
        }

        

        if(e.code === "Space") {
            this.angle = 180;
            this.velocity = 6;
            this.isPlaying = true;
            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.BALL_ACTIVE);
        }
       
    }

    private onBrickHit(e: any) {
        this.increaseSpeedOnScore();

 
        if(this.justHit) {
            return;
        }

        this.justHit = true;

        this.bounceBrick();

        setTimeout(() => {
            this.justHit = false;
        }, 500);

        if (e.brickType === BrickType.TYPE_3) { 
            const blurFilter = new PIXI.filters.BlurFilter(12);
            this.ballImg.filters = [blurFilter];
            
            this.velocity *= 1.4;
            this.ballImg.tint = 0xDB0F27;
          
            setTimeout(() => {
            const blurFilter = new PIXI.filters.BlurFilter(0);
                this.ballImg.filters = [blurFilter]
                this.increaseSpeedOnScore();
                this.ballImg.tint = 0xffffff;
            }, 5000);
        }

        if (e.brickType === BrickType.TYPE_4) {
       
    

        }
            
    }
}