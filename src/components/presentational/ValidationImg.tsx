import * as React from 'react';

import Popper from '@material-ui/core/Popper';

import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
// import Typography from '@material-ui/core/Typography';

import '../css/ValidationImg.css';

// -------------------- images
import * as invalidSrc from '../img/Login/invalid.png';


export default class ValidationImg extends React.Component<{ name: string, description: string[] }, { clicked: boolean, target: HTMLElement | null, img: JSX.Element }>{
    constructor(props: any) {
        super(props);

        this.handleClick = this.handleClick.bind(this);

        this.state = {
            clicked: false,
            img: (<img src={String(invalidSrc)} className="ValidationImg" onClick={this.handleClick} id={this.props.name} />),
            target: null,
        };

    }
    public render(): JSX.Element {
        return (
            <React.Fragment>
                <span aria-describedby={this.props.name}>
                    {this.state.img}
                </span>
                <Popper id={this.props.name}
                    open={this.state.clicked}
                    anchorEl={document.getElementById(this.props.name) as HTMLElement}
                    // anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                    // transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                    // onMouseDown={this.handleClick}
                    transition={true}
                >
                    {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={350}>
                            <Paper>
                                <div className="ValidationPopup">{this.props.description.map((e) => (<div key={e}>{e}</div>))}</div>
                            </Paper>
                        </Fade>
                    )}
                    
                </Popper>
            </React.Fragment>
        )
    }
    private handleClick(event: any): void {
        const { currentTarget } = event;
        if (!this.state.clicked) {
            setTimeout(() => { if (this.state.clicked) { this.setState({ clicked: false, target: null }); } }, 3000);
        }
        this.setState({ clicked: !this.state.clicked, target: currentTarget as HTMLElement });
    }
}