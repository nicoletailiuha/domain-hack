var express = require('express');
var bodyParser = require("body-parser");
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.use(bodyParser.text());

app.post('/domains', function(req, res){

	var text = req.body;
	getDomainInfoArray().then(function(result) {
		getDomainHackList(text.toString(), result).then(function(domainHackList) {
			res.send(domainHackList.toString())
		})
	})

})

function getDomainInfoArray() {
	var url = 'https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains';

	var domains = [];
	return new Promise(function(resolve, reject) {
		request(url, function(error, response, html){
			if(!error){
				var $ = cheerio.load(html);

				$('.wikitable').each(function(i, elem) {
					if ($(elem).find('th').first().text() == 'Name') {
						var secondColumnTextIsEntity = $(elem).find('th').eq(1).text() == 'Entity';
						$(elem).find('tbody').find('tr').each(function(i, elem) {
							if ($(elem).find('td').first().text().length > 0) {
								var newDomain = {
									name: $(elem).find('td').first().text(),
									type: {
										text: $(elem).find('td').eq(1).text(),
										flagIcon: secondColumnTextIsEntity ? $(elem).find('td').eq(1).find('.flagicon').find('img').attr('src') : ''
									},
									notes: $(elem).find('td').eq(secondColumnTextIsEntity ? 3 : 2).text()
								};
								domains.push(newDomain);
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

function getDomainHackList(text, domainInfoList) {
	return new Promise(function(resolve, reject) {
		var domainHackList = [];
		var matchingDomains = domainInfoList.filter(function(elem) {
			return text.toLowerCase().replace(/[\W_]+/g, ' ').indexOf(elem.name.replace('.', '')) > 0
		})
		matchingDomains.forEach(function(domain) {
			var indexOfDomain = text.indexOf(domain.name.replace('.', ''));
			var hackedDomain = text.slice(0, indexOfDomain) + '.' + text.slice(indexOfDomain);

			if (indexOfDomain + domain.name.length <= text.length) {
				hackedDomain = hackedDomain.slice(0, indexOfDomain + domain.name.length) + '/' + hackedDomain.slice(indexOfDomain + domain.name.length);
			}
			domainHackList.push(hackedDomain);
		})
		domainHackList.sort(function(a, b) {
			var paramA = getComparisonParameter(a);
			var paramB = getComparisonParameter(b);
			return (paramA < paramB) ? -1 : (paramA > paramB ? 1 : 0);
		})
		resolve(domainHackList);
	})
}

function getComparisonParameter(string) {
	return string.indexOf('/') < 0 ? 0 : string.length - string.indexOf('/');
}

app.listen('3000')
exports = module.exports = app;