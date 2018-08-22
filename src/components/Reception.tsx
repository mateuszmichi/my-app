import * as React from 'react';
import { connect } from "react-redux";

import Account from './Account';
import Login from './Login';

import { IAppStatus, } from './TYPES';

class ConnectedReception extends React.Component<{isLogged : boolean}, {}> {
    constructor(props: any) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <div className="insideContent">
                {(!this.props.isLogged) ? <Login /> : <Account />}
            </div>
        );
    }
}

// -------------- connect to the store
const mapStateToProps = (state:any) => {
    const pass = state as IAppStatus;
    return { isLogged: pass.isLoged };
};

const Reception = connect(mapStateToProps, null)(ConnectedReception);


// ========================================

export default Reception;