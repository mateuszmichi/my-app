import * as React from 'react';

import '../css/gamecomponents/MainWindow.css';

import LowerBar from './LowerBar';

import { IHero, IPassedGameData, } from '../TYPES';

import { Equipment } from './Equipment';
import { GameComponent } from './GameComponent';
import { Quests } from './Quests';
import { Skills } from './Skills';

import { IMessage } from '../MessageMenager';

import { IConnectionData, ServerConnect } from '../data/connectionConf';

import { IHeroUpdates } from '../Game';

import Invitational from './presentational/Invitational';





// ------------- images

// import backpackSrc from '../img/Game/Menu/backpack.png';

class MainWindow extends React.Component<{ CurrentPosition: number, character: IHero, ConnData: IConnectionData, HeroUpdates: IHeroUpdates, logFun: VoidFunction }, { height: number, width: number }> {
    private CallbackFun: any;
    private onResizeFun: VoidFunction;
    constructor(props: any) {
        super(props);
        // ------------ bindings
        this.closeInvitational = this.closeInvitational.bind(this);

        this.CallbackFun = (element: any) => {
            if (element === null) {
                return;
            }
            const poss = element.getBoundingClientRect() as DOMRect;
            this.setState({ height: poss.height, width: poss.width, });
        }
        this.onResizeFun = () => {
            const element = document.getElementById("GameDisplayArea");
            if (element === null) {
                throw Error("Problem with names");
            }
            this.CallbackFun(element);
        }
        this.state = {
            height: 0,
            width: 0,
        }
    }
    public componentDidMount() {
        window.addEventListener("resize", this.onResizeFun);
        if (this.props.character.isInvitational) {
            this.props.ConnData.popDialog(<Invitational applyFunction={this.closeInvitational} />);
        }
    }
    public componentWillUnmount() {
        window.removeEventListener("resize", this.onResizeFun);
    }

    public render() {
        return (
            <div className="MainWindow">
                <div className="GameElement">
                    <div className="GameDisplayComponent" ref={this.CallbackFun} id="GameDisplayArea">
                        <GameComponent visible={0 === this.props.CurrentPosition} height={this.state.height} width={this.state.width} ConnData={this.props.ConnData} HeroUpdates={this.props.HeroUpdates} hero={this.props.character} />
                        <Equipment visible={1 === this.props.CurrentPosition} hero={this.props.character} ConnData={this.props.ConnData} />
                        <Skills visible={2 === this.props.CurrentPosition} hero={this.props.character} ConnData={this.props.ConnData} />
                        <Quests visible={3 === this.props.CurrentPosition} hero={this.props.character} ConnData={this.props.ConnData} />
                    </div>
                </div>
                <LowerBar character={this.props.character} />
            </div>
        );
    }

    private closeInvitational(fast: boolean, level: boolean, equipment: boolean) {
        // confun
        const passed: IPassedGameData<boolean[]> = {
            ActionToken: this.props.ConnData.actionToken,
            Data: [fast, level, equipment],
            UserToken: this.props.ConnData.userToken,
        };
        const succFun = (res: any) => {
            // this.props.ConnData.closeDialog();
            this.props.ConnData.popMessage([{ title: "customiseSucc", description: "Character has been successfully updated to requirements.", } as IMessage], []);
            // this.props.logFun();
            if (fast || level || equipment) {
                this.props.ConnData.closeDialog();
                this.props.logFun();
            }
        };
        const failFun = (error: any) => {
            if (error.response === undefined) {
                this.props.ConnData.popMessage([{ title: "serverErr", description: "I've got bad feelings about this...", } as IMessage], []);
            } else {
                this.props.ConnData.popMessage([{ title: error.response.data.type, description: error.response.data.description } as IMessage], []);
            }
        };
        ServerConnect(`/api/Invitational`, passed, succFun, failFun, this.props.ConnData.popWaiting, this.props.ConnData.closeWaiting);
    }

}


export default MainWindow;
