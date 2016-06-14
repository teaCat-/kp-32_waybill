var graphql = require('graphql');
var graphqlHTTP = require('express-graphql');
var express = require('express');
var GraphQLType = require('graphql/type');
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/waybilldb'); // connect to our database
var Waybill = require('./app/models/momos');
var moment = require('moment');
var react = require('react');
var reactDOMServer = require('react-dom/server');

// Graph Schema
var userType = new graphql.GraphQLObjectType({
  name: 'User',
  fields: function() {
    return {
      name: { type: graphql.GraphQLString },
      signCode: { type: graphql.GraphQLString },
      company: { type: graphql.GraphQLString },
    }
  }
});
var goodType = new graphql.GraphQLObjectType({
  name: 'Good',
  fields: function(){
    return{
      name: { type: graphql.GraphQLString },
      qty: { type: graphql.GraphQLString },
      price: { type: graphql.GraphQLString },
    }
  }
});
var goodInputType = new graphql.GraphQLInputObjectType ({
  name: 'GoodInputs',
  fields: function(){
    return{
      name: { type: graphql.GraphQLString },
      qty: { type: graphql.GraphQLInt},
      price: { type: graphql.GraphQLInt },
    }
  }
});
var waybillType = new graphql.GraphQLObjectType({
  name: 'WaybillType',
  fields: function() {
    return {
      userTo: {type:new graphql.GraphQLList(graphql.GraphQLString)},
      userFrom: {type:new graphql.GraphQLList(graphql.GraphQLString)},
      date: {type:graphql.GraphQLString},
      total: {type:graphql.GraphQLString},
    }
  }
});

var good1 = new graphql.GraphQLObjectType({
  name: 'Good1',
  fields: function(){
    return{
      name: { type: graphql.GraphQLString },
      size: { type: graphql.GraphQLInt },
    }
  }
});
var goodsStatistic = new graphql.GraphQLObjectType({
  name: 'GoodStats',
  fields: function(){
    return{
      name: { type: graphql.GraphQLString },
      children: { type: new graphql.GraphQLList(good1) },
    }
  }
});

var QueryType = new graphql.GraphQLObjectType({
  name: 'Waybill',
  fields:()=> ({
	  name:{
			type:graphql.GraphQLString,
			args: {
			  user: { type: graphql.GraphQLString },
			},
			resolve:(root, args)=>{
				return args.user;
			}
		},
      children:{
        type:new graphql.GraphQLList(goodsStatistic),
        args: {
          name: { type: graphql.GraphQLString },
        },
        resolve:(root, args)=>{
          return new Promise((resolve, reject) => {
            Waybill.find({userTo:args.name}, (err, wbs)=> {
              if(err) reject(err)
              else {
                  var rez = JSON.parse(JSON.stringify(wbs));
				  var wbArr = [];
				  var goodz = [];
				  rez.forEach(function(item, i, rez){
						var tmpArr = item.goods
						tmpArr.forEach(function(good, j, tmpArr){
								var obj = {
									name:good.name,
									size:good.qty*good.price
								}
							goodz.push(obj)
						})
						var wbObj = {
							name:item.date,
							children:goodz
						}
						wbArr.push(wbObj)
				  })
                  resolve(wbArr)
              }
            })
          })
        }
      },
  })
});

var MutationAdd = {
  type: waybillType,
  description: 'Add a waybill',
  args: {
    nameTo: {
      name: 'name',
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    },
    signCodeTo: {
      name: 'signCode',
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    },
    companyTo: {
      name: 'company',
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    },
    nameFrom: {
      name: 'name',
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    },
    signCodeFrom: {
      name: 'signCode',
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    },
    companyFrom: {
      name: 'company',
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    },
    goods: {
      name: 'goods',
      type: new graphql.GraphQLList(goodInputType)
    }
  },
  resolve: (root, args) => {
    var newWb = new Waybill();
      var uto = [args.nameTo, args.signCodeTo, args.companyTo];
      var ufrom = [args.nameFrom, args.signCodeFrom, args.companyFrom];
      newWb.userTo = uto;
      newWb.userFrom = ufrom;
      newWb.goods = args.goods;
      newWb.date = moment().format("MM-DD-YYYY");
      newWb.goods = args.goods;
      var summ = 0;
      for (var i = 0; i < args.goods.length; i++) {
        summ += args.goods[i]["qty"] * args.goods[i]["price"]
      }
      newWb.total = summ;
    return new Promise((resolve, reject) => {
      newWb.save(function (err) {
        if (err) reject(err)
        else
        {
          var rez = JSON.parse(JSON.stringify(newWb));
          resolve(rez)
        }
      })
    })
  }
}

var MutationType = new graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: {
    add: MutationAdd
  }
});

var schema = new graphql.GraphQLSchema({
      query:QueryType,
      mutation: MutationType
});

/////////////////
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}
var app = express();
app.use(allowCrossDomain);
app
  .use('/graphql', graphqlHTTP({ schema: schema, pretty: true }))
  .listen(8050);

console.log('GraphQL server running on http://localhost:8050/graphql');
