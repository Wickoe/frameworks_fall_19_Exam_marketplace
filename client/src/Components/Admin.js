import React, {Component} from 'react';

export default class Admin extends Component {
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

        if (!this.validateInput()) {
            return alert("Please enter valid input!")
        }

        this.props.postCategory({title: this.state["categoryTitle"]})
    }

    validateInput() {
        try {
            return this.state["categoryTitle"] !== "" && this.state["categoryTitle"].length > 0;
        } catch (_) {
            return false;
        }
    }

    onDeleteCategoryClicked(event, category) {
        event.preventDefault();

        this.props.removeCategory(category)
    }
}