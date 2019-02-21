import React, { Component } from "react";
import { compose } from "recompose";

import { Container } from "reactstrap";

import { withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";

class JavascriptExamPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        /*
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
            */
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const { loading } = this.state;
        return <Container>Hello World {loading}</Container>;
    }
}

const condition = authUser => !!authUser && authUser.profileDone;

export default compose(
    withFirebase,
    withAuthorization(condition)
)(JavascriptExamPage);
