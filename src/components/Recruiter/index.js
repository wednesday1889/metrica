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

const renderBadge = screeningStatus => {
    let badgeColor;
    let statusText;

    switch (screeningStatus) {
    case 1:
        badgeColor = "primary";
        statusText = "Registered";
        break;
    case 2:
        badgeColor = "primary";
        statusText = "Ready to take Exam";
        break;
    case 3:
        badgeColor = "info";
        statusText = "Exam Started";
        break;
    case 4:
        badgeColor = "warning";
        statusText = "For Assessment";
        break;
    case 5:
        badgeColor = "success";
        statusText = "Passed";
        break;
    case 6:
        badgeColor = "danger";
        statusText = "Failed";
        break;
    default:
        badgeColor = "secondary";
        statusText = "Not Registered";
        break;
    }

    return <Badge color={badgeColor}>{statusText}</Badge>;
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
            .allCandidateStatus()
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

    renderCandidates() {
        const { candidates } = this.state;
        return candidates.map(candidate => {
            return (
                <ListGroupItem className="d-inline-flex justify-content-between align-items-center">
                    {candidate.lastName}, {candidate.firstName}
                    {renderBadge(candidate.screeningStatus)}
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
