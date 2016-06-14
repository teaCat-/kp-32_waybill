 import React from "react";
 
var AddBtn = require("../../src/components/AddBtn").default;
var SearchBtn = require("../../src/components/SearchBtn").default;
var ShowBtn = require("../../src/components/ShowBtn").default;
 
 export default class NavbarForm extends React.Component {
    render()
    {
      var divStyle = {height: 80};

      return (
	  <div>
		<span className='navbar-brand'>Waybills</span>
		<div id='OptionList'  className='container-fluid'>
			<ul className='nav navbar-nav navbar-right'>
			< ShowBtn />
			< AddBtn />
			< SearchBtn />
		  </ul>
		</div>
	  </div>
      );
    }
  };