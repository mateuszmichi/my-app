import * as React from 'react';

import { IEquipmentResult, IItemResult, } from '../../data/gameTYPES';

import { AcceptItemSchema, IInventorySlot } from '../../data/gameCALC';

import { IActiveItem } from '../Equipment';



export class Inventory extends React.Component<{ equipment: IEquipmentResult, itemDetails: (e: IEquipmentResult, i: IItemResult, s: number) => void, activeItem: IActiveItem | null, makeActiveFun: (e: any, i: IActiveItem) => void }, {}>{
    private inventoryArr: IInventorySlot[];
    constructor(props: any) {
        super(props);
        // --------- bindings
        this.GenInventorySlot = this.GenInventorySlot.bind(this);
        this.showItemDescription = this.showItemDescription.bind(this);

        this.inventoryArr = [];
    }
    public render() {
        this.inventoryArr = AcceptItemSchema(this.props.equipment);

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
            return (<div className={"InventorySlotHolder" + additional}><div className={"InventorySlot " + slot.name} /></div>);
        }
        else {
            const element = this.props.equipment.knownItems.find(f => f.itemID === slot.item);
            if (element === undefined) {
                throw Error("Unknown item in inventory");
            }
            const onClickFun = (event: any) => {
                this.props.makeActiveFun(event, {
                    activeItem: "Inventory" + key,
                    activeType: element.itemType,
                });
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
                            <div className="ItemInspector" onClick={onClickFunDetails} />
                        </div>
                    </div>
                </div>);
        }
    }
    private showItemDescription(itemid: number) {
        const data = this.props.equipment.knownItems.find(e => e.itemID === itemid);
        if (data === undefined) {
            throw Error("Unknown Item!");
        }
        this.props.itemDetails(this.props.equipment, data, 1);
    }
}