import React, { Component } from "react";
import { compose } from "recompose";
import {
    Container,
    Row,
    Col,
    ListGroup,
    ListGroupItem,
    Badge
} from "reactstrap";

import { withAuthorization } from "../Session";
import * as ROLES from "../../constants/roles";
import { withFirebase } from "../Firebase";

const INITIAL_STATE = {
    candidates: []
};

class RecruiterPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...INITIAL_STATE
        };
    }

    componentDidMount() {
        const { firebase } = this.props;

        this.unsubscribeCandidates = firebase
            .candidates()
            .onSnapshot(querySnapshot => {
                const candidates = [];
                querySnapshot.forEach(doc => {
                    candidates.push(doc.data());
                    this.setState({ candidates });
                });
            });
    }

    componentWillUnmount() {
        if (this.unsubscribeCandidates) {
            this.unsubscribeCandidates();
        }
    }

    renderCandidates() {
        const { candidates } = this.state;
        return candidates.map(candidate => {
            return (
                <ListGroupItem className="d-inline-flex justify-content-between align-items-center">
                    {candidate.lastName}, {candidate.firstName}
                    <Badge color="success">Passed</Badge>
                </ListGroupItem>
            );
        });
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col
                        lg={{ size: 6, offset: 3 }}
                        md={{ size: 6, offset: 3 }}
                    >
                        <ListGroup>{this.renderCandidates()}</ListGroup>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const condition = authUser =>
    authUser && authUser.roles.includes(ROLES.RECRUITER);

export default compose(
    withAuthorization(condition),
    withFirebase
)(RecruiterPage);
