import * as React from 'react';
import { connect } from 'react-redux';

import { IConnectionData } from '../data/connectionConf';

import UnderConstruction from '../presentational/UnderConstruction';

import { IHero } from '../TYPES';

// -------------------


class ConnectedQuests extends React.Component<{ visible: boolean, hero: IHero, ConnData: IConnectionData }, {}>{
    constructor(props: any) {
        super(props);
        // --------- bindings

    }
    public render() {
        return (
            <div id="Quests" className={(this.props.visible) ? "Active" : "InActive"} style={{ height: "100%" }}>
                <UnderConstruction />
            </div>
        );
    }
}
// -------------------------- connection with the store

export const Quests = connect(null, null)(ConnectedQuests);

// -------------- interfaces