import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";

import {
    Alert,
    Col,
    Row,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    FormFeedback
} from "reactstrap";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const SignUpPage = () => (
    <Row>
        <Col sm={{ size: 8, offset: 4 }}>
            <h2>Register</h2>
            <SignUpForm />
        </Col>
    </Row>
);

const INITIAL_STATE = {
    email: "",
    passwordOne: "",
    passwordTwo: "",
    error: null
};

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...INITIAL_STATE,
            email: "",
            passwordOne: "",
            passwordTwo: "",
            validate: {
                emailState: ""
            }
        };
    }

    onSubmit = event => {
        const { email, passwordOne } = this.state;
        const { firebase, history } = this.props;
        firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(auth => {
                firebase
                    .users()
                    .doc(auth.user.uid)
                    .set({
                        email: auth.user.email,
                        firstName: "",
                        lastName: "",
                        profileDone: false,
                        examCode: "",
                        dateCreated: new Date(),
                        roles: []
                    });
                this.setState({ ...INITIAL_STATE });
                history.push(ROUTES.ACCOUNT);
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    validateEmail(e) {
        const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const { validate } = this.state;
        if (emailRex.test(e.target.value)) {
            validate.emailState = "has-success";
        } else {
            validate.emailState = "has-danger";
        }
        this.setState({ validate });
    }

    render() {
        const { email, passwordOne, passwordTwo, error, validate } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === "" ||
            email === "" ||
            validate.emailState === "has-danger";
        return (
            <Form className="form" onSubmit={this.onSubmit}>
                <Col sm={5}>
                    <FormGroup>
                        <Input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="youremail@domain.com"
                            value={email}
                            valid={validate.emailState === "has-success"}
                            invalid={validate.emailState === "has-danger"}
                            onChange={e => {
                                this.validateEmail(e);
                                this.onChange(e);
                            }}
                        />
                        <FormFeedback valid>Email is valid</FormFeedback>
                        <FormFeedback>
                            Uh oh! Looks like there is an issue with your email.
                            Please input a correct email.
                        </FormFeedback>
                        <Label>Password</Label>
                        <Input
                            name="passwordOne"
                            value={passwordOne}
                            onChange={this.onChange}
                            type="password"
                            placeholder="********"
                        />
                        <Label>Confirm Password</Label>
                        <Input
                            name="passwordTwo"
                            value={passwordTwo}
                            onChange={this.onChange}
                            type="password"
                            placeholder="********"
                        />
                    </FormGroup>
                    <Button disabled={isInvalid} type="submit">
                        Register
                    </Button>

                    {error && (
                        <Alert className="mt-2" color="danger">
                            {error.message}
                        </Alert>
                    )}
                </Col>
            </Form>
        );
    }
}

const SignUpLink = () => (
    <p>
        Don&apos;t have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
);

const SignUpForm = compose(
    withRouter,
    withFirebase
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
