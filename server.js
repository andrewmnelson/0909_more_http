'use strict';

var http = require('http');
var fs = require('fs');

var serverFunction = function(req, resp) {
  if ("/" === req.url) {
    resp.writeHead(200, {'Content-Type': 'text/plain'});
    resp.write('GET and POST requests to read/write JSON files on this server');
    return resp.end();
  }
  var entityPath = req.url.split('/');
  entityPath.shift();
  var entity = entityPath.join('_');
  var entFile = (__dirname + '/dataFiles/' + entity);
  var entityExists = true;
  var entInstance = 0;
  try {
    entityExists = fs.statSync(entFile).isDirectory();
    entInstance = fs.readdirSync(entFile).length;
  }
  catch (err) {
    entityExists = false;
  }
  // console.log((entityExists? 'old' : 'new') + ': ' + entFile);

  if ('POST' === req.method) {  // create new content
    if (entityExists) {
      entInstance += 1; // we're looking to make a new instance
    }
    else {
      fs.mkdirSync(entFile);
      entInstance = 1;  // this will be the first entry for the new entity
    }
    var entStream = fs.createWriteStream(entFile + '/' + entInstance.toString() + '.json');

    req.on('data', function(chunk) {
      entStream.write(chunk);
    });
    req.on('end', function() {
      entStream.end();
    });

    resp.writeHead(entityExists? 200 : 201, {'Content-Type': 'text/plain'});
    resp.write('Posted instance ' + entInstance + ' of \'' + entity + '\'');
    return resp.end();
  }

  // non-POST methods require an existing resource
  if (entityExists) {
    if ('GET' === req.method) {
      var readStream = fs.createReadStream(entFile + '/' + entInstance.toString() + '.json');
      resp.writeHead(200, {'Content-Type': 'application/json'});
      readStream.pipe(resp);
    }
  }
  else {
    resp.writeHead(404, {'Content-Type': 'text/plain'});
    resp.write('Resource \'' + entity + '\' not found');
    return resp.end();
  }


};

// server won't work if dataFiles directory doesn't exist, so create if we can
try { fs.mkdirSync(__dirname + '/dataFiles'); } catch(e) { }

var server = http.createServer(serverFunction);
server.listen(3000);
