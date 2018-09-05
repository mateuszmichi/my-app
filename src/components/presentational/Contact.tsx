import * as React from 'react';
import { connect } from "react-redux";

import styled from 'styled-components';

import { Func1 } from 'redux';

import TextField from '@material-ui/core/TextField';

import { Close_Dialog, Close_Messages, End_Waiting, Pop_Dialog, Pop_Messages, Start_Waiting, } from '../actions/actionCreators';
import { IMessage, IMessageTranslator, MessageType } from '../MessageMenager';

import { IConnectionFunctions, ServerConnect } from '../data/connectionConf';

// -------------------- images

import * as validSrc from '../img/Login/valid.png';

import * as mailSrc from '../img/AboutProject/mail.png';

import ValidationImg from '../presentational/ValidationImg';

// ---------- data
const ContactDisplay = styled.div`
width: 60%;
min-width: 320px;
max-width: 660px;
margin: auto;
background-color:rgba(255,255,255,0.78);
border: solid 2px rgba(255,255,255,0.95);
border-radius:16px;
padding:10px;
.ValidationImg {
    height: 24px;
    width: 24px;
    margin-left: 3px;
    cursor: pointer;
    vertical-align: middle;
}
input[type=submit] {
        cursor: pointer;
        width: 244px;
        margin:auto;
        margin-top: 10px;
        padding: 5px;
        border-width: 2px;
        border-radius: 5px;
        border: none;
        background-color: #303f9f;
        color: white;
        &:disabled{
            background-color: rgb(170,170,170);
            background-color: rgba(170,170,170,1.0);
    }
}
`;

class ConnectedContact extends React.Component<{ ConnFuns: IConnectionFunctions }, { inputs: IMailForm, validation: boolean }> {
    private KnownMessages: IMessageTranslator[];

    constructor(props: any) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUserInput = this.handleUserInput.bind(this);
        this.renderInput = this.renderInput.bind(this);
        this.SendEmail = this.SendEmail.bind(this);
        this.validate_Content = this.validate_Content.bind(this);
        this.validate_Email = this.validate_Email.bind(this);
        this.validate_Subject = this.validate_Subject.bind(this);


        this.KnownMessages = [
            {
                actions: [(e: IMessage) => {
                    const failed = this.state.inputs;
                    failed.content.text = '';
                    failed.from.text = '';
                    failed.subject.text = '';
                    this.setState({ inputs: failed, });
                }],
                images: [],
                ispopup: false,
                name: "eMailErr",
                title: "Could not send email",
                type: MessageType.ERROR,
            } as IMessageTranslator
        ];
        this.state = {
            inputs: {
                content: { isValid: -1, text: '', validation: this.validate_Content, description: [] },
                from: { isValid: -1, text: '', validation: this.validate_Email, description: [] },
                subject: { isValid: -1, text: '', validation: this.validate_Subject, description: [] },
            },
            validation: false,
        };
    }
    public componentWillMount() {
        document.title = "Projects";
    }
    public componentWillUnmount() {
        document.title = "Shattered Plains";
    }

    public render(): JSX.Element {
        return (
            <div className="insideContent">
                <ContactDisplay>
                    <div style={{ textAlign: "center" }}>
                        <h2>Contact us!</h2>
                        <img src={String(mailSrc)} style={{ maxWidth: "128px", width: "15%", minWidth: "64px" }} />
                    </div>
                    <form onSubmit={this.handleSubmit}>
                        <div>
                            {this.renderInput("text", "from", "Your email address")}
                            {this.renderInput("text", "subject", "Subject")}
                            {this.renderInput("text", "content", "Content of email",true)}
                            <div style={{textAlign:"center"}}>
                                <input type="submit" value="Send" disabled={!(this.state.inputs.content.isValid === 0 && this.state.inputs.from.isValid === 0
                                    && this.state.inputs.subject.isValid === 0)} />
                            </div>
                        </div>
                    </form>
                </ContactDisplay>
            </div>
        );
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
        this.SendEmail();
    }

    private renderInput(type: string, name: string, placeholder: string = "", multiline = false): JSX.Element {
        const stylized = {
            width: "calc(100% - 32px)",
        };
        let element = (<TextField
            style={stylized}
            id={name + "-input"}
            label={placeholder}
            type={type}
            name={name}
            value={this.state.inputs[name].text} onChange={this.handleUserInput}
        />);
        if (multiline) {
            element = (<TextField
                style={stylized}
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

    private SendEmail() {
        const passed: IMailData = {
            content: this.state.inputs.content.text,
            from: this.state.inputs.from.text,
            subject: this.state.inputs.subject.text,
        };
        const succFun = (res: any) => {
            this.props.ConnFuns.popMessage([{ title: "sendEmailSucc", description: "Email has been sent!", } as IMessage], this.KnownMessages);
        };
        const failFun = (error: any) => {
            if (error.response === undefined) {
                this.props.ConnFuns.popMessage([{ title: "serverErr", description: "I've got bad feelings about this...", } as IMessage], this.KnownMessages);
            } else {
                this.props.ConnFuns.popMessage([{ title: error.response.data.type, description: error.response.data.description, } as IMessage], this.KnownMessages);
            }
        };
        ServerConnect(`/api/ContactEmail`, passed, succFun, failFun, this.props.ConnFuns.popWaiting, this.props.ConnFuns.closeWaiting);
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
    private validate_Subject(password: IStringValidation): boolean {
        password.description = [];
        const reg = [/^.{4,30}$/];
        const desc = ["Between 4 to 30 characters."];
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
    private validate_Content(login: IStringValidation): boolean {
        login.description = [];
        const reg = [/^.{5,30}$/];
        const desc = ["Between 5 to 300 characters."];
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

const Contact = connect(null, mapDispatchToProps)(ConnectedContact);

// ----------------------- local interfaces

interface IMailForm {
    from: IStringValidation;
    subject: IStringValidation;
    content: IStringValidation;
}
export interface IStringValidation {
    isValid: number;
    text: string;
    validation: Func1<IStringValidation, boolean>;
    description: string[];
}
interface IMailData {
    from: string;
    subject: string;
    content: string;
}

// ========================================

export default Contact;
