import * as Phaser from 'phaser';

import { LocalMapScene } from './MapScenes';

import { IConnectionData } from '../../data/connectionConf';
import { ITravelResult } from '../../data/gameTYPES';
import { IHero } from '../../TYPES';


import { TravelScene } from './TravelScene';

// --------------------- MyGame

export class MyGame extends Phaser.Game {
    public ConnData: IConnectionData;
    constructor(size: number, conData: IConnectionData, hero: IHero) {
        super({
            backgroundColor: 'rgb(237, 205, 151)',
            height: size * 9,
            parent: "Game",
            "render.transparent": true,
            width: size * 16,
        });
        // bindings

        this.ConnData = conData;
        this.scene.add("MapScene", new LocalMapScene({ height: size * 9, width: size * 16 }, hero.location, this.ConnData), true);
        switch (hero.status) {
            case 0:
                break;
            case 1:
                const travelData = hero.statusData as ITravelResult;
                this.scene.pause("MapScene");
                this.scene.add("TravelScene", new TravelScene({ height: size * 9, width: size * 16 }, travelData, this.ConnData), true);
                break;
        }
    }
}

export function handleDBcutDate(time: Date) {
    const propDate = new Date(time);
    const offset = propDate.getTimezoneOffset();
    const modyfy = new Date(propDate.getTime() - 60000 * offset);
    return modyfy;
}