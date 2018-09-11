import * as Phaser from 'phaser';

import { LocalMapScene } from './MapScenes';

import { IConnectionData } from '../../data/connectionConf';
import { ITravelResult } from '../../data/gameTYPES';
import { IHero } from '../../TYPES';


import { TravelScene } from './TravelScene';

import { IHeroUpdates } from '../../Game';
import { HealingScene, IHealingResult,  } from './HealingScene';

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
        switch (hero.status) {
            case 0:
                break;
            case 1:
                const travelData = hero.statusData as ITravelResult;
                this.scene.pause("MapScene");
                this.scene.add("TravelScene", new TravelScene({ height: size * 9, width: size * 16 }, travelData, this.ConnData), true);
                break;
            case 2:
                const healingData = hero.statusData as IHealingResult;
                this.scene.pause("MapScene");
                this.scene.add("HealingScene", new HealingScene({ height: size * 9, width: size * 16 }, this.ConnData,this.HeroUpdates,healingData), true);
                break;
        }
    }
}