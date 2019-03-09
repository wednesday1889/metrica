import React, { Component } from "react";
import { compose } from "recompose";
import {
    Container,
    Row,
    Col,
    Badge,
    ListGroup,
    ListGroupItem
} from "reactstrap";

import { withAuthorization } from "../Session";
import * as ROLES from "../../constants/roles";
import { withFirebase } from "../Firebase";

const INITIAL_STATE = {
    candidates: []
};

class AdminPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...INITIAL_STATE
        };
    }

    componentDidMount() {
        const { firebase } = this.props;

        this.unsubscribeCandidates = firebase
            .allCandidatesForScreening()
            .onSnapshot(querySnapshot => {
                const candidates = [];
                querySnapshot.forEach(doc => {
                    const candidateStatus = doc.data();
                    candidates.push({
                        email: doc.id,
                        ...candidateStatus
                    });
                    this.setState({ candidates });
                });
            });
    }

    componentWillUnmount() {
        if (this.unsubscribeCandidates) {
            this.unsubscribeCandidates();
        }
    }

    /* viewExam(email) {
        console.log(email);
    } */

    renderCandidates() {
        const { candidates } = this.state;

        const candidateRows = candidates.map(candidate => {
            return (
                <ListGroupItem
                    key={candidate.email}
                    className="d-flex justify-content-between align-items-center"
                    tag="a"
                    href="#"
                    action
                    onClick={() => this.viewExam(candidate.email)}
                >
                    {candidate.lastName}, {candidate.firstName}
                    <Badge>{candidate.mcqResults}</Badge>
                </ListGroupItem>
            );
        });

        return candidateRows;
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col lg={{ size: 4 }} md={{ size: 4 }}>
                        <ListGroup>{this.renderCandidates()}</ListGroup>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const condition = authUser => authUser && authUser.roles.includes(ROLES.ADMIN);

export default compose(
    withAuthorization(condition),
    withFirebase
)(AdminPage);
