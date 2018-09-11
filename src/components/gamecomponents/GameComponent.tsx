import * as React from 'react';

import * as Phaser from 'phaser';

import { MyGame } from './scenes/MyGame';

import { IHero } from '../TYPES';

import { IConnectionData } from '../data/connectionConf';

import { IHeroUpdates } from '../Game';

export class GameComponent extends React.Component<{visible: boolean, height: number, width: number, hero: IHero, ConnData: IConnectionData, HeroUpdates: IHeroUpdates }, {}>{
    private game: Phaser.Game;
    constructor(props: any) {
        super(props);
        // --------- bindings

    }
    public componentDidUpdate() {
        const Element = document.getElementById('Game');
        if (Element !== null) {
            const width = Element.offsetWidth;
            const height = Element.offsetHeight;
            if (this.game !== undefined) {
                this.game.resize(width, height);
            }
        }
    }
    public componentDidMount() {
        const Element = document.getElementById('Game');
        if (Element !== null) {
            const width = Element.offsetWidth;
            this.game = new MyGame(Math.floor(width/16), this.props.ConnData, this.props.HeroUpdates, this.props.hero);
        }
    }
    public componentWillUnmount() {
        if (this.game !== undefined) {
            this.game.destroy(true);
        }
    }
    public render() {
        const dim = Math.min(Math.floor(this.props.height / 9), Math.floor(this.props.width / 16));
        const style = {
            height: dim * 9 + "px",
        }
        return (<div id="Game" className={(this.props.visible)?"Active":"InActive"} style={style}/>)
    }
}