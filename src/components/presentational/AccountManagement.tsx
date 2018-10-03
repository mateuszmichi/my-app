import * as React from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

import { IAccountOption } from '../Account';

import { isMobile } from "react-device-detect";

import {
    Link,
} from 'react-router-dom';

class AccountManagement extends React.Component<{ AccountOptions: IAccountOption[] }, {}> {
    public render() {
        return (<div className="buttonGroup">
            <List component="nav">
                {this.props.AccountOptions.map((e, i) => (!isMobile || e.route === null) ?
                    <ListItem key={i} component="button" onClick={e.onClick}>
                        <ListItemIcon>
                            {e.icon}
                        </ListItemIcon>
                        <ListItemText primary={e.text} />
                    </ListItem>
                    :
                    <Link to={"/account/" + e.route} style={{ textDecoration: "none" }}>
                        <ListItem key={i} component="button">
                            <ListItemIcon>
                                {e.icon}
                            </ListItemIcon>
                            <ListItemText primary={e.text} />
                        </ListItem>
                    </Link>
                )}
            </List>
        </div>);
    }
}

// =========================

export default AccountManagement;