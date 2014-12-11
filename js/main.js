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

	// console.log(data);
	// console.log(gdelt);

	var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d.headline; });

	var margin = {top: 20, right: 60, bottom: 30, left: 40};
	var width = 1000 - margin.left - margin.right;
	var height = 350 - margin.top - margin.bottom;

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
			35
		])
		.range([height, 0]);

	

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom")
	    .ticks(20);

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var svg = d3.select('#graphic').append("svg")
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


	svg.selectAll('rect')
		.data(data)
		.enter()
		.append('rect')
		.attr('class', 'box')
		.attr('x', function(d){ return x(d.date); })
		.attr('y', function(d){ return y(d.article_total); })
		// .attr('y', function(d){ return y(d.country_article_total); })
		.attr('width', 2)
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



	var gline = d3.svg.line()
		.interpolate('basis')
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.smooth); });

	// var gdelt_group = svg.append('g')
	// 	.attr('class', 'gdeltgroup');

	// var gd = gdelt_group.selectAll('.gdelt')
	// 	.datum(gdelt);

	// gd.append('path')
	// 	.datum(gdelt)
	// 	.attr('class', 'gdelt')
	// 	.attr('d', gline);



	// gpath.append("text")
	//     .datum(function(d) { 
	//     	// console.log(d);
	//     	return d[d.length-1]; 
	//     })
	//     .attr("transform", function(d) { 
	//     	// console.log(d);
	//     	return 'translate(800, 25)';
	//     	// return "translate(" + x(d.date) + "," + y(d.smooth) + ")"; 
	//     })
	//     .attr("x", 3)
	//     .attr("dy", ".35em")
	//     // .style('z-index', '1000')
	//     .text('Protests');


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


	var gdelt_group = svg.append('g')
		.attr('class', 'gdeltgroup');

	gdelt_group
		.datum(gdelt)
		.append('path')
		.attr('class', 'gdelt')
		.attr('d', gline);

	// gdelt_group
	// 	.datum(gdelt)
	// 	.append('text')

	gdelt_group
	    .datum(function(d) { 
	    	return d[d.length-1]; 
	    })
	    .append("text")
	    .attr('class', 'gdelt_label')
	    .attr("transform", function(d) { 
	    	return "translate(" + x(d.date) + "," + y(d.smooth) + ")"; 
	    })
	    .attr("x", 8)
	    .attr("dy", ".35em")
	    .text('Protests');

	//////////////////////////////////////////////////////
	// Vertical event lines
	
	var line = d3.svg.line()
		.x(function(d) { return x(new Date(d)); })
		.y(function(d) { return 0; });
	
	var linegroup = svg.append('g');
	var eventDate = linegroup.selectAll('.event')
		.data(timeline)
		.enter();

	eventDate.append('line')
		.attr('x1', function(d){ return x(new Date(d.date)); })
		.attr('y1', 0)
		.attr('x2', function(d){ return x(new Date(d.date)); })
		.attr('y2', height)
		.style('stroke', 'rgba(0,0,0,0.1)')
		.style('fill', 'none');

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


	var legend = svg.append("g")
		.attr("class", "legend")
		.attr("x", w - 65)
		.attr("y", 25)
		.attr("height", 100)
		.attr("width", 100);

	legend.selectAll('rect')
		.data(dataset)
		.enter()
		.append("rect")
		.attr("x", w - 65)
		.attr("y", 25)
		.attr("width", 10)
		.attr("height", 10)
		.style("fill", function(d) { 
			return color_hash[dataset.indexOf(d)][1]
		});

	legend.selectAll('text')
		.data(dataset)
		.enter()
		.append("text")
		.attr("x", w - 65)
		.attr("y", 25)
		.text(function(d) { 
			return color_hash[dataset.indexOf(d)][0] + ": " + d;
		});

	
} // ends drawgraph()


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



