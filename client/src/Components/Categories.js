import React, { Component } from 'react';

export default class Categories extends Component {
   render() {
       return (
           <div>
               <h1>Categories:</h1>
               <ul>
                   {
                       this.props.categories["categories"].map((category) => {
                           return <li key={category["_id"]}>{`${category["title"]}`}</li>
                       })
                   }
               </ul>
           </div>
       )
   }
}