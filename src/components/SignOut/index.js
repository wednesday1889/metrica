import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import { DropdownItem } from "reactstrap";

import { withFirebase } from "../Firebase";

import * as ROUTES from "../../constants/routes";

const SignOutButton = ({ firebase, history }) => (
    <DropdownItem
        onClick={() => {
            firebase.doSignOut().then(() => {
                history.push(ROUTES.LANDING);
            });
        }}
    >
        Sign Out
    </DropdownItem>
);

export default compose(
    withFirebase,
    withRouter
)(SignOutButton);
