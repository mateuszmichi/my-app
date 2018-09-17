import * as Phaser from 'phaser';

import { LocalMapScene } from './MapScenes';

import { IConnectionData } from '../../data/connectionConf';
import { IHero } from '../../TYPES';

import { IHeroUpdates } from '../../Game';


// --------------------- MyGame

export class MyGame extends Phaser.Game {
    public ConnData: IConnectionData;
    public HeroUpdates: IHeroUpdates;
    constructor(size: number, conData: IConnectionData, heroUpdates:IHeroUpdates, hero: IHero) {
        super({
            backgroundColor: 'rgb(237, 205, 151)',
            /*fps: {
                forceSetTimeOut: true,
                target: 30,
            },*/
            height: size * 9,
            parent: "Game",
            /*"render.antialias": false,
            /*"render.pixelArt": true,
            "render.preserveDrawingBuffer": true,
            "render.powerPreference": "high-performance",
            "render.powerPreference": "high-performance",
            */
            type: Phaser.CANVAS,
            width: size * 16,
        });
        // bindings

        this.ConnData = conData;
        this.HeroUpdates = heroUpdates;
        this.scene.add("MapScene", new LocalMapScene({ height: size * 9, width: size * 16 }, hero, this.ConnData, this.HeroUpdates), true);
    }
}