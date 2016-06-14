
var moment = require('moment');
var chai = require('chai'), chaiHttp = require('chai-http');
var assert = require("chai").assert;
chai.use(chaiHttp);
var url = 'http://localhost:8080/webpack-dev-server/waybill';
var tmout = 5000;

describe('Testing requests...', function () {
	var mgoods = [];
	var good =  {
            "qty" : 1,
            "price" : 20,
            "name": "Good1"
        }
	mgoods.push(good);
  var wb = {
        "userTo": ["UserToNameTest", "UserToCode", "UserToCompany"],
        "userFrom": ["UserFromName", "UserFromCode", "UserFromCompany"],
        "goods": mgoods
    };
	var wb2 = {
        "userTo": ["Edited", "Edited", "Edited"],
        "userFrom": ["UserFromName", "UserFromCode", "UserFromCompany"],
        "goods": mgoods
    };

  describe('GET', function () {
        this.timeout(tmout);
        it('Data checking...', function () {
            chai.request(url)
                .get("/")
								.set('Accept', 'application/json')
                .end(function (err, res) {
					assert.typeOf(res, 'Array');
                })
        });
    });

	describe('POST', function () {
        this.timeout(tmout);
        it('Sending data and checking HTTP status (201)...', function () {
            chai.request(url)
                .post("/")
                .send(wb)
								.set('Accept', 'application/json')
                .end(function (err, res) {
                    assert.equal(res.status, '201');
                })
        });
    });

	describe('PUT', function () {
        this.timeout(tmout);

				before(function () {
		            chai.request(url)
		                .post("/")
										.send(wb)
										.set('Accept', 'application/json')
		                .end()
				});

				var id = null;
				before(function () {
		            chai.request(url + '/searchT/UserToNameTest')
		                .get("/")
		                .end(function (err, res) {
		                    id = res._id;
		                })
				});

		    it('Edeting data and comparing data...', function () {
		            chai.request(url+"/"+id)
		                .put("/")
		                .send(wb2)
										.set('Accept', 'application/json')
		                .end(function (err, res) {
		                    assert.notEqual(res, wb);
		                })
		        });
	});

	describe('DELETE', function () {
        this.timeout(tmout);

				before(function () {
            chai.request(url)
                .post("/")
								.send(wb)
								.set('Accept', 'application/json')
                .end()
							});

				var id = null;
				before(function () {
			          chai.request(url + '/searchT/UserToNameTest')
			              .get("/")
			              .end(function (err, res) {
			                  id = res._id;
			              })
									});

		    it('Deleting data and getting HTTP status (204)...', function () {
		        chai.request(url+"/"+id)
		            .del("/")
		            .end(function (err, res) {
		                assert.equal(res.status, '204');
		            })
		    });
	});

});
