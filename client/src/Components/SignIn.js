import React, { Component } from 'react';

export default class SignIn extends Component {
    constructor(props) {
        super(props);

        this.state = ({
            username: "",
            password: ""
        });
    }

    render() {
        return (
            <div>
                <form>
                    <label>Username: <input type={"text"} name={"username"} onChange={(event) => this.onInputValueChanged(event)}/></label>
                    <label>Password: <input type={"password"} name={"password"} onChange={(event) => this.onInputValueChanged(event)}/></label>
                    <input type={"submit"} value={"Submit"} onClick={(event) => this.onSubmitInputClicked(event)}/>
                </form>
            </div>
        )
    }

    onInputValueChanged(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onSubmitInputClicked(event) {
        event.preventDefault();

        const username = this.state["username"],
            password = this.state["password"];

        if(username.length === 0 || password.length === 0) {
            return alert("Please enter your username and password!");
        }

        this.props.loginUser({username: username, password: password})
    }
}