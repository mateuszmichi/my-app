import * as React from 'react';

import styled from 'styled-components';

import { IRosharCart } from '../data/textsToFill';

import Button from '@material-ui/core/Button';

// ---------- data
const SimplePopper = styled.div`
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: fixed;
`;

const HoverDiv = styled.div<{}>`
    position: fixed;
    touch-action: none;
    top: 0;
    width: 100%;
    height: 100%;
    display: none;
`;
const InfoDiv = styled.div`
    position:absolute;
    left:10px;
    top:100px;
`;

class InfoCart extends React.Component<{ cart: IRosharCart }, {}> {
    constructor(props: any) {
        super(props);
        this.renderCart = this.renderCart.bind(this);

    }

    public render() {
        return (
            <SimplePopper>
                <HoverDiv aria-hidden={true} />
                <InfoDiv>
                    ELo ELO
                    </InfoDiv>
                </SimplePopper>
        );
    }
    private renderCart(element: IRosharCart, key: number): JSX.Element {
        return (
            <div className="Cart" key={key}>
                <div className="ImagePlace" style={{ backgroundImage: "url(" + element.graphics + ")" }} />
                <div className="ImageTitle">
                    <div>{element.title}</div>
                </div>
                <div className="ButtonPlace">
                    <Button
                        variant="flat"
                        color="default"
                        size="small"
                    >Description</Button>
                </div>
            </div>
        );
    }
}


// ========================================

export default InfoCart;