import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/Main';
import superagent from 'superagent';
import d3 from 'd3';

  var getData = function(){
    var request = require('superagent');

    request
    .get('http://localhost:8080/webpack-dev-server/waybill')
    .set('Accept', 'application/json')
    .end(function(err, res){
      var wb = JSON.parse(res.text);
      var i = 0;
      for(var key in wb){
        wb[key]['show'] = <ShowGoodsButton goods={wb[key]['goods']} prop={i}/>;
        wb[key]['update'] = <EditButton waybill={wb[key]}/>;
        wb[key]['delete'] = <DeleteButton waybill={wb[key]}/>;
        i++;
      }

      ReactDOM.render(<WBTable wbills={wb}/>, document.getElementById('Workplace'));
    });
  };
  var postData = function(message){
    var request = require('superagent');
    request
    .post('http://localhost:8080/webpack-dev-server/waybill')
    .send(message)
    .set('Accept', 'application/json')
    .end(function(err, res){
      getData();
    });
  };
  var delData = function(id){
    var request = require('superagent');
    request
    .del('http://localhost:8080/webpack-dev-server/waybill/' + id)
    .set('Accept', 'application/json')
    .end(function(err, res){
      alert(res.text);
      getData();
    });
  };
  var putData = function(id, message){
    var request = require('superagent');
    request
    .put('http://localhost:8080/webpack-dev-server/waybill/' + id)
    .send(message)
    .set('Accept', 'application/json')
    .end(function(err, res){
      alert(res.text);
      getData();
    });
  };
  var searchData = function(query){
    var request = require('superagent');
    request
    .get(query)
    .set('Accept', 'application/json')
    .end(function(err, res){
      var wb = JSON.parse(res.text);
      var i = 0;
      for(var key in wb)
      {
        wb[key]['show'] = <ShowGoodsButton goods={wb[key]['goods']} prop={i}/>;
        wb[key]['update'] = <EditButton waybill={wb[key]}/>;
        wb[key]['delete'] = <DeleteButton waybill={wb[key]}/>;
        i++;
      }
      ReactDOM.render(<WBTable wbills={wb}/>, document.getElementById('Workplace'));
    });
  };

  var validate = function(inptsList){
    var err = "Error!";
    if(inptsList["UTN"] == "")
    {
      err += "\nUserTo name is empty.";
    }
    if(inptsList["UTC"] == "")
    {
      err += "\nUserTo sign is empty.";
    }
    if(inptsList["UTc"] == "")
    {
      err += "\nUserTo company is empty.";
    }
    if(inptsList["UFN"] == "")
    {
      err += "\nUserFrom name is empty.";
    }
    if(inptsList["UFC"] == "")
    {
      err += "\nUserFrom sign is empty.";
    }
    if(inptsList["UFc"] == "")
    {
      err += "\nUserFrom company is empty.";
    }
    if(inptsList["gname"] == "")
    {
      err += "\nGood name is empty.";
    }
    if(inptsList["gprice"] == "")
    {
      err += "\nGood price is empty.";
    }
    if(inptsList["gcount"] == "")
    {
      err += "\nGood quantity is empty.";
    }
    /*try{
        var i = Integer.parseInt(inptsList["gprice"]);
        var i = Integer.parseInt(inptsList["gcount"]);
    }
    catch(NumberFormatException){
      err += "\nGood price or quantity is not a number.";
    }*/
    return err;
  };

  var ShowGoodsButton = React.createClass({
    getInitialState: function() {
      return {opened: false};
    },
    handleClick: function() {
      var id = 'Good-' + this.props.prop;

      if(this.state.opened == false){
        this.setState({opened: true});

        var goods=this.props.goods;
        console.log(goods);
        ReactDOM.render(<GTable goods={goods}/>,	document.getElementById(id));
      }

      else{
        this.setState({opened: false});
        ReactDOM.render(<div/>, document.getElementById(id));
      }
    },
    render: function(){
        if(this.state.opened == false){
          return(
              <button onClick={this.handleClick} className='btn'>
                <p className='glyphicon glyphicon-chevron-down'/>
              </button>
          );
        }
        else{
          return(
              <button onClick={this.handleClick} className='btn'>
                <p className='glyphicon glyphicon-chevron-up'/>
              </button>
          );
        }
      }
    });

  var EditForm = React.createClass({
    save: function(waybill, count){
        var wb = waybill;

        var UTN = document.getElementById('UTN').value;
        if(UTN == '') UTN = wb.userTo[0];
        var UTC = document.getElementById('UTC').value;
        if(UTC == '') UTC = wb.userTo[1];
        var UTc = document.getElementById('UTc').value;
        if(UTc == '') UTc = wb.userTo[2];

        var UFN = document.getElementById('UFN').value;
        if(UFN == '') UFN = wb.userFrom[0];
        var UFC = document.getElementById('UFC').value;
        if(UFC == '') UFC = wb.userFrom[1];
        var UFc = document.getElementById('UFc').value;
        if(UFc == '') UFc = wb.userFrom[2];
        var mgoods = [];

        for(var i = 0; i < count; i++)
        {
          var qty = document.getElementById('count' + i).value;
          if(qty == '') qty = wb.goods[i].qty;
          var price = document.getElementById('price' + i).value;
          if(price == '') price = wb.goods[i].price;
          var name = document.getElementById('name' + i).value;
          if(name == '') name = wb.goods[i].name;
          var d =  {
              "qty" : qty,
              "price" : price,
              "name": name
          }
          mgoods.push(d);
        }
        var nwb = {
          "userTo": [UTN, UTC, UTc],
          "userFrom" : [UFN, UFC, UFc],
          "updGood" : mgoods,
        }

        putData(wb._id, nwb);
    },
    render: function(){
        var wb = this.props.waybill;
        var goods = wb['goods'];
        var rows = [];
        var grows = [];
        var t = goods.length;

        for(var key in goods)
        {
            var good = goods[key];
            var name = 'name' + key;
            var price = 'price' + key;
            var count = 'count' + key;
            grows.push(
              <tr className='active'>
                <td><input type='text' id={name} placeholder={good['name']} className='form-control input-sm'/></td>
                <td><input type='text' id={price} placeholder={good['price']} className='form-control input-sm'/></td>
                <td><input type='text' id={count} placeholder={good['qty']} className='form-control input-sm'/></td>
              </tr>
            );
        }
        rows.push(
          <tr>
          <td className='col-md-2'>
            <input type='text' id='UTN' placeholder={wb['userTo'][0]} className='form-control input-sm'/>
            <input type='text' id='UTC' placeholder={wb['userTo'][1]} className='form-control input-sm'/>
            <input type='text' id='UTc' placeholder={wb['userTo'][2]} className='form-control input-sm'/>
          </td>
          <td className='col-md-2'>
            <input type='text' id='UFN' placeholder={wb['userFrom'][0]} className='form-control input-sm'/>
            <input type='text' id='UFC' placeholder={wb['userFrom'][1]} className='form-control input-sm'/>
            <input type='text' id='UFc' placeholder={wb['userFrom'][2]} className='form-control input-sm'/>
          </td>
          <td id={key}>
            <table className='table table-hover'>
                <thead>
                  <tr className='active'>
                    <th> Good </th>
                    <th> Price </th>
                    <th> Count </th>
                  </tr>
                </thead>
                <tbody> {grows} </tbody>
            </table>
          </td>
          <td className='col-md-1'>
            <button onClick={this.save.bind(this, wb, t)} className='btn'> <p className='glyphicon glyphicon-floppy-saved'/> </button>
          </td>
        </tr>
        );


        return(
          <table className='table table-striped'>
              <thead>
                <tr className='active'>
                  <th> Buyer </th>
                  <th> Vendor </th>
                  <th> Goods </th>
                  <th> Save </th>
                </tr>
              </thead>
              <tbody> {rows} </tbody>
          </table>
        );
    },
  })

  var EditButton = React.createClass({
    handleClick: function() {
      ReactDOM.render(<EditForm waybill={this.props.waybill}/>, document.getElementById('Workplace'));
    },
    render: function(){
      return(<button onClick={this.handleClick} className='btn'> <p className='glyphicon glyphicon-pencil'/> </button>);
    }
  });

  var DeleteButton = React.createClass({
    handleClick: function() {
      delData(this.props.waybill._id);
      ReactDOM.render(<div/>, document.getElementById('Workplace2'));
    },
    render: function(){
      return(<button onClick={this.handleClick} className='btn'> <p className='glyphicon glyphicon-trash'/> </button>);
    }
  });

  var AddButton = React.createClass({
    getInitialState: function() {
      return {row: 1};
    },
    AddData: function(event){
      var UTN = document.getElementById('UTN').value;
      var UTC = document.getElementById('UTC').value;
      var UTc = document.getElementById('UTc').value;
      var UFN = document.getElementById('UFN').value;
      var UFC = document.getElementById('UFC').value;
      var UFc = document.getElementById('UFc').value;
      var gname = document.getElementById('gname').value;
      var gprice = document.getElementById('gprice').value;
      var gcount = document.getElementById('gcount').value;

      var inpts = {
        "UTN":UTN,
        "UTC":UTC,
        "UTc":UTc,
        "UFN":UFN,
        "UFC":UFC,
        "UFc":UFc,
        "gname":gname,
        "gprice":gprice,
        "gcount":gcount,
      };

      var mgoods = [];
      var d =  {
          "qty" : gcount,
          "price" : gprice,
          "name": gname
      }
      mgoods.push(d);

      for(var i = 1; i < this.state.row; i++){
        var dd =  {
            "qty" : document.getElementById('gcount' + i).value,
            "price" : document.getElementById('gprice' + i).value,
            "name": document.getElementById('gname' + i).value
        }
        mgoods.push(dd);
      }
      var wb = {
        "userTo": [UTN, UTC, UTc],
        "userFrom" : [UFN, UFC, UFc],
        "goods" : mgoods,
      }
      var err = validate(inpts);
      if(err == "Error!") {
        postData(wb);
      }
      else {
        alert(err);
      }
    },
    addGood: function(){
      var row = this.state.row;
      var nrow = row + 1;
      this.setState({row: nrow});
      var id1 = "gname" + this.state.row;
      var id2 = "gprice" + this.state.row;
      var id3 = "gcount" + this.state.row;
      var form = (
          <tr>
            <td><input type='text' id={id1} placeholder='GoodName' className='form-control input-sm'/></td>
            <td><input type='text' id={id2} placeholder='Price' className='form-control input-sm'/></td>
            <td><input type='text' id={id3} placeholder='Quantity' className='form-control input-sm'/></td>
          </tr>
      );
      if(this.state.row == 9){
        ReactDOM.render(<td/>, document.getElementById('extra'));
      }
      ReactDOM.render(form, document.getElementById('ExtraRow' + row));
    },
    minGood: function(){
      var row = this.state.row;
      var nrow = row - 1;
      if (nrow < 1)
      {
        nrow = 1;
      }
      this.setState({row: nrow});
      var form = (
          <div></div>
      );
      if(this.state.row == 9){
        ReactDOM.render(<td/>, document.getElementById('extra'));
      }
      ReactDOM.render(form, document.getElementById('ExtraRow' + nrow));
    },
    handleClick: function(event){
      this.setState({row: 1});
      var rows = [];
      for(var i = 1; i < 10; i++){
        rows.push(<tr id = {'ExtraRow' + i}/>);
      }

      var form = (
        <div id='AddForm'>
          <table id='AddTable' className='table'>
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
            {rows}
            <tr id='extra'>

            </tr>
            <tr>
            <td>
                <button className='btn' onClick={this.addGood}> <p className='glyphicon glyphicon-plus'/></button>
                |
                <button className='btn' onClick={this.minGood}> <p className='glyphicon glyphicon-minus'/></button>
            </td>
            </tr>

          </table>
          <p>
          <div className='col-md-2 col-md-offset-5'>
            <button onClick={this.AddData} className='btn'>Add Waybill</button>
          </div>
          </p>
        </div>
      )
      var formS = (<p></p>)
      ReactDOM.render(form, document.getElementById('Workplace'));
      ReactDOM.render(formS, document.getElementById('Workplace2'));
      ReactDOM.render(<div></div>, document.getElementById('Workplace3'));
    },
    render: function(){
      return(
        <li><a onClick={this.handleClick}><span className='glyphicon glyphicon-plus' aria-hidden='true'></span></a></li>
      );
    }
  });

  var SearchButton = React.createClass({
    SrchData: function(event){
        var schDate = document.getElementById('DateValue').value;
        var schTo = document.getElementById('UTNValue').value;
        var schFrom = document.getElementById('UFNValue').value;

        var query = 'http://localhost:8080/webpack-dev-server/waybill/search';
        if((schFrom != "")&&(schTo == ""))
        {
          query += "F/"
        }
        else {
          if((schFrom == "")&&(schTo != ""))
          {
            query += "T/"
          }
          else{
            query += "/"
          }
        }

        if(schDate != "")
        {
          query += schDate + '/';
        }
        if(schTo != "")
        {
          query += schTo + '/';
        }
        if(schFrom != "")
        {
          query += schFrom + '/';
        }
        ReactDOM.render(<div/>, document.getElementById('Workplace2'));
        searchData(query);
      },
      EditWaybill: function(key)
      {
          ReactDOM.render(<EditForm id={key}/>, document.getElementById('Workplace'));
      },
      DeleteWaybill: function(key)
      {
          console.log(waybills[key]);
          var xhr = new XMLHttpRequest();
          xhr.open('DELETE', 'http://localhost:8080/webpack-dev-server/waybill/' + waybills[key]._id, false);
          xhr.setRequestHeader('Content-type', 'application/json');
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send(null);

          xhr.onreadystatechange = function() { // (3)
            if (xhr.readyState != 4) return;
          }
          alert(xhr.status + "\n" + xhr.responseText);

          this.getData();
          ReactDOM.render(<div/>, document.getElementById('Workplace2'));
      },
    handleClick: function(event){
      var formS = (
        <div id='SearchForm'>
          <div className="col-md-4 col-md-offset-4">
          <table id='SearchTable' className='table'>
            <tr >
              <td ><input type='text' id='DateValue' placeholder='Date' className='form-control  input-sm'/></td>
            </tr>
            <tr >
              <td><input type='text' id='UTNValue' placeholder='UserTo' className='form-control  input-sm'/></td>
            </tr>
            <tr >
              <td><input type='text' id='UFNValue' placeholder='UserFrom' className='form-control  input-sm'/></td>
            </tr>
            <tr>
              <td>
              <div className='col-md-offset-4'>
                  <button onClick={this.SrchData} className='btn' align='center'>Search</button>
              </div>
              </td>
            </tr>
          </table>
          </div>



        </div>
      )
      var formD = (
        <p></p>
      )
      ReactDOM.render(formD, document.getElementById('Workplace'));
      ReactDOM.render(formS, document.getElementById('Workplace2'));
      ReactDOM.render(<div></div>, document.getElementById('Workplace3'));
    },
    render: function(){
      return(
        <li><a onClick={this.handleClick} className='btn'><span className='glyphicon glyphicon-search' aria-hidden='true'></span></a></li>
      );
    }
  });

  var ShowButton = React.createClass({
    handleClick: function(event){
      getData();
      ReactDOM.render(<div></div>, document.getElementById('Workplace2'));
      ReactDOM.render(<div></div>, document.getElementById('Workplace3'));
    },
    render: function(){
      return(
        <li><a onClick={this.handleClick} className='btn'><span className='glyphicon glyphicon-th-list' aria-hidden='true'></span></a></li>
      );
    }
  });

  var GraphButton = React.createClass({
    handleClick: function(event){
			var UTN = document.getElementById('DateValueGr').value;
		  
		  var diameter = 960,
			  format = d3.format(",d");

		  var pack = d3.layout.pack()
			  .size([diameter - 4, diameter - 4])
			  .value(function(d) { return d.size; });

		  var svg = d3.select("#Workplace3").append("svg")
			  .attr("width", diameter)
			  .attr("height", diameter)
			.append("g")
			  .attr("transform", "translate(2,2)");

		  d3.json("http://localhost:8050/graphql?query={name(user:%22"+UTN+"%22),children(name:%22"+UTN+"%22){name,children{name,size}}}", function(error, root) {
			if (error) throw error;

			var node = svg.datum(root.data).selectAll(".node")
				.data(pack.nodes)
			  .enter().append("g")
				.attr("class", function(d) { return d.children ? "node" : "leaf node"; })
				.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

			node.append("title")
				.text(function(d) { return d.name + (d.children ? "" : ": " + format(d.size)); });

			node.append("circle")
				.attr("r", function(d) { return d.r; });

			node.filter(function(d) { return !d.children; }).append("text")
				.attr("dy", ".3em")
				.style("text-anchor", "middle")
				.text(function(d) { return d.name.substring(0, d.r / 3); });
		  });

		  d3.select(self.frameElement).style("height", diameter + "px");

		  ReactDOM.render(
			<div></div>,
			document.getElementById('Workplace'));
		ReactDOM.render(
			<div></div>,
			document.getElementById('Workplace2'));
		  ReactDOM.render(
			<div>{svg}</div>,
			document.getElementById('Workplace3'));
    },
    render: function(){
      return(
        <li><a onClick={this.handleClick} className='btn'><span className='glyphicon glyphicon-tree-deciduous' aria-hidden='true'></span></a></li>
      );
    }
  });

  var GRow = React.createClass({
    render: function(){
      var good = this.props.good;
      return (
        <tr>
          <td>{good['name']}</td>
          <td>{good['price']}</td>
          <td>{good['qty']}</td>
        </tr>
      );
    }
  });

  var GTable = React.createClass({
    render: function(){
      var goods = this.props.goods;

      var rows = [];
      for(var key in goods)
      {
          var good = goods[key];
          rows.push(<GRow good={good} id={key}/>);
      }

      return(
        <table className='table table-hover'>
            <thead>
              <tr>
                <th> Good </th>
                <th> Price </th>
                <th> Count </th>
              </tr>
            </thead>
            <tbody> {rows} </tbody>
        </table>
      );
    }
  });

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
            <table>
              <tr>
                <td>{waybill['total']} </td>
              </tr>
            </table>
          </td>
          <td>
            <p>{waybill['userTo'][0]}</p>
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

  var WBTable = React.createClass({
    getInitialState: function() {
      return {wbills: this.props.wbills};
    },
    render: function(){
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
  });

  var MainPage = React.createClass({
    render: function()
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
                <div id='Workplace3' ></div>
              </div>

            </div>
          </div>
        </div>
      );
    }
  });

  ReactDOM.render(<div>
                    <span className='navbar-brand'>Waybills</span>
                    <div id='OptionList'  className='container-fluid'>		</div>
                  </div>,
                  document.getElementById('navbar'));
  ReactDOM.render(<ul className='nav navbar-nav navbar-right'>
                    <input type='text' id='DateValueGr' placeholder='Date' className='form-control  input-sm'/>
                    < GraphButton />
                    < ShowButton />
                    < AddButton />
                    < SearchButton />
                  </ul>,
                  document.getElementById('OptionList'));
  ReactDOM.render(<MainPage />, document.getElementById('waybills'));
  getData();
