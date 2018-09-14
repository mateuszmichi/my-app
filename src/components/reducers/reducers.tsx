import { ADD_HERO, CLOSE_DIALOG, CLOSE_MESSAGE, END_GAME, END_WAITING, LOG_IN, LOG_OUT, POP_DIALOG, POP_MESSAGE, REMOVE_HERO, START_GAME, START_WAITING, UPDATE_EQUIPMENT, UPDATE_HERO_HP } from '../actions/actionTypes';

import { IAction, IAppStatus, ICharacterBrief, ILoadHeroData, ILoginData } from '../TYPES';

import { IEquipmentModifyResult } from '../data/gameTYPES';


const initialState: IAppStatus = {
    actionToken: null,
    activeHero: null,
    dialog: undefined,
    isLoged:false,
    isWaiting: false,
    messages: [],
    messagesTranslators: [],
    user:null,
    userToken:null,
}

function shatteredApp(state = initialState, action: any) {
    const pass = action as IAction;
    switch (pass.type) {
        case LOG_IN:
            const data = pass.payload as ILoginData;
            return Object.assign({}, state, { isLoged: true, user: data.user, userToken: data.userToken });
        case LOG_OUT:
            return Object.assign({}, state, { isLoged: false, user:null, userToken:null });

        case POP_MESSAGE:
            return Object.assign({}, state, { messages: pass.payload.messages, messagesTranslators: pass.payload.translators });
        case CLOSE_MESSAGE:
            return Object.assign({}, state, { messages: [], messagesTranslators: [] });

        case POP_DIALOG:
            return Object.assign({}, state, { dialog: pass.payload });
        case CLOSE_DIALOG:
            return Object.assign({}, state, { dialog: undefined });

        case ADD_HERO:
            const curr = Object.assign({}, state.user);
            if (curr === null) {
                return state;
            }
            const data2 = pass.payload as ICharacterBrief;
            curr.characters = [...curr.characters, data2];
            // alert(curr);
            return Object.assign({}, state, { user: curr });
        case REMOVE_HERO:
            const curr2 = Object.assign({}, state.user);
            if (curr2 === null) {
                return state;
            }
            const data3 = pass.payload as string;
            curr2.characters = curr2.characters.filter(e => e.name !== data3);
            return Object.assign({}, state, { user: curr2 });

        case START_GAME:
            const data4 = pass.payload as ILoadHeroData;
            return Object.assign({}, state, { activeHero: data4.hero, actionToken:data4.actionToken});
        case END_GAME:
            return Object.assign({}, state, { activeHero: null, actionToken:null });

        case START_WAITING:
            return Object.assign({}, state, { isWaiting: true });
        case END_WAITING:
            return Object.assign({}, state, { isWaiting: false });

        case UPDATE_EQUIPMENT:
            const data5 = pass.payload as IEquipmentModifyResult;
            if (state.activeHero === null) {
                return state;
            }
            const eqCopy = Object.assign({}, state.activeHero.equipment);
            data5.removed.forEach(e => {
                if (e.target.startsWith("Backpack")) {
                    const nub = parseInt(e.target.substring(8),10);
                    eqCopy.backpack[nub] = null;
                }
                if (e.target.startsWith("Inventory")) {
                    const nub = parseInt(e.target.substring(9),10);
                    switch (nub) {
                        case 0:
                            eqCopy.helmet = null;
                            break;
                        case 1:
                            eqCopy.ring1 = null;
                            break;
                        case 2:
                            eqCopy.neckles = null;
                            break;
                        case 3:
                            eqCopy.ring2 = null;
                            break;
                        case 4:
                            eqCopy.gloves = null;
                            break;
                        case 5:
                            eqCopy.armour = null;
                            break;
                        case 6:
                            eqCopy.bracelet = null;
                            break;
                        case 7:
                            eqCopy.firstHand = null;
                            break;
                        case 8:
                            eqCopy.trousers = null;
                            break;
                        case 9:
                            eqCopy.secondHand = null;
                            break;
                        case 10:
                            eqCopy.shoes = null;
                            break;
                    }
                }
            });
            data5.added.forEach(e => {
                if (e.target.startsWith("Backpack")) {
                    const nub = parseInt(e.target.substring(8),10);
                    eqCopy.backpack[nub] = e.itemID;
                }
                if (e.target.startsWith("Inventory")) {
                    const nub = parseInt(e.target.substring(9),10);
                    switch (nub) {
                        case 0:
                            eqCopy.helmet = e.itemID;
                            break;
                        case 1:
                            eqCopy.ring1 = e.itemID;
                            break;
                        case 2:
                            eqCopy.neckles = e.itemID;
                            break;
                        case 3:
                            eqCopy.ring2 = e.itemID;
                            break;
                        case 4:
                            eqCopy.gloves = e.itemID;
                            break;
                        case 5:
                            eqCopy.armour = e.itemID;
                            break;
                        case 6:
                            eqCopy.bracelet = e.itemID;
                            break;
                        case 7:
                            eqCopy.firstHand = e.itemID;
                            break;
                        case 8:
                            eqCopy.trousers = e.itemID;
                            break;
                        case 9:
                            eqCopy.secondHand = e.itemID;
                            break;
                        case 10:
                            eqCopy.shoes = e.itemID;
                            break;
                    }
                }
            });
            let heroCopy = Object.assign({}, state.activeHero);
            heroCopy = Object.assign(heroCopy, { equipment: eqCopy });
            return Object.assign({}, state, { activeHero: heroCopy });

        case UPDATE_HERO_HP:
            if (state.activeHero === null) {
                return state;
            }
            let heroCopy2 = Object.assign({}, state.activeHero);
            heroCopy2 = Object.assign(heroCopy2, { hp: pass.payload as number });
            return Object.assign({}, state, { activeHero: heroCopy2 });

        default: return state;
    }
}


// ======================================

export default shatteredApp;