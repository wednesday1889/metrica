import React, { Component } from "react";
import { compose } from "recompose";

import { withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";

class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            user: null
        };
    }

    componentDidMount() {
        const { firebase } = this.props;

        this.setState({ loading: true });
        this.unsubscribe = firebase
            .user(firebase.auth.currentUser.uid)
            .onSnapshot(snapshot => {
                this.setState({
                    user: snapshot.data(),
                    loading: false
                });
            });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const { user, loading } = this.state;
        return (
            <div>
                {!loading && (
                    <div>
                        <h1>Home Page</h1>
                        <p>
                            The Home Page is accessible by every signed in user.
                            {user.email}
                            {user.firstName}
                            {user.lastName}
                        </p>
                    </div>
                )}
            </div>
        );
    }
}

const condition = authUser => !!authUser;

export default compose(
    withFirebase,
    withAuthorization(condition)
)(HomePage);
