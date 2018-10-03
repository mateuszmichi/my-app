import * as React from 'react';

import styled from 'styled-components';

import * as logoSrc from '../img/MainPage/logo.png';

import {
    Link,
} from 'react-router-dom';

import MenuIcon from '@material-ui/icons/Menu';

import { ListItemIcon, ListItemText, MenuItem, MenuList } from '@material-ui/core';

import { ILinkElement } from './MobileWebsite';



class MobileMenu extends React.Component<{ expandMenu: VoidFunction }, {}> {
    public render() {
        return (
            <div id="topMenu">
                <div className="menuContent">
                    <div className="itemContainer linkContainer">
                        <div className="menuButton" onClick={this.props.expandMenu}>
                            <div className="inlineDiv">
                                <MenuIcon />
                            </div>
                        </div>
                    </div>
                    <div className="itemContainer logoContainer"><div><img src={String(logoSrc)} className="logo" /></div></div>
                </div>
            </div>
        );
    }
}

const MenuListBGR = styled.div<{isActive: boolean}>`
visibility: ${(props) => props.isActive ? `visible`:`hidden`};
position:absolute;
background-color:rgba(150,150,150,0.1);
width:100%;
min-height:100%;
top:0;
left:0;
`;
const MenuListDiv = styled.div<{ isActive: boolean }>`
color:snow;
position:absolute;
background-color:rgba(113, 113, 113, 1.0);
margin-top:54px;
transition: transform 300ms ease-in-out;
transform: ${(props) => props.isActive ? `none` : `translateX(-50%)`};
`;

export class MobileMenuList extends React.Component<{ visible: boolean, LinkList: ILinkElement[], selectedItem: number, clickAway: VoidFunction }, {}> {
    constructor(props: any) {
        super(props);

        this.handleClickAway = this.handleClickAway.bind(this);

    }
    public componentDidMount() {
        window.setTimeout(() => { this.setState({ isLoaded: true });}, 10);
    }
    public render() {
        return (
            <MenuListBGR isActive={this.props.visible} onClick={this.handleClickAway}>
                    <MenuListDiv isActive={this.props.visible}>
                        <MenuList>
                            {
                            this.props.LinkList.map((link, index) =>
                                <Link key={index} to={link.path} style={{ textDecoration: "none" }} onClick={this.handleClickAway}>
                                    <MenuItem 
                                        button={true}
                                        selected={index === this.props.selectedItem}
                                        >
                                            <ListItemIcon style={{ color: "snow" }}>
                                                {link.icon}
                                            </ListItemIcon>
                                            <ListItemText disableTypography={true} primary={link.description} style={{ color: "snow" }} />
                                        </MenuItem>
                                    </Link>
                                )
                            }
                        </MenuList>
                    </MenuListDiv>
            </MenuListBGR>
        );
    }
    private handleClickAway(event: any) {
        if (this.props.visible) {
            event.stopPropagation();
            this.props.clickAway();
        }
    }
}

export default MobileMenu;