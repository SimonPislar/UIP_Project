import React from "react";
import {useLocation} from "react-router-dom";

function Account() {

    // Get the email from the URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');

    return (
        <div>

        </div>
    )
}

export default Account;