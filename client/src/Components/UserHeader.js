import React, {Component} from "react";
import {Link} from "@reach/router";

export class UserHeader extends Component {
    render() {
        const writeLoginStatus = () => {
            if (this.props.username) {
                return (
                    <>
                        Welcome {this.props.username}.
                        <button className="button is-small" onClick={
                            (event) => this.props.logout(event)}>Logout</button>
                        <div className={"container"}><Link to={`/user/${this.props["username"]}`} className="btnText">User page</Link></div>
                    </>)
            } else {
                return <div className="container">
                    <div className={"container"}><Link to="/sign-in" className="btnText">Login</Link></div>
                    <div className={"container"}><Link to={"/sign-up"} className="btnText">Sign up</Link></div>
                </div>
            }
        };

        return (
            <div className="container is-widescreen">
                <div className="notification">
                    <div className={"container"}><Link to={"/"} className={"btnText"}>Back</Link></div>
                    {writeLoginStatus()}
                    <Link to={"/post-book-for-sale"}>Submit book to sell</Link>
                </div>
            </div>
        );
    }
}