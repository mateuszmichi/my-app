import * as React from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';

import '../../css/dialogs/RemoveAccountDialog.css';

import { Close_Dialog, Close_Messages, End_Waiting, Log_Out, Pop_Dialog, Pop_Messages, Remove_Hero, Start_Waiting } from '../../actions/actionCreators';
import { IMessage, IMessageTranslator, MessageType } from '../../MessageMenager';
import { IStringValidation } from '../../Registry';
import { IAppStatus, IPassedData, IUserToken, } from '../../TYPES';

import { IConnectionFunctions, ServerConnect } from '../../data/connectionConf';

import { Divider, TextField, } from '@material-ui/core';
import ValidationImg from '../ValidationImg';

import Cookies from 'universal-cookie';

// -------------------- images
import * as validSrc from '../../img/Login/valid.png';

// ----------- constants
const cookies = new Cookies();

class ConnectedRemoveCharacterDialog extends React.Component<{ userToken: IUserToken, logoutFun: VoidFunction, ConnFuns: IConnectionFunctions }, { inputs: IRemoveAccount }>{
    private KnownMessages: IMessageTranslator[];
    constructor(props: any) {
        super(props);
        // -------binding
        this.handleUserInput = this.handleUserInput.bind(this);
        this.renderInput = this.renderInput.bind(this);
        this.RemoveAccount = this.RemoveAccount.bind(this);

        this.KnownMessages = [
            {
                actions: [(e: IMessage) => {
                    const failed = this.state.inputs;
                    failed.password.description.push(e.description);
                    failed.password.text = '';
                    this.setState({ inputs: failed });
                    failed.password.isValid = 1;
                    this.setState({ inputs: failed });
                }],
                images: [],
                ispopup: false,
                name: "passwordErr",
                title: "Password is incorrect.",
                type: MessageType.ERROR,
            } as IMessageTranslator,
        ]

        this.state = {
            inputs: {
                password: {
                    description: [],
                    isValid: -1,
                    text: "",
                    validation: (data: IStringValidation) => {
                        const failed = this.state.inputs;
                        failed.password.isValid = -1;
                        this.setState({ inputs: failed, });
                        return true;
                    }
                } as IStringValidation,
                reason: {
                    description: [],
                    isValid: -1,
                    text: "",
                    validation: (data: IStringValidation) => {
                        const failed = this.state.inputs;
                        failed.password.isValid = -1;
                        this.setState({ inputs: failed, });
                        return true;
                    }
                } as IStringValidation,
            } as IRemoveAccount,
        }

    }

    public render() {
        return (<div className="dialog">
            <div className="RemoveAccountDialog">
                <div className="RemoveAccountForm">
                    <div className="TitleBar">Confirm with password</div>
                    <Divider />
                    {this.renderInput("password", "password", "Password")}
                    <div className="TitleBar">Share with us Your reason to resign</div>
                    <Divider />
                    {this.renderInput("text", "reason", "Reason of resign", true)}
                    <button onClick={this.RemoveAccount}>Delete the account</button>
                </div>
            </div>
            <div className="dialogBottom">
                <Button
                    variant="flat"
                    color="primary"
                    onClick={this.props.ConnFuns.closeDialog}
                >
                    Abord</Button>
            </div>
        </div>);
    }
    private renderInput(type: string, name: string, placeholder: string = "", multiline = false): JSX.Element {
        let element = (<TextField
            id={name + "-input"}
            label={placeholder}
            type={type}
            name={name}
            value={this.state.inputs[name].text} onChange={this.handleUserInput}
        />);
        if (multiline) {
            element = (<TextField
                id={name + "-input"}
                label={placeholder}
                multiline={true}
                rows={5}
                type={type}
                name={name}
                value={this.state.inputs[name].text} onChange={this.handleUserInput}
            />);
        }

        let ret = (<div>{element}</div>);
        switch (this.state.inputs[name].isValid) {
            case -1:
                return ret;
            case 0:
                ret = (<div className="Validated">{element} <img src={String(validSrc)} className="ValidationImg" /></div>);
                break;
            case 1:
                ret = (<div className="Validated">{element}<ValidationImg name={name + "-validationImg"} description={this.state.inputs[name].description} /></div>);
                break;
        }
        return ret;
    }
    private handleUserInput(e: React.FormEvent<HTMLInputElement>) {
        const name = e.currentTarget.name as string;
        const value = e.currentTarget.value as string;
        const inp = this.state.inputs;
        inp[name].text = value;
        if (value === "") {
            inp[name].isValid = -1;
        }
        else {
            inp[name].validation(inp[name]);
        }
        this.setState({ inputs: inp });
    }
    private RemoveAccount() {
        const passed: IPassedData<IPassedRemoveAccount> = {
            Data: {
                Password: this.state.inputs.password.text,
                Reason: this.state.inputs.reason.text,
            },
            UserToken: this.props.userToken,
        }
        const succFun = (res: any) => {
            cookies.remove("LoginCookie");
            this.props.ConnFuns.closeDialog();
            this.props.logoutFun();
            this.props.ConnFuns.popMessage([{ title: "removeAccountSucc", description: "Account has been successfully removed.", } as IMessage], this.KnownMessages);
        };
        const failFun = (error: any) => {
            if (error.response === undefined) {
                this.props.ConnFuns.popMessage([{ title: "serverErr", description: "I've got bad feelings about this...", } as IMessage], this.KnownMessages);
            } else {
                this.props.ConnFuns.popMessage([{ title: error.response.data.type, description: error.response.data.description } as IMessage], this.KnownMessages);
            }
        };
        ServerConnect(`/api/UsersRemove`, passed, succFun, failFun, this.props.ConnFuns.popWaiting, this.props.ConnFuns.closeWaiting);
    }
}

// ----------- connect to store

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
        removeHeroFromList: (heroname: string) => dispatch(Remove_Hero(heroname)),
    };
};
const mapStateToProps = (state: IAppStatus) => {
    if (state.user === null) {
        throw Error("No user in storage");
    }
    return {
        characters: state.user.characters,
        userToken: state.userToken,
    }
};

const RemoveCharacterDialog = connect(mapStateToProps, mapDispatchToProps)(ConnectedRemoveCharacterDialog);

// --------------- interfaces
interface IRemoveAccount {
    password: IStringValidation;
    reason: IStringValidation;
}
interface IPassedRemoveAccount {
    Password: string;
    Reason: string;
}

// ===============================


export default RemoveCharacterDialog; 