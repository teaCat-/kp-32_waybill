 import React from "react";
 
 export default class AddBtn extends React.Component {
	render(){
      var divStyle = {height: 80};
      return (
        <li><a onClick={this.handleClick}><span className='glyphicon glyphicon-plus' aria-hidden='true'></span></a></li>
      );
    }
  };