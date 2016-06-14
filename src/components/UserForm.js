import React from "react";

export default class UserForm extends React.Component {
  render(){
    const {user} = this.props.user;
    return(
      <table>
        <tr>
          <td id="name">user.name</td>
          <td id="company">user.company</td>
          <td id="sign">user.signCode</td>
        </tr>
      </table>
    );
  }
};
