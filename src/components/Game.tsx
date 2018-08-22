import * as React from 'react';
import { connect } from "react-redux";
import { Redirect } from 'react-router';
// import { Link, } from 'react-router-dom';

import './css/Game.css';

// import { IUser, IUserToken, } from './TYPES';

import { Grid } from '@material-ui/core';

import MainMenu from './gamecomponents/MainMenu';
import MainWindow from './gamecomponents/MainWindow';

import { End_Game } from './actions/actionCreators';
import { IAppStatus, IHero } from './TYPES';

import { ILocationResult } from './data/gameTYPES';


class ConnectedGame extends React.Component<{ character: IHero, location: ILocationResult, logFun: any,/* popmessfun: any,*/ }, { CurrentPosition: number, isEnd : boolean}> {
    constructor(props: any) {
        super(props);
        // inner functions biding - lambda disabled due to performance
        this.handleLogout = this.handleLogout.bind(this);
        this.handleChangePosition = this.handleChangePosition.bind(this);

        let isEnd = false;
        if (this.props.character === null || this.props.character === undefined) {
            isEnd = true;
        }
        this.state = {
            CurrentPosition: 0,
            isEnd,
        };
    }

    public render(): JSX.Element {
        if (this.state.isEnd) {
            return <Redirect to="/" />;
        }
        return (<div className="Game">
            <div className="GameContent">
                <div className="GameDisplay">
                    <Grid container={true} className="GameMax">
                        <Grid item={true} xs={11}>
                            <MainWindow character={this.props.character} CurrentPosition={this.state.CurrentPosition}/>
                        </Grid>
                        <Grid item={true} xs={1}>
                            <MainMenu changePosition={this.handleChangePosition} logFun={this.handleLogout}/>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>);
    }

    private handleLogout() {
        this.props.logFun();
        this.setState({ isEnd: true });
    }
    private handleChangePosition(id: number) {
        this.setState({ CurrentPosition: id });
    }
}

// -------------------------- connection with the store

const mapDispatchToProps = (dispatch: any) => {
    return {
        logFun: () => dispatch(End_Game()),
    };
};
const mapStateToProps = (state: any) => {
    const pass = state as IAppStatus;
    return { character: pass.activeHero };
};

const Game = connect(mapStateToProps, mapDispatchToProps)(ConnectedGame);

// -------------------------- interfaces used only in Login


// ========================================

export default Game;