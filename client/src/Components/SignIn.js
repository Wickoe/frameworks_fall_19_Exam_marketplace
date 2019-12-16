import React, { Component } from 'react';

export default class SignIn extends Component {
    render() {
        return (
            <div>
                <form>
                    <label>Username: <input type={"text"} name={"username"} onChange={(event) => this.onInputValueChanged(event)}/></label>
                    <label>Password: <input type={"password"} name={"password"} onChange={(event) => this.onInputValueChanged(event)}/></label>
                    <input type={"submit"} value={"Submit"}/>
                </form>
            </div>
        )
    }

    onInputValueChanged(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
}