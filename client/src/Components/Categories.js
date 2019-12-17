import React, { Component } from 'react';
import {Link} from "@reach/router";

export default class Categories extends Component {
   render() {
       return (
           <div>
               <h1>Categories:</h1>
               <ul>
                   {
                       this.props.categories["categories"].map((category) => {
                           return <li key={category["_id"]}><Link to={`/categories/${category["title"]}`} onClick={this.props.loadCategoryBooks(`${category["_id"]}`)}>{`${category["title"]}`}</Link></li>
                       })
                   }
               </ul>
           </div>
       )
   }
}