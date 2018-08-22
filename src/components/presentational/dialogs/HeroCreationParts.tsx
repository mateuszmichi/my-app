import * as React from 'react';

import '../../css/dialogs/CreateCharacterDialog.css'

import { Divider, TextField, } from '@material-ui/core';

import { IHeroData, IHeroName } from './CreateCharacterDialog';

import { CharacterAttributes, IAttribute } from '../../data/gameTYPES';
// ----------- images
import warriorSrc from '../../img/Account/warrior.png';
import warriorinSrc from '../../img/Account/woman_warrior.png';

import alethiSrc from '../../img/Account/Alethkar.jpg';
import jahkevedSrc from '../../img/Account/JahKeved.jpg';

import ardentSrc from '../../img/Account/ardent2.jpg';
import nobleSrc from '../../img/Account/noble.png';
import writedownSrc from '../../img/Account/quill-drawing-a-line.png';
import slaveSrc from '../../img/Account/slave.png';
import swordsmanSrc from '../../img/Account/swordman.png';




export class ChampionsSex extends React.Component<{ initialData: IHeroData, updateDataFun: (data: boolean) => void }, { isMan: boolean }>{
    constructor(props: any) {
        super(props);
        // -------binding
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            isMan: this.props.initialData.isMan,
        }
    }
    public render() {
        return (
            <div className="SexSelect">
                <div className="TitleBar">Select sex of your character</div>
                <Divider />
                <button name="Man" onClick={this.handleChange} className={(this.state.isMan) ? "ButtonActive" : "ButtonInActive"}>
                    <img src={String(warriorSrc)} /><br />
                    <span>Man</span>
                </button>
                <button name="Woman" onClick={this.handleChange} className={(!this.state.isMan) ? "ButtonActive" : "ButtonInActive"}>
                    <img src={String(warriorinSrc)} /><br />
                    <span>Woman</span>
                </button>
            </div>);
    }
    private handleChange(event: React.MouseEvent<HTMLButtonElement>) {
        this.setState({ isMan: event.currentTarget.name === "Man", });
        this.props.updateDataFun(event.currentTarget.name === "Man");
    }

}
export class ChampionsOrigin extends React.Component<{ initialData: IHeroData, updateDataFun: (data: { country: number, origin: number }) => void }, { country: number, origin: number }>{
    private ListOrigin: IOptionButton[] = [
        {
            description: "Slaves, who survived all adversities, are know to have high strength and durability.",
            picture: String(slaveSrc),
            under: "Slave",
        },
        {
            description: "Ardents are always looking for knowledge. They are known to posses great knowledge and wisdom.",
            picture: String(ardentSrc),
            under: "Ardent",
        },
        {
            description: "Every child dreams of becoming a soldier. Their skill in fight and composure are an incredible advantage on a battlefield.",
            picture: String(swordsmanSrc),
            under: "Warrior",
        },
        {
            description: "According to the Vorin religion, all lighteyes are born to rule. They have got charm and charisma.",
            picture: String(nobleSrc),
            under: "Lighteye",
        },
    ]
    constructor(props: any) {
        super(props);
        // -------binding
        this.handleCountryChange = this.handleCountryChange.bind(this);
        this.handleOriginChange = this.handleOriginChange.bind(this);
        this.GenOptions = this.GenOptions.bind(this);

        this.state = {
            country: this.props.initialData.country,
            origin: this.props.initialData.origin,
        }
    }
    public render() {
        return (
            <div>
                <div className="CountrySelect">
                    <div className="TitleBar">Select origin of Your character</div>
                    <Divider />
                    <button name="Alethi" onClick={this.handleCountryChange} className={(this.state.country === 0) ? "ButtonActive" : "ButtonInActive"}>
                        <img src={String(alethiSrc)} />
                    </button>
                    <button name="JahKeved" onClick={this.handleCountryChange} className={(this.state.country === 1) ? "ButtonActive" : "ButtonInActive"}>
                        <img src={String(jahkevedSrc)} />
                    </button>
                </div>
                <div className="OriginSelect">
                    <div className="TitleBar">Select backstory of this character</div>
                    <Divider />
                    {this.GenOptions(this.state.origin, this.ListOrigin, this.handleOriginChange)}
                    {(this.state.origin !== -1) && (<p>{this.ListOrigin[this.state.origin].description}</p>)}
                </div>
            </div>);
    }
    private handleCountryChange(event: React.MouseEvent<HTMLButtonElement>) {
        let res: number = -1;
        switch (event.currentTarget.name) {
            case "Alethi":
                res = 0;
                break;
            case "JahKeved":
                res = 1;
                break;
        }
        this.setState({ country: res });
        this.props.updateDataFun({ country: res, origin: this.state.origin });
    }
    private handleOriginChange(index: number): void {
        this.setState({ origin: index });
        this.props.updateDataFun({ country: this.state.country, origin: index });
    }
    private GenOptions(currindex: number, options: IOptionButton[], handleFun: (index: number) => void): JSX.Element[] {
        const ret: JSX.Element[] = [];
        options.forEach((value, index) => {
            const fun = () => {
                handleFun(index);
            }
            ret.push(<PickturePicker key={index} isSelected={currindex === index} picture={value.picture} selectFun={fun} under={value.under} />);
        });
        return ret;
    }
}
export class ChampionsAttributes extends React.Component<{ initialData: IHeroData, updateDataFun: (data: number[]) => void, pointsLimit: number }, { attributes: number[], leftPoints: number, description: number }>{
    private ListOrigin: IAttributePicker[] = CharacterAttributes.map<IAttributePicker>((val, index) => ({ attribute: val, value: this.props.initialData.attributes[index] } as IAttributePicker));
    private MinValue = 8;
    private MaxValue = 20;
    constructor(props: any) {
        super(props);
        // -------binding
        this.handleChange = this.handleChange.bind(this);
        this.renderAttribute = this.renderAttribute.bind(this);
        this.handleOver = this.handleOver.bind(this);

        let left = this.props.pointsLimit;
        this.props.initialData.attributes.forEach((value) => { left -= value });
        if (this.props.initialData.attributes.length !== CharacterAttributes.length) {
            throw new Error('Bad data passed here!');
        }
        this.state = {
            attributes: this.props.initialData.attributes,
            description: -1,
            leftPoints: left,
        }
    }
    public render() {
        return (
            <div className="AttributesSelect">
                <div className="TitleBar">Spend points on Your character</div>
                <Divider />
                <div className="AttributesSelector">
                    <div className="AttributesSelectorPart">
                        <div className="AttributesList">
                            {this.ListOrigin.map((value, index) => this.renderAttribute(value, index))}
                        </div>
                    </div>
                    <div className="AttributesSelectorPart">

                        <b><span>Points left: </span><span>{this.state.leftPoints}</span></b><br />
                        {(this.state.description !== -1) && (<div><div className="TitleBar">{this.ListOrigin[this.state.description].attribute.name}</div> <Divider /> <div className="AttributesDescription">{this.ListOrigin[this.state.description].attribute.description}</div></div>)}

                    </div>
                </div>
            </div>);
    }
    private handleChange(increase: boolean, index: number): boolean {
        const curr = this.state.attributes;
        if (increase && (this.state.leftPoints > 0) && (this.state.attributes[index] < this.MaxValue)) {
            curr[index] += 1;
            this.setState({ attributes: curr, leftPoints: this.state.leftPoints - 1 });
            this.props.updateDataFun(curr);
            return true;
        }
        if (!increase && (this.state.attributes[index] > this.MinValue)) {
            curr[index] -= 1;
            this.setState({ attributes: curr, leftPoints: this.state.leftPoints + 1 });
            this.props.updateDataFun(curr);
            return true;
        }
        return false;
    }
    private handleOver(index: number): void {
        this.setState({ description: index });
    }
    private renderAttribute(attr: IAttributePicker, index: number): JSX.Element {
        const fun = (increase: boolean) => {
            return this.handleChange(increase, index);
        }
        const fun2 = () => {
            this.handleOver(index);
        }
        return (<AttributeShow description={attr.attribute.name} changeFun={fun} hoverFun={fun2} initialData={attr.value} key={index} />);
    }
}

class PickturePicker extends React.Component<{ picture: string, selectFun: VoidFunction, under: string, isSelected: boolean }, {}> {
    public render() {
        return (<button name={this.props.under} onClick={this.props.selectFun} className={(this.props.isSelected) ? "ButtonActive" : "ButtonInActive"}>
            <img src={this.props.picture} /><br />
            <span>{this.props.under}</span>
        </button>);
    }
}
class AttributeShow extends React.Component<{ description: string, changeFun: (increase: boolean) => boolean, hoverFun: VoidFunction, initialData: number }, { value: number }> {
    constructor(props: any) {
        super(props);
        // -------binding
        this.increase = this.increase.bind(this);
        this.decrease = this.decrease.bind(this);

        this.state = {
            value: this.props.initialData,
        }
    }
    public render() {
        return (<div className="AttributeShow" onMouseEnter={this.props.hoverFun}>
            <div>{this.props.description}</div>
            <div>{this.state.value}</div>
            <div>
                <button onClick={this.decrease}>-</button>
                <button onClick={this.increase}>+</button>
            </div>
        </div>);
    }

    private increase() {
        if (this.props.changeFun(true)) {
            this.setState({ value: this.state.value + 1 });
        }
    }
    private decrease() {
        if (this.props.changeFun(false)) {
            this.setState({ value: this.state.value - 1 });
        }
    }
}
export class ChampionsName extends React.Component<{ initialData: IHeroData, updateDataFun: (data: IHeroName) => void }, { input: IHeroName }> {
    constructor(props: any) {
        super(props);
        // -------binding
        this.handleUserInput = this.handleUserInput.bind(this);

        this.state = {
            input: this.props.initialData as IHeroName,
        }
    }
    public render() {
        return (<div className="CharacterIdentity">
            <div className="TitleBar">Character's name and nickname</div>
            <Divider />
            <div>
                <img src={String(writedownSrc)} />
                <div className="FormData">
                    <TextField
                        id="login-input"
                        label={(this.props.initialData.isMan) ? "Hero's name" : "Heroin's name"}
                        type="text"
                        name="name"
                        value={this.state.input.name} onChange={this.handleUserInput}
                    /><br />
                    <TextField
                        id="nickname-input"
                        label={(this.props.initialData.isMan) ? "Hero's nickname" : "Heroin's nickname"}
                        type="text"
                        name="nickname"
                        value={this.state.input.nickname} onChange={this.handleUserInput}
                    />
                    <div className="TitleBar">Hints</div>
                    <Divider />
                    <p>
                        Character's name should be between 4 to 30 characters.
                        {(this.props.initialData.isMan) ? " His" : " Her"} nickname should be between 4 to 50 characters.
                </p>
                </div>
            </div>
        </div>);
    }

    private handleUserInput(e: React.FormEvent<HTMLInputElement>) {
        const name = e.currentTarget.name as string;
        const value = e.currentTarget.value as string;
        const inp = this.state.input;
        inp[name] = value;
        this.setState({ input: inp });
        this.props.updateDataFun(inp);
    }
}

interface IOptionButton {
    description: string;
    picture: string;
    under: string;
}
interface IAttributePicker {
    attribute: IAttribute;
    value: number;
}