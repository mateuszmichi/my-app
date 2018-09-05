import * as React from 'react';
import { connect } from 'react-redux';

import '../css/gamecomponents/Equipment.css';

import { EquipmentScene } from './scenes/EquipmentScene';

import { Backpack } from './presentational/Backpack';
import { Statistics } from './presentational/Statistics';

import { IHero, IPassedGameData } from '../TYPES';

import { IConnectionData, ServerConnect } from '../data/connectionConf';
import { IEquipmentModifyResult, IItemResult, ItemTypes,  } from '../data/gameTYPES';

import { Inventory } from './presentational/Inventory';
import { ItemDescription } from './presentational/ItemDescription';

import { IMessage } from '../MessageMenager';

import { ClickAwayListener } from '@material-ui/core';
import { Update_Equipment } from '../actions/actionCreators';
import { AcceptItemSchema } from '../data/gameCALC';


// -------------------




class ConnectedEquipment extends React.Component<{ visible: boolean, hero: IHero, ConnData: IConnectionData, updateEquipment: (modification: IEquipmentModifyResult) => void  }, { active: IActiveItem | null }>{
    private heroScene: Phaser.Game;
    constructor(props: any) {
        super(props);
        // --------- bindings
        this.showItemDialog = this.showItemDialog.bind(this);
        this.handleActivateItem = this.handleActivateItem.bind(this);
        this.handleDisactivateItem = this.handleDisactivateItem.bind(this);
        this.handleEquipmentChange = this.handleEquipmentChange.bind(this);
        this.handleButtonItemChange = this.handleButtonItemChange.bind(this);
        this.isChangeUseful = this.isChangeUseful.bind(this);

        this.state = {
            active: null,
        }
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
        return (
            <ClickAwayListener onClickAway={this.handleDisactivateItem}>
                <div id="Equipment" className={(this.props.visible) ? "Active" : "InActive"} onClick={this.handleDisactivateItem}>
                    <Backpack hero={this.props.hero} itemDetails={this.showItemDialog} activeItem={this.state.active} makeActiveFun={this.handleActivateItem} />
                    <div className="HeroModel">
                        <div className="TopField">
                            <Statistics hero={this.props.hero} />
                        </div>
                        <div className="BottomField">
                            <div className="HeroDisplay" id="HeroDisplay" />
                            <Inventory hero={this.props.hero} itemDetails={this.showItemDialog} activeItem={this.state.active} makeActiveFun={this.handleActivateItem} />
                        </div>
                    </div>
                </div>
            </ClickAwayListener>);
    }
    private showItemDialog(hero: IHero, item: IItemResult, status: number) {
        const currentActive = Object.assign({},this.state.active);
        const changeItemInside = (event: any, target: string) => {
            event.stopPropagation();
            this.handleButtonItemChange(currentActive, target);
        }
        this.props.ConnData.popDialog(<ItemDescription hero={hero} item={item} isOn={status === 1} ConnData={this.props.ConnData} equipFun={changeItemInside}/>);
    }
    private handleActivateItem(event: any, activeItem: IActiveItem | null, target: string) {
        event.stopPropagation();
        // TODO this is simplification
        if (this.state.active !== null) {
            if (activeItem !== null) {
                if (this.state.active.activeItem !== activeItem.activeItem) {
                    if (this.isChangeUseful(this.state.active.activeItem, activeItem.activeItem)) {
                        this.handleEquipmentChange(this.state.active.activeItem, activeItem.activeItem);
                    } else {
                        this.handleDisactivateItem();
                    }
                }
            } else {
                if (this.isChangeUseful(this.state.active.activeItem, target)) {
                    this.handleEquipmentChange(this.state.active.activeItem, target);
                } else {
                    this.handleDisactivateItem();
                }
            }
        } else {
            this.setState({ active: activeItem });
        }
    }
    private handleButtonItemChange(from: IActiveItem|null, to: string) {
        if (from !== null) {
            this.handleEquipmentChange(from.activeItem, to);
        }
    }
    private handleDisactivateItem() {
        this.setState({ active: null });
    }
    private handleEquipmentChange(from: string, to: string) {
        this.handleDisactivateItem();
        const passed: IPassedGameData<IPassedChangeEqData> = {
            ActionToken: this.props.ConnData.actionToken,
            Data: {
                From: from,
                To: to
            },
            UserToken: this.props.ConnData.userToken,
        }
        const succFun = (res: any) => {
            const received = res.data;
            this.props.updateEquipment(received.changes as IEquipmentModifyResult);
        };
        const failFun = (error: any) => {
            if (error.response === undefined) {
                this.props.ConnData.popMessage([{ title: "serverErr", description: "I've got bad feelings about this...", } as IMessage], []);
            } else {
                this.props.ConnData.popMessage([{ title: error.response.data.type, description: error.response.data.description } as IMessage], []);
            }
        };
        ServerConnect(`/api/EquipmentsChange`, passed, succFun, failFun, this.props.ConnData.popWaiting, this.props.ConnData.closeWaiting);
    }
    private isChangeUseful(from: string, to: string):boolean {
        if (to === "Trash") {
            return true;
        }
        if (from.startsWith("Backpack") && to.startsWith("Backpack")) {
            return true;
        }
        const onItems = AcceptItemSchema(this.props.hero.equipment);
        const itemstoput: Array<{nr:number,item:IItemResult}> = []
        if (from.startsWith("Backpack") && to.startsWith("Inventory")) {
            const slot = parseInt(from.substring(8),10);
            const target = parseInt(to.substring(9),10);
            const itnum = this.props.hero.equipment.backpack[slot];
            if (itnum === null) {
                throw Error("No item to pass");
            }
            const item = this.props.hero.equipment.knownItems.find(e => e.itemID === itnum);
            if (item === undefined) {
                throw Error("Unknown item to pass");
            }
            itemstoput.push({ nr: target, item });
        }
        if (to.startsWith("Backpack") && from.startsWith("Inventory")) {
            const slot = parseInt(from.substring(9),10);
            const target = parseInt(to.substring(8),10);
            const itnum = this.props.hero.equipment.backpack[target];
            if (itnum !== null) {
                const item = this.props.hero.equipment.knownItems.find(e => e.itemID === itnum);
                if (item === undefined) {
                    throw Error("Unknown item to pass");
                }
                itemstoput.push({ nr: slot, item });
            }
        }
        if (from.startsWith("Inventory") && to.startsWith("Inventory")) {
            const slot = parseInt(from.substring(9),10);
            const target = parseInt(to.substring(9),10);
            let itnum = onItems[slot].item;
            if (itnum === null) {
                throw Error("No item to pass");
            }
            else {
                const item = this.props.hero.equipment.knownItems.find(e => e.itemID === itnum);
                if (item === undefined) {
                    throw Error("Unknown item to pass");
                }
                itemstoput.push({ nr: target, item });
            }
            itnum = onItems[target].item;
            if (itnum !== null) {
                const item = this.props.hero.equipment.knownItems.find(e => e.itemID === itnum);
                if (item === undefined) {
                    throw Error("Unknown item to pass");
                }
                itemstoput.push({ nr: slot, item });
            }
        }
        let check = true;
        itemstoput.forEach(e => {
            if (onItems[e.nr].acceptType.findIndex(f=> f === e.item.itemType) === -1) {
                check = false;
                return;
            }
            if (e.item.lvl > this.props.hero.level) {
                check = false;
            }
        });
        return check;
    }
}
// -------------------------- connection with the store

const mapDispatchToProps = (dispatch: any) => {
    return {
        updateEquipment: (modification: IEquipmentModifyResult) => dispatch(Update_Equipment(modification)),
    };
};

export const Equipment = connect(null, mapDispatchToProps)(ConnectedEquipment);

// -------------- interfaces

export interface IActiveItem {
    activeItem: string;
    activeType: ItemTypes;
}

interface IPassedChangeEqData {
    From: string;
    To: string;
}