import * as React from 'react';

import { IActionToken, IUserToken, } from '../TYPES';

import { IConnectionData, IConnectionFunctions, } from '../data/connectionConf';
// -------------------

export class Equipment extends React.Component<{ ConnFuns: IConnectionFunctions, userToken: IUserToken, actionToken: IActionToken }, {}>{
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
    }
    // public componentWillUnmount() {
    //    if (this.game !== null) {
    //        this.game.destroy(true);
    //    }
    // }
    public render() {
        const dim = Math.min(Math.floor(this.props.height / 9), Math.floor(this.props.width / 16));
        const style = {
            height: dim * 9 + "px",
        }
        return (<div id="Game" style={style} />)
    }
}