import * as React from 'react';
import { connect } from "react-redux";
import { Redirect } from 'react-router';
// import { Link, } from 'react-router-dom';

import './css/Game.css';

// import { IUser, IUserToken, } from './TYPES';

import { Grid } from '@material-ui/core';

import MainMenu from './gamecomponents/MainMenu';
import MainWindow from './gamecomponents/MainWindow';

import { Add_To_Equipment, Close_Dialog, Close_Messages, End_Game, End_Waiting, Pop_Dialog, Pop_Messages, Start_Waiting, Update_Equipment, Update_Hero_Exp, Update_Hero_Hp, Update_Hero_HpBase,   } from './actions/actionCreators';
import { IActionToken, IAppStatus, IHero, IUserToken,  } from './TYPES';

import { IConnectionData, IConnectionFunctions,  } from './data/connectionConf';
import { IMessage, IMessageTranslator } from './MessageMenager';

import { IEquipmentModification, IEquipmentModifyResult,  IItemResult } from './data/gameTYPES';


class ConnectedGame extends React.Component<{ hero: IHero, ConnFuns: IConnectionFunctions, userToken: IUserToken, actionToken: IActionToken, logFun: any, HeroUpdates: IHeroUpdates}, { CurrentPosition: number, isEnd: boolean }> {
    private connData: IConnectionData;

    constructor(props: any) {
        super(props);
        // inner functions biding - lambda disabled due to performance
        this.handleLogout = this.handleLogout.bind(this);
        this.handleChangePosition = this.handleChangePosition.bind(this);

        this.connData = {
            actionToken: this.props.actionToken,
            closeDialog: this.props.ConnFuns.closeDialog,
            closeMessage: this.props.ConnFuns.closeMessage,
            closeWaiting: this.props.ConnFuns.closeWaiting,
            popDialog: this.props.ConnFuns.popDialog,
            popMessage: this.props.ConnFuns.popMessage,
            popWaiting: this.props.ConnFuns.popWaiting,
            userToken: this.props.userToken,
        }

        let isEnd = false;
        if (this.props.hero === null || this.props.hero === undefined) {
            isEnd = true;
        }
        this.state = {
            CurrentPosition: 0,
            isEnd,
        };
    }

    public render(): JSX.Element {
        if (this.state.isEnd) {
            return <Redirect to="/" />;
        }
        return (<div className="Game">
            <div className="GameContent">
                <div className="GameDisplay">
                    <Grid container={true} className="GameMax">
                        <Grid item={true} xs={11}>
                            <MainWindow character={this.props.hero} ConnData={this.connData} HeroUpdates={this.props.HeroUpdates} logFun={this.handleLogout} CurrentPosition={this.state.CurrentPosition}/>
                        </Grid>
                        <Grid item={true} xs={1}>
                            <MainMenu CurrentPosition={this.state.CurrentPosition} changePosition={this.handleChangePosition} logFun={this.handleLogout}/>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>);
    }

    private handleLogout() {
        // this.setState({ isEnd: true });
        // this.props.logFun();
        window.location.replace("/");
    }
    private handleChangePosition(id: number) {
        this.setState({ CurrentPosition: id });
    }
}

// -------------------------- connection with the store

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
        HeroUpdates: {
            AddToEQ: (added: IEquipmentModification[], newItems: IItemResult[]) => dispatch(Add_To_Equipment(added,newItems)),
            UpdateEQ: (modification: IEquipmentModifyResult) => dispatch(Update_Equipment(modification)),
            UpdateEXP: (exp:number,lvl:number) => dispatch(Update_Hero_Exp(exp,lvl)),
            UpdateHP: (hp: number) => dispatch(Update_Hero_Hp(hp)),
            UpdateHPBase: (hpMax: number) => dispatch(Update_Hero_HpBase(hpMax)),
        } as IHeroUpdates,
        logFun: () => dispatch(End_Game()),
    };
};
const mapStateToProps = (state: any) => {
    const pass = state as IAppStatus;
    return { hero: pass.activeHero, userToken: pass.userToken, actionToken: pass.actionToken };
};

const Game = connect(mapStateToProps, mapDispatchToProps)(ConnectedGame);

// -------------------------- interfaces

export interface IHeroUpdates {
    AddToEQ: (added: IEquipmentModification[], newItems: IItemResult[]) => void;
    UpdateHP: (hp: number) => void;
    UpdateEQ: (modification: IEquipmentModifyResult) => void;
    UpdateEXP: (exp: number, lvl: number) => void;
    UpdateHPBase: (hpmax: number) => void;
}

// ========================================

export default Game;