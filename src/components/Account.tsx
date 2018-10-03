import * as React from 'react';
import { connect } from "react-redux";
import { Redirect } from 'react-router';

import { Close_Dialog, Close_Messages, End_Waiting, Log_Out, Pop_Dialog, Pop_Messages, Start_Game, Start_Waiting } from './actions/actionCreators';
import { IMessage, IMessageTranslator } from './MessageMenager';

import { IConnectionFunctions, ServerConnect } from './data/connectionConf';

import './css/Account.css';

import { IActionToken, IAppStatus, IHero, IPassedData, IUser, IUserToken, } from './TYPES';

import Cookies from 'universal-cookie';

import { Divider } from '@material-ui/core';
import AccountManagement from './presentational/AccountManagement';
import CharacterList from './presentational/CharactersList';
import ChangeEmailDialog from './presentational/dialogs/ChangeEmailDialog';
import ChangePasswordDialog from './presentational/dialogs/ChangePasswordDialog';
import CreateCharacterDialog from './presentational/dialogs/CreateCharacterDialog';
import RemoveAccountDialog from './presentational/dialogs/RemoveAccountDialog';
import RemoveCharacterDialog from './presentational/dialogs/RemoveCharacterDialog';

import MobileCreateCharacterDialog from './presentational/dialogs/mobile/MobileCreateCharacterDialog';

import DeleteIcon from '@material-ui/icons/Delete';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EmailIcon from '@material-ui/icons/Email';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import LockIcon from '@material-ui/icons/Lock';

import {
    // Link,
    Route,
    Switch,
} from 'react-router-dom';

import { isMobile } from 'react-device-detect';

// ------------------ constants
const cookies = new Cookies();


class ConnectedAccount extends React.Component<{ user: IUser, userToken: IUserToken, logoutFun: VoidFunction, startFun: (hero: IHero, actionToken: IActionToken) => void, ConnFuns: IConnectionFunctions }, { isGame: boolean }>{
    private AccountOptions: IAccountOption[];

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

        this.AccountOptions = [
            {
                element: <ChangePasswordDialog />,
                icon: <LockIcon />,
                onClick: this.handlePassChange,
                route: 'changepassword',
                text: "Change password",
            },
            {
                element: <ChangeEmailDialog />,
                icon: <EmailIcon />,
                onClick: this.handleEmailChange,
                route: 'changeemail',
                text: "Change email"
            },
            {
                element: <RemoveCharacterDialog />,
                icon: <DeleteIcon />,
                onClick: this.handleCharacterRemove,
                route: 'removecharacter',
                text: "Remove a character"
            },
            {
                element: <RemoveAccountDialog />,
                icon: <DeleteForeverIcon />,
                onClick: this.handleAccountRemove,
                route: 'removeaccount',
                text: "Delete account"
            },
            {
                element: null,
                icon: <ExitToAppIcon />,
                onClick: this.handleLogOut,
                route: null,
                text: "Log Out"
            },
        ];
    }

    public render(): JSX.Element {
        if (this.state.isGame) {
            return <Redirect to="/game" />;
        }
        const menu = (match: any) => {
            return (
                <div className={isMobile ?"ContentField MobileContentField":"ContentField"}>
                    <div className="SectionTitle">Available Characters</div>
                    <Divider />
                    <CharacterList characters={this.props.user.characters} addHeroFun={this.handleAddHero} playFun={this.handleGame} />
                    <Divider />
                    <div className="SectionTitle">Account's Management</div>
                    <Divider />
                    <AccountManagement AccountOptions={this.AccountOptions} />
                </div>
            );
        }
        return (
            <Switch>
                <Route path="/(account|)/" exact={true} component={menu} />
                {
                    this.AccountOptions.filter(f => f.element !== null && f.route !== null).map((e, i) => {
                        const Fun = (match: any) => {
                            return <div className="MobileContentField">{e.element}</div>;
                        };
                        return <Route key={i} path={"/account/" + e.route} exact={true} component={Fun} />;
                    })
                }
                <Route path="/account/addcharacter" exact={true} component={MobileCreateCharacterDialog} />
            </Switch>);
    }

    private handleLogOut(): void {
        cookies.remove("LoginCookie");
        cookies.remove("AutoCookie");
        this.props.logoutFun();
        if (isMobile) {
            location.reload(true);
        }
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

export interface IAccountOption {
    text: string,
    onClick: VoidFunction,
    icon: JSX.Element,
    route: string | null,
    element: JSX.Element | null,
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
        logoutFun: () => dispatch(Log_Out()),
        startFun: (hero: IHero, actionToken: IActionToken) => dispatch(Start_Game(hero, actionToken)),
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