import * as React from 'react';

import '../css/Roshar.css';
import { IRosharCart } from '../data/textsToFill';

import Button from '@material-ui/core/Button';

// ---------- data
import { RosharCarts } from '../data/textsToFill';

import InfoCart from './InfoCart';


class Roshar extends React.Component<{}, { activeCart: number | null }> {
    constructor(props: any) {
        super(props);
        this.renderCart = this.renderCart.bind(this);
        this.setActive = this.setActive.bind(this);

        this.state = {
            activeCart: null,
        }
    }
    public componentWillMount() {
        document.title = "About Roshar";
    }
    public componentWillUnmount() {
        document.title = "Shattered Plains";
    }

    public render(): JSX.Element {
        return (
            <div className="insideContent">
                <div className="CartContext">
                    {RosharCarts.map((e, i) => this.renderCart(e, i))}
                </div>
                {(this.state.activeCart !== null) && <InfoCart cart={RosharCarts[this.state.activeCart]} />}
            </div>
        );
    }
    private renderCart(element: IRosharCart, key: number): JSX.Element {
        const onClickFun = () => {
            this.setActive(key);
        }
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
                        onClick={onClickFun}
                    >Description</Button>
                </div>
            </div>
        );
    }
    private setActive(id: number) {
        this.setState({ activeCart: id });
    }
}


// ========================================

export default Roshar;