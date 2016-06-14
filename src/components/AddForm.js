 import React from "react";
 
 export default class AddForm extends React.Component {
    render()
    {
      var divStyle = {height: 80};

      return (
        <div id='AddForm'>
          <table id='AddTable' className='table'>
		  <tbody>
            <tr>
              <td><input type='text' id='UTN' placeholder='UserToName'  className='form-control  input-sm'/></td>
              <td><input type='text' id='UTC' placeholder='UserToCode' className='form-control  input-sm'/></td>
              <td><input type='text' id='UTc' placeholder='UserToCompany' className='form-control  input-sm'/></td>
            </tr>
            <tr>
              <td><input type='text' id='UFN' placeholder='UserFromName' className='form-control  input-sm'/></td>
              <td><input type='text' id='UFC' placeholder='UserFromCode' className='form-control  input-sm'/></td>
              <td><input type='text' id='UFc' placeholder='UserFromCompany' className='form-control input-sm'/></td>
            </tr>
            <tr>
              <td><input type='text' id='gname' placeholder='GoodName' className='form-control input-sm'/></td>
              <td><input type="number" id='gprice' placeholder='Price' className='form-control input-sm bfh-number'/></td>
              <td><input type="number" id='gcount' placeholder='Quantity' className='form-control input-sm bfh-number'/></td>
            </tr>
            <tr id='extra'>

            </tr>
            <tr>
            <td>
                <button className='btn' > <p className='glyphicon glyphicon-plus'/></button>
                |
                <button className='btn' > <p className='glyphicon glyphicon-minus'/></button>
            </td>
            </tr>
			</tbody>
          </table>
          <div className='col-md-2 col-md-offset-5'>
            <button className='btn'>Add Waybill</button>
          </div>
        </div>
      );
    }
  };