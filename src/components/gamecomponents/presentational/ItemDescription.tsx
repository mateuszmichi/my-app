import * as React from 'react';

import '../../css/gamecomponents/ItemDescription.css';

import { CompererItems } from '../../data/gameCALC';
import { CharacterAttributes, IEquipmentResult, IItemResult, ItemTypeDescription, } from '../../data/gameTYPES';

import { Button, ClickAwayListener, Divider,  } from '@material-ui/core';

import { IConnectionData } from '../../data/connectionConf';

// -------------- images
import * as defenceSrc from '../../img/Game/EQ/shield.svg';

import * as attackSrc from '../../img/Game/EQ/weapon2.png';





export class ItemDescription extends React.Component<{ item: IItemResult, equipment: IEquipmentResult, isOn: boolean, ConnData: IConnectionData }, {}>{
    constructor(props: any) {
        super(props);
        this.NumberToComperer = this.NumberToComperer.bind(this);
        this.showStat = this.showStat.bind(this);
        this.showDmgStat = this.showDmgStat.bind(this);
        this.showPossiblePlacement = this.showPossiblePlacement.bind(this);
    }

    public render() {
        const options = CompererItems(this.props.item, this.props.equipment, this.props.isOn);

        const toshow = [];
        for (let i = 0; i < 8; i++) {
            let fit = false;
            options.wearing.forEach(e => {
                if (e.item !== null) {
                    if (e.item.attributes[i] > 0) {
                        fit = true;
                    }
                }
            });
            if (fit || this.props.item.attributes[i] > 0) {
                const compArr: IStatToDisplay[] = [];
                options.wearing.forEach(e => {
                    if (e.item !== null) {
                        compArr.push({ OtherStat: this.props.item.attributes[i], ThisStat: e.item.attributes[i] });
                    } else {
                        compArr.push({ OtherStat: this.props.item.attributes[i], ThisStat: 0 });
                    }
                });
                toshow.push({ description: CharacterAttributes[i].name, count: this.props.item.attributes[i], comper: compArr });
            }
        }
        // dmg
        let showDmg = (this.props.item.dmgMax > 0 || this.props.item.dmgMin > 0);
        const DmgShow: IDmgStatToDisplay[] = [];
        options.wearing.forEach(e => {
            if (e.item !== null) {
                if (e.item.dmgMin > 0 || e.item.dmgMax > 0) {
                    showDmg = true;
                }
                DmgShow.push({ OtherStatMin: this.props.item.dmgMin, OtherStatMax: this.props.item.dmgMax, ThisStatMax: e.item.dmgMax, ThisStatMin: e.item.dmgMin });
            } else {
                DmgShow.push({ OtherStatMin: this.props.item.dmgMin, OtherStatMax: this.props.item.dmgMax, ThisStatMax: 0, ThisStatMin: 0 });
            }
        });
        // armour
        let showArmour = (this.props.item.armour > 0);
        const ArmourShow: IStatToDisplay[] = [];
        options.wearing.forEach(e => {
            if (e.item !== null) {
                if (e.item.armour > 0) {
                    showArmour = true;
                }
                ArmourShow.push({ OtherStat: this.props.item.armour, ThisStat: e.item.armour });
            } else {
                ArmourShow.push({ OtherStat: this.props.item.armour, ThisStat: 0 });
            }
        });

        const image = String(require('../../img/Game/Items/' + this.props.item.itemID + '.png'));

        return (
            <ClickAwayListener onClickAway={this.props.ConnData.closeDialog}>
                <div className="ItemDescription">
                    <div className="inlineDiv TopOfItem">
                        <img src={image} />
                    </div>
                    <div className="inlineDiv TopOfItem">
                        <div className="ItemName">
                            {this.props.item.name}
                        </div>
                        <div className="ItemType">
                            {ItemTypeDescription[this.props.item.itemType]}
                        </div>
                        <div className="ItemLevel">
                            Lvl {this.props.item.lvl}
                        </div>
                    </div>
                    <Divider />
                    <div className="ItemAttributes">
                        <div className="Attribute">
                            <div className="AttributeRow" /><div className="AttributeRow"><div className="PossiblePlacement"><div className="PossiblePlacementSlot"><img src={image} /></div></div></div>
                            {options.wearing.map((e, i) => (<div className="AttributeRow" key={i}>{this.showPossiblePlacement(e)}</div>))}
                        </div>
                        {(showDmg) && (<div className="Attribute">
                            <div className="AttributeRow"><img src={String(attackSrc)} /></div>
                            <div className="AttributeRow">{String(this.props.item.dmgMin) + "-" + String(this.props.item.dmgMax)}</div>
                            {DmgShow.map((e, i) => (<div className="AttributeRow" key={i}>{this.showDmgStat(e)}</div>))}
                        </div>)}
                        {(showArmour) && (<div className="Attribute">
                            <div className="AttributeRow"><img src={String(defenceSrc)} /></div>
                            <div className="AttributeRow">{this.NumberToComperer(this.props.item.armour)}</div>
                            {ArmourShow.map((e, i) => (<div className="AttributeRow" key={i}>{this.showStat(e)}</div>))}
                        </div>)}
                        {toshow.map((e, i) => (<div className="Attribute" key={i}>
                            <div className="AttributeRow">{e.description}</div>
                            <div className="AttributeRow">{this.NumberToComperer(e.count)}</div>
                            {e.comper.map((comp, j) => (<div className="AttributeRow" key={j}>
                                {this.showStat(comp)}
                            </div>))}
                        </div>))}

                        <div className="Options">
                            <div className="OptionsRow" /><div className="OptionsRow" />
                            {options.wearing.map((e, i) => (<div className="OptionsRow" key={i}><button>Equip</button></div>))}
                        </div>
                    </div>
                    <Divider />
                    <div className="BottomPart"><Button
                        variant="flat"
                        color="primary"
                        onClick={this.props.ConnData.closeDialog}
                    >
                        Back</Button></div>
                </div>
            </ClickAwayListener>)
    }
    private NumberToComperer(count: number): string {
        if (count >= 0) {
            return "+" + String(count);
        } else {
            return String(count);
        }
    }
    private showStat(stat: IStatToDisplay) {
        if (stat.OtherStat === stat.ThisStat) {
            return (<span>{this.NumberToComperer(stat.ThisStat)}</span>);
        } else {
            if (stat.OtherStat < stat.ThisStat) {
                return (<span className="Positive">{this.NumberToComperer(stat.ThisStat)}</span>);
            } else {
                return (<span className="Negative">{this.NumberToComperer(stat.ThisStat)}</span>);
            }
        }
    }
    private showDmgStat(stat: IDmgStatToDisplay) {
        if (stat.OtherStatMin + stat.OtherStatMax === stat.ThisStatMin + stat.ThisStatMax) {
            return (<span>{stat.ThisStatMin + "-" + stat.ThisStatMax}</span>);
        } else {
            if (stat.OtherStatMin + stat.OtherStatMax < stat.ThisStatMin + stat.ThisStatMax) {
                return (<span className="Positive">{stat.ThisStatMin + "-" + stat.ThisStatMax}</span>);
            } else {
                return (<span className="Negative">{stat.ThisStatMin + "-" + stat.ThisStatMax}</span>);
            }
        }
    }
    private showPossiblePlacement(e: { item: IItemResult | null, name: string, background: string }) {
        return (<div className="PossiblePlacement"><div className="PossiblePlacementSlot"><img src={e.background} /></div></div>);
        // if (e.item !== null) {
        //    const req = String(require('../../img/Game/Items/' + e.item.itemID + '.png'));
        //    return (<div className="PossiblePlacement"><img src={req} /></div>)
        // } else {
        //    return <div className={"PossiblePlacement " + e.name} />
        // }
    }
}


// ----------- interface
interface IStatToDisplay {
    OtherStat: number;
    ThisStat: number;
}
interface IDmgStatToDisplay {
    OtherStatMin: number;
    OtherStatMax: number;
    ThisStatMin: number;
    ThisStatMax: number;
}