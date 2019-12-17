import React, {Component} from 'react';
import {Link} from "@reach/router";

export default class User extends Component {
    render() {
        const userLoggedIn = this.props["user"]["username"] !== undefined && this.props["user"]["username"].length > 0;

        return (
            <React.Fragment>
                {!userLoggedIn ?
                    <h1> Please login!</h1>
                    :
                    <div>
                        <Link to={"/sell-book"}>Sell book!</Link>
                        {this.props["user"]["admin"] && <Link to={"/admin"}>Admin</Link>}
                    </div>
                }
            </React.Fragment>
        );
    }
}