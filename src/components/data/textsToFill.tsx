import * as React from 'react';

import {
    Link,
} from 'react-router-dom';

// --------- images
import * as sandersonSrc from '../img/AboutProject/sanderson.png';
import * as webdesingSrc from '../img/AboutProject/webdesign.jpg';

import * as map1Src from '../img/AboutProject/features/map_1.png';
import * as map2Src from '../img/AboutProject/features/map_2.png';
import * as map3Src from '../img/AboutProject/features/map_3.png';
import * as map4Src from '../img/AboutProject/features/map_4.png';

import * as travelSrc from '../img/AboutProject/features/travel.png';

import * as fight1Src from '../img/AboutProject/features/fighting1.png';
import * as fight2Src from '../img/AboutProject/features/fighting2.png';
import * as fight3Src from '../img/AboutProject/features/fighting3.png';
import * as fight4Src from '../img/AboutProject/features/fighting4.png';
import * as fight5Src from '../img/AboutProject/features/fighting5.png';

import * as healingSrc from '../img/AboutProject/features/healing1.png';

import * as eq1Src from '../img/AboutProject/features/equipment_1.png';
import * as eq2Src from '../img/AboutProject/features/equipment_2.png';
import * as eq3Src from '../img/AboutProject/features/equipment_3.png';

import * as account1Src from '../img/AboutProject/features/account_1.png';
import * as account2Src from '../img/AboutProject/features/account_2.png';
import * as account3Src from '../img/AboutProject/features/account_3.png';

import * as aspnetSrc from '../img/AboutProject/technologies/Asp.Net-Core.jpg';
import * as css3Src from '../img/AboutProject/technologies/css3_logo.png';
import * as entityframeworkSrc from '../img/AboutProject/technologies/EF.png';
// import * as jsSrc from '../img/AboutProject/technologies/jses6.jpeg';
import * as materialUISrc from '../img/AboutProject/technologies/Material-UI.png';
import * as sqlSrc from '../img/AboutProject/technologies/mssql.png';
import * as phaserSrc from '../img/AboutProject/technologies/phaser.png';
import * as reactrouterSrc from '../img/AboutProject/technologies/react-router.svg';
import * as reactSrc from '../img/AboutProject/technologies/React.svg';
import * as reduxSrc from '../img/AboutProject/technologies/redux.png';
import * as styledSrc from '../img/AboutProject/technologies/styled-components.png';
import * as typescriptSrc from '../img/AboutProject/technologies/ts.png';
import * as webpackSrc from '../img/AboutProject/technologies/webpack.png';

import * as matchgeoSrc from '../img/AboutProject/construction.svg';
import * as shatteredSrc from '../img/AboutProject/shash_white.png';

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
        has been built from scratch. All of the important technologies and libraries have been placed in <Link className="LinkFromText" to="/technology">TECHNOLOGIES</Link>.
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
                    <img className="ImageMedium" src={String(map2Src)} />
                </div>
            </div>),
        title: "Traveling system"
    },
    {
        description:
            (<div className="Description">
                <div className="ImageContainer">
                    <img className="ImageBig" src={String(fight5Src)} />
                </div>
                <div className="DescriptionDetails">
                    After entering the location, there is possibility to due with several enemies, that are there. It is adviced to 
                    equip previously all new equipment. Enemies provide additional experience, that will be gained after winning the fight.
                    Sometimes enemies will drop loot.
                </div>
                <div className="ImageContainer">
                    <img className="ImageMedium" src={String(fight2Src)} />
                    <img className="ImageMedium" src={String(fight3Src)} />
                    <img className="ImageMedium" src={String(fight4Src)} />
                </div>
                <div className="DescriptionDetails">
                    At this moment fight is simplified. It is planned to turn this feature more in decition-based fighting. Moreover,
                    it is planned to provied other forms of defeating enemy - like sneaking by or using conversation options. But that is 
                    a far future.
                </div>
                <div className="ImageContainer">
                    <img className="ImageBig" src={String(fight1Src)} />
                </div>
            </div>),
        title: "Fighting"
    },
    {
        description:
            (<div className="Description">
                <div className="ImageContainer">
                    <img className="ImageBig" src={String(healingSrc)} />
                </div>
                <div className="DescriptionDetails">
                    If you loose the battle, it is required to restore some missing health. At this moment character can heal in the
                    camp, or after a lost battle. In the future penalty will be harder - the character will be transported to hospital
                    and will be forced to spend time to go back into previous location.
                </div>
            </div>),
        title: "Healing"
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
        feature: "Adapt main website for small resolutions",
        isMade: true,
    },
    {
        feature: "Adapt game elements for small resolutions",
        isMade: false,
    },
    {
        feature: "Adjust pictures resolutions for better loading performance",
        isMade: true,
    },
    {
        feature: "Add global map entry",
        isMade: true,
    },
    {
        feature: "Add instance entry and travel logic",
        isMade: true,
    },
    {
        feature: "Add simple fight",
        isMade: true,
    },
    {
        feature: "Add simple fight reward system",
        isMade: true,
    },
    {
        feature: "Add healing mechanics",
        isMade: true,
    },
    {
        feature: "Generate greater variety of enemies, loot and locations",
        isMade: false,
    },
    {
        feature: "Add treasure mechanics",
        isMade: false,
    },
    {
        feature: "Add shoping mechanics",
        isMade: false,
    },
    {
        feature: "Add leveling up",
        isMade: false,
    },
    {
        feature: "Add hospital and Alethi Camp",
        isMade: false,
    },
];

export const RosharCarts: IRosharCart[] = [
    {
        brief: "Roshar is the name of the world, system, and the main continent on the world where the The Stormlight Archive takes place.",
        description: (<div>
            <p>Roshar is home to a diverse and unique ecology containing dramatic megafauna and fascinating symbiotic relationships
        between creatures and Splinters of Investiture. The most dramatic of these is the relationship between humans and self-aware spren,
        which is the basis for the magic of Surgebinding.</p>
            <p>During main plot of Stormlight Archive book's Roshar contains of multi kingsdoms, f.e.
        Alethkar, Jah Keved, Herdaz, Azir, Shinovar and more and more. Each of the kingdoms has it own culture and peoples.</p>
        </div>),
        graphics: "Map_roshar_small.jpg",
        route: "roshar",
        title: "Roshar",
    },
    {
        brief: "\"Spren are those ideas - the ideas of collective human experience - somehow come alive.\"",
        description: (<div><p>
            Spren are creatures of nature. With the exception of Shinovar, where there are no spren, they have a common presence all over
            Roshar and tend to be ignored, or remain unseen. Spren are not fully understood. They take different shapes and forms,
            appearing around certain events, ideas, or abnormalities.
        </p><p>
                Spren come in many different varieties, each associated with and named for their own phenomenon. Most spren are non-sentient,
                however, some could become sentient and there are some that already are, for example Kaladin's honorspren.
            </p></div>),
        graphics: "sprens.jpg",
        route: "sprens",
        title: "Sprens",
    },
    {
        brief: "The Knights Radiant, commonly known as Radiants, were a military organization of ten consecrated orders, centered at Urithiru on Roshar.",
        description: (<div><p>The Radiants were divided into ten Orders, each of which directly corresponds with one of the Heralds.
            Each Order had two Surges associated with it, and each Surge was used by two different Orders.
            The Knights Radiant used Shardblades and Shardplate, which were etched with glyphs and glowed a different color
            according to the Order of which they were a member.</p>
            <p> Each Radiant was bonded to a spren, and that spren determined the powers and Order to which the Radiant belonged.</p></div>),
        graphics: "Surgebinders.jpg",
        route: "knightsradiant",
        title: "Knights Radiant",
    },
    {
        brief: "A highstorm is a fierce weather system that traverses the entire continent of Roshar from east to west, starting at the Origin.",
        description: (<div><p>A highstorm can last for hours, and the brutality of these storms has shaped much of the ecosystem of Roshar,
            with the most eastern of lands having the hardiest of creatures and plants. </p>
            <p>While highstorms have meteorological significance,
                they also provide Stormlight,
            an energy which can be stored within gemstones and power a range of devices and magical abilities.</p></div>),
        graphics: "Highstorm.png",
        route: "highstorm",
        title: "Highstorm",
    },
    {
        brief: "Stormlight is a radiant energy given off by highstorms that can be stored in gemstones and then later used by Surgebinders.",
        description: (<div><p>Stormlight is a source of light and power and is used to power the technology of Roshar.</p>
            <p> What is more important,
            stormlight is used by all Surgebinders to perform certain feats, which are akin to those performed by the Knights Radiant,
            which had ten Orders. Each Order possessed different abilities. However, Stormlight can be used by any Surgebinder to
            <b> increase battle reflexes, reactivity, speed, and strength</b>.</p></div>),
        graphics: "stormlight.jpg",
        route: "stormlight",
        title: "Stormlight",
    },
    {
        brief: "A gemstone is a mineral, with applications in many aspects of life on Roshar.",
        description: (<div><p>Though mining efforts do indeed result in the acquisition of gemstones on Roshar, the harvesting of gemhearts
            - which grow within greatshells - produces another significant source. Larger species of greatshell, like chasmfiends,
            produce gemhearts of great size</p>
            <p>Gemstones are used in spheres, which are the primary currency of Roshar. Their <b>ability to absorb Stormlight</b> make them
                a source of magical potency necessary for certain types of magic, such as Soulcasting, powering fabrials replicating
                types of Surgebinding, and as common sources of illumination. An infused gemstone can also trap a spren.</p></div>),
        graphics: "gems.jpg",
        route: "gemstones",
        title: "Gemstones",
    },
    {
        brief: "The Shattered Plains are located in the Frostlands on the borders of the Unclaimed Hills, Alethkar and New Natanan.",
        description: (<div><p>The Plains appear as a broken, jagged mosaic of uneven and variously sized plateaus separated by a labyrinth of sheer chasms and crevasses ranging twenty to thirty feet in width.
                Some chasms were so deep that they disappeared into darkness.</p>
            <p>The Shattered Plains are heavily contested in two ways: The first is between the Parshendi and the Alethi,
                who fight due to the Vengeance Pact after the Parshendi took responsibility for the assassination of the former king of
                Alethkar, Gavilar Kholin.
                </p><p>The second is between the armies of the individual Highprinces, who contest over the gemhearts
    from chrysalises, as well as for the opportunity to possibly gain Shardplate and Shardblades from Parshendi Shardbearers.
            </p></div>),
        graphics: "shatteredplains.jpg",
        route: "shatteredplains",
        title: "Shattered Plains",
    },
    {
        brief: "The Parshendi are clever, accomplished warriors. They are other species that lives on Roshar side by humans.",
        description: (<div><p>The Parshendi learned to change their forms. They need a highstorm in order to change forms and such a change involves bonding with spren.
            The change can affect their appearance, physical abilities and mental faculties.</p>
            <p>The Parshendi, as observed by Alethi warriors, have black or white skin marbled with red and very muscular builds, especially in the legs, the strength
                of which allows them to leap the chasms of the Shattered Plains.</p>
            <p>Individual Parshendi are capable of seeking the Old Magic and receiving a boon and a curse from the Nightwatcher.
            </p></div>),
        graphics: "parshendi.jpg",
        route: "parshendi",
        title: "Parshendi",
    },
    {
        brief: "A Shardblade is a powerful weapon capable of slicing rock and severing souls.",
        description: (<div><p>No two Shardblades are the same, but all Shardblades cut easily through most inanimate matter,
            so long as the Blade is kept in motion. They do not cut living flesh; instead the metal fuzzes as it passes through,
            killing without leaving a mark or spilling blood.</p>
            <p>A Shardblade is summoned by the intent of the Shardbearer, willing it into existence, typically dropping into his/her hand extended to the side.
                The process of summoning takes exactly ten heartbeats.</p><p>
                Shardbearers are soul-bound to their Blades until death, or until their Blades are willingly relinquished.</p></div>),
        graphics: "shardblade.jpg",
        route: "shardblades",
        title: "Shardblades",
    },
    {
        brief: "Shardplate is magically-enhanced, stormlight-powered plate armor that offers great protection and massively enhances the wearer's strength, speed and dexterity.",
        description: (<div><p>Shardplate is forged from an unknown metal, and is composed of interlocking plates covering the wearer's entire
            body. Shardplate is heavy, often requiring assistance to don. Typically, attendants apply the armor from the feet up due to
            its weight. However, once on, the armor grants the wearer enhanced strength, enabling Shardbearers to easily bear the weight.</p>
            <p>Shardplate protects its bearer far more than traditional, non-Plate armor. Swords glance off the armor with little more than
                a scratch, arrows are all but completely ineffective except when shot through the eyeslit of the helm, and the Plate can
                withstand many hits from hammers and maces before showing signs of damage.</p></div>),
        graphics: "shardplate.jpg",
        route: "shardplates",
        title: "Shardplates",
    },
    {
        brief: "\"Life before death, strength before weakness, journey before destination.\"",
        description: (<div><p>Windrunners are one of the ten orders of Knights Radiant. They share Surges with the orders of Bondsmiths (Adhesion) and Skybreakers (Gravitation).
        </p><p>The Windrunners' Nahel bond is with honorspren, who are inclined toward truth and justice.</p>
        </div>),
        graphics: "windrunners.jpg",
        route: "windrunners",
        title: "Windrunners",
    },
    {
        brief: "Roshar is a fascinating place to visit!",
        description: (<div><p>More information about <b>The Stormlight Archive</b> can be found at:</p>
            <div style={{ textAlign: "center" }}>
                <a target="_blank" rel="noopener noreferrer" href="http://stormlightarchive.wikia.com/wiki/Stormlight_Archive_Wiki">Stormlight Archive Wiki</a><br />
                <a target="_blank" rel="noopener noreferrer" href="http://17thshard.com">17th Shard</a><br />
                <a target="_blank" rel="noopener noreferrer" href="https://brandonsanderson.com/">Bandon Sanderson's Page</a>
            </div>
        </div>),
        graphics: "whoissanderson.jpg",
        route: "more",
        title: "Find out more...",
    },
];

export const TechnologiesList: ITechnologiesGroup[] = [
    {
        description: "Front-end",
        technologies: [
            {
                background: "rgb(34, 34, 34)",
                color: "rgb(97,218,251)",
                displayName: true,
                graphics: String(reactSrc),
                target: "Components and containers generation. Main structure of the application.",
                title: "React"
            },
            {
                background: "white",
                color: "inherit",
                displayName: true,
                graphics: String(reactrouterSrc),
                target: "Handling routing. Creating Single Page Application (SPA).",
                title: "React Router"
            },
            {
                background: "white",
                color: "inherit",
                displayName: true,
                graphics: String(reduxSrc),
                target: "State container for JS apps. Storing application status for global usage.",
                title: "Redux"
            },
            {
                background: "rgb(0,122,204)",
                color: "white",
                displayName: true,
                graphics: String(typescriptSrc),
                target: "All front-end files written in TS.",
                title: "TypeScript"
            },
        ],
    } as ITechnologiesGroup,
    {
        description: "Styles + UI",
        technologies: [
            {
                background: "white",
                color: "black",
                displayName: true,
                graphics: String(css3Src),
                target: "Providing cross-components CSS classes. Animations.",
                title: "CSS3"
            },
            {
                background: "rgb(33,150,243)",
                color: "white",
                displayName: true,
                graphics: String(materialUISrc),
                target: "Applied for aesthetic look. A few UI features.",
                title: "Material-UI"
            },
            {
                background: "white",
                color: "inherit",
                displayName: false,
                graphics: String(styledSrc),
                target: "Tested on a few components.",
                title: "styled components"
            },
        ],
    } as ITechnologiesGroup,
    {
        description: "Back-end",
        technologies: [
            {
                background: "rgb(12,44,101)",
                color: "white",
                displayName: true,
                graphics: String(aspnetSrc),
                target: "Back-end game API based on MVC Controllers.",
                title: "ASP.NET Core"
            },
            {
                background: "white",
                color: "inherit",
                displayName: false,
                graphics: String(entityframeworkSrc),
                target: "Communication with database using .NET objects.",
                title: "Entity Framework"
            },
        ],
    } as ITechnologiesGroup,
    {
        description: "Database",
        technologies: [
            {
                background: "white",
                color: "inherit",
                displayName: false,
                graphics: String(sqlSrc),
                target: "Storage of all passed and generated data for game.",
                title: "Microsoft SQL Server"
            },
        ],
    },
    {
        description: "Other",
        technologies: [
            {
                background: "white",
                color: "inherit",
                displayName: true,
                graphics: String(webpackSrc),
                target: "Bundling all types of files in the project.",
                title: "webpack"
            },
            {
                background: "white",
                color: "inherit",
                displayName: true,
                graphics: String(phaserSrc),
                target: "Generation of the map and equipment interface.",
                title: "Phaser 3"
            },
        ],
    } as ITechnologiesGroup,
];

export const ProjectsList: IProject[] = [
    {
        background: "rgb(197, 159, 95)",
        color:"white",
        description: "A website game which takes place on Roshar - world created in The Stormlight Archive series. \
                        Created to present usage of front and back end technologies.",
        image: String(shatteredSrc),
        title: "SHATTERED PLAINS",
    },
    {
        background: "cornflowerblue",
        color: "inherit",
        description: "A programme that is matching primitives to complicated cloud of points in .STL format. It is dedicated to \
        aid process of topological optimization provided by ANSYS. Used algorithms are under construction.",
        image: String(matchgeoSrc),
        title: "MATCHGEO",
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
    route: string;
    title: string;
    graphics: string;
    brief: string;
    description: JSX.Element;
}
export interface ITechnology {
    background: string | number;
    color: string;
    displayName: boolean;
    title: string;
    graphics: string;
    target: string;
}
export interface ITechnologiesGroup {
    description: string;
    technologies: ITechnology[];
}
export interface IProject {
    background: string|number;
    color: string;
    image: string;
    title: string;
    description: string;
}