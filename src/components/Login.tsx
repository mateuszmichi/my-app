import * as React from 'react';
import { connect } from "react-redux";
import { Link, } from 'react-router-dom';

import './css/Login.css';

import Cookies from 'universal-cookie';

import TextField from '@material-ui/core/TextField';

import { Close_Dialog, Close_Messages, End_Waiting, Log_In, Pop_Dialog, Pop_Messages, Start_Waiting,  } from './actions/actionCreators';
import { IMessage, IMessageTranslator } from './MessageMenager';

import { IConnectionFunctions, ServerConnect } from './data/connectionConf';

import { IUser, IUserToken,  } from './TYPES';

// ------------------- constants
const cookies = new Cookies();

// ------------------- image load
import * as shashSrc from './img/Login/shash.png';



class ConnectedLogin extends React.Component<{ logfun: any, ConnFuns: IConnectionFunctions}, { inputs: ILogin, isRemember: boolean}> {
    private KnownMessages: IMessageTranslator[];

    constructor(props: any) {
        super(props);
        // inner functions biding - lambda disabled due to performance
        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
        this.ActiveCheckbox = this.ActiveCheckbox.bind(this);
        this.TryLogin = this.TryLogin.bind(this);
        this.TryLoginWithToken = this.TryLoginWithToken.bind(this);

        this.KnownMessages = [];

        this.state = {
            inputs: {
                login: '',
                password: '',
            },
            isRemember: false,
        };
    }
    public componentDidMount(): void {
        const check = cookies.get('LoginCookie') as ILoginToken;
        if (check !== undefined) {
            this.TryLoginWithToken(check);
        }
    }

    public render(): JSX.Element {
        return (<div className="LogField">
            <img src={String(shashSrc)} className="TopLogo" />
            <div className="LogInner">
                <h2>Please sign in</h2>
                <form onSubmit={this.handleSubmit}>
                    <TextField
                        id="login-input"
                        label="Login"
                        type="text"
                        name="login"
                        value={this.state.inputs.login} onChange={this.handleUserInput}
                    />
                    <TextField
                        id="password-input"
                        label="Password"
                        type="password"
                        name="password"
                        value={this.state.inputs.password} onChange={this.handleUserInput}
                    />
                    <div className="CheckBoxDesc"><input type="checkbox" name="isRemember" checked={this.state.isRemember} onChange={this.handleCheckbox} /><span onClick={this.ActiveCheckbox} className="noselect">Remember me</span></div>
                    <input type="submit" value="Log in" />
                    <h3>No account already?<br /> Create new account</h3>
                    <Link to="/registration">
                        <button>Register now</button>
                    </Link>
                </form>
            </div>
        </div>);
    }

    private handleCheckbox(e: React.FormEvent<HTMLInputElement>) {
        const value = e.currentTarget.checked as boolean;
        this.setState({ isRemember: value });
    }
    private ActiveCheckbox(): void {
        this.setState({ isRemember: !this.state.isRemember });
    }
    private handleUserInput(e: React.FormEvent<HTMLInputElement>) {
        const name = e.currentTarget.name as string;
        const value = e.currentTarget.value as string;
        const inp = this.state.inputs;
        inp[name] = value;
        this.setState({ inputs: inp });
    }
    private handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const user = {
            Name: this.state.inputs.login,
            Password: this.state.inputs.password,
            isRemembered: this.state.isRemember,
        } as ILoginData;
        this.TryLogin(user);
    }
    private TryLogin(data: ILoginData) {
        const passed = data;
        const succFun = (res: any) => {
            const received = res.data;
            // alert(JSON.stringify(received));
            let ntoken: (IUserToken | null) = null;
            if (received.logintoken !== undefined) {
                const t: ILoginToken = {
                    token: received.logintoken.token,
                    tokenName: received.logintoken.tokenName,
                }
                cookies.set('LoginCookie', t, { path: '/', expires: new Date(received.logintoken.expireDate) });
            }
            ntoken = { username: received.usertoken.userName, token: received.usertoken.token } as IUserToken;
            const nuser: IUser = received.user;
            this.props.logfun(nuser, ntoken);
        };
        const failFun = (error: any) => {
            if (error.response === undefined) {
                this.props.ConnFuns.popMessage([{ title: "serverErr", description: "I've got bad feelings about this...", } as IMessage], this.KnownMessages);
            } else {
                this.props.ConnFuns.popMessage([{ title: error.response.data.type, description: error.response.data.description } as IMessage], this.KnownMessages);
            }
        };
        ServerConnect(`/api/Login`, passed, succFun, failFun, this.props.ConnFuns.popWaiting, this.props.ConnFuns.closeWaiting);
    }

    private TryLoginWithToken(token: ILoginToken) {
        const passed = token;
        const succFun = (res: any) => {
            const t: ILoginToken = {
                token: res.data.logintoken.token,
                tokenName: res.data.logintoken.tokenName,
            }
            cookies.set('LoginCookie', t, { path: '/', expires: new Date(res.data.logintoken.expireDate) });
            const ntoken = { username: res.data.usertoken.userName, token: res.data.usertoken.token } as IUserToken;
            const nuser: IUser = res.data.user;
            this.props.logfun(nuser, ntoken);
        };
        const failFun = (error: any) => {
            if (error.response === undefined) {
                this.props.ConnFuns.popMessage([{ title: "serverErr", description: "I've got bad feelings about this...", } as IMessage], this.KnownMessages);
            } else {
                this.props.ConnFuns.popMessage([{ title: error.response.data.type, description: error.response.data.description } as IMessage], this.KnownMessages);
            }
        };
        ServerConnect(`/api/LoginToken`, passed, succFun, failFun, this.props.ConnFuns.popWaiting, this.props.ConnFuns.closeWaiting);
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
        logfun: (loadedUser: IUser, receivedToken: IUserToken) => dispatch(Log_In(loadedUser, receivedToken)),
    };
};

const Login = connect(null, mapDispatchToProps)(ConnectedLogin);

// -------------------------- interfaces used only in Login

interface ILoginToken {
    token: string;
    tokenName: string;
}
interface ILogin {
    login: string;
    password: string;
}
interface ILoginData {
    Name: string,
    Password: string,
    isRemembered: boolean,
}

// ========================================

export default Login;