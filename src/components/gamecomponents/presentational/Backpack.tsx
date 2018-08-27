import * as React from 'react';

import { MoneyToGems } from '../../data/gameCALC';
import { CharacterAttributes, IEquipmentResult,  } from '../../data/gameTYPES';

import { ClickAwayListener, Fade, Paper, Popper, } from '@material-ui/core';


export class Backpack extends React.Component<{ equipment: IEquipmentResult }, { anchorEl: any, popperOpen: boolean, activeElement: number | null }>{
    constructor(props: any) {
        super(props);
        // --------- bindings
        this.GenGoldStatus = this.GenGoldStatus.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClickAway = this.handleClickAway.bind(this);
        this.ItemDescription = this.ItemDescription.bind(this);

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
                            const onClickFun = (event: any) => {
                                this.handleClick(event, key);
                            }
                            const image = require('../../img/Game/Items/' + e + '.png');
                            return (<div className="ItemSlotHolder" key={key}>
                                <div className="ItemSlot">
                                    <div className="Item" onClick={onClickFun}>
                                        <img src={String(image)} />
                                    </div>
                                </div>
                            </div>);
                        } else {
                            return (<div className="ItemSlotHolder" key={key}><div className="ItemSlot" /></div>);
                        }
                    })}
                    <Popper
                        open={this.state.popperOpen}
                        anchorEl={this.state.anchorEl}
                        style={{ zIndex: 1 }}
                        placement='bottom'
                        disablePortal={false}
                        modifiers={{
                            // arrow: {
                            //    element: this.state.anchorEl,
                            //    enabled: true,
                            // },
                            flip: {
                                enabled: true,
                            },

                            preventOverflow: {
                                boundariesElement: 'scrollParent',
                                enabled: true,
                            },
                        }}
                        transition={true}
                    >
                        {({ TransitionProps }) => (
                            <Fade {...TransitionProps} timeout={150}>
                                <ClickAwayListener onClickAway={this.handleClickAway}>
                                    <Paper>
                                        {(this.state.activeElement === null) ? <span /> :
                                            this.ItemDescription(this.state.activeElement)
                                        }

                                    </Paper>
                                </ClickAwayListener>
                            </Fade>
                        )}
                    </Popper>

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

    private handleClick(event: any, id: number): void {
        const { currentTarget } = event;
        this.setState({ popperOpen: true, anchorEl: currentTarget as HTMLElement, activeElement: id });
    }
    private handleClickAway(): void {
        this.setState({ popperOpen: false, anchorEl: null, activeElement: null });
    }
    private ItemDescription(id: number): JSX.Element {
        const element = this.props.equipment.backpack[id];
        if (element === null) {
            throw Error("Unknown Item!");
        }
        const data = this.props.equipment.knownItems.find(e => e.itemID === element);
        if (data === undefined) {
            throw Error("Unknown Item!");
        }
        const toshow = [];
        for (let i = 0; i < 8; i++) {
            if (data.attributes[i] > 0) {
                toshow.push({ description: CharacterAttributes[i], count: data.attributes[i] });
            }
        }
        return (<div>
            <div>
                {data.name}
            </div>
            <div>
                {data.itemType}
            </div>
            <div>
                {(data.primaryAttr === data.secondaryAttr) ? data.primaryAttr : data.primaryAttr + " - " + data.secondaryAttr}
            </div>
            <div>
                {toshow.map((e, i) => (<div key={i}>{e.description.name} : {e.count}</div>))}
            </div>
        </div>)
    }
}