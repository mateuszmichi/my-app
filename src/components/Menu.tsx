import * as React from 'react';

import './css/Menu.css'

import * as logoSrc from './img/MainPage/logo.png';

import AccountBalance from '@material-ui/icons/AccountBalance';
import Book from '@material-ui/icons/Book';
import Gamepad from '@material-ui/icons/Gamepad';
import HomeIcon from '@material-ui/icons/Home';

import {
    Link,
} from 'react-router-dom';

class TopMenu extends React.Component {
    public render() {
        return (
            <div id="topMenu">
                <div className="menuContent">
                    <div className="itemContainer logoContainer"><div><img src={String(logoSrc)} className="logo" /></div></div>
                    <div className="itemContainer linkContainer"><Link className="menuLink" to="/">
                        <div className="menuButton">
                            <div className="inlineDiv">
                                <HomeIcon className="svgInMenu" />
                            </div>
                            <div className="inlineDiv">
                                <span>HOME</span>
                            </div>
                        </div>
                    </Link></div>
                    <div className="itemContainer linkContainer"><Link className="menuLink" to="/project">
                        <div className="menuButton">
                            <div className="inlineDiv">
                                <AccountBalance className="svgInMenu" />
                            </div>
                            <div className="inlineDiv">
                                <span>ABOUT THE PROJECT</span>
                            </div>
                        </div>
                    </Link></div>
                    <div className="itemContainer linkContainer"><Link className="menuLink" to="/developed">
                        <div className="menuButton">
                            <div className="inlineDiv">
                                <Gamepad className="svgInMenu" />
                            </div>
                            <div className="inlineDiv">
                                <span>FEATURES</span>
                            </div>
                        </div>
                    </Link></div>
                    <div className="itemContainer linkContainer"><Link className="menuLink" to="/roshar">
                        <div className="menuButton">
                            <div className="inlineDiv">
                                <Book className="svgInMenu" />
                            </div>
                            <div className="inlineDiv">
                                <span>CONCEPT OF ROSHAR</span>
                            </div>
                        </div>
                    </Link></div>
                </div>
            </div>
        );
    }
}

export default TopMenu;