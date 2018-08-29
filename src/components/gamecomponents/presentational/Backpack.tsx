import * as React from 'react';

import { MoneyToGems } from '../../data/gameCALC';
import { IEquipmentResult, IItemResult, } from '../../data/gameTYPES';

import { IActiveItem } from '../Equipment';


export class Backpack extends React.Component<{ equipment: IEquipmentResult, itemDetails: (e: IEquipmentResult, i: IItemResult, s: number) => void, activeItem: IActiveItem | null, makeActiveFun: (e:any,i: IActiveItem) => void }, {}>{
    constructor(props: any) {
        super(props);
        // --------- bindings
        this.GenGoldStatus = this.GenGoldStatus.bind(this);
        this.showItemDescription = this.showItemDescription.bind(this);

        this.state = {
            activeElement: null,
            anchorEl: null,
            popperOpen: false,
        }
    }
    public render() {
        return (<div className="Backpack">
            <div className="BackpackInside">
                <div className="TopDescription">
                    <div className="BackGroundBar" />
                    <div className="Description"><div className="Text">EQUIPMENT</div></div>
                </div>
                <div className="Gold">{this.GenGoldStatus(this.props.equipment.money)}</div>

                <div className="ItemContainer">
                    {this.props.equipment.backpack.map((e, key) => {
                        if (e !== null) {
                            const element = this.props.equipment.knownItems.find(f => f.itemID === e);
                            if (element === undefined) {
                                throw Error("Unknown item in inventory");
                            }
                            const onClickFun = (event: any) => {
                                this.props.makeActiveFun(event, {
                                    activeItem: "Backpack" + key,
                                    activeType: element.itemType,
                                });
                            };
                            const onClickFunDetails = () => {
                                this.showItemDescription(key);
                            };
                            const image = require('../../img/Game/Items/' + e + '.png');
                            let additional = "";
                            if (this.props.activeItem !== null) {
                                if (this.props.activeItem.activeItem === "Backpack" + key) {
                                    additional = " SlotActive";
                                }
                            }
                            return (<div className={"ItemSlotHolder" + additional} key={key} >
                                <div className="ItemSlot" onClick={onClickFun}>
                                    <div className="Item">
                                        <img src={String(image)} />
                                        <div className="ItemInspector" onClick={onClickFunDetails}/>
                                    </div>
                                </div>
                            </div>);
                        } else {
                            return (<div className={(this.props.activeItem !== null) ? "ItemSlotHolder SlotToPut" : "ItemSlotHolder"} key={key}><div className="ItemSlot" /></div>);
                        }
                    })}
                </div>
            </div>
        </div>);
    }
    private GenGoldStatus(gold: number): JSX.Element[] {
        const res: JSX.Element[] = [];
        const pickures: string[] = [];
        const values = MoneyToGems(this.props.equipment.money);
        for (let i = 0; i < 3; i++) {
            pickures.push(String(require('../../img/Game/EQ/gem' + i + ".svg")));
        }
        for (let i = 0; i < 3 && i < values.length; i++) {
            res.push(<div className="inlineDiv" key={i * 2}><img src={pickures[i]} /></div>);
            res.push(<div className="inlineDiv" key={i * 2 + 1}><span>{values[i]}</span></div>);
        }
        return res.reverse();
    }
    private showItemDescription(id: number) {
        const element = this.props.equipment.backpack[id];
        if (element === null) {
            throw Error("Unknown Item!");
        }
        const data = this.props.equipment.knownItems.find(e => e.itemID === element);
        if (data === undefined) {
            throw Error("Unknown Item!");
        }
        this.props.itemDetails(this.props.equipment, data, 0);
    }
}