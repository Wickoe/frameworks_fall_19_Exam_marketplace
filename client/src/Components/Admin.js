import React, {Component} from 'react';
import AuthenticationService from "../Services/AuthenticationService";
import SignIn from "./SignIn";

export default class Admin extends Component {
    constructor(props) {
        super(props);

        this.state = ({
            categoryTitle: ""
        });

        this.authService = new AuthenticationService();
    }

    render() {
        return (
            <div>
                <div>
                    <h1>Create category:</h1>
                    <form>
                        <label>Category name: <input name={"categoryTitle"} typeof={"text"}
                                                     onChange={(event) => this.onInputValueChange(event)}/></label>
                        <input type={"submit"} value={"Submit"}
                               onClick={(event) => this.onSubmitInputValueClicked(event)}/>
                    </form>
                </div>
                <h1>Categories:</h1>
                <ul>
                    {this.props["categories"].map(category => {
                        return <li key={category["_id"]}>
                            <div>
                                <label>{category["title"]}</label>
                                <button onClick={(event) => this.onDeleteCategoryClicked(event, category)}>Remove
                                    category
                                </button>
                            </div>
                        </li>
                    })}
                </ul>
            </div>
        )
    }

    onInputValueChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    onSubmitInputValueClicked(event) {
        event.preventDefault();

        if (!this.validInput()) {
            return alert("Please enter valid input!")
        }

        this.props.postCategory({title: this.state["categoryTitle"]})
    }

    validInput() {
        return this.state["categoryTitle"] !== "" && this.state["categoryTitle"].length > 0;
    }

    onDeleteCategoryClicked(event, category) {
        event.preventDefault();

        this.props.removeCategory(category)
    }
}