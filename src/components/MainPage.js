 import React from "react";
 
 export default class MainPage extends React.Component {
    render()
    {
      var divStyle = {height: 80};

      return (
        <div id='MainPage'>
          <div className='container-fluid'>
            <div className='row bootstrap-3-vert-offset -shim'>

              <div style={divStyle}></div>

              <div className='col-md-offset-3 col-md-6'>
                <div id='Workplace' ></div>
                <div id='Workplace2' ></div>
              </div>

            </div>
          </div>
        </div>
      );
    }
  };