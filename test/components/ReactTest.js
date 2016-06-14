var ReactDOM = require('react-dom');
var TestUtils = require("react-addons-test-utils");
var assert = require("chai").assert;
var React = require("react");
var chai = require('chai'), chaiHttp = require('chai-http');
chai.use(chaiHttp);

var urlAdd = 'http://localhost:8050/graphql?query=mutation{add(nameTo:"gqlUTo",signCodeTo:"gqlUToSC",companyTo:"gqlUToComp",nameFrom:"gqlUFrom",signCodeFrom:"gqlUFromSC",companyFrom:"gqlFromComp",goods:[{name:"Good1",qty:20,price:30},{name:"Good2",qty:10,price:40}]){userTo,userFrom,date,total}}';
var urlGetByGraph = 'http://localhost:8050/graphql?query={userTo(name:%22gqlUTo%22)}'
var urlGetByRestApi = 'http://localhost:8000/waybill/searchT/gqlUTo'
var tmout = 5000;

var MainPage = require("../../src/components/MainPage").default;
var AddForm = require("../../src/components/AddForm").default;
var AddBtn = require("../../src/components/AddBtn").default;
var SearchBtn = require("../../src/components/SearchBtn").default;
var ShowBtn = require("../../src/components/ShowBtn").default;
var Nav = require("../../src/components/Nav").default;
var UserForm = require("../../src/components/UserForm").default;
var WaybillForm = require("../../src/components/WaybillForm").default;


describe('React testing...', function () {
      this.timeout(tmout);
      it('MainPage must have div with class name "container-fluid".', function () {
        var rend = TestUtils.renderIntoDocument(<MainPage/>);
        var result = TestUtils.findRenderedDOMComponentWithClass(rend, 'container-fluid');
        assert.isNotNull(result);
      });

	  it('AddForm must contain 2 fields-number.', function () {
        var rend = TestUtils.renderIntoDocument(<AddForm/>);
        var result = TestUtils.scryRenderedComponentsWithType(rend, 'number');
        assert.isNotNull(result);
      });

	  it('Navbar renders all three buttons.', function () {
        var rend = TestUtils.renderIntoDocument(<Nav/>);
        var btnsStr = TestUtils.scryRenderedDOMComponentsWithTag(rend, 'li');
        assert.equal(3, btnsStr.length);
      });
  });

describe('More react tests...', function () {
    before(function(){
            chai.request(urlAdd)
                .post("")
                .end(function (err, res) {
                    response = res;
                });
        });

  it('Getting data, using GraphQL server and checking user form.', function () {
      chai.request(urlGetByGraph)
          .get("/")
          .set('Accept', 'application/json')
          .end(function (err, res) {
              var us = JSON.parse(res.text);
			  var userInf = '<td id="name">gqlUTo</td><td id="company">gqlUToComp</td><td id="sign">gqlUToSC</td>';
                var rend = TestUtils.renderIntoDocument(<UserForm user={us}/>);
                var btnsStr = TestUtils.findRenderedDOMComponentWithTag(rend, 'tr');
                assert.equal(btnsStr.innerHTML, userInf);
          })
      });

	it('Getting data, using RestApi server and checking user form.', function () {
      chai.request(urlGetByRestApi)
          .get("/")
          .set('Accept', 'application/json')
          .end(function (err, res) {
              var us = JSON.parse(res.text);
			  var userInf = '<td id="name">gqlUTo</td><td id="company">gqlUToComp</td><td id="sign">gqlUToSC</td>';
                var rend = TestUtils.renderIntoDocument(<UserForm user={us.userTo}/>);
                var btnsStr = TestUtils.findRenderedDOMComponentWithTag(rend, 'tr');
                assert.equal(btnsStr.innerHTML, userInf);
          })
      });

	it('Getting data, using RestApi server and checking waybill form.', function () {
      chai.request(urlGetByRestApi)
          .get("/")
          .set('Accept', 'application/json')
          .end(function (err, res) {
              var wb = JSON.parse(res.text);
                var rend = TestUtils.renderIntoDocument(<WaybillForm wbills={wb}/>);
                var btnsStr = TestUtils.scryRenderedDOMComponentsWithTag(rend, 'tbody');
                rend = TestUtils.renderIntoDocument(btnsStr);
                btnsStr = TestUtils.scryRenderedDOMComponentsWithTag(rend, 'td');
                var usTo = TestUtils.findRenderedDOMComponentWithClass(rend, 'userTo');
                assert.equal(btnsStr.length, 6);
                assert.equal(usTo.innerHTML, "gqlUTo");
          })
      });
  });
