var express = require('express');
var app = express();
var config = require('./config');
var async = require('async');
var querystring = require('querystring');
var https = require('https');

var client_id = config.concur.client_id;
var client_secret = config.concur.client_secret;

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send(
	"<b>Concur Web Flow Demo</b><br/><br/>" +
    "<b>Step 1</b> - <a href='https://www.concursolutions.com/net2/oauth2/Login.aspx?client_id=" + client_id + "&scope=ITINER&redirect_uri=https://stark-island-9579.herokuapp.com/redirect&state=OPTIONAL_APP_DEFINED_STATE'><b>Login to Concur</b></a>" +
	"&nbsp;(This link is pointing to the href below...) <br/><br/>" +
    "<textarea rows='4' cols='100'>" + "https://www.concursolutions.com/net2/oauth2/Login.aspx?client_id=gA42rKGFxoVd9Toad1oR4e&scope=ITINER&redirect_uri=https://stark-island-9579.herokuapp.com/redirect&state=OPTIONAL_APP_DEFINED_STATE".encodeHTML() + "</textarea><br/><br/>" +
    "<font color='red'>Use the following login credentials after clicking the link above: </font><br/><br/>" +
    "Username: <b>user50@concurdisrupt.com</b><br/>" +
    "Password: <b>disrupt</b>"
  );
});

app.get('/redirect', function(request, response) {
  if(request.query.code == null || request.query.code == "") response.send("Parameter <b>Code</b> was was not passed. Start <a href='https://stark-island-9579.herokuapp.com/'>here</a> again.");

  var access_token;

  async.waterfall([
    function(callback) {
	  var host = "www.concursolutions.com";
	  var endpoint = "/net2/oauth2/GetAccessToken.ashx";

      doRequest(host, endpoint, 'GET', null,
      {
	    "code": request.query.code,
	    "client_id": client_id,
	    "client_secret": client_secret
	  }, function(data) {
		     callback(null, data);
		 }
	  );
	},

	function(tokenXML, callback) {
	  var accessToken = tokenXML.match(/<Token>(.*?)<\/Token>/g).map(function(val) {
		  return val.replace(/<\/?Token>/g,'');
  	  });

	  var host = "www.concursolutions.com";
	  var endpoint = "/api/travel/trip/v1.1";

      doRequest(host, endpoint, 'GET',
      {
	    "Authorization": "OAuth " + accessToken,
	  }, null, function(data) {
		   var itinResponse = data;
		   var result = {
			   "tokenXML": tokenXML,
			   "accessToken": accessToken,
			   "itinResponse": itinResponse
		   }

		   callback(null, result);
		 }
	  );
	}

  ],
  function(err, result) {
    if(err) response.send(err);
    else response.send(

	  "<b>Concur Web Flow Demo</b><br/><br/>" +

	  "<b>Step 2</b> -  After getting <b>code</b> from Step 1, run the API call below to get your access token<br/><br/>" +

  	  "https://www.concursolutions.com/net2/oauth2/GetAccessToken.ashx?" + "<br/>" +
  	  "&nbsp;&nbsp;&code=" + "<b>" + request.query.code + "</b> (We got this from Step 1)<br/>" +
  	  "&nbsp;&nbsp;&client_id=YOUR_CLIENT_ID (You'll get this from your Concur sandbox account)<br/> " +
  	  "&nbsp;&nbsp;&client_secret=YOUR_CLIENT_SECRET (You'll get this from your Concur sandbox account)<br/><br/>" +

  	  "Here's the response we got - <br/><br/>" + "<textarea rows='6' cols='100'>" + result.tokenXML.encodeHTML()+ "</textarea><br/><br/>" +

  	  "<b>Step 3</b> - After getting the <b>access token</b> from Step 2, run the API call below to get an Itinerary List<br/><br/>" +

  	  "https://www.concursolutions.com//api/travel/trip/v1.1<br/>" +
  	  "&nbsp;&nbsp;Header - 'Authorization: OAuth <b>" + result.accessToken + "</b>' (We got this from Step 2)<br/><br/>" +

  	  "Here's the response we got - <br/><br/>" + "<textarea rows='6' cols='100'>" + result.itinResponse.encodeHTML()+ "</textarea>"

    );
  });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

// util

function doRequest(host, endpoint, method, headers, data, success) {
  var dataString = JSON.stringify(data);
  //var headers = {};

  if (method == 'GET') {
    endpoint += '?' + querystring.stringify(data);
  }
  //else {
  //  headers = {
  //    'Content-Type': 'application/json',
  //    'Content-Length': dataString.length
  //  };
  //}
  var options = {
    host: host,
    path: endpoint,
    method: method,
    headers: headers
  };

  var req = https.request(options, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      console.log(responseString);
      //var responseObject = JSON.parse(responseString);
      //success(responseObject);
      success(responseString);
    });
  });

  req.write(dataString);
  req.end();
}

if (!String.prototype.encodeHTML) {
  String.prototype.encodeHTML = function () {
    return this.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&apos;');
  };
}
