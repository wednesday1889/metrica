import React from "react";

import { Col, Card, CardHeader, CardText } from "reactstrap";

const ExamCompleteCard = () => (
    <Col lg={{ size: 4, offset: 4 }}>
        <Card color="success" inverse>
            <CardHeader>Your have completed the Online Assessment!</CardHeader>
            <CardText className="pl-4 pt-2 pb-2 pr-4">
                Congratulations on completing the exam!
                <br />
                We will be assessing your exam answers and our recruiter will
                contact you soon. <br />
                <br />
                Thank you!
            </CardText>
        </Card>
    </Col>
);

export default ExamCompleteCard;
