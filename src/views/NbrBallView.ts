import { BaseView } from './BaseView';
import * as PIXI from 'pixi.js';
import { GameApplication } from '../GameApplication';
import { EventDispatcher } from '../EventDispatcher';
import { GameEvents } from '../GameEvents';
import { BrickType } from '../game/level/BrickType';

export class NbrBallView extends BaseView {

    private ballGraphicImage: PIXI.Sprite;
    private nbrBallText: PIXI.Text;

    constructor() {
        super();
    }
    public setNbrBall(score: number) {
        this.nbrBallText.text = score.toString(10).padStart(2, "0"); 
      }

    public createText() {
            this.nbrBallText = new PIXI.Text("000", {
              fontSize: 35,
              fontFamily: "Minecraft",
              fill: 0xffffff,
            });
      
      const gfx = new PIXI.Graphics();
      gfx.beginFill(0xffffff);
      gfx.drawCircle(0, 0, 15);
      gfx.endFill();
      const texture = GameApplication.getApp().renderer.generateTexture(gfx);
      this.ballGraphicImage = new PIXI.Sprite(texture);
            // console.log(this.nbrBallText.text);
            // this.label = new PIXI.Text ('Balls: ', {
            //   fontSize: 40,
            //   fontFamily: "Minecraft",
            //   fill: 0xE4A0F7,
            // });

            // this.label.resolution = 2;
            this.ballGraphicImage.anchor.set(1, 0.5);
            this.ballGraphicImage.x = this.background.width/2.80;
            this.ballGraphicImage.y = this.background.height/2;
              
            this.nbrBallText.resolution = 2;
            this.nbrBallText.anchor.set(0.5);
            this.nbrBallText.x = this.background.width/1.3;
            this.nbrBallText.y = this.background.height/2;
            this.background.addChild(this.ballGraphicImage);
            this.background.addChild(this.nbrBallText);
    }
    protected createBackground(){
    this.background = new PIXI.Graphics();
    this.background.lineStyle({ width: 2, color: 0xffffff });
    this.background.beginFill(0x000000);
    this.background.drawRect(0, 0, 120, 50);
    this.background.endFill();
    this.background.x = GameApplication.STAGE_WIDTH*0.015;
    this.background.y = GameApplication.STAGE_HEIGHT*0.9;
    this.addChild(this.background);
  }

  public getBallGraphicImage() {
    return this.ballGraphicImage;
  }
    protected init() {
        super.init();
      this.createText();

        
    }
}
