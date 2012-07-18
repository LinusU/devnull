
var request = require('request');
var jQuery = require('jquery');

request({ uri: "http://edition.cnn.com/" }, function (error, response, body) {
    
    //console.log(body.match(/(^|[^a-zA-Z0-9\/-])[Ss]pace([^a-zA-Z0-9\/-]|$)/g).length);
    
    console.log(jQuery(body).find('body').text().match(/(^| )[Ss]pace( |$)/g).length);
    
});
