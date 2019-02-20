import React from "react";

import { Row, Col } from "reactstrap";

import { withAuthorization } from "../Session";

const HomePage = () => (
    <Row>
        <Col sm={{ size: 8, offset: 4 }}>
            <h2>Home</h2>
            <p>Only logged in users will see this</p>
        </Col>
    </Row>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);
