import { IAction, IActionToken, ICharacterBrief, IHero, ILoadHeroData,  ILoginData, IUser, IUserToken,    } from '../TYPES';
import { ADD_HERO, CLOSE_DIALOG, CLOSE_MESSAGE, END_GAME, END_WAITING, LOAD_LOCATION, LOG_IN, LOG_OUT, POP_DIALOG, POP_MESSAGE, REMOVE_HERO, START_GAME, START_WAITING,   } from './actionTypes';

import { IMessage, IMessageTranslator } from '../MessageMenager';

import { ILocationResult } from '../data/gameTYPES';

export function Log_In(loadedUser:IUser, receivedToken:IUserToken) :IAction {
    return {
        payload: {
            user: loadedUser,
            userToken: receivedToken,
        }as ILoginData,
        type: LOG_IN,
    }
}
export function Log_Out() :IAction {
    return {
        payload: null,
        type: LOG_OUT,
    }
}
export function Pop_Messages(messages: IMessage[], translators: IMessageTranslator[]): IAction{
    return {
        payload: {
            messages,
            translators,
        },
        type: POP_MESSAGE,
    }
}
export function Close_Messages(): IAction {
    return {
        payload: null,
        type: CLOSE_MESSAGE,
    }
}
export function Pop_Dialog(element: React.ReactNode): IAction {
    return {
        payload: element,
        type: POP_DIALOG,
    }
}
export function Close_Dialog(): IAction {
    return {
        payload: null,
        type: CLOSE_DIALOG,
    }
}
export function Add_Hero(data: ICharacterBrief): IAction {
    return {
        payload: data,
        type: ADD_HERO,
    }
}
export function Remove_Hero(data: string): IAction {
    return {
        payload: data,
        type: REMOVE_HERO,
    }
}
export function Start_Game(hero: IHero,actionToken: IActionToken): IAction {
    return {
        payload: {
            actionToken,
            hero,
        } as ILoadHeroData,
        type: START_GAME,
    }
}
export function End_Game(): IAction {
    return {
        payload: null,
        type: END_GAME,
    }
}
export function Load_Location(location: ILocationResult): IAction {
    return {
        payload: location,
        type: LOAD_LOCATION,
    }
}

export function Start_Waiting(): IAction {
    return {
        payload: null,
        type: START_WAITING,
    }
}
export function End_Waiting(): IAction {
    return {
        payload: null,
        type: END_WAITING,
    }
}