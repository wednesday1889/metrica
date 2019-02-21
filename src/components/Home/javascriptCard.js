import React from "react";
import { withRouter } from "react-router-dom";

import { Card, Button, CardText, CardImg } from "reactstrap";

import logo from "../../images/jslogo.png";

import * as ROUTES from "../../constants/routes";

const JavascriptExamCard = ({ history }) => (
    <Card body>
        <CardImg src={logo} alt="Javascript Logo" />
        <CardText>
            A mix of multiple choice questions and programming problems for the
            Javascript programming language.
        </CardText>
        <Button
            onClick={() => {
                history.push(ROUTES.EXAM_JS_LANDING);
            }}
        >
            Start the JS Exam!
        </Button>
    </Card>
);

export default withRouter(JavascriptExamCard);
