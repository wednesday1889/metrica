import React from "react";
import { Spinner } from "reactstrap";

const CenteredSpinner = () => (
    <div className="d-flex justify-content-center">
        <Spinner />
    </div>
);

const GrowingSpinner = () => (
    <div className="d-flex justify-content-center">
        <Spinner className="spinner-grow text-info" />
        <Spinner className="spinner-grow text-warning" />
        <Spinner className="spinner-grow text-danger" />
        <Spinner className="spinner-grow text-info" />
        <Spinner className="spinner-grow text-warning" />
        <Spinner className="spinner-grow text-danger" />
    </div>
);

export { CenteredSpinner, GrowingSpinner };
