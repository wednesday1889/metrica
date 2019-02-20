import React from "react";
import { Container, Col, Row } from "reactstrap";

const App = () => (
    <Container>
        <Col sm={{ size: 8, offset: 4 }}>
            <Row>This is a landing page</Row>
        </Col>
    </Container>
);

export default App;
