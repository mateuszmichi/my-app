import * as React from 'react';

import '../css/gamecomponents/Equipment.css';
// import { IActionToken, IUserToken, } from '../TYPES';

// import { IConnectionData, IConnectionFunctions, } from '../data/connectionConf';
import { IEquipmentResult } from '../data/gameTYPES';

import { EquipmentScene } from './scenes/EquipmentScene';

import { Backpack } from './presentational/Backpack';
import { Statistics } from './presentational/Statistics';

import { IHero } from '../TYPES';

// -------------------




export class Equipment extends React.Component<{ visible: boolean, hero: IHero /* ConnFuns: IConnectionFunctions, userToken: IUserToken, actionToken: IActionToken */ }, {}>{
    // private connData: IConnectionData;
    private heroScene: Phaser.Game;
    constructor(props: any) {
        super(props);
        // --------- bindings

        /* this.connData = {
            actionToken: this.props.actionToken,
            closeDialog: this.props.ConnFuns.closeDialog,
            closeMessage: this.props.ConnFuns.closeMessage,
            closeWaiting: this.props.ConnFuns.closeMessage,
            popDialog: this.props.ConnFuns.popDialog,
            popMessage: this.props.ConnFuns.popMessage,
            popWaiting: this.props.ConnFuns.popWaiting,
            userToken: this.props.userToken,
        } */
    }
    public componentWillUnmount() {
        if (this.heroScene !== null) {
            this.heroScene.destroy(true);
        }
    }
    public componentDidMount() {
        // alert(JSON.stringify(EQ));
        const Element = document.getElementById('HeroDisplay');
        if (Element !== null) {
            const width = Element.offsetWidth;
            const height = Element.offsetHeight;
            this.heroScene = new Phaser.Game({
                backgroundColor: 'rgb(237, 205, 151)',
                height,
                parent: "HeroDisplay",
                "render.transparent": true,
                scene: new EquipmentScene({ height, width }),
                width,
            });
        }
    }
    public componentDidUpdate() {
        const Element = document.getElementById('HeroDisplay');
        if (Element !== null) {
            const width = Element.offsetWidth;
            const height = Element.offsetHeight;
            if (this.heroScene !== undefined) {
                this.heroScene.resize(width, height);
            }
        }
    }
    public render() {
        const data = '{"knownItems":[{"itemID":1,"itemType":0,"name":"Simple Knife","attributes":[0,0,2,0,0,0,0,0],"lvl":1,"primaryAttr":3,"secondaryAttr":5},{"itemID":2,"itemType":1,"name":"Wollen Cap","attributes":[0,1,0,0,0,0,0,0],"lvl":1,"primaryAttr":2,"secondaryAttr":2}],"backpack":[1,null,null,null,null,null,null,null,null,null,2,2,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],"backpackSize":30,"firstHand":1,"secondHand":null,"armour":null,"trousers":null,"shoes":null,"gloves":null,"ring1":null,"ring2":null,"neckles":null,"bracelet":null,"money":0}';
        const eq = JSON.parse(data) as IEquipmentResult;
        return (<div id="Equipment" className={(this.props.visible) ? "Active" : "InActive"}>
            <Backpack equipment={eq} />
            <div className="HeroModel">
                <div className="TopField">
                    <Statistics hero={this.props.hero} />
                </div>
                <div className="BottomField">
                    <div className="HeroDisplay" id="HeroDisplay" />
                    <div className="Inventory">
                        <div className="InventorySlotHolder Hidden" />
                        <div className="InventorySlotHolder"><div className="InventorySlot" id="Helmet" /></div>
                        <div className="InventorySlotHolder Hidden" />
                        <div className="InventorySlotHolder"><div className="InventorySlot" id="Ring1" /></div>
                        <div className="InventorySlotHolder"><div className="InventorySlot" id="Neckles" /></div>
                        <div className="InventorySlotHolder"><div className="InventorySlot" id="Ring2" /></div>
                        <div className="InventorySlotHolder"><div className="InventorySlot" id="Gloves" /></div>
                        <div className="InventorySlotHolder"><div className="InventorySlot" id="Armour" /></div>
                        <div className="InventorySlotHolder"><div className="InventorySlot" id="Bracelet" /></div>
                        <div className="InventorySlotHolder"><div className="InventorySlot" id="FirstHand" /></div>
                        <div className="InventorySlotHolder"><div className="InventorySlot" id="Trousers" /></div>
                        <div className="InventorySlotHolder"><div className="InventorySlot" id="SecondHand" /></div>
                        <div className="InventorySlotHolder Hidden" />
                        <div className="InventorySlotHolder"><div className="InventorySlot" id="Shoes" /></div>
                    </div>
                </div>
            </div>
        </div>);
    }
}