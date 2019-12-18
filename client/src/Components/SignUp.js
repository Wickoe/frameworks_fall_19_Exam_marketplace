import React, {Component} from 'react';

export default class SignUp extends Component {
    constructor(props) {
        super(props);

        this.state = ({
            username: "",
            password: "",
            userGroup: ""
        })
    }
    render() {
        return (
            <div>
                <form>
                    <label>* Username: <input name={"username"} type={"text"}
                                              onChange={(event) => this.onInputValueChanged(event)}/></label>
                    <label>* Password: <input name={"password"} type={"password"}
                                              onChange={(event) => this.onInputValueChanged(event)}/></label>
                    <div>
                        <label>*</label>
                        <label>Admin: <input name={"userGroup"} type={"radio"} value={"admin"}
                                             onChange={(event) => this.onInputValueChanged(event)}/></label>
                        <label>User: <input name={"userGroup"} type={"radio"} value={"user"}
                                            onChange={(event) => this.onInputValueChanged(event)}/> </label>
                    </div>
                    <input type={"submit"} value={"Submit"} onClick={(event) => this.onSubmitFormClicked(event)}/>
                </form>
            </div>
        )
    }

    onInputValueChanged(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onSubmitFormClicked(event) {
        event.preventDefault();

        if (!this.state["username"] || !this.state["password"] || !this.state["userGroup"]) {
            return alert("Please input required fields!");
        }

        this.props.createUser({
            username: this.state["username"],
            password: this.state["password"],
            userGroup: this.state["userGroup"]
        });
    }
}