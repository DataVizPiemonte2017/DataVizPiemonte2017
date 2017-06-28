var labels_y_top = 15;
var labels_y_bottom = 85;
var rects_y = 20;
var rects_height = 50;
var name_y = 50;

//=======================
//[3] Wipe info-box clean
//=======================
function msover () {

	// Change style
	//d3.select(this._path).attr("stroke-opacity", 1);
	d3.select(this._path).attr("stroke-width", 6);

	

	var obj = d3.select(this);
	var obj = obj._groups[0][0];

	var name = obj.feature.properties.wn;
	var dob = obj.feature.properties.yb;
	var dod = obj.feature.properties.yd;
	var color = obj._path.attributes.stroke.nodeValue;


	d3.select('#mouseoverName')
			.style('display', 'inline')
			.style('background-color', color);

	d3.select('#mouseoverText')
		.text(name + ' (' + dob + ', ' + dod + ')');

	data_periodi.forEach(function (period) {
		if (dob != null && dod != null) {
			if (dob > period.start && dod < period.end) {
			// Starts and ends within this period
				d3.select('#timeSvg')
					.append('rect')
					.attr('id', 'focusWithin')
					.attr('class', 'focus')
					.attr('x', timeScale(dob))
					.attr('y', 18)
					.attr('width', timeScale(dod) - timeScale(dob))
					.attr('height', 54)
					.style('fill', period.color)

			}
			else if (dob > period.start && dob < period.end && dod > period.end) {
			// Starts but does not end within this period			
				d3.select('#timeSvg')
					.append('rect')
					.attr('id', 'focusStart')
					.attr('class', 'focus')
					.attr('x', timeScale(dob))
					.attr('y', 18)
					.attr('width', timeScale(period.end) - timeScale(dob))
					.attr('height', 54)
					.style('fill', period.color)
			}
			else if (dob < period.start && dod > period.start && dod < period.end) {
			// Does not start but ends whitin this period
				d3.select('#timeSvg')
					.append('rect')
					.attr('id', 'focusEnd')
					.attr('class', 'focus')
					.attr('x', timeScale(period.start))
					.attr('y', 18)
					.attr('width', timeScale(dod) - timeScale(period.start))
					.attr('height', 54)
					.style('fill', period.color)
			}
			else if (dob < period.start && dod > period.start) {
			// Passes through this period
				d3.select('#timeSvg')
					.append('rect')
					.attr('id', 'focusThrough')
					.attr('class', 'focus')
					.attr('x', timeScale(period.start))
					.attr('y', 18)
					.attr('width', timeScale(period.end) - timeScale(period.start))
					.attr('height', 54)
					.style('fill', period.color)
			}
		} 
	})
}


function msout () {
	// Restore style
	//d3.select(this._path).attr("stroke-opacity", 0.5);
	d3.select(this._path).attr("stroke-width", 3);

	d3.select('#mouseoverName')
			.style('display', 'none');

	d3.selectAll('.focus')
		.remove();
}


function streetClick () {
	var obj = d3.select(this);
	var obj = obj._groups[0][0];
	console.log(obj);

	var name = obj.feature.properties.wn;
	var img = obj.feature.properties.img;
	
	var mini_bio = obj.feature.properties.mini_bio; 
	var wiki_link = obj.feature.properties.wu; 

	var infoBox = d3.select('#info-box');
	var reset = d3.select('#reset');
	//Make info-box slide out and back in
	var windowWidth = window.innerWidth;
	infoBox
		.transition()
			.duration(500)
			.style('transform', 'translateX(' + windowWidth + 'px)')
		.transition()
			.duration(500)
			.style('transform', 'translateX(0)')
			.style('background-color', 'rgba(169,169,169,0.7)')
	// reset
	// 	.transition()
	// 		.duration(500)
	// 		.style('transform', 'translateX(' + windowWidth + 'px)')
	// 	.transition()
	// 		.duration(500)
	// 		.style('transform', 'translateX(0)')

	//Change content
	setTimeout (function () {
		infoBox.select('#ib-title')
			.text(name)
		infoBox.select('img')
			.attr('src', img)
			.style('display', function () {
				if (img == null) {
					return 'none';
				} else {
					return 'inline'
				}
			})
		infoBox.select('#mini_bio')
			.html(mini_bio)
			.style('display', 'inline')
			.style('overflow', 'auto')
		infoBox.select('#wiki_link')
			.html("<p>Per saperne di più: <a target='_blank' href='" + wiki_link + "'>Wikipedia.</a><p/>")
			.style('display', 'inline')
	}, 250)
}


//=======================
//[3] Wipe info-box clean
//=======================
function resetInfoBox () {
	d3.select('#reset').on('click', function () {
		var infoBox = d3.select('#info-box');
		var reset = d3.select('#reset');
		var windowWidth = window.innerWidth;

		infoBox
			.transition()
				.duration(500)
				.style('transform', 'translateX(' + windowWidth + 'px)')
			.transition()
				.duration(500)
				.style('transform', 'translateX(0)')

		reset
		.transition()
			.duration(500)
			.style('transform', 'translateX(' + windowWidth + 'px)')
		.transition()
			.duration(500)
			.style('transform', 'translateX(0)')

		setTimeout (function () {
			infoBox.select('#ib-title')
					.text('Click on a street to find more information.')
			infoBox.select('img')
					.attr('src', null)
					.style('display', 'none')
		}, 500)
	})
}

function extractYear (date) {
	year = date.substr(date.length - 4);
	return year;
}