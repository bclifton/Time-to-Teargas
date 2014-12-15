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

function processGDELT(gdelt) {
	var processed = gdelt.forEach(function(d){
		d.date = new Date(d.date);
		d.smooth = +d.smooth;
	});
	return processed;
}

function addOverallIndex(data) {
	// console.log(data);

	// create the new dataset, sorted by date:
	var newData = {};
	_.each(data, function(d) {
		date = roundDate(d.date);

		var article = {};

		article['headline'] = d.headline;
		article['source'] = d.source;
		article['url'] = d.web_url;
		article['country_1'] = d.country_1;

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


function parseCountries(data, timeline, gdelt) {

	var start = new Date('1997-4-29');
	var end = new Date('2014-12-2');
	var daterange = moment.range(start, end);


	var finalData = addOverallIndex(data);

	gdelt.forEach(function(d){
		d.date = new Date(d.date);
		d.smooth = +d.smooth;
	});

	drawGraph(finalData, timeline, gdelt, 'graphic1', 'All');
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
		])
		.range([0, width]);

	var y = d3.scale.linear()
		.domain([0, 35])
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
	    .text('News Articles mentioning "Tear Gas" per Day');

	svg.call(tip);

	var boxes = svg.selectAll('rect')
		.data(data)
		.enter()
		.append('rect')
		.attr('class', function(d){ return 'box ' + d.country_1; })
		.attr('x', function(d){ return x(d.date); })
		.attr('y', function(d){ return y(d.article_total); })
		.attr('width', 2)
		.attr('height', 8)
		.style('fill', function(d) { 
			if (d.article_total > 10) {
				return 'rgba(206,39.37,1)';
			} else {
				return redScale[d.article_total];
			}
		})
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide)
		;




	//////////////////////////////////////////////////////
	// Buttons to change the countries

	d3.selectAll('.button--all')
		.on('click.position', function() {
			boxes.transition('position')
				.attr('height', 8)
				.attr('y', function(d){ return y(d.article_total); })
				.style('fill', function(d) { 
					if (d.article_total > 10) {
						return 'rgba(206,39.37,1)';
					} else {
						return redScale[d.article_total];
					}
				});
		});

	d3.selectAll('.button--egypt')
		.on('click.position', function() {

			boxes.transition('position')
				.attr('height', 0);

			d3.selectAll('.egypt')
				.transition('position')
				.attr('height', 8)
				.attr('y', function(d) {
					return y(d.country_article_total);
				})
				.style('fill', function(d) { 
					if (d.country_article_total > 10) {
						return 'rgba(206,39.37,1)';
					} else {
						return redScale[d.country_article_total];
					}
				});
		});

	d3.selectAll('.button--united-states')
		.on('click.position', function() {

			boxes.transition('position')
				.attr('height', 0);

			d3.selectAll('.states')
				.transition('position')
				.attr('height', 8)
				.attr('y', function(d) {
					return y(d.country_article_total);
				})
				.style('fill', function(d) { 
					if (d.country_article_total > 10) {
						return 'rgba(206,39.37,1)';
					} else {
						return redScale[d.country_article_total];
					}
				});
		});

	d3.selectAll('.button--hong-kong')
		.on('click.position', function() {

			boxes.transition('position')
				.attr('height', 0);

			d3.selectAll('.kong')
				.transition('position')
				.attr('height', 8)
				.attr('y', function(d) {
					return y(d.country_article_total);
				})
				.style('fill', function(d) { 
					if (d.country_article_total > 10) {
						return 'rgba(206,39.37,1)';
					} else {
						return redScale[d.country_article_total];
					}
				});
		});

	d3.selectAll('.button--tunisia')
		.on('click.position', function() {

			boxes.transition('position')
				.attr('height', 0);

			d3.selectAll('.tunisia')
				.transition('position')
				.attr('height', 8)
				.attr('y', function(d) {
					return y(d.country_article_total);
				})
				.style('fill', function(d) { 
					if (d.country_article_total > 10) {
						return 'rgba(206,39.37,1)';
					} else {
						return redScale[d.country_article_total];
					}
				});
		});

	d3.selectAll('.button--greece')
		.on('click.position', function() {

			boxes.transition('position')
				.attr('height', 0);

			d3.selectAll('.greece')
				.transition('position')
				.attr('height', 8)
				.attr('y', function(d) {
					return y(d.country_article_total);
				})
				.style('fill', function(d) { 
					if (d.country_article_total > 10) {
						return 'rgba(206,39.37,1)';
					} else {
						return redScale[d.country_article_total];
					}
				});
		});

	d3.selectAll('.button--turkey')
		.on('click.position', function() {

			boxes.transition('position')
				.attr('height', 0);

			d3.selectAll('.turkey')
				.transition('position')
				.attr('height', 8)
				.attr('y', function(d) {
					return y(d.country_article_total);
				})
				.style('fill', function(d) { 
					if (d.country_article_total > 10) {
						return 'rgba(206,39.37,1)';
					} else {
						return redScale[d.country_article_total];
					}
				});
		});

	d3.selectAll('.button--israel-palestine')
		.on('click.position', function() {

			boxes.transition('position')
				.attr('height', 0);

			d3.selectAll('.israel-palestine')
				.transition('position')
				.attr('height', 8)
				.attr('y', function(d) {
					return y(d.country_article_total);
				})
				.style('fill', function(d) { 
					if (d.country_article_total > 10) {
						return 'rgba(206,39.37,1)';
					} else {
						return redScale[d.country_article_total];
					}
				});
		});

	d3.selectAll('.button--south-africa')
		.on('click.position', function() {

			boxes.transition('position')
				.attr('height', 0);

			d3.selectAll('.africa')
				.transition('position')
				.attr('height', 8)
				.attr('y', function(d) {
					return y(d.country_article_total);
				})
				.style('fill', function(d) { 
					if (d.country_article_total > 10) {
						return 'rgba(206,39.37,1)';
					} else {
						return redScale[d.country_article_total];
					}
				});
		});
	d3.selectAll('.button--china')
		.on('click.position', function() {

			boxes.transition('position')
				.attr('height', 0);

			d3.selectAll('.china')
				.transition('position')
				.attr('height', 8)
				.attr('y', function(d) {
					return y(d.country_article_total);
				})
				.style('fill', function(d) { 
					if (d.country_article_total > 10) {
						return 'rgba(206,39.37,1)';
					} else {
						return redScale[d.country_article_total];
					}
				});
		});
	d3.selectAll('.button--united-kingdom')
		.on('click.position', function() {

			boxes.transition('position')
				.attr('height', 0);

			d3.selectAll('.kingdom')
				.transition('position')
				.attr('height', 8)
				.attr('y', function(d) {
					return y(d.country_article_total);
				})
				.style('fill', function(d) { 
					if (d.country_article_total > 10) {
						return 'rgba(206,39.37,1)';
					} else {
						return redScale[d.country_article_total];
					}
				});
		});
	d3.selectAll('.button--iran')
		.on('click.position', function() {

			boxes.transition('position')
				.attr('height', 0);

			d3.selectAll('.iran')
				.transition('position')
				.attr('height', 8)
				.attr('y', function(d) {
					return y(d.country_article_total);
				})
				.style('fill', function(d) { 
					if (d.country_article_total > 10) {
						return 'rgba(206,39.37,1)';
					} else {
						return redScale[d.country_article_total];
					}
				});
		});
	d3.selectAll('.button--brazil')
		.on('click.position', function() {

			boxes.transition('position')
				.attr('height', 0);

			d3.selectAll('.brazil')
				.transition('position')
				.attr('height', 8)
				.attr('y', function(d) {
					return y(d.country_article_total);
				})
				.style('fill', function(d) { 
					if (d.country_article_total > 10) {
						return 'rgba(206,39.37,1)';
					} else {
						return redScale[d.country_article_total];
					}
				});
		});


	//////////////////////////////////////////////////////
	// GDELT Protests line

	var gline = d3.svg.line()
		.interpolate('basis')
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.smooth); });

	var gdelt_group = svg.append('g')
		.attr('class', 'gdeltgroup');

	gdelt_group
		.datum(gdelt)
		.append('path')
		.attr('class', 'gdelt')
		.attr('d', gline);

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

	eventDate.append('rect')
		.attr('x', 0)
		.attr('y', function(d) {
			return x(new Date(d.date));
		})
		.attr('width', 10)
		.attr('height', 50)
		.attr('fill', 'rgba(255,255,255,0.5)');
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
	// Chart legend

	// d3.select('#graphic')
	// 	.append('img')
	// 	.attr('src', 'img/legend3.svg')
	// 	.attr('id', 'legend')
	// 	.attr('height', 100)
	// 	.attr('width', 80);

} // ends drawgraph()


$(document).ready(function() {
	queue()
	    .defer(d3.tsv, 'assets/teargas_region-country1.tsv')
	    .defer(d3.csv, 'assets/ProtestTimeline.csv')
	    .defer(d3.csv, 'assets/GDELT-protests_smooth1.csv')
	    .await(function(error, articles, timeline, gdelt) {
	    	parseCountries(articles, timeline, gdelt);
	    });
});



