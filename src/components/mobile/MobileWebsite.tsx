import * as React from 'react';

import {
    Route,
} from 'react-router-dom';

import Contact from '../presentational/Contact';
import Credits from '../presentational/Credits';
import Features from '../presentational/Features';
import Project from '../presentational/Project';
import Projects from '../presentational/Projects';
import Roshar from '../presentational/Roshar';
import Technologies from '../presentational/Technologies';

import MobileMenu, { MobileMenuList } from './MobileMenu';

import Reception from '../Reception';
import Registry from '../Registry';

import AccountBalance from '@material-ui/icons/AccountBalance';
import Android from '@material-ui/icons/Android';
import Book from '@material-ui/icons/Book';
import Code from '@material-ui/icons/Code';
import FavoriteOutlined from '@material-ui/icons/FavoriteOutlined';
import Gamepad from '@material-ui/icons/Gamepad';
import HomeIcon from '@material-ui/icons/Home';
import MailOutlined from '@material-ui/icons/MailOutlined';
import PersonAdd from '@material-ui/icons/PersonAdd';

const LinkList: ILinkElement[] = [
    {
        description: "Home",
        exact: false,
        icon: <HomeIcon />,
        path: "/",
    } as ILinkElement,
    {
        description: "Register",
        exact: true,
        icon: <PersonAdd />,
        path: "/registration",
    } as ILinkElement,
    {
        description: "About the project",
        exact: true,
        icon: <AccountBalance />,
        path: "/aboutproject",
    } as ILinkElement,
    {
        description: "Features",
        exact: true,
        icon: <Gamepad />,
        path: "/developed",
    } as ILinkElement,
    {
        description: "Concept of Roshar",
        exact: false,
        icon: <Book />,
        path: "/roshar",
    } as ILinkElement,
    {
        description: "My projects",
        exact: true,
        icon: <Code />,
        path: "/myprojects",
    } as ILinkElement,
    {
        description: "Technologies",
        exact: true,
        icon: <Android />,
        path: "/technology",
    } as ILinkElement,
    {
        description: "Credits",
        exact: true,
        icon: <FavoriteOutlined />,
        path: "/credits",
    } as ILinkElement,
    {
        description: "Contact",
        exact: true,
        icon: <MailOutlined />,
        path: "/contact",
    } as ILinkElement,
];


class MobileWebsite extends React.Component<{}, { isMenuVisible: boolean }> {
    constructor(props: any) {
        super(props);

        this.GenMenuComponent = this.GenMenuComponent.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClickAway = this.handleClickAway.bind(this);

        this.state = {
            isMenuVisible: false,
        }
    }

    public render() {
        return (
            <div id="content"><MobileMenu expandMenu={this.handleClick} />
                <div id="inside">
                    <Route exact={true} path="/" component={Reception} />
                    <Route exact={false} path="/account" component={Reception} />
                    <Route path="/registration" component={Registry} />
                    <Route path="/aboutproject" component={Project} />
                    <Route path="/developed" component={Features} />
                    <Route path="/roshar" component={Roshar} />
                    <Route path="/technology" component={Technologies} />
                    <Route path="/myprojects" component={Projects} />
                    <Route path="/contact" component={Contact} />
                    <Route path="/credits" component={Credits} />
                </div>
                {
                    LinkList.map((route, index) => {
                        const fun = (props: any) => <MobileMenuList {...props} visible={this.state.isMenuVisible} clickAway={this.handleClickAway} selectedItem={index} LinkList={LinkList} />;
                        return <Route key={index} exact={route.exact} path={route.path} render={fun} />
                    })
                }
            </div>
        );
    }
    private GenMenuComponent(index: number) {
        return <MobileMenuList visible={this.state.isMenuVisible} clickAway={this.handleClickAway} selectedItem={index} LinkList={LinkList} />;
    }

    private handleClick() {
        this.setState({ isMenuVisible: true });
    }
    private handleClickAway() {
        this.setState({ isMenuVisible: false });
    }
}

export default MobileWebsite;

export interface ILinkElement {
    path: string;
    exact: boolean;
    icon: JSX.Element;
    description: string;
}