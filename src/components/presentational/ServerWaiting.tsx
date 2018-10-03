import * as React from 'react';
import { connect } from "react-redux";

import '../css/ServerWaiting.css';

import IAppStatus from '../TYPES';

// -------------------- images
import * as cogImg from '../img/MainPage/cog.svg';

class ConnectedServerWaiting extends React.Component<{ isWaiting: boolean }, { opacity: number, bussyWaiting: boolean }> {
    private TimeOutFun: number;
    constructor(props: any) {
        super(props);

        this.setBussyWaiting = this.setBussyWaiting.bind(this);

        this.state = {
            bussyWaiting: false,
            opacity: (this.props.isWaiting) ? 1 : 0,
        };

        this.TimeOutFun = window.setTimeout(this.setBussyWaiting, 5000);
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
                    {this.state.bussyWaiting && <p>Server is restarting, it will take about 30 sec</p>}
                </div>
            </div>
        );
    }
    public componentWillReceiveProps(nextprops: any) {
        this.setState({ opacity: (nextprops.isWaiting) ? 1 : 0, bussyWaiting: false });
        window.clearTimeout(this.TimeOutFun);
        if (nextprops.isWaiting) {
            this.TimeOutFun = window.setTimeout(this.setBussyWaiting,5000);
        }
    }
    private setBussyWaiting() {
        if (this.props.isWaiting) {
            this.setState({ bussyWaiting: true });
        }
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