import { BaseView } from "./BaseView";
import * as PIXI from "pixi.js";
import { GameApplication } from "../GameApplication";
import { Model } from "../Model";

export class ScoreView extends BaseView {
        
  protected scoreText: PIXI.Text;
  private label: PIXI.Text;
  

  constructor() {
      super();
  
  }

  public setScore(score: number) {
      this.scoreText.text = score.toString(10).padStart(4, '0');
      return this.scoreText;
  }
    
    public getScoreText(): PIXI.Text{
        return this.scoreText;
    }

  protected init() {
      super.init();
      this.createText();
  }

  protected createBackground() {
      this.background = new PIXI.Graphics();
      this.background.lineStyle({width:2, color: 0xffffff})
      this.background.beginFill(0x000000);
      this.background.drawRect(0, 0, 200 , 50);
      this.background.endFill();
 
      this.addChild(this.background);
  }

    private createText() {
      
        this.label = new PIXI.Text('SCORE:', {
            fontFamily: 'Minecraft',
            fill:  0xFFFF00,
            fontSize: 25
        });
    
        this.label.resolution = 2;
        this.label.anchor.set(0.5);
        this.label.x = this.background.width * 0.3;
        this.label.y = this.background.height * 0.5;
        this.addChild(this.label);

     this.scoreText = new PIXI.Text('0', {
         fontSize: 30, 
         fontFamily: 'Minecraft',
         fill:  0x00FF00

      });
      this.scoreText.anchor.set(0.5);
      this.scoreText.resolution = 2;
     
      this.scoreText.x = this.background.width * 0.8;
        this.scoreText.y = this.background.height * 0.5;

      this.addChild(this.scoreText);
      
      }

}
