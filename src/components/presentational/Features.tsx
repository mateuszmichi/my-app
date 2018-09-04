import * as React from 'react';

import '../css/Features.css';

import { Divider } from '@material-ui/core';

import Checkbox from '@material-ui/core/Checkbox';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


// ---------- data
import { GameElements, TODOS } from '../data/textsToFill';


class Features extends React.Component<{}, {}> {
    constructor(props: any) {
        super(props);
    }
    public componentWillMount() {
        document.title = "Development";
    }
    public componentWillUnmount() {
        document.title = "Shattered Plains";
    }

    public render(): JSX.Element {
        return (
            <div className="insideContent">
                <div className="ContentField">
                    <div className="Header">
                        Developed game elements
                    </div>
                    <Divider />
                    <div className="GameElements">
                        <div className="TextDiv">
                            Click to get more information about each of developed elements.<br />
                            <span className="Warning">Some features may look in a different way after changes.</span>
                        </div>
                        {GameElements.map((e, i) =>
                            (<ExpansionPanel key={i}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} >
                                    <Typography className="GameElement">{e.title}</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    {e.description}
                                </ExpansionPanelDetails>
                            </ExpansionPanel>)
                        )}
                    </div>
                    <div className="Header">
                        List of upcoming features:
                    </div>
                    <Divider />
                    <div className="TodoElements">
                        {TODOS.map((e, i) =>
                            (<div key={i}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            className="CheckBox"
                                            checked={e.isMade}
                                        />
                                    }
                                    label={e.feature}
                                />
                            </div>)
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

// ========================================

export default Features;