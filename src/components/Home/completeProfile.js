import React from "react";

import { Card, CardHeader, CardText } from "reactstrap";

const CompleteProfileCard = ({ firstName }) => (
    <Card color="success" inverse>
        <CardHeader>Your Profile is Complete!</CardHeader>
        <CardText className="pl-4 pt-2 pb-2 pr-4">
            Thank you for completing your profile, {firstName}! <br /> You can
            now start your exam by choosing the exam type below. Only one exam
            type can be taken. <br /> Happy coding and debugging!
        </CardText>
    </Card>
);

export default CompleteProfileCard;
