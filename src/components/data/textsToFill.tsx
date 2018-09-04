import * as React from 'react';

import {
    Link,
} from 'react-router-dom';

// --------- images
import * as sandersonSrc from '../img/AboutProject/sanderson.png';
import * as webdesingSrc from '../img/AboutProject/webdesign.jpg';

import * as map1Src from '../img/AboutProject/map_1.png';
import * as map2Src from '../img/AboutProject/map_2.png';
import * as map3Src from '../img/AboutProject/map_3.png';
import * as map4Src from '../img/AboutProject/map_4.png';

import * as travelSrc from '../img/AboutProject/travel.png';

import * as eq1Src from '../img/AboutProject/equipment_1.png';
import * as eq2Src from '../img/AboutProject/equipment_2.png';
import * as eq3Src from '../img/AboutProject/equipment_3.png';

import * as account1Src from '../img/AboutProject/account_1.png';
import * as account2Src from '../img/AboutProject/account_2.png';
import * as account3Src from '../img/AboutProject/account_3.png';

import * as gemsSrc from '../img/AboutProject/gems.jpg';
import * as stormSrc from '../img/AboutProject/Highstorm.png';
import * as rosharSrc from '../img/AboutProject/Map_roshar_small.jpg';
import * as parshendiSrc from '../img/AboutProject/parshendi.jpg';
import * as sharedbladeSrc from '../img/AboutProject/shardblade.jpg';
import * as sharedplateSrc from '../img/AboutProject/shardplate.jpg';
import * as plainsSrc from '../img/AboutProject/shatteredplains.jpg';
import * as sprensSrc from '../img/AboutProject/sprens.jpg';
import * as stormlightSrc from '../img/AboutProject/stormlight.jpg';
import * as knightsSrc from '../img/AboutProject/Surgebinders.jpg';
import * as whoissandersonSrc from '../img/AboutProject/whoissanderson.jpg';
import * as windrunnersSrc from '../img/AboutProject/windrunners.jpg';




export const AboutProject = [
    <img key={0} src={String(webdesingSrc)} />
    ,
    <p key={1}>
        The main idea behind the project was to create an interactive browser game. The idea for such a challenge has already
        occurred many years ago, but due to insufficient experience was repeatedly postponed. The assumptions were changing, but the idea was
        constantly stuck in the mind and was waiting for a better time. At this point, a skeleton has been built, on which in the coming months
        there will be more and more elements of a real browser game.
    </p>
    ,
    <p key={2}>
        Within a few years, the technologies used in the development of websites have dynamically changed. For this reason, the current project
        has been built from scratch. All of the important technologies and libraries have been placed in <Link className="LinkFromText" to="/technologies">TECHNOLOGIES</Link>.
        </p>
    ,
    <img id="Sanderson" key={3} src={String(sandersonSrc)} />
    ,
    <p key={4}>
        The universe used as the background of the game comes from a great series of fantasy books written by Brandon Sanderson.
        The Stormlight Archive is an epic saga that describes the events taking place in the world, which is only seemingly similar
        to ours. <Link className="LinkFromText" to="/roshar">ROSHAR</Link> is a place where an incredible fantasy story takes place, which is not be ashamed by the Tolkien itself. The book
        impressed me so much that I decided to use the aspects present in it during the creation of mechanics of the game. I truly recommend
        pick up a copy of Sanderson's work.
    </p>
    ,
    <p key={5}>
        Unfortunately I am not an artist, so most of the used graphics has been downloaded from the Web. The full list is present in section <Link className="LinkFromText" to="/credits">CREDITS</Link>.
        At this point, it is worth noting that the project aims to <b>present the usage of front and back end technologies</b>, rather than
        the aspect of aesthetics (which is crucial for every final product).
    </p>
    ,
    <p key={6}>
        Currently developed elements of the game can be found under link <Link className="LinkFromText" to="/developed">FEATURES</Link>. All of them
        can be tested after simple account's registration and creation of a character.
    </p>];

export const GameElements: IToExpand[] = [
    {
        description:
            (<div className="Description">
                <div className="ImageContainer">
                    <img className="ImageMedium" src={map4Src} />
                </div>
                <div className="DescriptionDetails">
                    A location is built with the graph of related nodes. In order to discover a new location or instance, one need to
                    travel to the next node. During the exploration, more and more nodes are being discovered.
                </div>
                <div className="ImageContainer">
                    <img className="ImageSmall" src={map1Src} />
                    <img className="ImageSmall" src={map3Src} />
                </div>
                <div className="DescriptionDetails">
                    Each of nodes has its own unique possibilities. From one man can enter global map, from the other man can start the location.
                </div>
            </div>),
        title: "Locations"
    },
    {
        description:
            (<div className="Description">
                <div className="ImageContainer">
                    <img className="ImageBig" src={String(travelSrc)} />
                </div>
                <div className="DescriptionDetails">
                    It requires some time to get to new location or location's node. Traveling route is being found with the A* algorythm.
                    Calculated time depends on the current stage of discovering the location. Discovering new elements of location's graph enables
                    more ways to move. It is also the only way to get to new locations.
                </div>
                <div className="ImageContainer">
                    <img className="ImageSmall" src={String(map2Src)} />
                </div>
            </div>),
        title: "Traveling system"
    },
    {
        description:
            (<div className="Description">
                <div className="ImageContainer">
                    <img className="ImageBig" src={String(eq1Src)} />
                </div>
                <div className="DescriptionDetails">
                    The design of the equipment is based on standard RPG equipment. For each of 11 avaible slots man can put specific type of
                    items. For example - secondary weapons like daggers can be put only in right or left hand. A shield require secondary hand slot when
                    a big, double-hand swords require both of the hands.
                </div>
                <div className="ImageContainer">
                    <img className="ImageSmall" src={String(eq2Src)} />
                    <img className="ImageSmall" src={String(eq3Src)} />
                </div>
                <div className="DescriptionDetails">
                    Each of the items has it own attributes that are stored in database. There is no possibility to equip too much advanced equipment on
                    low-level hero. Armour and weapons influence the physical attributes of the character. Jewellery has an effect on mental attributes. There is possibility to
                    move items between backpack and equipment. In order to provide support on touchscreens, the drag'n'drop features has been
                    given up.
                </div>
            </div>),
        title: "Equipment"
    },
    {
        description:
            (<div className="Description">
                <div className="ImageContainer">
                    <img className="ImageBig" src={String(account1Src)} />
                </div>
                <div className="DescriptionDetails">
                    Through this panel, a user can manage his account. There is possibility to create new character or enter the game with
                    old one. The implemented possibilities contain also:
                    <ul>
                        <li>Changing password</li>
                        <li>Changing contact email</li>
                        <li>Removal of a character</li>
                        <li>Deleting an account</li>
                    </ul>
                    Each of this is executed after using an <b>own created dialogs - messages - validation system</b>.
                </div>
                <div className="ImageContainer">
                    <img className="ImageMedium" src={String(account2Src)} />
                    <img className="ImageMedium" src={String(account3Src)} />
                </div>
            </div>),
        title: "Account's management"
    },
];

export const TODOS: IToDo[] = [
    {
        feature: "Add global map entry",
        isMade: true,
    },
    {
        feature: "Add instance entry and travel logic",
        isMade: false,
    },
    {
        feature: "Add simple fight",
        isMade: false,
    },
    {
        feature: "Add simple fight reward system",
        isMade: false,
    },
    {
        feature: "Add rest mechanics",
        isMade: false,
    }
];

export const RosharCarts: IRosharCart[] = [
    {
        brief: "Roshar is the name of the world, system, and the main continent on the world where the The Stormlight Archive takes place.",
        description: "Roshar",
        graphics: String(rosharSrc),
        title: "Roshar",
    },
    {
        brief: "Roshar is the name of the world, system, and the main continent on the world where the The Stormlight Archive takes place.",
        description: "Roshar",
        graphics: String(sprensSrc),
        title: "Sprens",
    },
    {
        brief: "Roshar is the name of the world, system, and the main continent on the world where the The Stormlight Archive takes place.",
        description: "Roshar",
        graphics: String(knightsSrc),
        title: "Knights Radiant",
    },
    {
        brief: "Roshar is the name of the world, system, and the main continent on the world where the The Stormlight Archive takes place.",
        description: "Roshar",
        graphics: String(stormSrc),
        title: "Highstorm",
    },
    {
        brief: "Roshar is the name of the world, system, and the main continent on the world where the The Stormlight Archive takes place.",
        description: "Roshar",
        graphics: String(stormlightSrc),
        title: "Stormlight",
    },
    {
        brief: "Roshar is the name of the world, system, and the main continent on the world where the The Stormlight Archive takes place.",
        description: "Roshar",
        graphics: String(gemsSrc),
        title: "Gemstones",
    },
    {
        brief: "Roshar is the name of the world, system, and the main continent on the world where the The Stormlight Archive takes place.",
        description: "Roshar",
        graphics: String(plainsSrc),
        title: "Shattered Plains",
    },
    {
        brief: "Roshar is the name of the world, system, and the main continent on the world where the The Stormlight Archive takes place.",
        description: "Roshar",
        graphics: String(parshendiSrc),
        title: "Parshendi",
    },
    {
        brief: "Roshar is the name of the world, system, and the main continent on the world where the The Stormlight Archive takes place.",
        description: "Roshar",
        graphics: String(sharedbladeSrc),
        title: "Shardblades",
    },
    {
        brief: "Roshar is the name of the world, system, and the main continent on the world where the The Stormlight Archive takes place.",
        description: "Roshar",
        graphics: String(sharedplateSrc),
        title: "Shardplates",
    },
    {
        brief: "Roshar is the name of the world, system, and the main continent on the world where the The Stormlight Archive takes place.",
        description: "Roshar",
        graphics: String(windrunnersSrc),
        title: "Windrunners",
    },
    {
        brief: "Roshar is the name of the world, system, and the main continent on the world where the The Stormlight Archive takes place.",
        description: "Find out more...",
        graphics: String(whoissandersonSrc),
        title: "Find out more...",
    },
];

// -------------- interfaces

export interface IToExpand {
    title: string;
    description: JSX.Element;
}
export interface IToDo {
    feature: string;
    isMade: boolean;
}
export interface IRosharCart {
    title: string;
    graphics: string;
    brief: string;
    description: string;
}