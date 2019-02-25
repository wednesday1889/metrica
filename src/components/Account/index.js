import React, { Component } from "react";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";

import {
    Container,
    Row,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Button,
    Alert,
    CardBody,
    CardHeader,
    Card
} from "reactstrap";

import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import { CenteredSpinner } from "../CenteredSpinner";

const AccountPage = props => (
    <AuthUserContext.Consumer>
        {authUser => (
            <Container>
                <Row>
                    <Col
                        lg={{ size: 6, offset: 3 }}
                        md={{ size: 6, offset: 3 }}
                    >
                        <Card>
                            <CardHeader>My Profile</CardHeader>
                            <CardBody>
                                <AccountForm
                                    authUser={authUser}
                                    firebase={props.firebase}
                                    history={props.history}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
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
            loading: true,
            isError: false
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
        const { email, firstName, lastName, examCode } = this.state;
        const { firebase, history } = this.props;

        const saveProfileFunc = firebase.saveProfile();
        this.setState({ loading: true });
        saveProfileFunc({
            email,
            firstName,
            lastName,
            examCode
        })
            .then(() => {
                this.setState({ loading: false });
                history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({ loading: false });
                this.setState({ isError: error.details.message });
            });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const {
            email,
            firstName,
            lastName,
            examCode,
            loading,
            isError
        } = this.state;

        if (loading) {
            return <CenteredSpinner />;
        }

        const isInvalid =
            email === "" ||
            firstName === "" ||
            lastName === "" ||
            examCode === "";
        return (
            <Form className="form" onSubmit={this.onSubmit}>
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
                {isError && (
                    <Alert className="mt-2" color="danger">
                        {isError}
                    </Alert>
                )}
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
