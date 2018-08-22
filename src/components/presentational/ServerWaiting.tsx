import * as React from 'react';
import { connect } from "react-redux";

import '../css/ServerWaiting.css';

import IAppStatus from '../TYPES';

// -------------------- images
import * as cogImg from '../img/MainPage/cog.svg';

class ConnectedServerWaiting extends React.Component<{ isWaiting: boolean }, {opacity: number}> {
    constructor(props: any) {
        super(props);
        this.state = {
            opacity: (this.props.isWaiting) ? 1 : 0,
        };
    }
    public render() {
        const style = {
            opacity: this.state.opacity,
        }
        return (
            <div className={(this.props.isWaiting) ? "serverWaiting serverWaitingVisible" : "serverWaiting"} style={style}>
                <div>
                    <img src={String(cogImg)} />
                    <p>Waiting for server</p>
                </div>
            </div>
        );
    }
    public componentWillReceiveProps(nextprops:any) {
        this.setState({ opacity: (nextprops.isWaiting) ? 1 : 0 });
    }
}
// ----------- connect to store

const mapStateToProps = (state: any) => {
    const pass = state as IAppStatus;
    return {
        isWaiting: pass.isWaiting,
    };
};

const ServerWaiting = connect(mapStateToProps, null)(ConnectedServerWaiting);

// ===============================

export default ServerWaiting;