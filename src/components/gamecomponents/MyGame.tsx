import * as Phaser from 'phaser';

import { LocalMapScene } from './scenes/MapScenes';

import { ILocationResult } from '../data/gameTYPES';

import { IConnectionData } from '../data/connectionConf';

// --------------------- MyGame

export class MyGame extends Phaser.Game {
    public ConnData: IConnectionData;
    constructor(size: number, conData: IConnectionData, location: ILocationResult) {
        super({
            backgroundColor: 'rgb(237, 205, 151)',
            height: size * 9,
            parent: "Game",
            "render.transparent": true,
            width: size * 16,
        });
        this.ConnData = conData;
        this.scene.add("MapScene",new LocalMapScene({ height: size * 9, width: size * 16 }, location, this.ConnData),true);
    }
}