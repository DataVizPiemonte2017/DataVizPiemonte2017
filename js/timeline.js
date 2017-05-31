//===============================================
//------------------ TIMELINE -------------------
//===============================================
var outer_width;
var outer_height;
var range_width;

setTimeout(function () {
	outer_width = d3.select('#timeline').node().getBoundingClientRect().width;
	outer_height = d3.select('#timeline').node().getBoundingClientRect().height;
	// Subtract div's border (see css)
	range_width = outer_width*0.98;
}, 500)

function setTimeScale (range_width, callback) {

	// Set domain beginning on filtered var	
	var first_year;
	if (filtered == 0) {first_year = 1400; filtered = 1;}
	else if (filtered == 1) {first_year = 1900; filtered = 0;}

	var last_year = 2017;

	
	timeScale = d3.scaleLinear()
					.domain([first_year, last_year])
					.range([0, range_width]);

	callback();
}

var labels_y_top = 15;
var labels_y_bottom = 85;
var rects_y = 20;
var rects_height = 50;
var name_y = -40;

// Generate first timeline
function generateTimeline() {

	// Set domain boundaries
	var period_start = timeScale.domain()[0];
	var period_end = timeScale.domain()[1];
	
	// Draw data only for periods included in the domain
	data_periodi = data_periodi.filter(function (d) { return d.end > period_start; })
	// Find last index
	var last_one = data_periodi.length;

	var svg = d3.select('#timeline').append('svg')
					.attr('x', 0)
					.attr('y', 0)
					.attr('width', '98%')
					.attr('height', '100%')
					.attr('id', 'timeSvg')
					.style('left', '5%');
	

	var periods = d3.select('#timeSvg').selectAll('g').data(data_periodi).enter().append('g');
	var rects = periods.append('rect');
	var labels = periods.append('text');
	var opacity = 0.2;

	rects
		.transition()
		.duration(2000)
		.attr('id', function (d) {return d.name;})
		.attr('class', 'timelineRect')
		.attr('y', rects_y)
		.attr('x', function (d) {
			if (d.start > period_start) 
				{ return timeScale(d.start); }
			else if (d.start < period_start) 
				{ return 0; }
		})
		.attr('width', function (d) {
			if (d.start > period_start)
				{ return timeScale(d.end) - timeScale(d.start); }
			else if (d.start < period_start) {
				{ return timeScale(d.end); }
			}
		})
		.attr('height', rects_height)
		.attr('fill', function (d) {return d.color;})
		.attr('opacity', opacity);

	labels
		.transition()
		.duration(2000)
		.attr('class', 'timelineLabel')
		.attr('x', function (d,i) {
			if (d.start < period_start && d.end > period_start) { return 0; }
			else { return timeScale(d.start); }
			})
		.attr('y', function (d,i) {
			if (i%2) {return labels_y_top;} 
			else {return labels_y_bottom;} 
			})
		.style('text-anchor', function (d,i) { if (i==0) {return 'initial';} })
		.text( function (d,i) { 
			if (d.start <= 1900) {return d.start;}
			else if (d.start <= period_start) {return period_start;}
			})

	rects.on('mouseover', function (d) {

		d3.select(this).style('opacity', 1);

		d3.select('#timeSvg')
		.append('text')
		.attr('id', 'period_name')
		.attr('x', range_width/2)
		.attr('y', name_y)
		.text(d.name + ' (' + d.start + '-' + d.end + ')');
		})

	rects.on('mouseout', function (d) {
		d3.select(this).style('opacity', opacity);

		d3.select('#period_name')
		.remove();
		})

	d3.select('#timeFilter').attr('disabled', null)
	firstTimeline = 1;
}

// Update timeline depending on filter
function updateTimeline () {

	var period_start = timeScale.domain()[0];
	
	var period_end = timeScale.domain()[1];
	

	var periods = d3.select('#timeSvg').selectAll('g');
	var rects = d3.select('#timeSvg').selectAll('rect');
	var labels = d3.select('#timeSvg').selectAll('text');

	rects
	.attr('id', function (d) {return d.name;})
	.transition()
	.duration(2000)
		.attr('x', function (d) {return timeScale(d.start);})
		.attr('width', function (d) {return timeScale(d.end) - timeScale(d.start);})
		.attr('height', rects_height)
		.attr('fill', function (d) {return d.color;})
		.attr('opacity', 0.2);

	d3.select('#timeSvg').selectAll('text')
			.remove()

	d3.select('#timeSvg').selectAll('g').append('text')
		.attr('class', 'timelineLabel')
		.transition()
		.duration(2000)
			.attr('x', function (d) {return timeScale(d.start);})
			.attr('y', function (d,i) {if (i%2) {return labels_y_top;} else {return labels_y_bottom;} })
			.style('text-anchor', function (d,i) { if (i==0) {return 'initial';} })
			.text(function (d) { 
				if (filtered == 0) {
					if (d.start >= 1900) {return d.start;} 
				} else {
					if (d.start <= 1900) {return d.start;}
					else if (d.start <= period_start) {return period_start;}
				}
			})

}


function timeFilter () {

	var only900 = d3.select('#only900');
	var allTime = d3.select('#allTime');

	only900.on('click', function () {
		only900.style('pointer-events', 'none');
		allTime.style('pointer-events', 'all');
		filtered = 1;//900	
		setTimeScale(range_width, updateTimeline);
		flyingTo(city_data_temp, city_coord_temp,filtered);

	})
	allTime.on('click', function () {
		allTime.style('pointer-events', 'none');
		only900.style('pointer-events', 'all');
		filtered = 0;//	tutto
		setTimeScale(range_width, updateTimeline);	
		flyingTo(city_data_temp, city_coord_temp,filtered);
	})
}

