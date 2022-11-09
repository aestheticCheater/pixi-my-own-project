import * as PIXI from "pixi.js";
import { BaseView } from './BaseView';
import { GameApplication } from '../GameApplication';

export class GameControlsScreen extends BaseView {

    private rulesTitle: PIXI.Text;
    private rulesDescription: PIXI.Text;
  private controlsTitle: PIXI.Text;
  private arrowKeys: PIXI.Sprite;
  private arrowkeysDescription: PIXI.Text;
  private ctrlKey: PIXI.Sprite;
  private ctrlKeyDescription: PIXI.Text;
  private spaceKey: PIXI.Sprite;
  private spaceKeyDescription: PIXI.Text;
  constructor() {
    super();
  }

  protected init() {
    super.init();
    this.createText();
    this.loadAssets();
  }
  

  private loadAssets() {
    const arrowKeys = PIXI.Sprite.from('./assets/image/arrow-keys.png');
    arrowKeys.anchor.set(0.5);
    arrowKeys.width = 200;
    arrowKeys.height = 100;
    arrowKeys.x = GameApplication.STAGE_WIDTH / 2;
    arrowKeys.y = this.controlsTitle.y + 100;
    this.addChild(arrowKeys);

    const ctrlKey = PIXI.Sprite.from('./assets/image/ctrl-key.png');
    ctrlKey.anchor.set(0.5);
    ctrlKey.width = 100;
    ctrlKey.height = 100;
    ctrlKey.x = GameApplication.STAGE_WIDTH - 650;
    ctrlKey.y = this.controlsTitle.y + 130;
    this.addChild(ctrlKey);

    const spaceKey = PIXI.Sprite.from('./assets/image/space-key.png');
    spaceKey.anchor.set(0.5);
    spaceKey.width = 160;
    spaceKey.height = 100;
    spaceKey.x = GameApplication.STAGE_WIDTH - 120;
    spaceKey.y = GameApplication.STAGE_HEIGHT / 1.35;
    this.addChild(spaceKey);

  }

   

  protected createBackground() {
    this.background = new PIXI.Graphics();
    this.background.lineStyle({ width: 2, color: 0xffffff });
    this.background.beginFill(0x000000);
    this.background.drawRect(
      0,
      0,
      GameApplication.STAGE_WIDTH,
      GameApplication.STAGE_HEIGHT
      );
      this.background.endFill();
    this.background.cacheAsBitmap = true;
      const texture: PIXI.Texture = GameApplication.getApp().renderer.generateTexture(this.background);
      const sprite: PIXI.Sprite = new PIXI.Sprite(texture);

    this.addChild(this.background);
  }
  private createText() {
    this.rulesTitle = new PIXI.Text("Rules", {
      fontSize: 40,
      dropShadow: true,
      dropShadowBlur: 7,
      dropShadowColor: "#d7d0d0",
      fill: "white",
      fillGradientType: 1,
      fontFamily: "Comic Sans MS",
      fontVariant: "small-caps",
      fontWeight: '900',
      stroke: "#1f1f1f",
      strokeThickness: 3
    });
    this.rulesTitle.resolution = 2;
    this.rulesTitle.anchor.set(0.5);
    this.rulesTitle.x = GameApplication.STAGE_WIDTH / 2;
    this.rulesTitle.y = GameApplication.STAGE_HEIGHT * 0.06;
    this.addChild(this.rulesTitle);

    this.rulesDescription = new PIXI.Text("Layer of bricks lines the top third of the screen \n and the goal is to destroy them all \n and score at least 100pts by repeatedly \n bouncing a ball off a paddle into them.  You need to clear 4 levels in total to finish the game.", {
      align: "center",
      dropShadowColor: "#d7d0d0",
      fill: "#f5fffd",
      fontFamily: "Comic Sans MS",
      fontSize: 20,
      fontVariant: "small-caps",
      fontWeight: '800',
      lineHeight: 38,
      stroke: "#c2c799",
      strokeThickness: 2,
      whiteSpace: "normal",
      wordWrap: true,
      wordWrapWidth: 700
    });
    this.rulesDescription.resolution = 2;
    this.rulesDescription.anchor.set(0.5);
    this.rulesDescription.x = GameApplication.STAGE_WIDTH / 2;
    this.rulesDescription.y = this.rulesTitle.y + 140;
    this.addChild(this.rulesDescription);
    
      
    this.controlsTitle = new PIXI.Text("Game Controls", {
      fontSize: 40,
      dropShadow: true,
      dropShadowBlur: 7,
      dropShadowColor: "#d7d0d0",
      fill: "white",
      fillGradientType: 1,
      fontFamily: "Comic Sans MS",
      fontVariant: "small-caps",
      fontWeight: '900',
      stroke: "#1f1f1f",
      strokeThickness: 3
    });
    this.controlsTitle.resolution = 2;
    this.controlsTitle.anchor.set(0.5);
    this.controlsTitle.x = GameApplication.STAGE_WIDTH / 2;
    this.controlsTitle.y = this.rulesDescription.y + 150;
    this.addChild(this.controlsTitle);

    this.arrowkeysDescription = new PIXI.Text('paddle movement', {
      fontSize: 16,
      fill: "white",
      wordWrap: true,
      align: "center",
      fillGradientType: 1,
      fontFamily: "Comic Sans MS",
      fontVariant: "small-caps",
      fontWeight: '900',
      stroke: "#1f1f1f",
      strokeThickness: 3
    })

    this.arrowkeysDescription.resolution = 2;
    this.arrowkeysDescription.anchor.set(0.5);
    this.arrowkeysDescription.x = GameApplication.STAGE_WIDTH / 2;
    this.arrowkeysDescription.y = GameApplication.STAGE_HEIGHT / 1.1;
    this.addChild(this.arrowkeysDescription);

    this.ctrlKeyDescription = new PIXI.Text('buy life (-20)pts', {
      fontSize: 16,
      fill: "white",
      wordWrap: true,
      align: "center",
      fillGradientType: 1,
      fontFamily: "Comic Sans MS",
      fontVariant: "small-caps",
      fontWeight: '900',
      stroke: "#1f1f1f",
      strokeThickness: 3
    })

    this.ctrlKeyDescription.resolution = 2;
    this.ctrlKeyDescription.anchor.set(0.5);
    this.ctrlKeyDescription.x = GameApplication.STAGE_WIDTH - 650;
    this.ctrlKeyDescription.y = GameApplication.STAGE_HEIGHT / 1.1;
    this.addChild(this.ctrlKeyDescription);
    
  

    this.spaceKeyDescription = new PIXI.Text('launch ball', {
      fontSize: 16,
      fill: "white",
      align: "center",
      fillGradientType: 1,
      fontFamily: "Comic Sans MS",
      fontVariant: "small-caps",
      fontWeight: '900',
      stroke: "#1f1f1f",
      strokeThickness: 3
    })

    this.spaceKeyDescription.resolution = 2;
    this.spaceKeyDescription.anchor.set(0.5);
    this.spaceKeyDescription.x = GameApplication.STAGE_WIDTH - 120;
    this.spaceKeyDescription.y = GameApplication.STAGE_HEIGHT / 1.13;
    this.addChild(this.spaceKeyDescription);
  
  }
}
    
