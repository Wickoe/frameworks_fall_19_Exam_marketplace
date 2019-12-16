import React, {Component} from 'react';
import {Link, Router} from "@reach/router";
import {connect} from 'react-redux'

import {createUserAction, loginUserAction, logoutUserAction} from "./Actions/UserActions";

import Categories from "./Components/Categories";
import PostBook from "./Components/PostBook";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import AuthenticationService from "./Services/AuthenticationService";

class App extends Component {
    constructor(props) {
        super(props);

        this.authService = new AuthenticationService();
    }

    render() {
        const displayLogout = this.authService.authenticatedUser();

        return (
            <React.Fragment>
                <Link to={"/admin"}>Admin</Link>
                {this.props.notification["display"] &&
                <div>
                    <h1> {this.props.notification["msg"]}</h1>
                </div>
                }
                <div>
                    <Link to={"/post-book-for-sale"}>Submit book to sell</Link>
                    {displayLogout ?
                        <div>
                            <button onClick={this.props.logoutUser}>Logout</button>
                        </div>
                        :
                        <div>
                            <Link to={"/sign-in"}>Sign in</Link>
                            <Link to={"/sign-up"}>Sign up</Link>
                        </div>
                    }
                </div>
                <Router>
                    <Categories path={"/"} categories={this.props.categories}/>
                    <PostBook path={"/post-book-for-sale"}/>
                    <SignIn path={"/sign-in"} loginUser={(userCredentials) => this.props.loginUser(userCredentials)}/>
                    <SignUp path={"/sign-up"} createUser={(userCredentials) => this.props.createUser(userCredentials)}/>
                </Router>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({categories: state.categories, users: state.users, notification: state.notification});
const mapDispatchToProps = dispatch => ({
    createUser: (userCredentials) => dispatch(createUserAction(userCredentials)),
    loginUser: (userCredentials) => dispatch(loginUserAction(userCredentials)),
    logoutUser: _ => dispatch(logoutUserAction())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)