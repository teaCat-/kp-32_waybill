 import React from "react";
 
 export default class SearchBtn extends React.Component {
	render(){
      var divStyle = {height: 80};
      return (
        <li><a onClick={this.handleClick} className='btn'><span className='glyphicon glyphicon-search' aria-hidden='true'></span></a></li>
      );
    }
  };