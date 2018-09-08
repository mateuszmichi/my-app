import * as React from 'react';

import styled from 'styled-components';

// -------------------- images

import * as constructionSrc from '../img/MainPage/under-construction.svg';

// ---------- data
const Box = styled.div`
position:relative;
top:0;
height:100%;
width:100%;
background: #5E5E5E;
color: white;
font-size: 1.5rem;
font-weight: bold;
img {
	height:80px;
	width:80px;
}
text-align:center;
display:flex;
align-content:center;
> div {
	margin:auto;
}
`;

class UnderConstruction extends React.Component {

    public render(): JSX.Element {
        return (
            <Box>
                <div>
                    <div>
                        This part is still under construction...
						</div>
                    <div>
                        <img src={String(constructionSrc)} />
                    </div>
                </div>
            </Box>
        );
    }
}


// ========================================

export default UnderConstruction;