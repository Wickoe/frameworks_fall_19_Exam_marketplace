import React, { Component } from 'react';
import {Link} from "@reach/router";

export default class Category extends Component {
    render() {
        return (
            <div>
                <ul>
                    {this.props["books"]().map(book => {
                        return (
                            <li key={book["_id"]}>
                                <Link to={`/books/${book["_id"]}`}>${book["_id"]}</Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        )
    }
}