/*eslint no-console:0 */
'use strict';
require('core-js/fn/object/assign');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const open = require('open');

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var moment = require('moment');
var apoc = require('apoc');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}
app.use(allowCrossDomain);

var port = process.env.PORT || 8080;        // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/waybilldb'); // connect to our database

var Waybill = require('./app/models/momos');

// ROUTES
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// Requests with no id needed
// ----------------------------------------------------
router.route("/waybill")

  .post(function(req, res){
      var wb = new Waybill();

      wb.userTo = req.body.userTo

      wb.userFrom = req.body.userFrom

      wb.goods = req.body.goods

      wb.date = moment().format("MM-DD-YYYY");

      var summ = 0;
      for (var i = 0; i < req.body.goods.length; i++) {
        summ += req.body.goods[i]["qty"] * req.body.goods[i]["price"]
      }

      wb.total = summ

      wb.save(function(err){
        if(err)
          res.send(err);
        res.json({message: "Added"})
      });
  })

  .delete(function(req, res) {
          Waybill.remove(function(err){
            if(err)
              res.send(err);
            res.json({message: "Cleared"})
          });
  })

  .get(function(req, res) {
        Waybill.find(function(err, waybills) {
                if (err)
                    res.send(err);
                res.json(waybills);
            });
  });


// Requests with id
// ----------------------------------------------------
router.route('/waybill/:wb_id')

    .get(function(req, res) {
        Waybill.findById(req.params.wb_id, function(err, wb) {
            if (err)
                res.send(err);
            res.json(wb);
        });
    })

    .put(function(req, res) {
        Waybill.findById(req.params.wb_id, function(err, wb) {
            if (err)
                res.send(err);

            if (req.body.userTo != null)
                wb.userTo = req.body.userTo
            if (req.body.userFrom != null)
              wb.userFrom = req.body.userFrom

            /*for (var j = 0; j < req.body.updGood.length; j++) {
                for (var i = 0; i < wb.goods.length; i++) {
                    if(wb.goods[i]["name"] == req.body.updGood[j])
                    {
                      wb.goods[i].name = req.body.goods[j]["name"]
                      wb.goods[i].qty = req.body.goods[j]["qty"]
                      wb.goods[i].price = req.body.goods[j]["price"]
                      break;
                    }
                }
            }*/
            for(var i = 0; i < req.body.updGood.length; i++)
            {
              wb.goods[i].name = req.body.updGood[i]["name"];
              wb.goods[i].qty = req.body.updGood[i]["qty"];
              wb.goods[i].price = req.body.updGood[i]["price"];
            }


            var summ = 0;
            for (var i = 0; i < wb.goods.length; i++) {
              summ += wb.goods[i]["qty"] * wb.goods[i]["price"]
            }

            wb.total = summ

            wb.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Updated!' });
            });

        });
    })

    .delete(function(req, res) {
            Waybill.remove({
                _id: req.params.wb_id
            }, function(err, wb) {
                if (err)
                    res.send(err);

                res.json({ message: 'Deleted' });
            });
        });

router.route('/waybill/search/:date/:userTo/:userFrom')
    .get(function(req, res) {
        Waybill.find({
          date:req.params.date,
          userTo:req.params.userTo,
          userFrom:req.params.userFrom,
        }, function(err, waybills) {
                if (err)
                    res.send(err);

                res.json(waybills);
            });
        });

router.route('/waybill/searchT/:date/:userTo')
    .get(function(req, res) {
        Waybill.find({
          date:req.params.date,
          userTo:req.params.userTo,
        }, function(err, waybills) {
                if (err)
                    res.send(err);

                res.json(waybills);
            });
        });

router.route('/waybill/searchT/:userTo')
    .get(function(req, res) {
        Waybill.find({
          userTo:req.params.userTo,
        }, function(err, waybills) {
                if (err)
                    res.send(err);

                res.json(waybills);
            });
        });

router.route('/waybill/searchF/:userFrom')
    .get(function(req, res) {
        Waybill.find({
        userFrom:req.params.userFrom,
        }, function(err, waybills) {
                if (err)
                    res.send(err);

                res.json(waybills);
            });
        });

router.route('/waybill/searchF/:date/:userFrom')
    .get(function(req, res) {
        Waybill.find({
          date:req.params.date,
          userFrom:req.params.userFrom,
        }, function(err, waybills) {
                if (err)
                    res.send(err);

                res.json(waybills);
            });
        });

router.route('/waybill/search/:date')
    .get(function(req, res) {
        Waybill.findOne({
          date:req.params.date,
        }, function(err, waybills) {
                if (err)
                    res.send(err);

                res.json(waybills);
            });
        });

router.route('/waybill/search/:userTo/:userFrom')
    .get(function(req, res) {
        Waybill.find({
          userTo:req.params.userTo,
          userFrom:req.params.userFrom,
        }, function(err, waybills) {
                if (err)
                    res.send(err);

                res.json(waybills);
            });
        });
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /lab
app.use('/webpack-dev-server/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('\tRunning server.\n\tProt: ' + port);

new WebpackDevServer(webpack(config), config.devServer)
.listen(config.port, 'localhost', (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Listening at localhost:' + config.port);
  //console.log('Opening your system browser...');
  //open('http://localhost:' + config.port + '/webpack-dev-server/waybill');
});
