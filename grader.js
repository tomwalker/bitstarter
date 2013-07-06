#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

// var http = require('http');    was going to use this but went for restler instead
var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');
//var sleep = require('sleep');

var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "http://powerful-dusk-9947.herokuapp.com/";


var assertFileExists = function (infile) {  
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {    // checks if a file exists
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;    // returns as a string
};

var assertUrlExists = function (inUrl) {
	var url_string = inUrl.toString();
	rest.head(url_string).on('complete', function(result){
		if(result instanceof Error) {
			console.log("%s is not available. Exiting.", inUrl);
			process.exit(1);
		}
	});
	return url_string;
};

var cheerioHtmlFile = function (htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));    // loads the html using cheerio
};

var loadChecks = function (checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));    //  returns a file parsed into JSON
};

var checkHtmlFile = function (htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for (var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;    // returns a file with a dictionary of elements specified in checksfile and whether they are present or not in htmlfile
};

var checkUrl = function (request_data, checksfile) {
	$ = cheerio.load(request_data);
	var checks = loadChecks(checksfile).sort();
	var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function (fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <url>', 'Url to index.html', clone(assertUrlExists), URL_DEFAULT)
        .parse(process.argv);
    if(program.url) {
		rest.get(program.url).on('complete', function(result) {
//			sleep.sleep(5);
			var checkJson = checkUrl(result, program.checks);
			var outJson = JSON.stringify(checkJson, null, 4);
//			console.log("printing after url check");
			console.log(outJson);
//			console.log("-------------------");
			console.log(result.url);

		});
	}
	else {
		var checkJson = checkHtmlFile(program.file, program.checks);
		var outJson = JSON.stringify(checkJson, null, 4);
		console.log(outJson);
	}

} else {
    exports.checkHtmlFile = checkHtmlFile;
}







