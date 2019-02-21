import React from "react";

import { Card, Button, CardText, CardImg } from "reactstrap";

import logo from "../../images/javalogo.png";

const JavaExamCard = () => (
    <Card body>
        <CardImg src={logo} alt="Javascript Logo" />
        <CardText>
            A mix of multiple choice questions and programming problems for the
            Java programming language.
        </CardText>
        <Button>Start the Java Exam!</Button>
    </Card>
);

export default JavaExamCard;
