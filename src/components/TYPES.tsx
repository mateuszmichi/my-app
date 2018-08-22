import { IMessage, IMessageTranslator } from './MessageMenager';

import { ILocationResult } from './data/gameTYPES';

// -------------------- APP status
export interface IAppStatus {
    isWaiting: boolean;
    isLoged: boolean;
    user: IUser | null;
    userToken: IUserToken | null;
    messages: IMessage[];
    messagesTranslators: IMessageTranslator[];
    dialog: React.ReactNode;
    activeHero: IHero | null;
    heroLocation: ILocationResult | null;
    actionToken: IActionToken | null;
}

// -------------------- Commonly used interfaces

export interface IUser {
    username: string;
    characters: ICharacterBrief[];
}
export interface IUserToken {
    username: string;
    token: string;
}
export interface IActionToken {
    heroID: number;
    token: string;
}
export interface IAction {
    type: string;
    payload: any;
}
export interface ICharacterBrief {
    name: string;
    nickname: string;
    level: number;
    orders: Orders;
}
export interface IHero extends ICharacterBrief {
    attributes: number[];
    hp: number;
    hpmax: number;
    sl: number;
    slmax: number;
    exp: number;
}

export enum Orders {
    none,
    Windrunners,
    Skybreakers,
    Dustbringers,
    Edgedancers,
    Truthwatchers,
    Lightweavers,
    Elsecallers,
    Willshapers,
    Stonewards,
    Bondsmiths,
}

export interface IPassedData<T> {
    UserToken: IUserToken;
    Data: T;
}
export interface IPassedGameData<T> extends IPassedData<T>{
    ActionToken: IActionToken;
}

// ------------------ interfaces passed by payload

export interface ILoginData {
    user: IUser,
    userToken: IUserToken,
}
export interface ILoadHeroData {
    hero: IHero,
    actionToken: IActionToken;
}

// ------------------

export default IAppStatus;