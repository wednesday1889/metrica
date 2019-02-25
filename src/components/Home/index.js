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

class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            email: "",
            firstName: "",
            profileDone: false,
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
            profileDone,
            languageTaken
        } = this.state;

        const isLanguageJS = languageTaken === "" || languageTaken === "js";
        const isLanguageJava = languageTaken === "" || languageTaken === "java";

        return (
            <Container>
                {!loading && !profileDone && (
                    <Row>
                        <Col md={{ size: 8, offset: 2 }}>
                            <IncompleteProfileCard email={email} />
                        </Col>
                    </Row>
                )}
                {!loading && profileDone && (
                    <div>
                        <Row>
                            <Col lg={{ size: 8, offset: 2 }}>
                                <CompleteProfileCard firstName={firstName} />
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
                                        !isLanguageJS && isLanguageJava ? 2 : 0
                                }}
                                md={{ size: 6 }}
                            >
                                <JavaExamCard />
                            </Col>
                        </Row>
                    </div>
                )}
                {loading && <GrowingSpinner />}
            </Container>
        );
    }
}

const condition = authUser => !!authUser;

export default compose(
    withFirebase,
    withAuthorization(condition)
)(HomePage);
