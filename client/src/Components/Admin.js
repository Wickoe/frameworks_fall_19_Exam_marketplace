import React, {Component} from 'react';

export default class Admin extends Component {
    render() {
        return (
            <div className={"container"}>
                <div>
                    <h1 className={"title is-2"}>Create category:</h1>
                    <form>
                        <label className={"label"}>Category name: <input name={"categoryTitle"} typeof={"text"}
                                                     onChange={(event) => this.onInputValueChange(event)}/></label>
                        <input className={"button "} type={"submit"} value={"Submit"}
                               onClick={(event) => this.onSubmitInputValueClicked(event)}/>
                    </form>
                </div>
                <h1 className={"title is-2"}>Categories:</h1>
                <ol>
                    {this.props["categories"].map(category => {
                        return <li className={"list-item"} key={category["_id"]}>
                            <div className={"container"}>
                                <label className={"label"}>{category["title"]}</label>
                                <button onClick={(event) => this.onDeleteCategoryClicked(event, category)}>Remove
                                    category
                                </button>
                            </div>
                        </li>
                    })}
                </ol>
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