import * as React from 'react';
import { connect } from "react-redux";

import { IActionToken, IUserToken, } from '../TYPES';

import * as Phaser from 'phaser';

import { ILocationResult } from '../data/gameTYPES';

import { IAppStatus } from '../TYPES';

import { MyGame } from './MyGame';

import { IConnectionData, IConnectionFunctions, } from '../data/connectionConf';

import { Close_Dialog, Close_Messages, End_Waiting, Pop_Dialog, Pop_Messages, Start_Waiting, } from '../actions/actionCreators';
import { IMessage, IMessageTranslator } from '../MessageMenager';

class ConnectedGameComponent extends React.Component<{visible: boolean, height: number, width: number, location: ILocationResult, ConnFuns: IConnectionFunctions, userToken: IUserToken, actionToken: IActionToken }, {}>{
    private game: Phaser.Game | null;
    private connData: IConnectionData;
    constructor(props: any) {
        super(props);
        // --------- bindings

        this.connData = {
            actionToken: this.props.actionToken,
            closeDialog: this.props.ConnFuns.closeDialog,
            closeMessage: this.props.ConnFuns.closeMessage,
            closeWaiting: this.props.ConnFuns.closeMessage,
            popDialog: this.props.ConnFuns.popDialog,
            popMessage: this.props.ConnFuns.popMessage,
            popWaiting: this.props.ConnFuns.popWaiting,
            userToken: this.props.userToken,
        }

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
                this.game = new MyGame(dim, this.connData, this.props.location);
            } else {
                this.game = new MyGame(dim, this.connData, this.props.location);
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

// ------------- connect
const mapStateToProps = (state: any) => {
    const pass = state as IAppStatus;
    return { location: pass.heroLocation, userToken: pass.userToken, actionToken: pass.actionToken };
};
const mapDispatchToProps = (dispatch: any) => {
    return {
        ConnFuns: {
            closeDialog: () => dispatch(Close_Dialog()),
            closeMessage: () => dispatch(Close_Messages()),
            closeWaiting: () => dispatch(End_Waiting()),
            popDialog: (element: React.ReactNode) => dispatch(Pop_Dialog(element)),
            popMessage: (messages: IMessage[], translators: IMessageTranslator[]) => dispatch(Pop_Messages(messages, translators)),
            popWaiting: () => dispatch(Start_Waiting()),
        } as IConnectionFunctions,
    };
};

export const GameComponent = connect(mapStateToProps, mapDispatchToProps)(ConnectedGameComponent);