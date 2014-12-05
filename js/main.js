var format = d3.time.format('%Y%m%d');

function roundDate(date) {
	return format(new Date(date));
}

function parseDate(date) {
	return format.parse(date);
}

function loadData(data, timeline, gdelt) {
	// d3.csv('assets/teargasdata.csv', function(data) {
		console.log(data.length);

		// create the new dataset:
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
				entry['i'] = index + 1;
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


		gdelt.forEach(function(d){
			d.date = new Date(d.date);
			d.nummentions = +d.nummentions;
		});

		drawGraph(finalData, timeline, gdelt);
	// }); // ends d3.tsv
}

function drawGraph(data, timeline, gdelt) {
	console.log(gdelt);
	// console.log('timeline', timeline);



	var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d.headline; });
	var tip2 = d3.tip().attr('class', 'd3-tip').html(function(d) { console.log(d.reference); return d.reference; });

	var margin = {top: 20, right: 20, bottom: 30, left: 40};
	var width = 1000 - margin.left - margin.right;
	var height = 400 - margin.top - margin.bottom;

	var x = d3.time.scale()
		.domain([
			d3.min(data, function(d) { return d.date; }),
			d3.max(data, function(d) { return d.date; })
		])
		.range([0, width]);

	var y = d3.scale.linear()
		.domain([0, d3.max(data, function(d) { return d.i; })])
		.range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom")
	    .ticks(20);

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var svg = d3.select("#graphic").append("svg")
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
		})
		.on('mouseover', tip2.show)
		.on('mouseout', tip2.hide);

	svg.selectAll('rect')
		.data(data)
		.enter()
		.append('rect')
		.attr('class', 'box')
		.attr('class', function(d) {

			// console.log(d.source);
			if (d.source === 'AP') {
				return 'ap'; //'rgba(239, 59, 53, 0.2)'
			} else if (d.source === 'Reuters') {
				return 'reuters'; //'rgba(252, 128, 36, 0.2)'
			} else if (d.source === 'Guardian') {
				return 'guardian'; //'rgba(51, 105, 217, 0.2)'
			} else {
				return 'nytimes'; //'rgba(0, 0, 0, 0.07)'
			}
		})
		.attr('x', function(d){ return x(d.date); })
		.attr('y', function(d){ return y(d.i); })
		.attr('width', 2)
		.attr('height', 10)
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);



	// var gline = d3.svg.line()
	// 	.x(function(d) { return x(d.date); })
	// 	.y(function(d) { return y(d.nummentions); })

	// svg.append('path')
	// 	.datum(gdelt)
	// 	.attr('class', 'line')
	// 	.attr('d', gline)
	// 	.style('stroke', 'rgba(140,173,241,0.3)')
	// 	.style('fill', 'none');



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

	
}




$(document).ready(function() {

	queue()
	    .defer(d3.csv, 'assets/teargasdata.csv')
	    .defer(d3.csv, 'assets/ProtestTimeline.csv')
	    .defer(d3.csv, 'assets/GDELT-protests.csv')
	    .await(function(error, articles, timeline, gdelt) {
	    	loadData(articles, timeline, gdelt);
	    });
});



