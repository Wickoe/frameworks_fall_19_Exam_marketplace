import React, { Component } from 'react';
import {Link} from "@reach/router";

export default class Categories extends Component {
   render() {
       return (
           <div className={"container"}>
               <h1 className={"title is-1"}>Categories:</h1>
               <ul className={"has-background-white-bis"}>
                   {
                       this.props.categories["categories"].map((category) => {
                           return <li key={category["_id"]} ><Link to={`/category/${category["title"]}`} className={"list-item"} onClick={() => this.props.loadCategoryBooks(`${category["_id"]}`)}>{`${category["title"]}`}</Link></li>
                       })
                   }
               </ul>
           </div>
       )
   }
}