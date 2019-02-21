import React from "react";
import { withRouter } from "react-router-dom";

import { Card, CardTitle, CardText, CardHeader, Button } from "reactstrap";

import * as ROUTES from "../../constants/routes";

const IncompleteProfileCard = ({ history, email }) => (
    <Card color="info" inverse>
        <CardHeader>Your Profile is Incomplete</CardHeader>
        <CardTitle className="pl-4">Hello {email}!</CardTitle>
        <CardText className="pl-4">
            You currently cannot take an exam if your profile is incomplete.
            Please update your profile to start the assessment.
        </CardText>
        <Button onClick={() => history.push(ROUTES.ACCOUNT)}>
            Update Your Profile
        </Button>
    </Card>
);

export default withRouter(IncompleteProfileCard);
