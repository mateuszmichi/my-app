import * as React from 'react';
import { connect } from "react-redux";
import { Link, } from 'react-router-dom';
import { Func1 } from 'redux';

import './css/Login.css';

import TextField from '@material-ui/core/TextField';

import { Close_Dialog, Close_Messages, End_Waiting, Pop_Dialog, Pop_Messages, Start_Waiting, } from './actions/actionCreators';
import { IMessage, IMessageTranslator, MessageType } from './MessageMenager';

import { IConnectionFunctions, ServerConnect } from './data/connectionConf';

// -------------------- images
import * as shashSrc from './img/Login/shash.png';
import * as validSrc from './img/Login/valid.png';

import ValidationImg from './presentational/ValidationImg';

// -------------------- constants


class ConnectedRegistry extends React.Component<{ ConnFuns: IConnectionFunctions}, { inputs: IRegestration, validation: boolean }>{
    private KnownMessages: IMessageTranslator[];

    constructor(props: any) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUserInput = this.handleUserInput.bind(this);
        this.validate_Confrim = this.validate_Confrim.bind(this);

        this.KnownMessages = [
            {
                actions: [(e: IMessage) => {
                    const failed = this.state.inputs;
                    failed.login.description.push(e.description);
                    failed.login.text = '';
                    failed.login.isValid = 1;
                    this.setState({ inputs: failed, });
                }],
                images: [],
                ispopup: false,
                name: "sameloginErr",
                title: "Same login exists",
                type: MessageType.ERROR,
            } as IMessageTranslator,
            {
                actions: [(e: IMessage) => {
                    const failed = this.state.inputs;
                    failed.email.description.push(e.description);
                    failed.email.text = '';
                    failed.email.isValid = 1;
                    this.setState({ inputs: failed, });
                }],
                images: [],
                ispopup: false,
                name: "sameemailErr",
                title: "Same email exists",
                type: MessageType.ERROR,
            } as IMessageTranslator,
            {
                actions: [(e: IMessage) => {
                    const failed = this.state.inputs;
                    failed.password_confirm.description.push(e.description);
                    failed.password_confirm.text = '';
                    failed.password_confirm.isValid = 1;
                    this.setState({ inputs: failed });
                }],
                images: [],
                ispopup: false,
                name: "confirmErr",
                title: "Passwords don't match",
                type: MessageType.ERROR,
            } as IMessageTranslator,
        ];

        this.state = {
            inputs: {
                email: { isValid: -1, text: '', validation: this.validate_Email, description: [] },
                login: { isValid: -1, text: '', validation: this.validate_Login, description: [] },
                password: { isValid: -1, text: '', validation: this.validate_Password, description: [] },
                password_confirm: { isValid: -1, text: '', validation: this.validate_Confrim, description: [] },
            },
            validation: false,
        };
    }

    public render(): JSX.Element {
        return (<div className="insideContent">
            <div className="LogField">
                <img src={String(shashSrc)} className="TopLogo" />
                <div className="LogInner">
                    <h2>Registration</h2>
                    <form onSubmit={this.handleSubmit}>
                        {this.renderInput("text", "login", "Login")}
                        {this.renderInput("password", "password", "Password")}
                        {this.renderInput("password", "password_confirm", "Confirm password")}
                        {this.renderInput("text", "email", "Email")}
                        <input type="submit" value="Create account" disabled={!(this.state.inputs.email.isValid === 0 && this.state.inputs.login.isValid === 0
                            && this.state.inputs.password.isValid === 0 && this.state.inputs.password_confirm.isValid === 0)} />
                    </form>
                    <h3>Have an account?</h3>
                    <Link to="/">
                        <button>To Login</button>
                    </Link>
                </div>
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
            if (inp[key].isValid !== 0) {
                genvalid = false;
                break;
            }
        }
        this.setState({ inputs: inp, validation: genvalid });
    }

    private handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        this.registerNewUser();
    }

    private registerNewUser() {
        const passed: INewUser = {
            email: this.state.inputs.email.text,
            password: this.state.inputs.password.text,
            password_Confrim: this.state.inputs.password_confirm.text,
            username: this.state.inputs.login.text,
        };
        const succFun = (res: any) => {
            this.props.ConnFuns.popMessage([{ title: "createUserSucc", description: "Created new account! Invitational email has been sent to passed previously email. You can login now.", } as IMessage], this.KnownMessages);
        };
        const failFun = (error: any) => {
            if (error.response === undefined) {
                this.props.ConnFuns.popMessage([{ title: "serverErr", description: "I've got bad feelings about this...", } as IMessage], this.KnownMessages);
            } else {
                this.props.ConnFuns.popMessage([{ title: error.response.data.type, description: error.response.data.description, } as IMessage], this.KnownMessages);
            }
        };
        ServerConnect(`/api/Registration`, passed, succFun, failFun, this.props.ConnFuns.popWaiting, this.props.ConnFuns.closeWaiting);
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
        confrim.isValid = (confrim.text === this.state.inputs.password.text) ? 0 : 1;
        if (confrim.isValid !== 0) {
            confrim.description = ["Passwords should be the same."]
        }
        return (confrim.isValid === 0);
    }
    private validate_Login(login: IStringValidation): boolean {
        login.description = [];
        const reg = [/^.{5,30}$/, /^[a-zA-Z0-9_]*$/];
        const desc = ["Between 5 to 30 characters.", "Only letters, digits and _"];
        let result = true;
        for (let i = 0; i < reg.length; i++) {
            if (!reg[i].test(login.text)) {
                result = false;
                login.description.push(desc[i]);
            }
        }
        login.isValid = (result) ? 0 : 1;
        return result;
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
    };
};

const Registry = connect(null, mapDispatchToProps)(ConnectedRegistry);

// ----------------------- local interfaces

interface IRegestration {
    login: IStringValidation;
    password: IStringValidation;
    password_confirm: IStringValidation;
    email: IStringValidation;
}
export interface IStringValidation {
    isValid: number;
    text: string;
    validation: Func1<IStringValidation, boolean>;
    description: string[];
}
interface INewUser {
    email: string;
    username: string;
    password: string;
    password_Confrim: string;
}

// ========================================

export default Registry;