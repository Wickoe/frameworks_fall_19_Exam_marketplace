import React, { Component } from 'react';
import {Link} from "@reach/router";

export default class Category extends Component {
    componentDidMount() {
        this.props["loadCategoryBooks"](this.props["category"])
    }

    render() {
        return (
            <div>
                <h1>Category books:</h1>
                <ul>
                    {this.props["books"].map(book => {
                        return (
                            <li key={book["_id"]}>
                                <Link to={`/books/${book["_id"]}`} onClick={() => this.props.loadBook(book["_id"])}>{book["title"]}</Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        )
    }
}