import React from "react";

import { Row, Col } from "reactstrap";

import { AuthUserContext, withAuthorization } from "../Session";

const HomePage = () => (
    <AuthUserContext.Consumer>
        {authUser => (
            <Row>
                <Col sm={{ size: 8, offset: 4 }}>
                    <h2>Home</h2>
                    {authUser.profileDone && <p>Profile is complete</p>}
                    {!authUser.profileDone && <p>Profile not yet complete</p>}
                </Col>
            </Row>
        )}
    </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);
