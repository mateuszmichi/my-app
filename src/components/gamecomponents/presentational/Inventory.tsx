import * as React from 'react';

import { IItemResult, } from '../../data/gameTYPES';

import { AcceptItemSchema, IInventorySlot } from '../../data/gameCALC';

import { IActiveItem } from '../Equipment';

import { IHero } from '../../TYPES';



export class Inventory extends React.Component<{ hero: IHero, itemDetails: (h: IHero, i: IItemResult, s: number) => void, activeItem: IActiveItem | null, makeActiveFun: (e: any, i: IActiveItem | null, t: string) => void }, {}>{
    private inventoryArr: IInventorySlot[];
    constructor(props: any) {
        super(props);
        // --------- bindings
        this.GenInventorySlot = this.GenInventorySlot.bind(this);
        this.showItemDescription = this.showItemDescription.bind(this);

        this.inventoryArr = [];
    }
    public render() {
        this.inventoryArr = AcceptItemSchema(this.props.hero.equipment);

        return (<div className="Inventory">
            <div className="InventorySlotHolder Hidden" />
            {this.GenInventorySlot(this.inventoryArr[0], 0)}
            <div className="InventorySlotHolder Hidden" />
            {this.GenInventorySlot(this.inventoryArr[1], 1)}
            {this.GenInventorySlot(this.inventoryArr[2], 2)}
            {this.GenInventorySlot(this.inventoryArr[3], 3)}
            {this.GenInventorySlot(this.inventoryArr[4], 4)}
            {this.GenInventorySlot(this.inventoryArr[5], 5)}
            {this.GenInventorySlot(this.inventoryArr[6], 6)}
            {this.GenInventorySlot(this.inventoryArr[7], 7)}
            {this.GenInventorySlot(this.inventoryArr[8], 8)}
            {this.GenInventorySlot(this.inventoryArr[9], 9)}
            <div className="InventorySlotHolder Hidden" />
            {this.GenInventorySlot(this.inventoryArr[10], 10)}
        </div>);
    }

    private GenInventorySlot(slot: IInventorySlot, key: number): JSX.Element {
        let additional = "";
        if (this.props.activeItem !== null) {
            const type = this.props.activeItem.activeType;
            if (slot.acceptType.findIndex(f => f === type) !== -1) {
                additional += " SlotWearing";
            }
        }
        if (slot.item === null) {
            const onClickEmpty = (event: any) => {
                this.props.makeActiveFun(event, null, "Inventory" + key);
            };
            return (<div className={"InventorySlotHolder" + additional}><div className={"InventorySlot " + slot.name} onClick={onClickEmpty} /></div>);
        }
        else {
            const element = this.props.hero.equipment.knownItems.find(f => f.itemID === slot.item);
            if (element === undefined) {
                throw Error("Unknown item in inventory");
            }
            const onClickFun = (event: any) => {
                this.props.makeActiveFun(event, {
                    activeItem: "Inventory" + key,
                    activeType: element.itemType,
                }, "Inventory" + key);
            };
            const onClickFunDetails = () => {
                this.showItemDescription(element.itemID);
            };
            const image = require('../../img/Game/Items/' + slot.item + '.png');
            if (this.props.activeItem !== null) {
                if (this.props.activeItem.activeItem === "Inventory" + key) {
                    additional += " SlotActive";
                }
            }
            return (
                <div className={"InventorySlotHolder" + additional}>
                    <div className={"InventorySlot " + slot.name}>
                        <div className="Item" onClick={onClickFun}>
                            <img src={String(image)} />
                            <div className="ItemInspector" onClick={onClickFunDetails}><div>Details</div></div>
                        </div>
                    </div>
                </div>);
        }
    }
    private showItemDescription(itemid: number) {
        const data = this.props.hero.equipment.knownItems.find(e => e.itemID === itemid);
        if (data === undefined) {
            throw Error("Unknown Item!");
        }
        this.props.itemDetails(this.props.hero, data, 1);
    }
}