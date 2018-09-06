import * as React from 'react';

import styled from 'styled-components';

import { IconsAuthors, picturesData, } from '../data/picturesData';

import { Divider } from '@material-ui/core';

// import { ClickAwayListener } from '@material-ui/core';
// import Button from '@material-ui/core/Button';


// ---------- data
const IconsList = styled.div`
margin:auto;
padding:10px;
a {
    text-decoration: none;
    padding-bottom: 3px;
    color: rgb(11, 74, 188);
    border-color: white;
    -webkit-transition: color 0.5s ease-in-out;
    -o-transition: color 0.5s ease-in-out;
    transition: color 0.5s ease-in-out;
    -webkit-transition: border-color 0.5s ease-in-out;
    -o-transition: border-color 0.5s ease-in-out;
    transition: border-color 0.5s ease-in-out;
    &:hover {
        padding-bottom: 1px;
        border-bottom: 2px solid rgb(11, 74, 188);
    }
}
`;
const CreditsDisplay = styled.div`
height:100%:
width: 60%;
min-width: 320px;
max-width: 720px;
margin: auto;
background-color:rgb(255,255,255);
padding:10px;
`;
const PictureContainer = styled.div`
    margin-top:10px;
    margin-bottom:10px;
    position:relative;
`;

const ImageContainer = styled.div<{ image: string }>`
display: inline-block;
vertical-align: middle;
height:64px;
width:64px;
background-size:contain;
background-position:center;
background-repeat: no-repeat;
background-image: url("${props => props.image}");
`;
const InfoDiv = styled.div`
text-align:center;
display: inline-block;
vertical-align: middle;
width: calc(100% - 80px);
> div {
    padding:5px;
}
`;
class Credits extends React.Component<{}, {}> {
    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <CreditsDisplay>
                <IconsList>
                    <h2>List of authors of icons used in the game:</h2>
                    <ul>
                        {IconsAuthors.map((e, i) =>
                            <li key={i} style={{padding:"5px"}}>
                                {e}
                            </li>
                        )}
                    </ul>
                </IconsList>
                <IconsList>
                    <h2>List of images used in the game:</h2>
                    {picturesData.sort((a,b)=>a.imageName.localeCompare(b.imageName)).map((e, i) => {
                        const imageIcon = require('../img/Minatures/' + e.imageName);
                        return (
                            <div key={i}>
                                <PictureContainer >
                                    <ImageContainer image={String(imageIcon)} />
                                    <InfoDiv>
                                        <div><b>Author</b></div>
                                        <div><i>{e.author}</i></div>
                                        <div><a href="{e.source}">Source</a></div>
                                    </InfoDiv>

                                </PictureContainer>
                                <Divider />
                            </div>
                        );
                    })}
                </IconsList>
                
            </CreditsDisplay>
        );
    }
}


// ========================================

export default Credits;