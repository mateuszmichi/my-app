import * as React from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';

import '../../css/dialogs/ChangePasswordDialog.css';


import { Close_Dialog, Close_Messages, End_Waiting, Pop_Dialog, Pop_Messages, Start_Waiting } from '../../actions/actionCreators';
import { IMessage, IMessageTranslator, MessageType } from '../../MessageMenager';
import { IStringValidation } from '../../Registry';
import IAppStatus, { IPassedData, IUserToken } from '../../TYPES';

import { IConnectionFunctions, ServerConnect } from '../../data/connectionConf';

import { Divider, TextField, } from '@material-ui/core';
import ValidationImg from '../ValidationImg';

// -------------------- images
import * as safeSrc from '../../img/Account/locked.png';
import * as validSrc from '../../img/Login/valid.png';


// ----------- constants



class ConnectedChangePasswordDialog extends React.Component<{ userToken: IUserToken, ConnFuns: IConnectionFunctions }, { inputs: IChangePassword, validation: boolean }>{
    private KnownMessages: IMessageTranslator[];
    constructor(props: any) {
        super(props);
        // -------binding
        this.handleUserInput = this.handleUserInput.bind(this);
        this.renderInput = this.renderInput.bind(this);
        this.validate_Confrim = this.validate_Confrim.bind(this);
        this.validate_Password = this.validate_Password.bind(this);
        this.updatePassword = this.updatePassword.bind(this);

        this.KnownMessages = [
            {
                actions: [(e: IMessage) => {
                    const failed = this.state.inputs;
                    failed.oldpass.description.push(e.description);
                    failed.oldpass.text = '';
                    failed.oldpass.isValid = 1;
                    this.setState({ inputs: failed, });
                }],
                images: [],
                ispopup: false,
                name: "passwordErr",
                title: "Old password is incorrect.",
                type: MessageType.ERROR,
            } as IMessageTranslator,
            {
                actions: [(e: IMessage) => {
                    const failed = this.state.inputs;
                    failed.newpass.description.push(e.description);
                    failed.newpass.text = '';
                    failed.newpass.isValid = 1;
                    failed.newconfirm.description.push(e.description);
                    failed.newconfirm.text = '';
                    failed.newconfirm.isValid = 1;
                    this.setState({ inputs: failed, });
                }],
                images: [],
                ispopup: false,
                name: "newpasswordErr",
                title: "New password was not confirmed correctly.",
                type: MessageType.ERROR,
            } as IMessageTranslator,
            {
                actions: [(e: IMessage) => {
                    this.props.ConnFuns.closeDialog();
                }],
                images: [],
                ispopup: true,
                name: "updatePasswordSucc",
                title: "Password has been changed",
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
                newpass: {
                    description: [],
                    isValid: -1,
                    text: "",
                    validation: this.validate_Password,
                } as IStringValidation,
                oldpass: {
                    description: [],
                    isValid: -1,
                    text: "",
                    validation: (data: IStringValidation) => {
                        const failed = this.state.inputs;
                        failed.oldpass.isValid = -1;
                        this.setState((st, pr) => ({ inputs: failed }));
                        return true;
                    }
                } as IStringValidation,
            } as IChangePassword,
            validation: false,
        }

    }
    public render() {
        return (<div className="dialog">
            <div className="ChangePassDialog">
                <div className="ChangePassForm">
                    <img src={String(safeSrc)} />
                    <div className="TitleBar">Change your password</div>
                    <Divider />
                    {this.renderInput("password", "oldpass", "Old password")}
                    {this.renderInput("password", "newpass", "New password")}
                    {this.renderInput("password", "newconfirm", "Confirm new password")}
                    <button disabled={!this.state.validation} onClick={this.updatePassword}>Change password</button>
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
    private renderInput(type: string, name: string, placeholder: string = ""): JSX.Element {
        let ret = (<div><TextField
            id={name + "-input"}
            label={placeholder}
            type={type}
            name={name}
            value={this.state.inputs[name].text} onChange={this.handleUserInput}
        /></div>);
        switch (this.state.inputs[name].isValid) {
            case -1:
                return ret;
            case 0:
                ret = (<div><TextField
                    className="Validated"
                    id={name + "-input"}
                    label={placeholder}
                    type={type}
                    name={name}
                    value={this.state.inputs[name].text} onChange={this.handleUserInput}
                /><img src={String(validSrc)} className="ValidationImg" /></div>);
                break;
            case 1:
                ret = (<div><TextField
                    className="Validated"
                    id={name + "-input"}
                    label={placeholder}
                    type={type}
                    name={name}
                    value={this.state.inputs[name].text} onChange={this.handleUserInput}
                /><ValidationImg name={name + "-validationImg"} description={this.state.inputs[name].description} /></div>);
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
            if (inp[key].isValid !== 0 && key !== "oldpass") {
                genvalid = false;
                break;
            }
        }
        this.setState({ inputs: inp, validation: genvalid });
    }
    private validate_Password(password: IStringValidation): boolean {
        password.description = [];
        const reg = [/(?=.*\d)/, /(?=.*[a-z])/, /(?=.*[A-Z])/, /[a-zA-Z0-9]{8,}/];
        const desc = ["At least one digit required.", "At least one lower case required.", "At least one upper case required.", "Between 8 to 25 characters."];
        let result = true;
        for (let i = 0; i < reg.length; i++) {
            if (!reg[i].test(password.text)) {
                result = false;
                password.description.push(desc[i]);
            }
        }
        password.isValid = (result) ? 0 : 1;
        return result;
    }
    private validate_Confrim(confrim: IStringValidation): boolean {
        confrim.isValid = (confrim.text === this.state.inputs.newpass.text) ? 0 : 1;
        if (confrim.isValid !== 0) {
            confrim.description = ["Passwords should be the same."]
        }
        return (confrim.isValid === 0);
    }
    private updatePassword() {
        const passed: IPassedData<IPassedNewPassword> = {
            Data: {
                ConfirmPassword: this.state.inputs.newconfirm.text,
                NewPassword: this.state.inputs.newpass.text,
                OldPassword: this.state.inputs.oldpass.text,
            },
            UserToken: this.props.userToken
        };
        const succFun = (res: any) => {
            this.props.ConnFuns.popMessage([{ title: "updatePasswordSucc", description: "Password has been successfully changed.", } as IMessage], this.KnownMessages);
        };
        const failFun = (error: any) => {
            if (error.response === undefined) {
                this.props.ConnFuns.popMessage([{ title: "serverErr", description: "I've got bad feelings about this...", } as IMessage], this.KnownMessages);
            } else {
                this.props.ConnFuns.popMessage([{ title: error.response.data.type, description: error.response.data.description } as IMessage], this.KnownMessages);
            }
        };
        ServerConnect(`/api/UsersChangePass`, passed, succFun, failFun, this.props.ConnFuns.popWaiting, this.props.ConnFuns.closeWaiting);
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
interface IChangePassword {
    oldpass: IStringValidation;
    newpass: IStringValidation;
    newconfirm: IStringValidation;
}
interface IPassedNewPassword {
    OldPassword: string;
    NewPassword: string;
    ConfirmPassword: string;
}



// ===============================


export default ChangePasswordDialog; 