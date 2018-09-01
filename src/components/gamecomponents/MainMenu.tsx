import * as React from 'react';

import '../css/gamecomponents/MainMenu.css';

import { Divider } from '@material-ui/core';
// ------------- images

import backpackSrc from '../img/Game/Menu/backpack.svg';
import mapSrc from '../img/Game/Menu/map.svg';
import questSrc from '../img/Game/Menu/quest.svg';
import skillsSrc from '../img/Game/Menu/skills.svg';

import ExitToAppIcon from '@material-ui/icons/ExitToApp';


const buttons: IMenuButton[] = [
    {
        description: "Travel",
        image: String(mapSrc),
    },
    {
        description: "Equipment",
        image: String(backpackSrc),
    },
    {
        description: "Skills",
        image: String(skillsSrc),
    },
    {
        description: "Quests",
        image: String(questSrc),
    }
];

class MainMenu extends React.Component<{CurrentPosition: number, changePosition: (i: number) => void, logFun: VoidFunction }, {}> {
    private buttons = buttons;
    constructor(props: any) {
        super(props);
        this.renderButton = this.renderButton.bind(this);
    }
    public render() {
        return (
            <div className="MainMenu">
                <div className="MainButtons">
                    {this.buttons.map((e, nr) => this.renderButton(e, nr))}
                </div>
                <div className="ExitButtons">
                    <Divider />
                    <div className="MainMenuButton" onClick={this.props.logFun}>
                        <ExitToAppIcon />
                        <span>Logout</span>
                    </div>
                </div>
            </div>
        );
    }
    private renderButton(button: IMenuButton, key: number): JSX.Element {
        const onclickFun = () => {
            this.props.changePosition(key);
        }
        return (<div key={key} onClick={onclickFun}>
            <div className={(this.props.CurrentPosition === key) ? "MainMenuButton MainMenuActive" :"MainMenuButton" }>
                <img src={button.image} />
                <span>{button.description}</span>
            </div>
            {(key + 1 < this.buttons.length) && (<Divider />)}
        </div>);
    }
}

interface IMenuButton {
    description: string;
    image: string;
}

export default MainMenu;
