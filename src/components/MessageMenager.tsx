import * as React from 'react';

import { ErrorPopup, SuccessPopup } from './presentational/Popups';

export class MessageMenager {
    private KnownMessages: IMessageTranslator[];

    constructor(KnownMessages: IMessageTranslator[]) {
        this.KnownMessages = KnownMessages;
    }

    public GeneratePopup(mess: IMessageConverted, closefun: VoidFunction, index: number): JSX.Element[] {
        switch (mess.translator.type) {
            case MessageType.ERROR:
                return [<ErrorPopup key={index} index={index} clearFun={closefun} description={mess.message.description} title={mess.translator.title} imgs={mess.translator.images} />];
            case MessageType.SUCCESS:
                return [<SuccessPopup key={index} index={index} clearFun={closefun} description={mess.message.description} title={mess.translator.title} imgs={mess.translator.images} />];
            default:
                return [];
        }
    }

    public ExecutePopup(mess: IMessageConverted): void {
        mess.translator.actions.forEach(e => {
            e(mess.message);
        });
    }
    public SortMessages(messages: IMessage[]): { toShow: IMessageConverted[], toExec: IMessageConverted[]} {
        const show: IMessageConverted[] = [];
        const exec: IMessageConverted[] = [];
        messages.forEach(e => {
            const got: IMessageConverted = this.ModifyMessageToKnown(e);
            if (got.translator.ispopup) {
                show.push(got);
            }
            if (got.translator.actions.length > 0) {
                exec.push(got);
            }
        });
        return { toShow: show, toExec: exec };
    }
    private ModifyMessageToKnown(message: IMessage): IMessageConverted {
        let known = this.KnownMessages.find((e) => e.name === message.title);
        if (known === undefined) {
            known = {
                actions: [],
                images: [],
                ispopup: true,
                name: message.title,
                title: "Unknown error",
                type: MessageType.ERROR,
            } as IMessageTranslator;
        }
        // JSON.stringify({ message, translator: known });
        return { message , translator: known} as IMessageConverted;
    }
    
}

export interface IMessage {
    title: string;
    description: string;
}
export interface IMessageTranslator {
    name: string;
    title: string;
    type: MessageType;
    ispopup: boolean;
    images: string[];
    actions: Array<updateFunction<IMessage>>;
}
export interface IMessageConverted {
    message: IMessage;
    translator: IMessageTranslator;
}
export type updateFunction<R> = (a1: R) => void;
export enum MessageType {
    ERROR,
    SUCCESS,
    WARNING
}

// ========================================
export default MessageMenager;