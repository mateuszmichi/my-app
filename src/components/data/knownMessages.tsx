import { IMessage, IMessageTranslator, MessageType, } from '../MessageMenager';

import Cookies from 'universal-cookie';

// ------------------ images import
import * as newuserSrc from '../img/MainPage/add-user.png';
import * as disconnSrc from '../img/MainPage/disconnect.png';
import * as mailSrc from '../img/MainPage/mail.png';
import * as riskSrc from '../img/MainPage/risk-skull.png';

import * as warriorSrc from '../img/Account/warrioriconbig.png';

const cookies = new Cookies();

export const MessageLoginErr: IMessageTranslator =
{
    actions: [],
    images: [],
    ispopup: true,
    name: "loginErr",
    title: "Authentication failed",
    type: MessageType.ERROR,
};
export const MessageNameErr: IMessageTranslator =
{
    actions: [],
    images: [],
    ispopup: true,
    name: "nameErr",
    title: "Name duplicated",
    type: MessageType.ERROR,
};
export const MessageServerErr: IMessageTranslator =
{
    actions: [],
    images: [String(disconnSrc)],
    ispopup: true,
    name: "serverErr",
    title: "Unable to connect with server",
    type: MessageType.ERROR,
};
export const MessageSecurityErr: IMessageTranslator =
{
    actions: [(a: IMessage) => {
        window.location.replace("/");
        alert("Probably someone else has logged into this account.")
        cookies.remove('LoginCookie');
    }],
    images: [String(riskSrc)],
    ispopup: true,
    name: "securityErr",
    title: "Security warning",
    type: MessageType.ERROR,
};
export const MessageChangeEqErr: IMessageTranslator =
{
    actions: [],
    images: [],
    ispopup: true,
    name: "changeEqErr",
    title: "Failed to change equipment",
    type: MessageType.ERROR,
};
export const MessageCreateUserSucc: IMessageTranslator =
{
    actions: [],
    images: [String(newuserSrc)],
    ispopup: true,
    name: "createUserSucc",
    title: "Created new user!",
    type: MessageType.SUCCESS,
};
export const MessageCreateHeroSucc: IMessageTranslator =
{
    actions: [],
    images: [String(warriorSrc)],
    ispopup: true,
    name: "createHeroSucc",
    title: "Character has been created!",
    type: MessageType.SUCCESS,
};
export const MessageRemoveHeroSucc: IMessageTranslator =
{
    actions: [],
    images: [],
    ispopup: true,
    name: "removeHeroSucc",
    title: "Removed the character",
    type: MessageType.SUCCESS,
};
export const MessageTimeoutErr: IMessageTranslator =
{
    actions: [(a: IMessage) => {
        window.location.replace("/");
        cookies.remove("AutoCookie");
        alert("You have been loged out due to long inactiveness.")
    }],
    images: [String(disconnSrc)],
    ispopup: false,
    name: "timeoutErr",
    title: "Unable to connect with server",
    type: MessageType.ERROR,
};
export const MessageRemoveAccountSucc: IMessageTranslator =
{
    actions: [],
    images: [],
    ispopup: true,
    name: "removeAccountSucc",
    title: "Account has been removed",
    type: MessageType.SUCCESS,
};
export const MessageSentEmailSucc: IMessageTranslator =
{
    actions: [],
    images: [String(mailSrc)],
    ispopup: true,
    name: "sendEmailSucc",
    title: "Email has been sent",
    type: MessageType.SUCCESS,
};
export const MessageHpRestoreSucc: IMessageTranslator =
{
    actions: [],
    images: [],
    ispopup: true,
    name: "heroHpSucc",
    title: "No need to restore HP",
    type: MessageType.SUCCESS,
};
export const MessageHeroCustomiseSucc: IMessageTranslator =
{
    actions: [],
    images: [],
    ispopup: true,
    name: "customiseSucc",
    title: "Customization successfull",
    type: MessageType.SUCCESS,
};
export const MessageBackpackErr: IMessageTranslator =
{
    actions: [],
    images: [],
    ispopup: true,
    name: "backpackErr",
    title: "Backpack is full",
    type: MessageType.ERROR,
};
export const MessageNotImplementedErr: IMessageTranslator =
{
    actions: [],
    images: [],
    ispopup: true,
    name: "notImplementedErr",
    title: "Not implemented",
    type: MessageType.ERROR,
};

// ---------------- export groups

export const MessagesForLogin = [
    MessageLoginErr,
    MessageServerErr,
    MessageSecurityErr,
];

export const MessagesAll = [MessageLoginErr, MessageNameErr, MessageServerErr,
    MessageSecurityErr, MessageChangeEqErr, MessageCreateUserSucc, MessageCreateHeroSucc, MessageRemoveHeroSucc,
    MessageTimeoutErr, MessageRemoveAccountSucc, MessageSentEmailSucc, MessageHpRestoreSucc, MessageHeroCustomiseSucc,
    MessageBackpackErr, MessageNotImplementedErr];
