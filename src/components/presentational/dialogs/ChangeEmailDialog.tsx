import * as React from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';

import '../../css/dialogs/ChangeEmailDialog.css';

import EmailIcon from '@material-ui/icons/Email';


import { Close_Dialog, Close_Messages, End_Waiting, Pop_Dialog, Pop_Messages, Start_Waiting, } from '../../actions/actionCreators';
import { IMessage, IMessageTranslator, MessageType } from '../../MessageMenager';
import { IStringValidation } from '../../Registry';
import IAppStatus, { IPassedData, IUserToken,  } from '../../TYPES';

import { IConnectionFunctions, ServerConnect } from '../../data/connectionConf';

import { Divider, TextField, } from '@material-ui/core';
import ValidationImg from '../ValidationImg';

// -------------------- images
import * as validSrc from '../../img/Login/valid.png';

// ----------- constants

import { isMobile } from "react-device-detect";

import {
    Link,
} from 'react-router-dom';


class ConnectedChangePasswordDialog extends React.Component<{ userToken: IUserToken, ConnFuns: IConnectionFunctions }, { inputs: IChangeEmail, validation: boolean, previousEmail: string }>{
    private KnownMessages: IMessageTranslator[];
    constructor(props: any) {
        super(props);
        // -------binding
        this.handleUserInput = this.handleUserInput.bind(this);
        this.renderInput = this.renderInput.bind(this);
        this.validate_Confrim = this.validate_Confrim.bind(this);
        this.validate_Email = this.validate_Email.bind(this);
        this.updateEmail = this.updateEmail.bind(this);

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
            {
                actions: [(e: IMessage) => {
                    const failed = this.state.inputs;
                    failed.newemail.text = '';
                    failed.newemail.isValid = 1;
                    failed.newemail.description = [...failed.newemail.description, e.description];
                    failed.newconfirm.isValid = -1;
                    failed.newconfirm.text = '';
                    this.setState({ validation: false, inputs: failed });
                }],
                images: [],
                ispopup: true,
                name: "newEmailErr",
                title: "Failed to save this email.",
                type: MessageType.ERROR,
            } as IMessageTranslator,
            {
                actions: [(e: IMessage) => {
                    this.props.ConnFuns.closeDialog();
                }],
                images: [],
                ispopup: true,
                name: "updateEmailSucc",
                title: "Email has been changed",
                type: MessageType.SUCCESS,
            } as IMessageTranslator
        ]

        this.state = {
            inputs: {
                newconfirm: {
                    description: [],
                    isValid: -1,
                    text: "",
                    validation: this.validate_Confrim,
                } as IStringValidation,
                newemail: {
                    description: [],
                    isValid: -1,
                    text: "",
                    validation: this.validate_Email,
                } as IStringValidation,
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
            } as IChangeEmail,
            previousEmail : "Loading...",
            validation: false,
        }

    }

    public componentDidMount() {
        const succFun = (res: any) => {
            this.setState({ previousEmail: res.data.email });
        };
        const failFun = (error: any) => {
            if (error.response === undefined) {
                this.props.ConnFuns.popMessage([{ title: "serverErr", description: "I've got bad feelings about this...", } as IMessage], this.KnownMessages);
            } else {
                this.props.ConnFuns.popMessage([{ title: error.response.data.type, description: error.response.data.description } as IMessage], this.KnownMessages);
            }
        };
        ServerConnect(`/api/GetEmail`, this.props.userToken, succFun, failFun, this.props.ConnFuns.popWaiting, this.props.ConnFuns.closeWaiting, false);
    }

    public render() {
        return (<div className="dialog">
            <div className="ChangeEmailDialog">
                <div className="ChangeEmailForm">
                    <div className="TitleBar">Current email:</div>
                    <Divider />
                    <div className="CurrentEmail">
                        <div className="inlineDiv"><EmailIcon /></div>
                        <div className="inlineDiv">{this.state.previousEmail}</div>
                    </div>
                    <div className="TitleBar">Change contact email</div>
                    <Divider />
                    {this.renderInput("password", "password", "Password")}
                    {this.renderInput("text", "newemail", "New email")}
                    {this.renderInput("text", "newconfirm", "Confirm new email")}
                    <button disabled={!this.state.validation} onClick={this.updateEmail}>Change email</button>
                </div>
            </div>
            <div className="dialogBottom">
                {(isMobile) ?
                    <Button
                        variant="flat"
                        color="primary"
                        size="large"
                    ><Link to="/" style={{textDecoration:'none'}}>
                        Back</Link></Button>
                    :
                    <Button
                        variant="flat"
                        color="primary"
                        onClick={this.props.ConnFuns.closeDialog}
                    >
                        Abort</Button>
                    }
            </div>
        </div>);
    }
    private renderInput(type: string, name: string, placeholder: string = ""): JSX.Element {
        const element = (<TextField
            id={name + "-input"}
            label={placeholder}
            type={type}
            name={name}
            value={this.state.inputs[name].text} onChange={this.handleUserInput}
            style={{minWidth:200}}
        />);
        let ret = (<div>{element}</div>);
        switch (this.state.inputs[name].isValid) {
            case -1:
                return ret;
            case 0:
                ret = (<div className="Validated">{ element } <img src={String(validSrc)} className="ValidationImg" /></div>);
                break;
            case 1:
                ret = (<div className="Validated">{ element }<ValidationImg name={name + "-validationImg"} description={this.state.inputs[name].description} /></div>);
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
        let genvalid = true;
        for (const key in inp) {
            if (inp[key].isValid !== 0 && key !== "password") {
                genvalid = false;
                break;
            }
        }
        this.setState({ inputs: inp, validation: genvalid });
    }
    private validate_Email(email: IStringValidation): boolean {
        email.description = [];
        const reg = [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            /^.{1,40}$/];
        const desc = ["Invalid email format.", "Too long email address."];
        let result = true;
        for (let i = 0; i < reg.length; i++) {
            if (!reg[i].test(email.text)) {
                result = false;
                email.description.push(desc[i]);
            }
        }
        email.isValid = (result) ? 0 : 1;
        return result;
    }
    private validate_Confrim(confrim: IStringValidation): boolean {
        confrim.isValid = (confrim.text === this.state.inputs.newemail.text) ? 0 : 1;
        if (confrim.isValid !== 0) {
            confrim.description = ["Emails should be the same."]
        }
        return (confrim.isValid === 0);
    }
    private updateEmail() {
        const passed: IPassedData<IPassedNewEmail> = {
            Data: {
                ConfirmEmail: this.state.inputs.newconfirm.text,
                NewEmail: this.state.inputs.newemail.text,
                Password: this.state.inputs.password.text,
            },
            UserToken: this.props.userToken,
        };
        const succFun = (res: any) => {
            this.props.ConnFuns.popMessage([{ title: "updateEmailSucc", description: "Contact email has been successfully changed.", } as IMessage], this.KnownMessages);
        };
        const failFun = (error: any) => {
            if (error.response === undefined) {
                this.props.ConnFuns.popMessage([{ title: "serverErr", description: "I've got bad feelings about this...", } as IMessage], this.KnownMessages);
            } else {
                this.props.ConnFuns.popMessage([{ title: error.response.data.type, description: error.response.data.description } as IMessage], this.KnownMessages);
            }
        };
        ServerConnect(`/api/UsersChangeEmail`, passed, succFun, failFun, this.props.ConnFuns.popWaiting, this.props.ConnFuns.closeWaiting);
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
    };
};
const mapStateToProps = (state: IAppStatus) => {
    return {
        userToken: state.userToken,
    }
};

const ChangePasswordDialog = connect(mapStateToProps, mapDispatchToProps)(ConnectedChangePasswordDialog);

// --------------- interfaces
interface IChangeEmail {
    password: IStringValidation;
    newemail: IStringValidation;
    newconfirm: IStringValidation;
}
interface IPassedNewEmail {
    Password: string;
    NewEmail: string;
    ConfirmEmail: string;
}

// ===============================


export default ChangePasswordDialog; 