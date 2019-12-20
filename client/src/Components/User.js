import React, {Component} from 'react';
import AuthenticationService from "../Services/AuthenticationService";
import Admin from "./Admin";
import {Link} from "@reach/router";

export default class User extends Component {
    authService = new AuthenticationService();

    componentDidMount() {
        this.props.loadUser(this.props["username"])
    }

    render() {
        return (
            <div className={"container"}>
                <Link className={"button"} to={"/"}>Back</Link>
                <label className={"label"}>Username: <p>{this.props["user"]["user"]["username"]}</p></label>
                <label className={"label"}>Name: <p>{this.props["user"]["user"]["name"]}</p></label>

                {this.authService.authenticatedUserPage(this.props["user"]["user"]) &&
                    <Admin categories={this.props["categories"]}
                           postCategory={(category) => this.props.postCategory(category)}
                           removeCategory={(category) => this.props.removeCategory(category)}/>
                }
            </div>
        );
    }
}