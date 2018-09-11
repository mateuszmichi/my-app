import * as React from 'react';

import Button from '@material-ui/core/Button';

import styled from 'styled-components';

import { ClickAwayListener } from '@material-ui/core';

// ----------- constants

const AcceptDiv = styled.div`
background-color:white;
text-align:center;
border-radius: 5px;
position:relative;
width:300px;
padding:15px;
padding-bottom:50px;
`;
const ButtonDiv = styled.div<{ isLeft: boolean }>`
position:absolute;
bottom:0;
${props => props.isLeft ? `left:0` : `right:0`};
padding:5px;
`;

class AcceptDialog extends React.Component<{ question: string, details: string, acceptFun: VoidFunction, denyFun: VoidFunction }, {}>{
    constructor(props: any) {
        super(props);
        // -------binding
    }

    public render() {
        return (
            <ClickAwayListener onClickAway={this.props.denyFun}>
                <AcceptDiv>
                    <div>
                        <h2>{this.props.question}</h2>
                        <p>{this.props.details}</p>
                    </div>
                    <ButtonDiv isLeft={true}>
                        <Button
                            variant="flat"
                            color="secondary"
                            onClick={this.props.denyFun}
                        >
                            Abort</Button>
                    </ButtonDiv>
                    <ButtonDiv isLeft={false}>
                        <Button
                            variant="flat"
                            color="primary"
                            onClick={this.props.acceptFun}
                        >
                            Accept</Button>
                    </ButtonDiv>
                </AcceptDiv>
            </ClickAwayListener>
        );
    }
}


// ===============================

export default AcceptDialog; 