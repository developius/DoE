var nmea = require('nmea-0183')
var fs = require("fs");

var coords = [];
var files = ["N1607240.LOG", "N1607250.LOG", "N1607251.LOG", "N1607260.LOG", "N1607270.LOG"];

for (var file = 0; file < files.length; file++){
	console.log("Opening /Users/finnian/Desktop/DoE GPS/" + files[file]);
	var data = fs.readFileSync("/Users/finnian/Desktop/DoE\ GPS/" + files[file], "utf8");
	data = data.split("\n");
	for (var i = 1; i < data.length-1; i++){
		var GPGGA = nmea.parse(data[i]);
		if (GPGGA.id == 'GPGGA'){
			i++;
			var GPRMC = nmea.parse(data[i]);
			GPGGA.speed = GPRMC.speed;
			GPGGA.date = GPRMC.date;
			GPGGA.course = GPRMC.course;
		}
		coords.push(GPGGA);
	}
}
fs.writeFile("./camdata.js", "var camdata = " + JSON.stringify(coords) + ";");
console.log("Created " + coords.length  + " coordinates");
