import React from "react";

export default class WBTable extends React.Component {
    static getInitialState() {
      return {wbills: this.props.wbills};
    }
    render(){
      var rows = [];
      var wbs = this.state.wbills;
      for(var key in wbs)
      {
          var id = 'Good-' + key;
          var wb = wbs[key];
          rows.push(<WBRow waybill={wb} id={key}/>);
          rows.push(<tr><td colSpan='6' id={id}></td> </tr>);
      }

      return(
        <table className='table table-striped'>
            <thead>
              <tr className='active'>
                <th width="100px"> Date </th>
                <th> Total </th>
                <th> Buyer </th>
                <th> Vendor </th>
                <th> Update </th>
                <th> Delete </th>
              </tr>
            </thead>
            <tbody> {rows} </tbody>
        </table>
      );
    }
  };

var WBRow = React.createClass({
    render: function(){
      var waybill = this.props.waybill;
      var key = 'Good-'+ this.props.id;
      var align = {TextAlign: 'right'};
      var dateWb = waybill['date'];

      return (
        <tr>
          <td>
            <p>{dateWb} </p>
            <p rowSpan='2' style={align}> {waybill['show']} </p>
          </td>
          <td>
              <p>{waybill['total']} </p>
          </td>
          <td>
            <p  className='userTo'>{waybill['userTo'][0]}</p>
            <p>{waybill['userTo'][1]}</p>
            <p>{waybill['userTo'][2]}</p>
          </td>
          <td>
            <p>{waybill['userFrom'][0]}</p>
            <p>{waybill['userFrom'][1]}</p>
            <p>{waybill['userFrom'][2]}</p>
          </td>
          <td className='col-md-1'>
            <p>{waybill['update']}</p>
          </td>
          <td className='col-md-1'	>
            <p>{waybill['delete']}</p>
          </td>
        </tr>
      );
    }
  });
