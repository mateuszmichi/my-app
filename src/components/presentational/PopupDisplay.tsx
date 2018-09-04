import * as React from 'react';
import { connect } from "react-redux";

import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import { IMessage, IMessageConverted, IMessageTranslator, MessageMenager, } from '../MessageMenager';

import { MessagesAll } from '../data/knownMessages';

import '../css/PopupDisplay.css';

import IAppStatus from '../TYPES';

import { Close_Dialog, Close_Messages, } from '../actions/actionCreators';

import { disableBodyScroll, enableBodyScroll} from 'body-scroll-lock';
// const enableBodyScroll = bodyScrollLock.enableBodyScroll;

class ConnectedPopupDisplay extends React.Component<{ dialog: React.ReactNode, messages: IMessage[], additionalTranslators: IMessageTranslator[], closemessfun: VoidFunction, closedialogFun:VoidFunction},
    { messagesToDisplay: IMessageConverted[], messagesToExecute: IMessageConverted[] }> {
    private KnownMessages: IMessageTranslator[];
    private MessageMenager: MessageMenager;
    constructor(props: any) {
        super(props);
        this.KnownMessages = MessagesAll;
        this.KnownMessages.push(...this.props.additionalTranslators);
        // TODO
        this.MessageMenager = new MessageMenager(this.KnownMessages);
        const val = this.MessageMenager.SortMessages(this.props.messages);
        this.state = {
            messagesToDisplay: val.toShow,
            messagesToExecute: val.toExec,
        };
    }

    public render() {

        return (
            <div id="PopupDisplay" className={(this.state.messagesToDisplay.length === 0 && this.props.dialog === undefined) ? "popupClosed" : "popupVisible"} >
                <div className="dialogContainer">
                    {this.props.dialog}
                </div>
                <div className={(this.state.messagesToDisplay.length > 0) ? "popupContainer" :"popupClosed"}>
                    <ClickAwayListener onClickAway={this.props.closemessfun} >
                        <div>
                            {this.state.messagesToDisplay.map(e => this.MessageMenager.GeneratePopup(e, this.props.closemessfun))}
                        </div>
                    </ClickAwayListener>
                </div>
            </div>
        );
    }

    public componentDidUpdate(): void {
        this.state.messagesToExecute.forEach(e => { this.MessageMenager.ExecutePopup(e); });
    }

    public componentWillReceiveProps(nextProps: any): void {
        this.KnownMessages = MessagesAll;
        this.KnownMessages.push(...nextProps.additionalTranslators);
        // TODO
        this.MessageMenager = new MessageMenager(this.KnownMessages);

        const val = this.MessageMenager.SortMessages(nextProps.messages);
        this.setState({
            messagesToDisplay: val.toShow,
            messagesToExecute: val.toExec,
        });
        const targetElement = document.querySelector("#PopupDisplay");
        if (val.toShow.length > 0 || ((nextProps.dialog !== null) && (nextProps.dialog !== undefined))) {
            disableBodyScroll(targetElement, null);
        } else {
            enableBodyScroll(targetElement);
        }
    }
}
// ----------- connect to store

const mapStateToProps = (state: any) => {
    const pass = state as IAppStatus;
    return {
        additionalTranslators: pass.messagesTranslators,
        dialog: pass.dialog,
        messages: pass.messages,
    };
};
const mapDispatchToProps = (dispatch: any) => {
    return {
        closedialogFun: () => dispatch(Close_Dialog()),
        closemessfun: () => dispatch(Close_Messages()),
    };
};

const PopupDisplay = connect(mapStateToProps, mapDispatchToProps)(ConnectedPopupDisplay);

// ===============================

export default PopupDisplay;