import * as React from 'react';

import '../css/gamecomponents/LowerBar.css';

import { IHero, Orders } from '../TYPES';

import { ExpToLevel } from '../data/gameCALC';

// ------------- images

class LowerBar extends React.Component<{ character: IHero }, {}> {
    constructor(props: any) {
        super(props);
    }
    public render() {
        return (
            <div className="LowerBar">
                <div className="StatusData">
                    <div className="StatusDescription">
                        <div className="overflowtext">
                            <b>{this.props.character.name} {this.props.character.nickname}</b>
                        </div>
                        <div className="overflowtext orders">
                            <i>{(this.props.character.orders !== Orders.none) && Orders[this.props.character.orders]}</i>
                        </div>
                        <LevelBar lvl={this.props.character.level} exp={this.props.character.exp} />
                    </div>
                </div>
                <StatusBars HP={this.props.character.hp} HPmax={this.props.character.hpmax} isHP={true} />

                <StatusBars HP={this.props.character.sl} HPmax={this.props.character.slmax} isHP={false} />

            </div>
        );
    }
}
class StatusBars extends React.Component<{ HP: number, HPmax: number, isHP: boolean }, { isHover: boolean }> {
    constructor(props: any) {
        super(props);

        this.handleHover = this.handleHover.bind(this);
        this.handleOut = this.handleOut.bind(this);

        this.state = {
            isHover: false,
        }
    }
    public render() {
        if (this.props.HPmax === 0) {
            return (<div className={(this.props.isHP) ? "StatusBars HPBGR DisabledBar" : "StatusBars SLBGR DisabledBar"} />);
        }
        const style = {
            height: 100 - this.props.HP / this.props.HPmax * 100 + "%",
        }
        return (
            <div className={(this.props.isHP) ? "StatusBars HPBGR" : "StatusBars SLBGR"} onMouseOver={this.handleHover} onMouseOut={this.handleOut}>
                <div className={(this.props.isHP) ? "HPBar" : "SLBar"} style={style} />
                <div className="Info">
                    <div className="InnerDiv">
                        {(this.state.isHover) ? String(this.props.HP) + "/" + String(this.props.HPmax) : String(Math.floor(this.props.HP / this.props.HPmax * 100)) + "%"}
                    </div>
                </div>
            </div>)
    }
    private handleHover() {
        this.setState({ isHover: true });
    }
    private handleOut() {
        this.setState({ isHover: false });
    }
}
class LevelBar extends React.Component<{ lvl: number, exp: number }, { isHover: boolean }> {
    constructor(props: any) {
        super(props);

        this.handleHover = this.handleHover.bind(this);
        this.handleOut = this.handleOut.bind(this);

        this.state = {
            isHover: false,
        }
    }
    public render() {
        const upexp = ExpToLevel(this.props.lvl + 1) - ExpToLevel(this.props.lvl);
        const restexp = ExpToLevel(this.props.lvl + 1) - this.props.exp;
        const style = {
            width: 100 - restexp / upexp * 100 + "%",
        }
        return (
            <div className="ExpBar">
                <div className="ExpLevel">
                    {this.props.lvl}
                </div>
                <div className="ExpProgress" onMouseOver={this.handleHover} onMouseOut={this.handleOut}>
                    <div className="ExpCurrent" style={style} />
                    <div className="Info" >
                        {(!this.state.isHover) ? String(Math.floor(100 - restexp / upexp * 100)) + "%" : String(this.props.exp - ExpToLevel(this.props.lvl)) + "/" + String(upexp)}
                    </div>
                </div>
                <div className="ExpLevel">
                    {this.props.lvl + 1}
                </div>
            </div>)
    }
    private handleHover() {
        this.setState({ isHover: true });
    }
    private handleOut() {
        this.setState({ isHover: false });
    }
}

export default LowerBar;
