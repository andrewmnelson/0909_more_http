'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var fs = require('fs');

chai.use(chaiHttp);

require(__dirname + '/../server.js');

describe('server.js', function(){
  before(function() {
    this.instanceCheckNum = 1;
    var greetDir = __dirname + '/../dataFiles/greet';
    try { fs.unlinkSync(greetDir + '/1.json'); } catch (e) { }
    try { fs.unlinkSync(greetDir + '/2.json'); } catch (e) { }
    try { fs.rmdirSync(greetDir); } catch (e) { }
  });

  describe('GET missing resource', function() {
    var response;
    var error;
    beforeEach(function(done){
      chai.request('localhost:3000')
      .get('/greet')
      .end(function(err, res){
        error = err;
        response = res;
        done();
      });
    });
    it('should return 404', function() {
      expect(response).to.have.status(404);
    });
  });

  describe('POST /greet', function() {
    var response;
    var error;
    beforeEach(function(done){
      chai.request('localhost:3000')
      .post('/greet')
      .send({
          name: 'Andrew',
          instance: this.instanceCheckNum++
        })
      .end(function(err, res){
        error = err;
        response = res;
        done();
      });
    });
    it('should return no error', function() {
      expect(error).to.eql(null);
      expect(response).to.have.status(201);
      expect(response.text).to.eql('Posted instance 1 of \'greet\'');
    });
    it('should recognize existing resources', function() {
      expect(error).to.eql(null);
      expect(response).to.have.status(200);
      expect(response.text).to.eql('Posted instance 2 of \'greet\'');
    });
  });

  describe('GET existing resource', function() {
    var response;
    var error;
    beforeEach(function(done){
      chai.request('localhost:3000')
      .get('/greet')
      .end(function(err, res){
        error = err;
        response = res;
        done();
      });
    });
    it('should return latest instance with no error', function() {
      expect(response).to.have.status(200);
      expect(response.body).to.eql( { name: "Andrew", instance: 2 } );
    });
  });
});
