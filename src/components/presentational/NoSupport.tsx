import * as React from 'react';

import styled from 'styled-components';

const DisplayMain = styled.div`
height:100%;
width:100%;
display:flex;
flex-direction: column;
align-content: center;
background-color:white;
`;
const Middle = styled.div`
text-align:center;
font-color:gray;
margin:auto;
> h1 {
    font-size:5rem;
    letter-spacing:0.8rem;
}
padding:10px;
`;

export class NoSupport extends React.Component {
    public render() {
        return (
            <DisplayMain>
                <Middle>
                    <h1>\(o_o)/</h1>
                    <p>Your browser is currently not supported. We advice using Chrome or Firefox.</p>
                </Middle>
            </DisplayMain>
        );
    }
}