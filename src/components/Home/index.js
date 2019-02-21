import React, { Component } from "react";
import { compose } from "recompose";

import { Container, Row, Col } from "reactstrap";

import { withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";

import IncompleteProfileCard from "./incompleteProfile";
import CompleteProfileCard from "./completeProfile";
import JavascriptExamCard from "./javascriptCard";
import JavaExamCard from "./javaCard";

class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            email: "",
            firstName: "",
            profileDone: false
        };
    }

    componentDidMount() {
        const { firebase } = this.props;

        this.setState({ loading: true });
        this.unsubscribe = firebase
            .user(firebase.auth.currentUser.uid)
            .onSnapshot(snapshot => {
                const user = snapshot.data();
                this.setState({
                    ...user,
                    loading: false
                });
            });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const { email, firstName, loading, profileDone } = this.state;
        return (
            <Container>
                {!loading && !profileDone && (
                    <Row>
                        <Col sm="12" md={{ size: 6, offset: 3 }}>
                            <IncompleteProfileCard email={email} />
                        </Col>
                    </Row>
                )}
                {!loading && profileDone && (
                    <div>
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <CompleteProfileCard firstName={firstName} />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={{ size: 3, offset: 3 }}>
                                <JavascriptExamCard />
                            </Col>
                            <Col md={{ size: 3 }}>
                                <JavaExamCard />
                            </Col>
                        </Row>
                    </div>
                )}
                {loading && (
                    <div>
                        <h1>Loading</h1>
                    </div>
                )}
            </Container>
        );
    }
}

const condition = authUser => !!authUser;

export default compose(
    withFirebase,
    withAuthorization(condition)
)(HomePage);
