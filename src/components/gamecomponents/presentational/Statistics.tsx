import * as React from 'react';

import { Divider } from '@material-ui/core';

import { IHero } from '../../TYPES';
// ------------------- images

import * as mentalSrc from '../../img/Game/EQ/mental.svg';
import * as physicalSrc from '../../img/Game/EQ/physical.svg';
import * as presentationSrc from '../../img/Game/EQ/presentation.svg';



export class Statistics extends React.Component<{ hero: IHero }, {}>{
    public render() {
        return (<div className="Statistics">
            <div className="TopStatistics">Statistics</div>
            <Divider light={true} />
            <div className="BottomStatistics">
                <div className="Block">
                    <div className="Middled">
                        <div className="inlineDiv VerticalMiddle"><img src={String(physicalSrc)} /></div>
                        <div className="inlineDiv">
                            <div className="StatisticsGroup Physical">
                                <div className="stat"><div>Strenght</div><div>{this.props.hero.attributes[0]}</div></div>
                                <div className="stat"><div>Endurance</div><div>{this.props.hero.attributes[1]}</div></div>
                                <div className="stat"><div>Dexterity</div><div>{this.props.hero.attributes[2]}</div></div>
                                <div className="stat"><div>Reflex</div><div>{this.props.hero.attributes[3]}</div></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="Block">
                    <div className="Middled">
                        <div className="inlineDiv VerticalMiddle"><img src={String(mentalSrc)} /></div>
                        <div className="inlineDiv">
                            <div className="StatisticsGroup Mental">
                                <div className="stat"><div>Knowledge</div><div>{this.props.hero.attributes[4]}</div></div>
                                <div className="stat"><div>Intelligence</div><div>{this.props.hero.attributes[5]}</div></div>
                                <div className="stat"><div>Charisma</div><div>{this.props.hero.attributes[6]}</div></div>
                                <div className="stat"><div>Willpower</div><div>{this.props.hero.attributes[7]}</div></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="Block">
                    <div className="Middled">
                        <div className="inlineDiv VerticalMiddle"><img src={String(presentationSrc)} /></div>
                        <div className="inlineDiv">
                            <div className="StatisticsGroup Physical">
                                <div className="stat"><div>Attack</div><div>0</div></div>
                                <div className="stat"><div>Armour</div><div>0</div></div>
                                <div className="stat"><div>Health</div><div>{this.props.hero.hp}/{this.props.hero.hpmax}</div></div>
                                <div className="stat"><div>StormLight</div><div>{this.props.hero.sl}/{this.props.hero.slmax}</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}