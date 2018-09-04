import * as React from 'react';

import { Divider } from '@material-ui/core';

import { IHero } from '../../TYPES';

import { HeroGenStatistics, HeroMaxHP, HeroMaxSL,  } from '../../data/gameCALC';
// ------------------- images

import * as mentalSrc from '../../img/Game/EQ/mental.svg';
import * as physicalSrc from '../../img/Game/EQ/physical.svg';
import * as presentationSrc from '../../img/Game/EQ/presentation.svg';

import * as attackSrc from '../../img/Game/EQ/attack.svg';
import * as defenseSrc from '../../img/Game/EQ/defense.svg';
import * as healthSrc from '../../img/Game/EQ/health.svg';
import * as stormlightSrc from '../../img/Game/EQ/stormlight.svg';





export class Statistics extends React.Component<{ hero: IHero }, {}>{
    constructor(props: any) {
        super(props);
    }

    public render() {
        const Stats = HeroGenStatistics(this.props.hero);
        return (<div className="Statistics">
            <div className="TopStatistics">Statistics</div>
            <Divider light={true} />
            <div className="BottomStatistics">
                <div className="Block">
                    <div className="Middled">
                        <div className="inlineDiv VerticalMiddle"><img src={String(physicalSrc)} /></div>
                        <div className="inlineDiv">
                            <div className="StatisticsGroup Physical">
                                <div className="stat"><div>Strenght</div><div>{Stats.Attributes[0]}</div></div>
                                <div className="stat"><div>Endurance</div><div>{Stats.Attributes[1]}</div></div>
                                <div className="stat"><div>Dexterity</div><div>{Stats.Attributes[2]}</div></div>
                                <div className="stat"><div>Reflex</div><div>{Stats.Attributes[3]}</div></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="Block">
                    <div className="Middled">
                        <div className="inlineDiv VerticalMiddle"><img src={String(mentalSrc)} /></div>
                        <div className="inlineDiv">
                            <div className="StatisticsGroup Mental">
                                <div className="stat"><div>Knowledge</div><div>{Stats.Attributes[4]}</div></div>
                                <div className="stat"><div>Intelligence</div><div>{Stats.Attributes[5]}</div></div>
                                <div className="stat"><div>Charisma</div><div>{Stats.Attributes[6]}</div></div>
                                <div className="stat"><div>Willpower</div><div>{Stats.Attributes[7]}</div></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="Block">
                    <div className="Middled">
                        <div className="inlineDiv VerticalMiddle"><img src={String(presentationSrc)} /></div>
                        <div className="inlineDiv">
                            <div className="StatisticsGroup Physical">
                                <div className="stat"><div><img src={attackSrc} /></div><div>{Stats.AttackMin}-{Stats.AttackMax}</div></div>
                                <div className="stat"><div><img src={defenseSrc} /></div><div>{Stats.Armour}</div></div>
                                <div className="stat"><div><img src={healthSrc} /></div><div>{this.props.hero.hp}/{HeroMaxHP(this.props.hero.hpmax,Stats.Attributes)}</div></div>
                                <div className="stat"><div><img src={stormlightSrc} /></div><div>{this.props.hero.sl}/{HeroMaxSL(this.props.hero.slmax, Stats.Attributes)}</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}