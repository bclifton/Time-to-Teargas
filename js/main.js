var format = d3.time.format('%Y%m%d');


$(document).ready(function() {
	loadData();
});

function loadData() {
	d3.tsv('assets/20140809-20141118_nytimes_get-articles_output.tsv', function(data) {
		// console.log(data);

		// create the new dataset:
		var newData = {};
		_.each(data, function(d) {
			// console.log(d);
			if (d.document_type === 'article') {
				date = roundDate(d.pub_date);

				var article = {};

				article['headline'] = d.headline;
				article['source'] = d.source;
				article['url'] = d.web_url;
				article['snippet'] = d.snippet;
				article['lead_paragraph'] = d.lead_paragraph;
				article['document_type'] = d.document_type;

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
			}		
		});

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
	// console.log(data);

	var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d.headline; });

	var margin = {top: 20, right: 20, bottom: 30, left: 40};
	var width = 1100 - margin.left - margin.right;
	var height = 700 - margin.top - margin.bottom;

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
	    .orient("bottom");

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
	    .call(yAxis);  

	svg.call(tip);

	svg.selectAll('circle')
		.data(data)
		.enter()
		.append('circle')
		.attr('class', 'point')
		.style('fill', function(d) {
			if (d.source === 'AP') {
				return '#ef3b35';
			} else if (d.source === 'Reuters') {
				return '#fc8024';
			} else {
				return 'darkgray';
			}
		})
		.attr('r', 5)
		.attr('cx', function(d) {
			return x(d.date);
		})
		.attr('cy', function(d) {
			return y(d.i);
		})
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);
}

function roundDate(date) {
	return format(new Date(date));
}

function parseDate(date) {
	return format.parse(date);
}