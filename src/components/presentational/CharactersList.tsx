import * as React from 'react';

import { Divider, List, ListItem, ListItemIcon, ListItemText, } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';

import { ICharacterBrief, Orders } from '../TYPES';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';

// -------------- images import
import * as noneSrc from '../img/CommonGlyphs/Sas.svg';
import * as windrunnerSrc from '../img/CommonGlyphs/Windrunners_glyph.svg';

import { isMobile } from "react-device-detect";

import {
    Link,
} from 'react-router-dom';

//

class CharacterList extends React.Component<{ characters: ICharacterBrief[], playFun: (index: number) => void, addHeroFun: VoidFunction }, {}> {
    public render() {
        return (<div className="buttonGroup">
            <List component="nav">
                {this.props.characters.map((value, index) => {
                    const fun = () => { this.props.playFun(index) };
                    return <HeroDisplay hero={value} key={index} playFun={fun} />;
                }
                )}
                {(this.props.characters.length > 0 && (this.props.characters.length < 5)) ? <Divider /> : ""}
                {(this.props.characters.length < 5) &&
                    this.genAdd()
                }
            </List>
        </div>);
    }
    private genAdd() {
        return (isMobile) ?
            <Link to={"/account/addcharacter"} style={{ textDecoration: "none" }}>
                <ListItem component="button">
                    <ListItemIcon>
                        <AddIcon className="AddHeroButton" />
                    </ListItemIcon>
                    <ListItemText primary="Create a new character" />
                </ListItem>
            </Link>
            :
            <ListItem component="button" onClick={this.props.addHeroFun} >
                <ListItemIcon>
                    <AddIcon className="AddHeroButton" />
                </ListItemIcon>
                <ListItemText primary="Create a new character" />
            </ListItem>
    }
}
class HeroDisplay extends React.Component<{ hero: ICharacterBrief, playFun: VoidFunction }, {}>{
    public render() {
        return (
            <ListItem component="button" onClick={this.props.playFun}>
                <ListItemIcon>
                    <img src={this.displayedImg()} />
                </ListItemIcon>
                <div className="HeroDisplay">
                    <div className="HeroData">
                        <div className="HeroName">
                            {this.props.hero.name} <i>"{this.props.hero.nickname}"</i>
                        </div>
                        {(this.props.hero.orders === Orders.none) ? "" :
                            <div className="HeroOrder">
                                Order of {Orders[this.props.hero.orders]}
                            </div>}
                        <div className="HeroLevel">
                            Level: {this.props.hero.level}
                        </div>
                    </div>
                    <div className="HeroPlay">
                        <span>PLAY</span><NavigateNextIcon />
                    </div>
                </div>
            </ListItem>
        );
    }
    private displayedImg(): string {
        switch (this.props.hero.orders) {
            case Orders.Windrunners:
                return String(windrunnerSrc);
            default:
                return String(noneSrc);
        }
    }
}

// =========================

export default CharacterList;