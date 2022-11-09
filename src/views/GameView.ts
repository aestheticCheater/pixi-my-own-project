import * as PIXI from "pixi.js";
import { GameApplication } from "../GameApplication";
import { BaseView } from "./BaseView";
import { GameObject } from "../game/GameObject";
import { PaddleBehavior } from "../game/behavior/PaddleBehavior";
import { BallBehavior } from "../game/behavior/BallBehavior";
import { LevelFactory } from "../game/level/LevelFactory";
import { EventDispatcher } from "../EventDispatcher";
import { GameEvents } from "../GameEvents";
import {CollisionManager} from "../CollisionManager";
import {GlowFilter} from '@pixi/filter-glow';
import { FillStyle } from "pixi.js";
export class GameView extends BaseView {
  private gameObjects: Map<string, GameObject>;
  private levelFactory: LevelFactory;
  private collisionManager: CollisionManager;
  private ballBody: PIXI.Sprite;

  public show() {
    super.show();

    this.activate();
  }

  public hide() {
    super.hide();

    this.deactivate();
  }

  public getGameObjectById(id: string): GameObject | null | undefined {
    if (!this.gameObjects.has(id)) {
      console.warn("getGameObjectById() " + id + " does not exist");
      return null;
    }

    return this.gameObjects.get(id);
  }

  public registerGameObject(id: string, gameObj: GameObject) {
    gameObj.setId(id);
    this.gameObjects.set(id, gameObj);
    this.addChild(gameObj);
  }

  public unregisterGameObject(id: string) {
    const gameObject: GameObject = this.getGameObjectById(id);

    if (!gameObject) {
      console.warn("unregisterGameObject() " + id + " does not exist");
      return;
    }

    this.removeChild(gameObject);
    this.gameObjects.delete(id);
    gameObject.destroy();
  }

  protected init() {
    super.init();
    this.createCollisionManager();

    this.gameObjects = new Map<string, GameObject>();
    this.hide();
    this.createGameObjects();

    this.collisionManager.registerBall(this.getGameObjectById('ball'));
    this.collisionManager.registerPaddle(this.getGameObjectById('paddle'));


    this.levelFactory = new LevelFactory(this);
    EventDispatcher.getInstance().getDispatcher().on(GameEvents.NEXT_LEVEL, this.setNextLevel, this);
    EventDispatcher.getInstance().getDispatcher().on(GameEvents.BRICK_HIDE, this.onBrickHide, this);
  }

  private createCollisionManager(){
    this.collisionManager = new CollisionManager();

} 

  private activate() {
    this.activateGameObjects();
    GameApplication.getApp().ticker.add(this.update, this);
  }

  private deactivate() {
    this.deactivateGameObjects();
    GameApplication.getApp().ticker.remove(this.update, this);
  }

  protected createBackground() {
    this.background = new PIXI.Graphics();
    this.background.beginFill(0x000000);
    this.background.lineStyle({ width: 2, color: 0xffffff });
    this.background.drawRect(
      0,
      0,
      GameApplication.STAGE_WIDTH,
      GameApplication.STAGE_HEIGHT
    );
    this.background.endFill();
    this.addChild(this.background);
  }

  private createGameObjects() {
    this.createPaddle();
    this.createBall();
  }

  private generateLevel(level: number) {
    
    this.levelFactory.getNextLevel(level).forEach((e,i)=>{
      this.registerGameObject('brick' + i, e);
      this.collisionManager.registerBrickObject(e);
      
    });
  }
  private setNextLevel(e:any){
    
    this.clearCurrentLevel();
    
    // this.generateLevel(e.level);
    this.generateLevel(e.level);
  }
  private clearCurrentLevel() {
     
    this.gameObjects.forEach((obj)=>{
      if(obj.getId() !== "paddle" && obj.getId() !== "ball"){
        
        this.unregisterGameObject(obj.getId());
      }
    });
  }

  private createPaddle() {
    const paddle: GameObject = new GameObject(this);

    const gfx: PIXI.Graphics = new PIXI.Graphics();
    gfx.beginFill(0xffffff);
    gfx.drawRoundedRect(0, 0, 120, 20, 50);
    gfx.endFill();
  
    gfx.cacheAsBitmap = true;

    
    const texture: PIXI.Texture = GameApplication.getApp().renderer.generateTexture(gfx);
    const sprite: PIXI.Sprite = new PIXI.Sprite(texture)
    // sprite.anchor.set(0.5);
    const paddleLabel = PIXI.Sprite.from("../assets/image/logo.svg");
    paddleLabel.width = sprite.width;
    paddleLabel.height = sprite.height;
    paddleLabel.cacheAsBitmapResolution = 2;
    paddleLabel.x = sprite.x / 2;
    paddleLabel.y = sprite.y / 2;
    sprite.addChild(paddleLabel);
    
    paddle.registerRenderable("paddleImg", sprite);
    const paddleBehavior: PaddleBehavior = new PaddleBehavior(paddle);
    paddle.registerBehavior("paddleBehavior", paddleBehavior);
    this.registerGameObject("paddle", paddle);
  }

  private createBall() {
    const ball: GameObject = new GameObject(this);
    const gfx: PIXI.Graphics = new PIXI.Graphics();
    gfx.beginFill(0xffffff);
    gfx.drawCircle(0, 0, 12);
    gfx.endFill();

    gfx.cacheAsBitmap = true;
    
    const texture: PIXI.Texture = GameApplication.getApp().renderer.generateTexture(gfx);
    const sprite: PIXI.Sprite = new PIXI.Sprite(texture)
    sprite.anchor.set(0.5);
    let randomNumber = Math.floor(Math.random() * 5 + 1);
    const ballSprite = PIXI.Sprite.from(`../assets/image/ball${randomNumber}.png`);
    ballSprite.x = sprite.x;
    ballSprite.y = sprite.y;
    ballSprite.anchor.set(0.5)
    ballSprite.width = sprite.width + 12;
    ballSprite.height = sprite.height + 12;
    sprite.addChild(ballSprite);
    
    // this.ballBody = PIXI.Sprite.from("../assets/image/ball-body.ico");
    // this.ballBody.height = sprite.height;
    // this.ballBody.width = sprite.width + 7;
    // this.ballBody.anchor.set(0.5)
    // sprite.addChild(this.ballBody);
    ball.registerRenderable("ballImg", sprite);
    const ballBehavior: BallBehavior = new BallBehavior(ball);

   
    ball.registerBehavior("ballbehavior", ballBehavior);
    this.registerGameObject("ball", ball);
  }

  private activateGameObjects() {
    this.gameObjects.forEach((obj, id) => {
      obj.activate();
    });
  }

  private deactivateGameObjects() {
    this.gameObjects.forEach((obj, id) => {
      obj.deactivate();
    });
  }

  private update(deltaTime: number) {
    this.gameObjects.forEach((obj, id) => {
      obj.update(deltaTime);
    });
    this.collisionManager.update();
  }
  private onBrickHide(e:any){
    this.collisionManager.unregisterBrickObject(e.brickId);
    this.unregisterGameObject(e.brickId);
    // ball animation
    
  }
}


