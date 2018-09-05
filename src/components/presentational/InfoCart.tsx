import * as React from 'react';

import styled from 'styled-components';

import { IRosharCart } from '../data/textsToFill';

import { ClickAwayListener } from '@material-ui/core';
import Button from '@material-ui/core/Button';


// ---------- data
const Cart = styled.div`
    background-color:white;
    border-radius: 5px;
    position:relative;
    margin:auto;
    width: 50%;
    min-width: 320px;
    max-width: 800px;
    overflow: hidden;
`;

const ImageContainer = styled.div`
    position:relative;
    width:100%;
> img {
    width: 100%;
}
> 
`;
const InfoDiv = styled.div`
    position:relative;
    padding:1rem;
    padding-left:5%;
    padding-right:5%;
`;
const BottomDiv = styled.div`
    text-align:right;
    > Button {
        width:100%;
    }
`;
const TitleDiv = styled.div`
    position:absolute;
    font-size: 2rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color:white;
    text-shadow: 0 0 1.5rem black;
`;
const MoreDiv = styled.div`
    text-align: justify;
    justify: auto;
    line-height: 1.5rem;
    p {
        margin:0.25rem;
    }
        a {
                width:auto;
                margin:auto;
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
                &:hover{
                    border-bottom: solid 2px rgb(11, 74, 188);
                    padding-bottom: 1px;
                }
            }
`;
const IntroDiv = styled(MoreDiv)`
    font-weight:bold;
    text-align:center;
`;
class InfoCart extends React.Component<{ cart: IRosharCart, closeFun: VoidFunction }, {}> {
    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <ClickAwayListener onClickAway={this.props.closeFun}>
                <Cart>
                    <ImageContainer>
                        <img src={this.props.cart.graphics} />
                        <TitleDiv>
                            <span>
                                {this.props.cart.title}
                            </span>
                        </TitleDiv>
                    </ImageContainer>
                    <InfoDiv>

                        <IntroDiv>
                            {this.props.cart.brief}
                        </IntroDiv>
                        <MoreDiv>
                            {this.props.cart.description}
                        </MoreDiv>
                    </InfoDiv>
                    <BottomDiv>
                        <Button
                            onClick={this.props.closeFun}
                            color="default"
                            size="medium"
                        >
                            BACK
                        </Button>
                    </BottomDiv>
                </Cart>
            </ClickAwayListener>
        );
    }
}


// ========================================

export default InfoCart;