import React, { Component } from "react";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";

import { Row, Col, Form, FormGroup, Input, Label, Button } from "reactstrap";

import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const AccountPage = props => (
    <AuthUserContext.Consumer>
        {authUser => (
            <Row>
                <Col sm={{ size: 8, offset: 4 }}>
                    <h2>My Profile</h2>
                    <AccountForm
                        authUser={authUser}
                        firebase={props.firebase}
                        history={props.history}
                    />
                </Col>
            </Row>
        )}
    </AuthUserContext.Consumer>
);

class AccountForm extends Component {
    constructor(props) {
        super(props);
        // const { authUser } = this.props;
        this.state = {
            firstName: "",
            lastName: "",
            examCode: "",
            loading: true
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
                    loading: false,
                    ...user
                });
            });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onSubmit = event => {
        const { firstName, lastName, examCode } = this.state;
        const { firebase, authUser, history } = this.props;
        firebase
            .user(authUser.uid)
            .set(
                {
                    firstName,
                    lastName,
                    examCode,
                    profileDone: true
                },
                {
                    merge: true
                }
            )
            .then(() => {
                history.push(ROUTES.HOME);
            });
        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { email, firstName, lastName, examCode, loading } = this.state;

        if (loading) {
            return <h1>loading</h1>;
        }

        const isInvalid =
            email === "" ||
            firstName === "" ||
            lastName === "" ||
            examCode === "";
        return (
            <Form className="form" onSubmit={this.onSubmit}>
                <Col sm={5}>
                    <FormGroup>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            readOnly
                        />
                        <Label>First Name</Label>
                        <Input
                            name="firstName"
                            id="firstName"
                            value={firstName}
                            onChange={this.onChange}
                            type="text"
                            placeholder="Your First Name"
                        />
                        <Label>Last Name</Label>
                        <Input
                            name="lastName"
                            id="lastName"
                            value={lastName}
                            onChange={this.onChange}
                            type="text"
                            placeholder="Your Last Name"
                        />
                        <Label>Exam Code</Label>
                        <Input
                            name="examCode"
                            id="examCode"
                            value={examCode}
                            onChange={this.onChange}
                            type="text"
                            placeholder="Your Exam Code"
                        />
                    </FormGroup>
                    <Button disabled={isInvalid} type="submit" block>
                        Update Profile
                    </Button>
                </Col>
            </Form>
        );
    }
}

const condition = authUser => !!authUser;

export default compose(
    withAuthorization(condition),
    withFirebase,
    withRouter
)(AccountPage);

// withAuthorization(condition)(AccountPage);
