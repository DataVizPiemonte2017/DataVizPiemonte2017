// Set view coordinates
var piemonte_coord = L.latLng(44.969915, 7.991462);
var asti_coord = L.latLng(44.899043, 8.204902);
var alessandria_coord = L.latLng(44.907919, 8.613737);
var biella_coord = L.latLng(45.562601, 8.058615);
var cuneo_coord = L.latLng(44.384963, 7.544000);
var novara_coord = L.latLng(45.447786, 8.622989);
var torino_coord = L.latLng(45.071087, 7.683477);
var verbania_coord = L.latLng(45.928410, 8.555575);
var vercelli_coord = L.latLng(45.320244, 8.418403);
var zoom = 8;
var zoom_city = 14;

// Inizializa dataset variables
var data_periodi;
var alessandria_data = 'data/alessandria.geojson';
var asti_data = 'data/asti.geojson';
var biella_data = 'data/biella.geojson';
var cuneo_data = 'data/cuneo.geojson';
var novara_data = 'data/novara.geojson';
var torino_data = 'data/torino.geojson';
var verbania_data = 'data/verbania.geojson';
var vercelli_data = 'data/vercelli.geojson';

var city_data_temp;
var city_coord_temp;


// Initialize toggles
var wrExist = 1;
var filtered = 0;
var firstTimeline = 0;
var current_data;

// Set initial view
var map = L.map('map').setView(piemonte_coord, zoom);
var mapLayer;

// Load first data
d3.csv("data/periodi_storici.csv", function (error, data) {
	if (error) throw error;

	data_periodi = data;

	initializeMap(welcomeRect);
	resetInfoBox();
	aboutBtn();
	timeFilter();
})

//============================================
//[1] Draw and style overlay map based on data
//============================================

function initializeMap (callback) {
	// L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZmVkZXJpY29wdnMiLCJhIjoiY2lsZ3JqdXgxMDA0MHdnbTRzYjJkaWplZiJ9.P_8XuqQUogZRfBqwXnXF8g', {
	//     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	//     maxZoom: 18,
	//     id: 'your.mapbox.project.id',
	//     accessToken: 'your.mapbox.public.access.token'
	// }).addTo(map);

	//-- Watercolor
	// L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	// 	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	// 	subdomains: 'abcd',
	// 	maxZoom: 18,
	// 	ext: 'png'
	// }).addTo(map);

	//Pioneer
	L.tileLayer('http://{s}.tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey={apikey}', {
	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	apikey: '2c87a72f60ea457aba0efbb50d5cf53e',
	maxZoom: 18
	}).addTo(map);

	callback();
}

function updateMap (city_leaflet) {
	
	if (mapLayer) { 
		mapLayer.remove(); 
		
	}
	mapLayer = L.geoJSON(city_leaflet, {
					style: colorHuman,
					onEachFeature : onEachFeature,
					})
					.addTo(map);
}

function updateMap900 (city_leaflet) {
	
	 if (mapLayer) { 
		mapLayer.remove();
	 	
	 }
	 mapLayer = L.geoJSON(city_leaflet, {
					style: colorHuman900,
					onEachFeature : onEachFeature,
					})
					.addTo(map);
}

var xv = '#ffffe5';
var xvi = '#FF7F00';
var xvii = '#E41A1C';
var xviii = '#984EA3';
var xix_early = '#2171b5';
var xix_late = '#6baed6';
var xx_early = '#74c476';
var xx_late = '#238b45';


function colorHuman (feature) {
	var street_opacity = 1;
	var street_weight = 3;

	var type = feature.properties.instance_type;
	var yd = feature.properties.yd;

	if (mapLayer) { mapLayer.remove(); }

	// if (filtered==1) {
	    if (type == 'human') {
			if (yd >= 1970) { return {color: xx_late, opacity: street_opacity, weight: street_weight}; }
			else if (yd < 1970 && yd >= 1950) {return {color: xx_early, opacity: street_opacity, weight: street_weight}; }
			else if (yd < 1950 && yd >= 1890) {return {color: xix_late, opacity: street_opacity, weight: street_weight}; }
			else if (yd < 1890 && yd >= 1800) {return {color: xix_early, opacity: street_opacity, weight: street_weight}; }
			else if (yd < 1800 && yd >= 1700) {return {color: xviii, opacity: street_opacity, weight: street_weight}; }
			else if (yd < 1700 && yd >= 1600) {return {color: xvii, opacity: street_opacity, weight: street_weight}; }
			else if (yd < 1600 && yd >= 1500) {return {color: xvi, opacity: street_opacity, weight: street_weight}; }
			else if (yd < 1500) {return {color: xv, opacity: street_opacity, weight: street_weight}; }
		} else if (type == 'determinator for date of periodic occurrence') {
			return {color : 'black', opacity: street_opacity, weight: street_weight}; }
}


function colorHuman900 (feature) {
	var street_opacity = 0.5;
	var street_weight = 3;

	var type = feature.properties.instance_type;
	var yd = feature.properties.yd;
    if (type == 'human' && yd < 1900) { 
    	if (yd >= 1970) { return {color: xx_late, opacity: street_opacity, weight: street_weight}; }
		else if (yd < 1970 && yd >= 1950) {return {color: xx_early, opacity: street_opacity, weight: street_weight}; }
		else if (yd < 1950 && yd >= 1890) {return {color: xix_late, opacity: street_opacity, weight: street_weight}; 
	} else if (type == 'determinator for date of periodic occurrence') {
		return {color : 'black', opacity: street_opacity, weight: street_weight};
		}
}}

// Cycle through the streets and bind events to different interactions
function onEachFeature (feature, layer) {
	layer.on({
		mouseover : msover,
		mouseout : msout,
		click : streetClick
	})
}


//===============================================
//[5] INITIAL RECTANGLE COVERING THE MAP
//===============================================
function welcomeRect () {
    var width = d3.select('#map').node().getBoundingClientRect().width;
    var height = d3.select('#map').node().getBoundingClientRect().height;
    var coords = map.getBounds()._northEast;

    var welcomeRect = d3.select(map.getPanes().overlayPane)
    					.append("svg")
    					.attr('id', 'welcomeRect')
    					.attr('width', map.getSize().x)
    					.attr('height', map.getSize().y)

    welcomeRect.append('rect')
    			//.attr('id', 'welcomeRect')
    			.attr('class', 'exist')
                // .attr('x', map.latLngToLayerPoint(coords).x)
                // .attr('y', map.latLngToLayerPoint(coords).y)
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', map.getSize().x)
                .attr('height', map.getSize().y)
                .attr('fill', 'rgba(0,0,0,0.75)')
                .style('opacity', 0.5)

    welcomeRect.append('text')
    			.attr('x', map.latLngToLayerPoint(piemonte_coord).x)
    			.attr('y', map.latLngToLayerPoint(piemonte_coord).y)
    			.attr('id', 'welcomeText')
    			.text('Seleziona una città per cominciare. Poi clicca su una strada per maggiori informazioni.')

    map.dragging.disable();
    map.zoomControl.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.touchZoom.disable();

}

function removeWelcome () {
	d3.select('#timeFilter').style('display', 'inline');
	var welcomeRect = d3.select('#welcomeRect');
	if (wrExist == 1) {
		welcomeRect.remove();
		map.dragging.enable();
    	map.zoomControl.enable();
    	map.doubleClickZoom.enable();
    	map.scrollWheelZoom.enable();
    	map.touchZoom.enable();
	}
}


function aboutBtn () {
	var divHeight = d3.select('#header').select('h1').node().getBoundingClientRect().height;
	var button = d3.select('#aboutBtn');
	var pageWidth = d3.select('body').node().getBoundingClientRect().width;
	var pageHeight = d3.select('body').node().getBoundingClientRect().height;

	button
		.style('transform', 'translateY(' + divHeight/2 + 'px)')
		.style('transform', 'translateY(50%)')

	button.on('click', function () {
		d3.select('body')
			.append('svg')
			.attr('id', 'aboutBack')
			.attr('width', '100%')
			.attr('height', '100%')
			.append('rect')
				.attr('width', '100%')
				.attr('height', '100%')
				.style('fill', 'rgba(0,0,0,0.75)')

		d3.select('#aboutText')
			.style('top', pageHeight/2 + 'px')
			.style('left', pageWidth/2 + 'px')
			.style('transform', 'translate(-50%,-50%)')
			.style('display', 'inline')

		d3.selectAll('button')
			.style('pointer-events', 'none');
	})

	d3.select('#closeAbout').on('click', function() {
		d3.select('#aboutBack').remove();
		d3.select('#aboutText').style('display', 'none');
		d3.selectAll('button')
			.style('pointer-events', 'all');
	})
}

