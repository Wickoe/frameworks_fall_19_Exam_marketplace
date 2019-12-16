import React, {Component} from 'react';
import {Router} from "@reach/router";
import {connect} from 'react-redux'
import Categories from "./Components/Categories";

class App extends Component {
    render() {
        return (
            <React.Fragment>
                <div/>
                <Router>
                    <Categories path={"/"} categories={this.props.categories}/>
                </Router>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({categories: state.categories, users: state.users, notification: state.notification});
const mapDispatchToProps = dispatch => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)