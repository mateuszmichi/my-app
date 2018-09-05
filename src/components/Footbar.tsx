import * as React from 'react';

import './css/Footbar.css'

import {
    Link,
} from 'react-router-dom';

class Footbar extends React.Component {
    public render() {
        return (
            <div id="footer">
                <div className="footerContent">
                    <Link className="FooterLink" to="/myprojects"><div className="footerButton">MY PROJECTS</div></Link>
                    <Link className="FooterLink" to="/technology"><div className="footerButton">TECHNOLOGIES</div></Link>
                    <div className="footerCentral">Created by Mateusz Michalewski, 2018</div>
                    <Link className="FooterLink" to="/credits"><div className="footerButton">CREDITS</div></Link>
                    <Link className="FooterLink" to="/contact"><div className="footerButton">CONTACT</div></Link>
                </div>
            </div>
        );
    }
}

export default Footbar;
