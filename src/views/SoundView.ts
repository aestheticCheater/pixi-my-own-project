import { BaseView } from './BaseView';
import * as PIXI from 'pixi.js';
import { GameApplication } from '../GameApplication';
import { Howl } from 'howler';

export class SoundView extends BaseView {
    private soundIcon: PIXI.Sprite;
    private sound: Howl;

    constructor() {
        super();
    }

    protected init() {
        super.init();
        // this.onKeyDown = this.onKeyDown.bind(this);
        // document.addEventListener("keydown", this.onKeyDown);
         
    }


    protected createBackground() {
        this.background = new PIXI.Graphics();
        this.background.lineStyle({ width: 2, color: 0xffffff });
        this.background.beginFill(0x000000);
        this.background.drawRect(0, 0, 45, 45);
        this.background.endFill();
        this.background.x = GameApplication.STAGE_WIDTH * 0.93;
        this.background.y = GameApplication.STAGE_HEIGHT * 0.91;
        this.soundIcon = PIXI.Sprite.from('./assets/image/speaker.png');
     
        
       

        this.addChild(this.background);
        this.soundIcon.anchor.set(0.5);
        this.soundIcon.width = 40;
        this.soundIcon.height = 40;
        this.soundIcon.x = this.background.x / 0.97;
        this.soundIcon.y = this.background.y / 0.96;
        this.soundIcon.interactive = true;
        this.soundIcon.cursor = 'pointer';
        this.soundIcon.once('click', () => {
            this.sound = new Howl({
                src: ['/assets/sounds/game-sound.mp3']
            });
            this.sound.once('load', ()=>{
                this.sound.volume(0.5);
            this.sound.play();
            });

            this.sound.on('end', () => {
                this.sound.volume(0.5);
                this.sound.play();
            })
             


        })
        this.addChild(this.soundIcon);

        
    }
//     private onKeyDown(e: any) {
//         let defaultSoundVolume = 0.50;
//            if (e.code === "ArrowUp"){
//                 defaultSoundVolume += 0.05;
//                 this.sound.volume(defaultSoundVolume)
//             }
            
//         if (e.code === "ArrowDown") {
//             defaultSoundVolume += 0.05;
//             this.sound.volume(defaultSoundVolume)
            
//         }

// }

 
    }
    
        