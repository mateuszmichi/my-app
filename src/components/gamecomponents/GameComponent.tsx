import * as React from 'react';

import * as Phaser from 'phaser';

import { MyGame } from './scenes/MyGame';

import { IHero } from '../TYPES';

import { IConnectionData } from '../data/connectionConf';

export class GameComponent extends React.Component<{visible: boolean, height: number, width: number, hero: IHero, ConnData: IConnectionData }, {}>{
    private game: Phaser.Game | null;
    constructor(props: any) {
        super(props);
        // --------- bindings

        this.game = null;
    }
    public componentWillReceiveProps(nextProps: any) {
        if (nextProps.height !== this.props.height) {
            const dim = Math.min(Math.floor(nextProps.height / 9), Math.floor(nextProps.width / 16));
            if (this.game !== null) {
                // TODO restart
                this.game.destroy(true);
                const element = document.getElementById("Game");
                if (element === null) {
                    throw Error("No game?");
                } if (element.firstChild !== null) {
                    element.removeChild(element.firstChild);
                }
                // this.game.resize(dim * 16, dim * 9);
                this.game = new MyGame(dim, this.props.ConnData, this.props.hero);
            } else {
                this.game = new MyGame(dim, this.props.ConnData, this.props.hero);
            }
        }
    }
    public componentWillUnmount() {
        if (this.game !== null) {
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