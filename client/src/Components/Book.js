import React, {Component} from 'react';

export default class Book extends Component{
    componentDidMount() {
        this.props["loadBook"](this.props.bookId)
    }

    render() {
        return (
            <div>
                <h1>{this.props["book"]["title"]}</h1>
                <label>Author: <p>{this.props["book"]["author"]}</p></label>
                <label>Category: <p>{this.props["book"]["category"]}</p></label>
                <label>Price: <p>{this.props["book"]["price"]}</p></label>
                <label>Seller name: <p>{this.props["book"]["author"]}</p></label>
                <label>Seller e-mail: <p>{this.props["book"]["author"]}</p></label>
            </div>
        )
    }
}