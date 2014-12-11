var format = d3.time.format('%Y%m%d');

var redScale = [
'rgba(0,0,0,0.1)',
'rgba(26,16,14,0.2)',
'rgba(44,26,22,0.3)',
'rgba(61,33,27,0.4)',
'rgba(78,38,31,0.5)',
'rgba(96,42,33,0.6)',
'rgba(115,45,35,0.7)',
'rgba(136,47,36,0.8)',
'rgba(159,47,37,0.9)',
'rgba(182,45,38,1)',
'rgba(182,45,38,1)',
'rgba(206,39,37,1)',
'rgba(206,39,37,1)',
'rgba(206,39,37,1)',
'rgba(206,39,37,1)',
'rgba(206,39,37,1)',
'rgba(182,45,38,1)',
'rgba(206,39,37,1)',
'rgba(206,39,37,1)',
'rgba(206,39,37,1)',
'rgba(206,39,37,1)',
'rgba(206,39,37,1)',
'rgba(206,39,37,1)',
'rgba(206,39,37,1)',
'rgba(206,39,37,1)',
'rgba(206,39,37,1)',
'rgba(206,39,37,1)',
'rgba(206,39,37,1)',
'rgba(206,39,37,1)',
'rgba(206,39,37,1)',
'rgba(206,39,37,1)',
'rgba(206,39,37,1)',
'rgba(206,39,37,1)',
'rgba(206,39,37,1)',
'rgba(206,39,37,1)',
'rgba(206,39,37,1)',
'rgba(206,39,37,1)',
'rgba(206,39,37,1)',
'rgba(206,39,37,1)',
'rgba(206,39,37,1)',
'rgba(206,39,37,1)'
];

function roundDate(date) {
	return format(new Date(date));
}

function parseDate(date) {
	return format.parse(date);
}


function addOverallIndex(data) {
	// console.log(data);

	// create the new dataset, sorted by date:
	var newData = {};
	_.each(data, function(d) {
		date = roundDate(d.date);
		// console.log(date);
		var article = {};

		article['headline'] = d.headline;
		article['source'] = d.source;
		article['url'] = d.web_url;
		article['country_1'] = d.country_1;
		// article['snippet'] = d.snippet;
		// article['lead_paragraph'] = d.lead_paragraph;
		// article['document_type'] = d.document_type;

		// function checkParagraph()
		// if (d.lead_paragraph === 'None') {
		// 	article['snippet'] = d.snippet;
		// } else {
		// 	article['lead_paragraph'] = d.lead_paragraph;
		// }

		// if newData does not have date, 1st time through:
		if(!_.has(newData, date)) {		
			newData[date] = [];
			newData[date].push(article);
		} else {
			newData[date].push(article);
		}	
	});

	// take the index of the atricle in the array, and add it to the article entry (this will be used for the y position):

	_.each(newData, function(value, date) {
		var countriesCounter = {};
		_.each(value, function(entry, index) {
			entry['article_total'] = index + 1;
			if (_.has(countriesCounter, entry['country_1'])) {
				countriesCounter[entry['country_1']] += 1;	
			} else {
				countriesCounter[entry['country_1']] = 1;
			}
			entry['country_article_total'] = countriesCounter[entry['country_1']];
		});
	});

	// turn the data back into an array for D3:
	var finalData = [];
	_.each(newData, function(value, key) {	
		_.each(value, function(entry) {
			entry['date'] = parseDate(key);
			finalData.push(entry);
		});
	});
	// console.log(finalData);

	return finalData;
}

function processGDELT(gdelt) {
	var processed = gdelt.forEach(function(d){
		d.date = new Date(d.date);
		d.smooth = +d.smooth;
	});
	return processed;
}


function parseCountries(data, timeline, gdelt) {


	var start = new Date('1997-4-29');
	var end = new Date('2014-12-2');
	var daterange = moment.range(start, end);


	var finalData = addOverallIndex(data);
	// var finalGDELT = processGDELT(gdelt);

	gdelt.forEach(function(d){
		d.date = new Date(d.date);
		d.smooth = +d.smooth;
	});

	drawGraph(finalData, timeline, gdelt, 'graphic1', 'All');
	// loadData(countriesObj['egypt'], timeline, false, 'graphic1', 'Egypt');


							// console.log(data);
							// var worldArticles = [];
							// var otherArticles = [];

							// _.each(data, function(entry) {
							// 	if (entry.section === 'world') {
							// 		// console.log(entry.snippet);
							// 		worldArticles.push(entry);
							// 	} else {
							// 		otherArticles.push(entry);
							// 	}
							// });

	// var countriesObj = {};
	// var others = [];

	// _.each(data, function(entry) {
		
	// 	if(!_.has(countriesObj, entry.country_1)){
	// 		countriesObj[entry.country_1] = [entry];
	// 	} else {
	// 		// console.log(countriesObj[entry.country_1]);
	// 		countriesObj[entry.country_1].push(entry);
	// 	}
	// });

	// // console.log('countries', countriesObj);
	// // console.log('others', others);

	// var newData = [];
	// _.each(countriesObj, function(countryArticles, countryName) {
	// 	// console.log('countryArticles:', countryArticles, 'countryName:', countryName);

	// 	var temp = {};
	// 	temp['name'] = countryName;
	// 	temp['values'] = {};

	// 	daterange.by('days', function(moment) {
	// 		var day = moment.toDate();
	// 		temp['values'][roundDate(day)] = 0;
	// 	});

	// 	_.each(countryArticles, function(entry) {
	// 		// var article = {};
	// 		var date = roundDate(entry.date);
	// 		// article['date'] = date;

	// 		temp['values'][date] += 1;

	// 		// if (!_.has(temp['values'], date)) {
	// 		// 	temp['values'][date] = 1;
	// 		// } else {
	// 		// 	temp['values'][date] += 1;
	// 		// }
	// 	});

	// 	// switches values from object to array:
	// 	var entries = [];
	// 	_.each(temp['values'], function(value, key) {
	// 		// console.log('values:', parseDate(key), value);
			
	// 		var obj = {'date': parseDate(key),
	// 				   'count': value
	// 				  };
	// 		entries.push(obj);
	// 	});
	// 	temp['values'] = entries;

	// 	newData.push(temp);
	// });

	// console.log(newData);


	// // drawLineGraph(newData, timeline, '#graphic1');
	// // loadData(worldArticles, timeline, gdelt);
	// // loadData(others, timeline, gdelt, '#graphic1');
	// // console.log(_.keys(countriesObj));




	// loadData(data, timeline, gdelt, 'graphic0', 'All');

	// // _.each(_.keys(countriesObj), function(name, index) {
	// // 	// console.log(name, index);
	// // 	loadData(countriesObj[name], timeline, gdelt, 'graphic'+index+1, name);
	// // });

	// loadData(countriesObj['egypt'], timeline, false, 'graphic1', 'Egypt');
	// loadData(countriesObj['bahrain'], timeline, false, 'graphic2', 'Bahrain');
	// loadData(countriesObj['syria'], timeline, false, 'graphic3', 'Syria');
	// loadData(countriesObj['libya'], timeline, false, 'graphic4', 'Libya');
	// loadData(countriesObj['tunisia'], timeline, false, 'graphic5', 'Tunisia');

	// loadData(countriesObj['united states'], timeline, false, 'graphic6', 'United States');
	// loadData(countriesObj['turkey'], timeline, false, 'graphic7', 'Turkey');
	// loadData(countriesObj['hong kong'], timeline, false, 'graphic8', 'Hong Kong');
	// loadData(countriesObj['greece'], timeline, false, 'graphic9', 'Greece');
}




function loadData(data, timeline, gdelt, target, name) {
	// d3.csv('assets/teargasdata.csv', function(data) {
		console.log(data);

		// create the new dataset, sorted by date:
		var newData = {};
		_.each(data, function(d) {
			date = roundDate(d.date);
			// console.log(date);
			var article = {};

			article['headline'] = d.headline;
			article['source'] = d.source;
			article['url'] = d.web_url;
			// article['snippet'] = d.snippet;
			// article['lead_paragraph'] = d.lead_paragraph;
			// article['document_type'] = d.document_type;

			// function checkParagraph()
			// if (d.lead_paragraph === 'None') {
			// 	article['snippet'] = d.snippet;
			// } else {
			// 	article['lead_paragraph'] = d.lead_paragraph;
			// }

			// if newData does not have date, 1st time through:
			if(!_.has(newData, date)) {		
				newData[date] = [];
				newData[date].push(article);
			} else {
				newData[date].push(article);
			}	
		});
		// console.log(newData);

		// take the index of the atricle in the array, and add it to the article entry (this will be used for the y position):
		_.each(newData, function(value, date) {
			_.each(value, function(entry, index) {
				entry['article_country'] = index + 1;
			});
		});

		// turn the data back into an array for D3:
		var finalData = [];
		_.each(newData, function(value, key) {	
			_.each(value, function(entry) {
				entry['date'] = parseDate(key);
				finalData.push(entry);
			});
		});
		// console.log(finalData);

		console.log(gdelt);

		if (gdelt) {
			gdelt.forEach(function(d){
				d.date = new Date(d.date);
				d.smooth = +d.smooth;
			});
		}
		

		drawGraph(finalData, timeline, gdelt, target, name);
		// drawLineGraph(finalData, timeline, target);
	// }); // ends d3.tsv
}

function drawGraph(data, timeline, gdelt, target, title) {
	// console.log(gdelt);
	// console.log('data', data);

	console.log(data);
	console.log(gdelt);


	d3.select('#graphics')
		.append('div')
		.attr('id', target)
		// .append('h3')
		// .text(title)
		;

	var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d.headline; });

	var margin = {top: 20, right: 20, bottom: 30, left: 40};
	var width = 1000 - margin.left - margin.right;
	var height = 300 - margin.top - margin.bottom;

	var x = d3.time.scale()
		.domain([
			new Date('1997-04-29'),
			new Date('2014-12-02')
			// d3.min(data, function(d) { return d.date; }),
			// d3.max(data, function(d) { return d.date; })
		])
		.range([0, width]);

	var y = d3.scale.linear()
		.domain([
			0,
			30
			// d3.max(data, function(d) { return d.i; })
		])
		.range([height, 0]);

	

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom")
	    .ticks(20);

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var svg = d3.select('#'+target).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append('g')
	    .attr('class', 'x axis')
	    .attr('transform', 'translate(0,' + height + ')')
	    .call(xAxis);

	svg.append('g')
	    .attr('class', 'y axis')
	    .call(yAxis)
	    .append('text')
	    .attr('class', 'label')
	    .attr('transform', 'rotate(-90)')
	    .attr('y', 6)
	    .attr('dy', '0.71em')
	    .style('text-anchor', 'end')
	    .text('Number of News Articles per Day');

	svg.call(tip);

	//////////////////////////////////////////////////////
	// Vertical event lines
	var linegroup = svg.append('g');
	var line = d3.svg.line()
		.x(function(d) { return x(new Date(d)); })
		.y(function(d) { return 0; });
	var eventDate = linegroup.selectAll('.event')
		.data(timeline)
		.enter();
	// eventDate.append('line')
	// 	.attr('x1', function(d){ return x(new Date(d.date)); })
	// 	.attr('y1', 0)
	// 	.attr('x2', function(d){ return x(new Date(d.date)); })
	// 	.attr('y2', height)
	// 	.style('stroke', 'rgba(255,0,0,0.4)')
	// 	.style('fill', 'none');
	eventDate.append('text')
		.attr('class', 'event-label')
		.attr('transform', 'rotate(-90)')
		.attr('x', 0)
		.attr('y', function(d) {
			return x(new Date(d.date));
		})
		.attr('dy', '1em')
		.text(function(d) {
			return d.label;
		});
	//////////////////////////////////////////////////////



	svg.selectAll('rect')
		.data(data)
		.enter()
		.append('rect')
		.attr('class', 'box')
		// .attr('class', function(d) {

		// 	// console.log(d.source);
		// 	if (d.source === 'AP') {
		// 		return 'ap'; //'rgba(239, 59, 53, 0.2)'
		// 	} else if (d.source === 'Reuters') {
		// 		return 'reuters'; //'rgba(252, 128, 36, 0.2)'
		// 	} else if (d.source === 'Guardian') {
		// 		return 'guardian'; //'rgba(51, 105, 217, 0.2)'
		// 	} else if (d.source === 'International Herald Tribune') {
		// 		return 'iht';
		// 	} else {
		// 		return 'nytimes'; //'rgba(0, 0, 0, 0.07)'
		// 	}
		// })
		.attr('x', function(d){ return x(d.date); })
		.attr('y', function(d){ return y(d.article_total); })
		// .attr('y', function(d){ return y(d.country_article_total); })
		.attr('width', 2)
		// .attr('height', (height / d3.max(data, function(d) { return d.i; })) - 1 )
		.attr('height', 8)
		.style('fill', function(d) { 
			if (d.article_total > 10) {
				return 'rgba(206,39.37,1)';
			} else {
				return redScale[d.article_total];
			}
			// console.log(redScale[d.article_total]); 
		})
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide)
		;


	if (gdelt) {
		console.log(gdelt);
		var gline = d3.svg.line()
			.interpolate('basis')
			.x(function(d) { return x(d.date); })
			.y(function(d) { return y(d.smooth); })

		svg.append('path')
			.datum(gdelt)
			.attr('class', 'gdelt')
			.attr('d', gline);

	}


	// d3.selectAll(".button--all,.button--position").on("click.position", function() {
	//   circle.transition(checkbox.property("checked") ? "position" : null)
	//       .delay(function(d, i) { return i * 50; })
	//       .duration(750)
	//       .attr("cy", (togglePosition = !togglePosition) ? 100 : height - 100);
	// });

	// d3.selectAll(".button--all,.button--size").on("click.size", function() {
	//   circle.transition(checkbox.property("checked") ? "size" : null)
	//       .delay(function(d, i) { return (n - 1 - i) * 50; })
	//       .duration(750)
	//       .attr("r", (toggleSize = !toggleSize) ? 50 : 10);
	// });	


	////////////////////////////////////////////////////////////


	// var margin = {top: 10, right: 10, bottom: 100, left: 40};
	// var margin2 = {top: 430, right: 10, bottom: 20, left: 40};
	// var width = 960 - margin.left - margin.right;
	// var height = 500 - margin.top - margin.bottom;
	// var height2 = 500 - margin2.top - margin2.bottom;

	// var x = d3.time.scale()
	// 	.domain([
	// 		d3.min(data, function(d) { return d.date; }),
	// 		d3.max(data, function(d) { return d.date; })
	// 	])
	// 	.range([0, width]);
	// var x2 = d3.time.scale()
	// 	.domain(x.domain())
	// 	.range([0, width]);
	// var y = d3.scale.linear()
	// 	.domain([0, d3.max(data, function(d) { return d.i; })])
	// 	.range([height, 0]);
	// var y2 = d3.scale.linear()
	// 	.domain(y.domain())
	// 	.range([height2, 0]);

	// var xAxis = d3.svg.axis().scale(x).orient('bottom');
	// var xAxis2 = d3.svg.axis().scale(x2).orient('bottom');
	// var yAxis = d3.svg.axis().scale(y).orient('left');

	// var brush = d3.svg.brush()
	// 	.x(x2)
	// 	.on('brush', brushed);

	// var gline = d3.svg.line()
	// 	.x(function(d) { return x(d.date); })
	// 	.y(function(d) { return y(d.nummentions); })

	// var gArea = d3.svg.area()
	// 	.interpolate('monotone')
	// 	.x(function(d) { return x(d.date); })
	// 	.y0(height)
	// 	.y1(function(d) { return y(d.nummentions); });

	// var gArea2 = d3.svg.area()
	// 	.interpolate('monotone')
	// 	.x(function(d) { return x2(d.date); })
	// 	.y0(height2)
	// 	.y1(function(d) { return y2(d.nummentions); });

	// var svg = d3.select("#graphic").append("svg")
	//     .attr("width", width + margin.left + margin.right)
	//     .attr("height", height + margin.top + margin.bottom)
	// 	.append("g")
	//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 //    svg.append('defs').append('clipPath')
 //    	.attr('id', 'clip')
 //    	.attr('width', width - 40)
 //    	.attr('height', height);

	// var focus = svg.append("g")
	//     .attr("class", "focus")
	//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// var context = svg.append("g")
	//     .attr("class", "context")
	//     .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

	// // focus.append('path')
	// // 	.datum(gdelt)
	// // 	.attr('class', 'area')
	// // 	.attr('d', gArea)
	// // 	.style('stroke', 'rgba(140,173,241,0.1)')
	// // 	.style('fill', 'rgba(140,173,241,0.3)');


	// focus.selectAll('rect')
	// 	.data(data)
	// 	.enter()
	// 	.append('rect')
	// 	.attr('class', 'box')
	// 	.attr('class', function(d) {

	// 		// console.log(d.source);
	// 		if (d.source === 'AP') {
	// 			return 'ap'; //'rgba(239, 59, 53, 0.2)'
	// 		} else if (d.source === 'Reuters') {
	// 			return 'reuters'; //'rgba(252, 128, 36, 0.2)'
	// 		} else if (d.source === 'Guardian') {
	// 			return 'guardian'; //'rgba(51, 105, 217, 0.2)'
	// 		} else {
	// 			return 'nytimes'; //'rgba(0, 0, 0, 0.07)'
	// 		}
	// 	})
	// 	.attr('x', function(d){ return x(d.date); })
	// 	.attr('y', function(d){ return y(d.i); })
	// 	.attr('width', 2)
	// 	.attr('height', 10)
	// 	// .on('mouseover', tip.show)
	// 	// .on('mouseout', tip.hide)
	// 	;

	// focus.append('g')
	//     .attr('class', 'x axis')
	//     .attr('transform', 'translate(0,' + height + ')')
	//     .call(xAxis);

	// focus.append('g')
	//     .attr('class', 'y axis')
	//     .call(yAxis)
	//     .append('text')
	//     .attr('class', 'label')
	//     .attr('transform', 'rotate(-90)')
	//     .attr('y', 6)
	//     .attr('dy', '0.71em')
	//     .style('text-anchor', 'end')
	//     .text('Number of News Articles per Day');

	// context.append('path')
	// 	.datum(gdelt)
	// 	.attr('class', 'area')
	// 	.attr('d', gArea2)
	// 	.style('stroke', 'rgba(140,173,241,0.1)')
	// 	.style('fill', 'rgba(140,173,241,0.3)');

	// context.append('g')
	//     .attr('class', 'x axis')
	//     .attr('transform', 'translate(0,' + height2 + ')')
	//     .call(xAxis2);

	// context.append('g')
	// 	.attr('class', 'x brush')
	// 	.call(brush)
	// 	.selectAll('rect')
	// 	.attr('y', -6)
	// 	.attr('height', height2 + 7);

	// function brushed() {
	// 	x.domain(brush.empty() ? x2.domain() : brush.extent());
	// 	// focus.select(".area").attr("d", gArea);
	// 	focus.select(".box").attr("width", 2);
	// 	focus.select(".x.axis").call(xAxis);
	// }

	
} // ends drawgraph()


function drawLineGraph(data, timeline, target) {

	// console.log(data);

	// var categories = [];
	// _.each(data, function(entry) {
	// 	var temp = {
	// 		name: entry.headline,
	// 		values: {
	// 			date: entry.date,
	// 			number: entry.i
	// 		}
	// 	};
	// 	categories.push(temp);
	// });
	// console.log('categories', categories);

	// var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d.headline; });

	var margin = {top: 20, right: 20, bottom: 30, left: 40};
	var width = 1000 - margin.left - margin.right;
	var height = 400 - margin.top - margin.bottom;

	var x = d3.time.scale()
		.domain([
			new Date('1997-04-29'),
			new Date('2014-12-02')
			// d3.min(data, function(d) { return d.date; }),
			// d3.max(data, function(d) { return d.date; })
		])
		.range([0, width]);

	var y = d3.scale.linear()
		.domain([
			0,
			25
			// d3.max(data, function(d) { return d.i; })
		])
		.range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom")
	    .ticks(20);

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var svg = d3.select(target).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append('g')
	    .attr('class', 'x axis')
	    .attr('transform', 'translate(0,' + height + ')')
	    .call(xAxis);

	svg.append('g')
	    .attr('class', 'y axis')
	    .call(yAxis)
	    .append('text')
	    .attr('class', 'label')
	    .attr('transform', 'rotate(-90)')
	    .attr('y', 6)
	    .attr('dy', '0.71em')
	    .style('text-anchor', 'end')
	    .text('Number of News Articles per Day');

	// svg.call(tip);

	var line = d3.svg.line()
	    .interpolate("basis")
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(d.count); });

	
	var countryLines = svg.selectAll('.country')
		.data(data)
		.enter()
		.append('g')
		.attr('class', 'country');

	// console.log(countryLines);

	countryLines.append('path')
		.attr('class', 'line')
		.attr('d', function(d) { return line(d.values); })
		.attr('stroke', 'steelblue');

}



$(document).ready(function() {

	queue()
	    // .defer(d3.tsv, 'assets/teargasdata2.tsv')
	    .defer(d3.tsv, 'assets/teargas_region-country1.tsv')
		// .defer(d3.tsv, 'assets/20131001-20131231_nytimes_get-articles_output.tsv')
	    .defer(d3.csv, 'assets/ProtestTimeline.csv')
	    .defer(d3.csv, 'assets/GDELT-protests_smooth1.csv')
	    .await(function(error, articles, timeline, gdelt) {
	    	// loadData(articles, timeline, countries, gdelt);
	    	parseCountries(articles, timeline, gdelt);
	    });
});



