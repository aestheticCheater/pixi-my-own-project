import {GameObjectBehavior} from "./GameObjectBehavior";
import { GameObject } from "../GameObject";
import {EventDispatcher} from "../../EventDispatcher";
import {GameEvents} from "../../GameEvents";
import { BrickType } from "../level/BrickType";
import {LevelFactory} from "../level/LevelFactory";
import * as PIXI from 'pixi.js';
import { GameView } from '../../views/GameView';
import { BaseBrickBehavior } from "./BaseBrickBehavior";
import { Howl } from 'howler';

export class BrickBehaviorLevel2 extends BaseBrickBehavior {
    constructor(gameObjRef: GameObject) {
        super(gameObjRef);
    }
    private hitCount: number = 0;
    private levelFactory: LevelFactory;
    private gameViewRef: GameView;
    private sound: Howl;
    protected onBrickHit(e: any) {

   
            if (e.brickId === this.gameObjRef.getId()) {
                this.hitCount++;
                this.sound = new Howl({
                    src: ['/assets/sounds/brick2.wav']
                });
                this.sound.play();
                if (this.hitCount === 3) {
                    this.sound.stop();
                    
                }
                
           
                const renderable: PIXI.Sprite = this.gameObjRef.getRenderableById('brickImg') as PIXI.Sprite;
    
                switch (this.hitCount) {
                    case 1:
                        renderable.tint = 0xff03fa;
                        break;
                    case 2:
                        renderable.tint = 0x24d3fa;
                        break;
                    case 3:
                        this.sound = new Howl({
                            src: ['/assets/sounds/brick2destroyed.mp3']
                        });
                        this.sound.play();
                        EventDispatcher.getInstance().getDispatcher().emit(GameEvents.BRICK_HIDE, { brickId: this.gameObjRef.getId(), brickType: BrickType.TYPE_2 });
                        break;
                }
            
            
            
            }
        
        
        }
        // public changeColorBrick1(e: any){
        //     console.log(e.brickId);
        
        //     const gfx: PIXI.Graphics = new PIXI.Graphics;
        //     gfx.beginFill(0xF6BE00);
        //                 gfx.lineStyle({width: 1, color:0x000000});
        //                 gfx.drawRect(0,0,this.gameObjRef.width,this.gameObjRef.height-2);
        //                 gfx.endFill();
        //                 gfx.cacheAsBitmap=true;
        //                 this.gameObjRef.unregisterRenderable('brickImg');
        //                 this.gameObjRef.registerRenderable('brickImg',gfx);
        // }
        // public changeColorBrick2(e: any){
        //     console.log(e.brickId);
        
        //     const gfx: PIXI.Graphics = new PIXI.Graphics;
        //     gfx.beginFill(0xff0000);
        //                 gfx.lineStyle({width: 1, color:0x000000});
        //                 gfx.drawRect(0,0,this.gameObjRef.width,this.gameObjRef.height-2);
        //                 gfx.endFill();
        //                 gfx.cacheAsBitmap=true;
        //                 this.gameObjRef.unregisterRenderable('brickImg');
        //                 this.gameObjRef.registerRenderable('brickImg',gfx);

        // }
    }
