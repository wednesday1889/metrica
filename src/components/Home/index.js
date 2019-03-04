import React, { Component } from "react";
import { compose } from "recompose";

import { Container, Row, Col } from "reactstrap";

import { withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";

import IncompleteProfileCard from "./incompleteProfile";
import CompleteProfileCard from "./completeProfile";
import JavascriptExamCard from "./javascriptCard";
import JavaExamCard from "./javaCard";
import { GrowingSpinner } from "../CenteredSpinner";
import ExamCompleteCard from "../JavascriptExam/examCompleteCard";

import * as ROLES from "../../constants/roles";
import * as SCREENINGSTATUS from "../../constants/screeningStatus";

class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            email: "",
            firstName: "",
            screeningStatus: 0,
            languageTaken: ""
        };
    }

    componentDidMount() {
        const { firebase } = this.props;

        this.setState({ loading: true });
        this.unsubscribeUser = firebase
            .user(firebase.auth.currentUser.uid)
            .onSnapshot(snapshot => {
                const user = snapshot.data();
                this.setState({
                    ...user,
                    loading: false
                });
            });
        this.unsubscribeCandidate = firebase
            .candidateStatus(firebase.auth.currentUser.email)
            .onSnapshot(snapshot => {
                const candStatus = snapshot.data();
                this.setState({
                    ...candStatus,
                    loading: false
                });
            });
    }

    componentWillUnmount() {
        this.unsubscribeUser();
        this.unsubscribeCandidate();
    }

    render() {
        const {
            email,
            firstName,
            loading,
            screeningStatus,
            languageTaken
        } = this.state;

        const isLanguageJS = languageTaken === "" || languageTaken === "js";
        const isLanguageJava = languageTaken === "" || languageTaken === "java";

        return (
            <Container>
                {!loading &&
                    (screeningStatus === SCREENINGSTATUS.REGISTERED ||
                        screeningStatus === SCREENINGSTATUS.NOT_REGISTERED) && (
                // eslint-disable-next-line react/jsx-indent
                    <Row>
                        <Col md={{ size: 8, offset: 2 }}>
                            <IncompleteProfileCard email={email} />
                        </Col>
                    </Row>
                )}
                {!loading &&
                    (screeningStatus === SCREENINGSTATUS.READY_TO_TAKE_EXAM ||
                        screeningStatus === SCREENINGSTATUS.EXAM_STARTED) && (
                // eslint-disable-next-line react/jsx-indent
                    <React.Fragment>
                        <Row>
                            <Col lg={{ size: 8, offset: 2 }}>
                                <CompleteProfileCard
                                    firstName={firstName}
                                />
                            </Col>
                        </Row>
                        <Row>
                            {isLanguageJS && (
                                <Col
                                    lg={{ size: 4, offset: 2 }}
                                    md={{ size: 6 }}
                                >
                                    <JavascriptExamCard />
                                </Col>
                            )}

                            <Col
                                lg={{
                                    size: 4,
                                    offset:
                                            !isLanguageJS && isLanguageJava
                                                ? 2
                                                : 0
                                }}
                                md={{ size: 6 }}
                            >
                                <JavaExamCard />
                            </Col>
                        </Row>
                    </React.Fragment>
                )}
                {!loading &&
                    screeningStatus !== 1 &&
                    screeningStatus !== 2 &&
                    screeningStatus !== 3 && (
                    <Row>
                        <Col md={{ size: 8, offset: 2 }}>
                            <ExamCompleteCard />
                        </Col>
                    </Row>
                )}
                {loading && <GrowingSpinner />}
            </Container>
        );
    }
}

const condition = authUser =>
    !!authUser &&
    !authUser.roles.includes(ROLES.ADMIN) &&
    !authUser.roles.includes(ROLES.RECRUITER);

export default compose(
    withFirebase,
    withAuthorization(condition)
)(HomePage);
