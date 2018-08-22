import { ADD_HERO, CLOSE_DIALOG, CLOSE_MESSAGE, END_GAME, END_WAITING, LOAD_LOCATION, LOG_IN, LOG_OUT, POP_DIALOG, POP_MESSAGE, REMOVE_HERO, START_GAME, START_WAITING,  } from '../actions/actionTypes';

import { IAction, IAppStatus, ICharacterBrief, ILoadHeroData, ILoginData,   } from '../TYPES';


const initialState: IAppStatus = {
    actionToken: null,
    activeHero: null,
    dialog: undefined,
    heroLocation: null,
    isLoged: false,
    isWaiting: false,
    messages: [],
    messagesTranslators: [],
    user: null,
    userToken: null,
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

        case LOAD_LOCATION:
            return Object.assign({}, state, { heroLocation: pass.payload });

        case START_WAITING:
            return Object.assign({}, state, { isWaiting: true });
        case END_WAITING:
            return Object.assign({}, state, { isWaiting: false });

        default: return state;
    }
}


// ======================================

export default shatteredApp;