import React from "react";
import { Container, Col, Row, Card, CardHeader, CardText } from "reactstrap";

const App = () => (
    <Container>
        <Row>
            <Col sm={{ size: 8, offset: 2 }}>
                <Card>
                    <CardHeader>
                        <strong>Infor PSSC GHR/TM Online Assessment</strong>
                    </CardHeader>
                    <CardText className="pl-4 pt-2 pb-2 pr-4">
                        Welcome to the Infor PSSC GHR/TM Online Technical
                        Assessment!
                        <br />
                        <br />
                        The technical assessment lasts about 30 minutes. All of
                        our questions are timed, once the timer is up you will
                        be moved to the next question with the current question
                        being set to unanswered. You can&apos;t go back to a
                        previous question.
                        <br />
                        <br />
                        This exam contains multiple choice questions and
                        programming challenges
                        <br />
                        <br />
                        Please make sure you have a stable internet connection
                        while taking this assessment.
                        <br />
                        <br />
                        <i>
                            <strong>
                                For the programming challenges, don&apos;t worry
                                too much on syntax. We just want to see your
                                basic programming knowledge and problem solving
                                skills
                            </strong>
                        </i>
                    </CardText>
                </Card>
            </Col>
        </Row>
    </Container>
);

export default App;
