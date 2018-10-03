import * as React from 'react';

import '../../../css/dialogs/CreateCharacterDialog.css'

import { Divider } from '@material-ui/core';

import { IHeroData } from '../CreateCharacterDialog';

// ----------- images

import alethiSrc from '../../../img/Account/Alethkar.jpg';
import jahkevedSrc from '../../../img/Account/JahKeved.jpg';

import ardentSrc from '../../../img/Account/ardent2.jpg';
import nobleSrc from '../../../img/Account/noble.png';
import slaveSrc from '../../../img/Account/slave.png';
import swordsmanSrc from '../../../img/Account/swordman.png';

export class ChampionsOriginCountry extends React.Component<{ initialData: IHeroData, updateDataFun: (country: number) => void }, { country: number }>{
    constructor(props: any) {
        super(props);
        // -------binding
        this.handleCountryChange = this.handleCountryChange.bind(this);

        this.state = {
            country: this.props.initialData.country,
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
        this.props.updateDataFun(res);
    }
}

export class ChampionsOriginHistory extends React.Component<{ initialData: IHeroData, updateDataFun: (origin: number) => void }, {origin: number }>{
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
        this.handleOriginChange = this.handleOriginChange.bind(this);
        this.GenOptions = this.GenOptions.bind(this);

        this.state = {
            origin: this.props.initialData.origin,
        }
    }
    public render() {
        return (
            <div>
                <div className="OriginSelect">
                    <div className="TitleBar">Select backstory of this character</div>
                    <Divider />
                    {this.GenOptions(this.state.origin, this.ListOrigin, this.handleOriginChange)}
                    {(this.state.origin !== -1) && (<p>{this.ListOrigin[this.state.origin].description}</p>)}
                </div>
            </div>);
    }
    private handleOriginChange(index: number): void {
        this.setState({ origin: index });
        this.props.updateDataFun(index);
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

class PickturePicker extends React.Component<{ picture: string, selectFun: VoidFunction, under: string, isSelected: boolean }, {}> {
    public render() {
        return (<button name={this.props.under} onClick={this.props.selectFun} className={(this.props.isSelected) ? "ButtonActive" : "ButtonInActive"}>
            <img src={this.props.picture} /><br />
            <span>{this.props.under}</span>
        </button>);
    }
}

interface IOptionButton {
    description: string;
    picture: string;
    under: string;
}