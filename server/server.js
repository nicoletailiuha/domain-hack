var express = require('express');
var bodyParser = require("body-parser");
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var cors = require('cors');

app.use(bodyParser.text());
app.use(cors());

app.post('/domains', function(req, res){

	var text = req.body.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
	getDomainInfoArray().then(function(result) {
		getDomainHackList(text.toString(), result).then(function(domainHackList) {
			res.send(JSON.stringify(domainHackList))
		})
	})

})

//parsing the Wikipedia list for info
function getDomainInfoArray() {
	var url = 'https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains';

	var domains = [];
	return new Promise(function(resolve, reject) {
		request(url, function(error, response, html){
			if(!error){
				var $ = cheerio.load(html);

				$('.wikitable').each(function(i, elem) {
					//only the tables in which the first column has 'Name' header
					//contain needed information
					if ($(elem).find('th').first().text() == 'Name') {
						//if the second table column contains the 'Entity' header then
						//the additional info column is the fourth, otherwise - the third
						var secondColumnTextIsEntity = $(elem).find('th').eq(1).text() == 'Entity';
						$(elem).find('tbody').find('tr').each(function(i, elem) {
							if ($(elem).find('td').first().text().length > 0) {
								domains.push(getDomain($(elem), secondColumnTextIsEntity));
							}
						})
					}
				})
				resolve(domains);
			} else {
				reject(error);
			}
		})
	});
}

function getDomain(elem, flag) {
	return newDomain = {
		name: removeCitations(elem.find('td').first().text()),
		type: {
			text: removeCitations(elem.find('td').eq(1).text()),
			flagIcon: flag ? elem.find('td').eq(1).find('.flagicon').find('img').attr('src') : ''
		},
		notes: removeCitations(elem.find('td').eq(flag ? 3 : 2).text())
	};
}

function getDomainHackList(text, domainInfoList) {
	return new Promise(function(resolve, reject) {
		var domainHackList = [];
		//find list of domains contained in the requested text
		var matchingDomains = domainInfoList.filter(function(elem) {
			return text.indexOf(elem.name.replace('.', '')) > 0
		})
		matchingDomains.forEach(function(domain) {
			var indexOfDomain = text.indexOf(domain.name.replace('.', ''));
			//add dot before the domain name
			var hackedDomain = text.slice(0, indexOfDomain) + '.' + text.slice(indexOfDomain);

			//add slash after the domain name
			if (indexOfDomain + domain.name.length <= text.length) {
				hackedDomain = hackedDomain.slice(0, indexOfDomain + domain.name.length) + '/' + hackedDomain.slice(indexOfDomain + domain.name.length);
			}
			domainHackList.push({
				name: hackedDomain,
				type: {
					text: domain.type.text,
					flagIcon: domain.type.flagIcon
				},
				notes: domain.notes
			});
		})
		//sorting domains by the lowest number of elements after slash
		domainHackList.sort(function(a, b) {
			var paramA = getComparisonParameter(a.name);
			var paramB = getComparisonParameter(b.name);
			return (paramA < paramB) ? -1 : (paramA > paramB ? 1 : 0);
		})
		resolve(domainHackList);
	})
}

function getComparisonParameter(string) {
	return string.indexOf('/') < 0 ? 0 : string.length - string.indexOf('/');
}

function removeCitations(text) {
	return text.replace(/\[.*\]/, '')
}

app.listen('8080')
exports = module.exports = app;