import * as React from 'react';

import '../css/gamecomponents/Equipment.css';

import { EquipmentScene } from './scenes/EquipmentScene';

import { Backpack } from './presentational/Backpack';
import { Statistics } from './presentational/Statistics';

import { IHero } from '../TYPES';

import { IConnectionData } from '../data/connectionConf';
import { IEquipmentResult, IItemResult, ItemTypes } from '../data/gameTYPES';

import { Inventory } from './presentational/Inventory';
import { ItemDescription } from './presentational/ItemDescription';

// -------------------




export class Equipment extends React.Component<{ visible: boolean, hero: IHero, ConnData: IConnectionData,  }, {active: IActiveItem|null}>{
    private heroScene: Phaser.Game;
    constructor(props: any) {
        super(props);
        // --------- bindings
        this.showItemDialog = this.showItemDialog.bind(this);
        this.handleActivateItem = this.handleActivateItem.bind(this);
        this.handleDisactivateItem = this.handleDisactivateItem.bind(this);

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
        return (<div id="Equipment" className={(this.props.visible) ? "Active" : "InActive"} onClick={this.handleDisactivateItem}>
            <Backpack equipment={this.props.hero.equipment} itemDetails={this.showItemDialog} activeItem={this.state.active} makeActiveFun={this.handleActivateItem}/>
            <div className="HeroModel">
                <div className="TopField">
                    <Statistics hero={this.props.hero} />
                </div>
                <div className="BottomField">
                    <div className="HeroDisplay" id="HeroDisplay" />
                    <Inventory equipment={this.props.hero.equipment} itemDetails={this.showItemDialog} activeItem={this.state.active} makeActiveFun={this.handleActivateItem}/>
                </div>
            </div>
        </div>);
    }
    private showItemDialog(equipment: IEquipmentResult, item: IItemResult, status: number) {
        this.props.ConnData.popDialog(<ItemDescription equipment={equipment} item={item} isOn={status === 1} ConnData={this.props.ConnData}/>);
    }
    private handleActivateItem(event: any, activeItem: IActiveItem) {
        event.stopPropagation();
        this.setState({ active: activeItem });
    }
    private handleDisactivateItem() {
        this.setState({ active: null });
    }
}

export interface IActiveItem {
    activeItem: string;
    activeType: ItemTypes;
}