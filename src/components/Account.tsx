import * as React from 'react';
import { connect } from "react-redux";
import { Redirect } from 'react-router';

import { Close_Dialog, Close_Messages, End_Waiting, Load_Location, Log_Out, Pop_Dialog, Pop_Messages, Start_Game, Start_Waiting } from './actions/actionCreators';
import { IMessage, IMessageTranslator } from './MessageMenager';

import { IConnectionFunctions, ServerConnect } from './data/connectionConf';

import './css/Account.css';

import { IActionToken, IAppStatus, IHero, IPassedData, IUser,  IUserToken,   } from './TYPES';

import { ILocationResult } from './data/gameTYPES';

import Cookies from 'universal-cookie';

import { Divider } from '@material-ui/core';
import AccountManagement from './presentational/AccountManagement';
import CharacterList from './presentational/CharactersList';
import ChangeEmailDialog from './presentational/dialogs/ChangeEmailDialog';
import ChangePasswordDialog from './presentational/dialogs/ChangePasswordDialog';
import CreateCharacterDialog from './presentational/dialogs/CreateCharacterDialog';
import RemoveAccountDialog from './presentational/dialogs/RemoveAccountDialog';
import RemoveCharacterDialog from './presentational/dialogs/RemoveCharacterDialog';


// ------------------ constants
const cookies = new Cookies();


class ConnectedAccount extends React.Component<{ user: IUser, userToken: IUserToken, logoutFun: VoidFunction, locationFun: (location: ILocationResult) => void ,startFun: (hero: IHero, actionToken: IActionToken) => void, ConnFuns: IConnectionFunctions }, { isGame: boolean }>{
    constructor(props: any) {
        super(props);
        // -------binding
        this.handleLogOut = this.handleLogOut.bind(this);
        this.handleAddHero = this.handleAddHero.bind(this);
        this.handlePassChange = this.handlePassChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleCharacterRemove = this.handleCharacterRemove.bind(this);
        this.handleAccountRemove = this.handleAccountRemove.bind(this);
        this.handleGame = this.handleGame.bind(this);

        this.state = {
            isGame: false,
        }
    }

    public render(): JSX.Element {
        if (this.state.isGame) {
            return <Redirect to="/game" />;
        }
        return (<div className="ContentField">
            <div className="SectionTitle">Available Characters</div>
            <Divider />
            <CharacterList characters={this.props.user.characters} addHeroFun={this.handleAddHero} playFun={this.handleGame}/>
            <Divider />
            <div className="SectionTitle">Account's Management</div>
            <Divider />
            <AccountManagement emailFun={this.handleEmailChange} logFun={this.handleLogOut} passFun={this.handlePassChange} removeCharacterFun={this.handleCharacterRemove} removeAccountFun={this.handleAccountRemove} />
        </div>);
    }

    private handleLogOut(): void {
        cookies.remove("LoginCookie");
        this.props.logoutFun();
    }
    private handleAddHero(): void {
        this.props.ConnFuns.popDialog(<CreateCharacterDialog />);
    }
    private handlePassChange(): void {
        this.props.ConnFuns.popDialog(<ChangePasswordDialog />);
    }
    private handleEmailChange(): void {
        this.props.ConnFuns.popDialog(<ChangeEmailDialog />);
    }
    private handleCharacterRemove(): void {
        this.props.ConnFuns.popDialog(<RemoveCharacterDialog />);
    }
    private handleAccountRemove(): void {
        this.props.ConnFuns.popDialog(<RemoveAccountDialog />);
    }
    private handleGame(index: number): void {
        const passed: IPassedData<string> = {
            Data: this.props.user.characters[index].name,
            UserToken: this.props.userToken,
        }
        const succFun = (res: any) => {
            const received = res.data;
            this.props.startFun(received.hero, received.actiontoken);
            const loc = received.location;
            if (loc !== undefined) {
                this.props.locationFun(loc as ILocationResult);
            }
            this.setState({ isGame: true });
        };
        const failFun = (error: any) => {
            if (error.response === undefined) {
                this.props.ConnFuns.popMessage([{ title: "serverErr", description: "I've got bad feelings about this...", } as IMessage], []);
            } else {
                this.props.ConnFuns.popMessage([{ title: error.response.data.type, description: error.response.data.description } as IMessage], []);
            }
        };
        ServerConnect(`/api/HerosLoad`, passed, succFun, failFun, this.props.ConnFuns.popWaiting, this.props.ConnFuns.closeWaiting);
    }
}
// ----------------- connect to the store

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
        locationFun: (location: ILocationResult) => dispatch(Load_Location(location)),
        logoutFun: () => dispatch(Log_Out()),
        startFun: (hero: IHero, actionToken: IActionToken) => dispatch(Start_Game(hero,actionToken)),        
    };
};

const mapStateToProps = (state: any) => {
    const pass = state as IAppStatus;
    return { user: pass.user, userToken: pass.userToken };
};

const Account = connect(mapStateToProps, mapDispatchToProps)(ConnectedAccount);

// ------------ interfaces

// ========================================

export default Account;