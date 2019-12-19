import React, {Component} from 'react';
import AuthenticationService from "../Services/AuthenticationService";
import SignIn from "./SignIn";

export default class PostBook extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "",
            author: "",
            category: "",
            price: 0.0
        };
    }

    render() {
        return (
            <div>
                {(new AuthenticationService()).authenticatedUser() ?
                    <div>
                        <h1>Post a book to sell</h1>
                        <form>
                            <label>Title:<input type={"text"} name={"title"}
                                                onChange={(event) => this.onValueInputChange(event)}/></label>
                            <label>Author:<input type={"text"} name={"author"}
                                                 onChange={(event) => this.onValueInputChange(event)}/></label>
                            <label>Price:<input type={"number"} name={"price"}
                                                onChange={(event) => this.onValueInputChange(event)}/></label>
                            <label>Category:
                                <select defaultValue={0} name={"category"} onChange={(event) => this.onValueInputChange(event)}>
                                    <option hidden>Book category</option>
                                    {this.props["categories"].map((category) => {
                                        return (
                                            <option key={category["_id"]}>{category["title"]}</option>
                                        )
                                    })}
                                </select>
                            </label>
                            <input type={"submit"} onClick={(event) => this.onSubmitInputClicked(event)} value={"Submit"}/>
                        </form>
                    </div>
                    :
                    <SignIn loginUser={(userCredentials) => this.props.loginUser(userCredentials)}/>
                }
            </div>
        )
    }

    onValueInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onSubmitInputClicked(event) {
        event.preventDefault();

        if (!this.validateInput()) {
            return alert("Please input data for all required fields!");
        }

        this.props.postBook({
            title: this.state["title"],
            author: this.state["author"],
            price: this.state["price"],
            category: this.state["category"]
        })
    }

    validateInput() {
        return this.state["title"].length > 0 && this.state["author"].length > 0 && this.state["category"].length > 0 && this.state["price"].length > 0;
    }
}