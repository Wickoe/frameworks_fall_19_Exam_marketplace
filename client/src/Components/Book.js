import React, {Component} from 'react';

export default class Book extends Component{
    componentDidMount() {
        this.props["loadBook"](this.props.bookId)
    }

    render() {
        return (
            <div className={"container"}>
                <h1 className={"title is-1"}>{this.props["book"]["title"]}</h1>
                <div className={"column"}>Author:<p>{this.props["book"]["author"]}</p></div>
                <div className={"column"}>Price:<p>{this.props["book"]["price"]}</p></div>
                <div className={"column"}>Category:<p>{this.props["category"]["title"]}</p></div>
                <div className={"column"}>Seller name:<p>{this.props["seller"]["name"]}</p></div>
                <div className={"column"}>Seller e-mail:<p>{this.props["seller"]["email"]}</p></div>
            </div>
        )
    }
}