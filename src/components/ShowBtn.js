 import React from "react";
 
 export default class ShowBtn extends React.Component {
	render(){
      var divStyle = {height: 80};
      return(
        <li><a onClick={this.handleClick} className='btn'><span className='glyphicon glyphicon-th-list' aria-hidden='true'></span></a></li>
      );
    }
  };