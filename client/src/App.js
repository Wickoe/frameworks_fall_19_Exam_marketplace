import React, {Component} from 'react';
import {Link, Router} from "@reach/router";
import {connect} from 'react-redux'

import {createUserAction, loginUserAction, logoutUserAction, loadUserCredentials} from "./Actions/UserActions";
import {loadCategories, loadCategoryBooks, postCategory} from "./Actions/BookActions";

import Categories from "./Components/Categories";
import PostBook from "./Components/PostBook";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import AuthenticationService from "./Services/AuthenticationService";
import User from "./Components/User";
import Admin from "./Components/Admin";
import Category from "./Components/Category";


class App extends Component {
    constructor(props) {
        super(props);

        this.authService = new AuthenticationService();
    }

    componentDidMount() {
        if (this.authService.authenticatedUser()) {
            this.props.loadUserCredentials();
        }

        this.props.loadCategories();
    }

    render() {
        document.title = (process.env.REACT_APP_NAME || "Bookshop marketplace development");

        return (
            <React.Fragment>
                {this.props.notification["display"] &&
                <div>
                    <h1> {this.props.notification["msg"]}</h1>
                </div>
                }
                <div>
                    <Link to={"/post-book-for-sale"}>Submit book to sell</Link>
                    {this.props.user["token"] !== undefined && this.props.user["token"].length > 0 ?
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
                    <Categories path={"/"} categories={this.props.categories} loadCategoryBooks={(categoryId) => this.props.loadCategoryBooks(categoryId)}/>
                    <Category path={`/categories/:category`} books={(category) => this.props.books.filter(book => {if(book["category"] === category) return book;})}/>
                    <PostBook path={"/post-book-for-sale"}/>
                    <SignIn path={"/sign-in"} loginUser={(userCredentials) => this.props.loginUser(userCredentials)}/>
                    <SignUp path={"/sign-up"} createUser={(userCredentials) => this.props.createUser(userCredentials)}/>
                    <User path={"/user/:username"} user={this.props["user"]}/>
                    <Admin path={"/admin"} categories={this.props["categories"]["categories"]} postCategory={(category) => this.props.postCategory(category)}/>
                </Router>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({categories: state.categories, user: state.user, notification: state.notification, books: state.books});
const mapDispatchToProps = dispatch => ({
    createUser: (userCredentials) => dispatch(createUserAction(userCredentials)),
    loginUser: (userCredentials) => dispatch(loginUserAction(userCredentials)),
    logoutUser: _ => dispatch(logoutUserAction()),
    loadUserCredentials: _ => dispatch(loadUserCredentials()),
    postCategory: (category) => dispatch(postCategory(category)),
    loadCategories: _ => dispatch(loadCategories()),
    loadCategoryBooks: category => dispatch(loadCategoryBooks(category))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)