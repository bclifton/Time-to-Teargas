var format = d3.time.format('%Y%m%d');

function roundDate(date) {
	return format(new Date(date));
}

function parseDate(date) {
	return format.parse(date);
}

function loadData() {
	d3.csv('assets/teargasdata.csv', function(data) {
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

		drawGraph(finalData);
	}); // ends d3.tsv
}

function drawGraph(data) {
	console.log(data.length);

	var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d.headline; });

	var margin = {top: 20, right: 20, bottom: 30, left: 40};
	var width = 1200 - margin.left - margin.right;
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

	svg.selectAll('rect')
		.data(data)
		.enter()
		.append('rect')
		.attr('class', 'box')
		.style('fill', function(d) {
			// console.log(d.source);
			if (d.source === 'AP') {
				return 'rgba(239, 59, 53, 0.2)';
			} else if (d.source === 'Reuters') {
				return 'rgba(252, 128, 36, 0.2)';
			} else if (d.source === 'Guardian') {
				return 'rgba(51, 105, 217, 0.2)';
			} else {
				return 'rgba(0, 0, 0, 0.07)';
			}
		})
		.attr('x', function(d){ return x(d.date); })
		.attr('y', function(d){ return y(d.i); })
		.attr('width', 1)
		.attr('height', 10)
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);

	// svg.selectAll('circle')
	// 	.data(data)
	// 	.enter()
	// 	.append('circle')
	// 	.attr('class', 'point')
	// 	.style('fill', function(d) {
	// 		if (d.source === 'AP') {
	// 			return '#ef3b35';
	// 		} else if (d.source === 'Reuters') {
	// 			return '#fc8024';
	// 		} else {
	// 			return 'rgba(51, 105, 217, 0.2)';
	// 		}
	// 	})
	// 	.attr('r', 3)
	// 	.attr('cx', function(d) {
	// 		return x(d.date);
	// 	})
	// 	.attr('cy', function(d) {
	// 		return y(d.i);
	// 	})
	// 	.on('mouseover', tip.show)
	// 	.on('mouseout', tip.hide);
}

$(document).ready(function() {
	loadData();
});