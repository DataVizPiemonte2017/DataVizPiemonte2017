//==============================================
//[2]----------------- FLYING  -----------------
//==============================================

d3.select('#menu-Alessandria').on('click', function () {
	flyingTo(alessandria_data, alessandria_coord,1);
	});
d3.select('#menu-Asti').on('click', function () {
	flyingTo(asti_data, asti_coord,1);
	});
d3.select('#menu-Biella').on('click', function () {
	flyingTo(biella_data, biella_coord,1);
	});
d3.select('#menu-Cuneo').on('click', function () {
	flyingTo(cuneo_data, cuneo_coord,1)
	});
d3.select('#menu-Novara').on('click', function () {
	flyingTo(novara_data, novara_coord,1)
	});
d3.select('#menu-Torino').on('click', function () {
	flyingTo(torino_data, torino_coord,1)
	});
d3.select('#menu-Verbania').on('click', function () {
	flyingTo(verbania_data, verbania_coord,1)
	});
d3.select('#menu-Vercelli').on('click', function () {
	flyingTo(vercelli_data, vercelli_coord,1)
	});


function flyingTo(city_data, city_coord, city_flag) {

city_data_temp = city_data;
city_coord_temp=city_coord;

	if (city_data.type != "FeatureCollection") {
		d3.json(city_data, function (error, collection) {
			if (error) throw error;
			city_data = collection;
			if (city_flag==1){
				updateMap(city_data);
			}
			if (city_flag==0){
				updateMap900(city_data);
			}
			
		})

		if (firstTimeline==0) {
			setTimeScale(range_width, generateTimeline);
		}
	}

	map.flyTo(city_coord, zoom_city);
	removeWelcome();

}


