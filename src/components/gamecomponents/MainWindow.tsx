import * as React from 'react';

import '../css/gamecomponents/MainWindow.css';

import LowerBar from './LowerBar';

import { IHero, } from '../TYPES';

import { Equipment } from './Equipment';
import { GameComponent } from './GameComponent';

import { IConnectionData } from '../data/connectionConf';



// ------------- images

// import backpackSrc from '../img/Game/Menu/backpack.png';

class MainWindow extends React.Component<{ CurrentPosition: number, character: IHero, ConnData: IConnectionData  }, {height: number, width:number}> {
    private CallbackFun: any;
    private onResizeFun: VoidFunction;
    constructor(props: any) {
        super(props);
        this.CallbackFun = (element: any) => {
            if (element === null) {
                return;
            }
            const poss = element.getBoundingClientRect() as DOMRect;
            this.setState({ height: poss.height, width: poss.width,  });
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
    }
    public componentWillUnmount() {
        window.removeEventListener("resize", this.onResizeFun);
    }

    public render() {
        return (
            <div className="MainWindow">
                <div className="GameElement">
                    <div className="GameDisplayComponent" ref={this.CallbackFun} id="GameDisplayArea">
                        <GameComponent visible={0 === this.props.CurrentPosition} height={this.state.height} width={this.state.width} ConnData={this.props.ConnData} hero={this.props.character}/>
                        <Equipment visible={1 === this.props.CurrentPosition} hero={this.props.character} ConnData={this.props.ConnData}/>
                    </div>
                </div>
                <LowerBar character={this.props.character} />
            </div>
        );
    }


}


export default MainWindow;
