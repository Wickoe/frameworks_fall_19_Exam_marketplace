import React, {Component} from 'react';
import {Link, Router} from "@reach/router";
import {connect} from 'react-redux'



import Categories from "./Components/Categories";
import PostBook from "./Components/PostBook";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";

class App extends Component {
    render() {
        return (
            <React.Fragment>
                <div>
                    <Link to={"/post-book-for-sale"}>Submit book to sell</Link>
                    <Link to={"/sign-in"}>Sign in</Link>
                    <Link to={"/sign-up"}>Sign up</Link>
                </div>
                <Router>
                    <Categories path={"/"} categories={this.props.categories}/>
                    <PostBook path={"/post-book-for-sale"}/>
                    <SignIn path={"/sign-in"}/>
                    <SignUp path={"/sign-up"}/>
                </Router>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({categories: state.categories, users: state.users, notification: state.notification});
const mapDispatchToProps = dispatch => ({

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)