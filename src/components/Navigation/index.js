import React from "react";
import { Link } from "react-router-dom";

import {
    Collapse,
    Navbar,
    // NavbarToggler,
    NavbarBrand
    // Nav,
    // NavItem,
    // NavLink
} from "reactstrap";

import SignOutButton from "../SignOut";
import * as ROUTES from "../../constants/routes";
import { AuthUserContext } from "../Session";

const Navigation = () => (
    <div>
        <AuthUserContext.Consumer>
            {authUser =>
                authUser ? <NavigationAuth /> : <NavigationNonAuth />
            }
        </AuthUserContext.Consumer>
    </div>
);

class NavigationAuth extends React.Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    render() {
        const { isOpen } = this.state;
        return (
            <Navbar color="light" light expand="md">
                <NavbarBrand>
                    <Link to={ROUTES.LANDING}>Landing</Link>
                </NavbarBrand>
                <Collapse isOpen={isOpen}>
                    <li>
                        <Link to={ROUTES.HOME}>Home</Link>
                    </li>
                    <li>
                        <Link to={ROUTES.ACCOUNT}>Account</Link>
                    </li>
                    <li>
                        <SignOutButton />
                    </li>
                </Collapse>
            </Navbar>
        );
    }
}

const NavigationNonAuth = () => (
    <Navbar>
        <NavbarBrand>
            <Link to={ROUTES.LANDING}>Landing</Link>
        </NavbarBrand>
        <Collapse navbar>
            <Link to={ROUTES.SIGN_IN}>Sign In</Link>
        </Collapse>
    </Navbar>
);

export default Navigation;
