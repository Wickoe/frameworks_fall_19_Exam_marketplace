import React, {Component} from 'react';
import {Link, Redirect, Router} from "@reach/router";
import {connect} from 'react-redux'
import io from 'socket.io-client';

import {
    createUserAction,
    loginUserAction,
    logoutUserAction,
    loadUserCredentials,
    loadUserByUsername
} from "./Actions/UserActions";
import {
    loadCategories,
    loadCategoryBooks,
    postCategory,
    postBook,
    loadBook,
    removeCategoryAction, handleMsg
} from "./Actions/BookActions";

import Categories from "./Components/Categories";
import PostBook from "./Components/PostBook";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import AuthenticationService from "./Services/AuthenticationService";
import User from "./Components/User";
import Admin from "./Components/Admin";
import Category from "./Components/Category";
import Book from "./Components/Book";
import {UserHeader} from "./Components/UserHeader";

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

        const socket = io(process.env.REACT_APP_SOCKET_URL);

        socket.on('connect', () => {console.log("Connected to socket.io!");socket.emit('hello', "Kristian", "howdy");});

        socket.on('new-data', (msg) => {this.props.handleData(msg)});
    }

    render() {
        document.title = process.env.REACT_APP_NAME;

        return (
            <React.Fragment>

                {this.props.notification["display"] &&
                <div>
                    <h1> {this.props.notification["msg"]}</h1>
                </div>
                }

                <section className="hero is-primary">
                    <div className="hero-body">
                        <div className="container">
                            <Link to="/"><h1 className="title is-2">Categories of books!</h1></Link>
                        </div>
                    </div>
                </section>

                <UserHeader username={this.props["user"]["username"]} logout={this.props.logoutUser}/>


                <Router>
                    <Categories path={"/"} categories={this.props.categories}
                                loadCategoryBooks={(categoryId) => this.props.loadCategoryBooks(categoryId, this.props["categories"]["books"])}/>

                    <Category path={`/category/:category`} books={this.props["categories"]["categoryBooks"]}
                              loadBook={(bookId) => this.props.loadBook(bookId, this.props["categories"]["books"])}
                              loadCategoryBooks={(category) => this.props.loadCategoryBooks(category, this.props["categories"]["books"])}/>

                    <Book path={"/books/:bookId"} book={this.props["categories"]["book"]}
                          loadBook={(bookId) => this.props.loadBook(bookId, this.props["categories"]["books"])}
                          seller={this.props["categories"]["bookSeller"]}
                          category={this.props["categories"]["bookCategory"]}/>

                    {this.authService.authenticatedUser() ?
                        <Redirect noThrow from={"/sign-in"} to={`/user/${this.authService.getUsername()}`}/>
                        :
                        <SignIn path={"/sign-in"}
                                loginUser={(userCredentials) => this.props.loginUser(userCredentials)}/>
                    }

                    <SignUp path={"/sign-up"} createUser={(userCredentials) => this.props.createUser(userCredentials)}/>

                    <User path={"/user/:username"} user={this.props["user"]}
                          categories={this.props["categories"]["categories"]}
                          loadUser={(username) => this.props.loadUser(username)}
                          postCategory={(category) => this.props.postCategory(category)}
                          removeCategory={(category) => this.props.removeCategory(category)}/>

                    {this.authService.authenticatedUser() ?
                        <PostBook path={"/post-book-for-sale"} categories={this.props["categories"]["categories"]}
                                  postBook={(book) => this.props.postBook(book)}/>
                        :
                        <Redirect noThrow from={"/post-book-for-sale"} to={"/sign-in"}/>
                    }

                    {this.authService.authenticatedUser() && this.authService.authenticatedUserIsAdmin() ?
                        <Admin path={"/admin"} categories={this.props["categories"]["categories"]}
                               postCategory={(category) => this.props.postCategory(category)}
                               removeCategory={(category) => this.props.removeCategory(category)}/>
                        :
                        <Redirect noThrow from={"/admin"} to={"/"}/>
                    }
                </Router>

                <footer className={"footer"}>
                    <div className={"container"}>
                        <div className={"content has-text-centered"}>
                            <p>
                                <strong>Bookshop markedplace</strong> by Martin
                            </p>
                        </div>
                    </div>
                </footer>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    categories: state.categories,
    user: state.user,
    notification: state.notification
});

const mapDispatchToProps = dispatch => ({
    createUser: (userCredentials) => dispatch(createUserAction(userCredentials)),
    loginUser: (userCredentials) => dispatch(loginUserAction(userCredentials)),
    logoutUser: _ => dispatch(logoutUserAction()),
    loadUserCredentials: _ => dispatch(loadUserCredentials()),
    postCategory: (category) => dispatch(postCategory(category)),
    loadCategories: _ => dispatch(loadCategories()),
    loadCategoryBooks: (category, books) => dispatch(loadCategoryBooks(category, books)),
    postBook: book => dispatch(postBook(book)),
    loadBook: (bookId, books) => dispatch(loadBook(bookId, books)),
    removeCategory: (category) => dispatch(removeCategoryAction(category)),
    loadUser: username => dispatch(loadUserByUsername(username)),
    handleData: socketMsg => dispatch(handleMsg(socketMsg))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)