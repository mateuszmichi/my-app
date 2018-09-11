import axios from 'axios';
// export const localhost = 'https://shatteredplains.azurewebsites.net';
// export const localhost = 'http://shatteredplains-001-site1.btempurl.com';
 export const localhost = `http://localhost:5000`;

import { IActionToken, IUserToken } from '../TYPES';

export function ServerConnect(apiName: string, passedData: any, successFun: (res: any) => void, failFun: (error: any) => void, popWaiting: () => void, closeWaiting: VoidFunction, isPopup = true) {
    const PopTimeout = 200;
    let timer: NodeJS.Timer | null = null;
    if (isPopup) {
        // TODO NODE
        timer = setTimeout(() => { popWaiting() }, PopTimeout);
    }
    axios.post(localhost + apiName, passedData)
        .then(res => {
            if (isPopup) {
                if (timer !== null) {
                    clearTimeout(timer);
                }
            }
            closeWaiting();
            successFun(res);
        })
        .catch(error => {
            if (isPopup) {
                if (timer !== null) {
                    clearTimeout(timer);
                }
            }
            closeWaiting();
            failFun(error);
        });
}

export interface IConnectionFunctions {
    popDialog: any;
    closeDialog: any;
    popMessage: any;
    closeMessage: any;
    popWaiting: any;
    closeWaiting: any;
}
export interface IConnectionData extends IConnectionFunctions {
    actionToken: IActionToken;
    userToken: IUserToken;
}