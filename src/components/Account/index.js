import React from "react";

import { Row, Col } from "reactstrap";

import { AuthUserContext, withAuthorization } from "../Session";
import { PasswordForgetForm } from "../PasswordForget";

const AccountPage = () => (
    <AuthUserContext.Consumer>
        {authUser => (
            <Row>
                <Col sm={{ size: 8, offset: 4 }}>
                    <h2>My Account</h2>
                    <h3>Account: {authUser.email}</h3>
                    <PasswordForgetForm />
                </Col>
            </Row>
        )}
    </AuthUserContext.Consumer>
);
const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);
