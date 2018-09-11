import * as React from 'react';

// -------------------
import styled from 'styled-components';

import { Button, Divider, Switch} from '@material-ui/core';

// -------------------
const OptionPopup = styled.div`
position:relative;
background:white;
padding:10px;
padding-bottom:40px;
max-width:720px;
border-radius: 10px;
`;
const ButtonDiv = styled.div`
position:absolute;
bottom:0;
left:0;
width:100%;
> button {
width:100%;
}
`;
const Title = styled.div`
text-align:center;
color:darkblue;
`;
const Addnotation = styled.div`
text-align:center;
color:darkred;
font-weight:bold;
font-style:italic;
`

class Invitational extends React.Component<{ applyFunction: (a: boolean, b: boolean, c: boolean) => void }, { inputs: { fast: boolean, level: boolean, eq: boolean } }>{
    constructor(props: any) {
        super(props);
        // --------- bindings
        this.handleChange = this.handleChange.bind(this);
        this.requireNote = this.requireNote.bind(this);
        this.applyFun = this.applyFun.bind(this);

        this.state = {
            inputs: {
                eq: false,
                fast: false,
                level: false,
            },
        };
    }
    public render() {
        return (
            <OptionPopup id="OptionsPopup">
                <Title><h3>Thank You for creating a new character!</h3></Title>
                <p>In order to test fast available game's options, please customize character's starting options.</p>
                <p>Whether you want to see applied technologies and project, select fast travel option to avoid waiting.</p>
                <p>Unless fighting is implemented, there will be <b>no option</b> to gain an equipment. To try it out, choose starting equipment option!</p>
                <Divider />
                <Title><h3>Options</h3></Title>
                <div>
                    <Switch
                        checked={this.state.inputs.fast}
                        onChange={this.handleChange}
                        color="primary"
                        name="fast"
                    />
                    Fast travel and healing
                </div>
                <div>
                    <Switch
                        checked={this.state.inputs.level}
                        onChange={this.handleChange}
                        color="primary"
                        name="level"
                    />
                    Start with 5th level
                </div>
                <div>
                    <Switch
                        checked={this.state.inputs.eq}
                        onChange={this.handleChange}
                        color="primary"
                        name="eq"
                    />
                    Start with elements of equipment. To equip, visit "Equipment" option on menu.
                </div>
                <Addnotation style={{ visibility: (this.requireNote())?"visible":"hidden"}}><p>The changes will require relogin!</p></Addnotation>
                <Divider />
                <ButtonDiv>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.applyFun}
                    >
                        Apply</Button>
                </ButtonDiv>
            </OptionPopup>
        );
    }
    private handleChange(event: any) {
        const name = event.currentTarget.name as string;
        const inp = Object.assign({}, this.state.inputs);
        inp[name] = event.currentTarget.checked as boolean;
        this.setState({ inputs: inp });
    }
    private applyFun() {
        this.props.applyFunction(this.state.inputs.fast, this.state.inputs.level, this.state.inputs.eq);
    }
    private requireNote() {
        return (this.state.inputs.eq || this.state.inputs.fast || this.state.inputs.level);
    }
}

export default Invitational;

// -------------- interfaces