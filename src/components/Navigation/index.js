import React, { Component } from "react";
import { Link } from "react-router-dom";

import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from "reactstrap";

import SignOutButton from "../SignOut";
import * as ROUTES from "../../constants/routes";
import { AuthUserContext } from "../Session";

const Navigation = () => (
    <div>
        <AuthUserContext.Consumer>
            {authUser => <NavigationAuth authUser={authUser} />}
        </AuthUserContext.Consumer>
    </div>
);

class NavigationAuth extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    toggle() {
        const { isOpen } = this.state;
        this.setState({
            isOpen: !isOpen
        });
    }

    render() {
        const { isOpen } = this.state;
        const { authUser } = this.props;
        return (
            <Navbar color="faded" light expand="md">
                <NavbarBrand tag={Link} to={ROUTES.LANDING}>
                    Landing
                </NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={isOpen} navbar>
                    {authUser && (
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink tag={Link} to={ROUTES.HOME}>
                                    Home
                                </NavLink>
                            </NavItem>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>
                                    Account
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem
                                        tag={Link}
                                        to={ROUTES.ACCOUNT}
                                    >
                                        Manage
                                    </DropdownItem>
                                    <DropdownItem divider />
                                    <SignOutButton />
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                    )}
                    {!authUser && (
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink tag={Link} to={ROUTES.SIGN_IN}>
                                    Sign In
                                </NavLink>
                            </NavItem>
                        </Nav>
                    )}
                </Collapse>
            </Navbar>
        );
    }
}

export default Navigation;
