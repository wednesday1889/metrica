import React from "react";

import { Row, Col } from "reactstrap";

import { PasswordForgetForm } from "../PasswordForget";
import { withAuthorization } from "../Session";

const AccountPage = () => (
    <Row>
        <Col sm={{ size: 8, offset: 4 }}>
            <h2>My Account</h2>
            <PasswordForgetForm />
        </Col>
    </Row>
);
const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);
