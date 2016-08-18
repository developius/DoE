var ExifImage = require('exif').ExifImage;
var fs = require("fs");

function convertDMStoDD(degrees, minutes, seconds, direction) {
	var dd = degrees + minutes/60 + seconds/(60*60);

	if (direction == "S" || direction == "W") {
		dd = dd * -1;
	} // Don't do anything for N or E
	return dd;
}


var images = ["1.jpg","105.jpg","111.jpg","12.jpg","19.jpg","25.jpg","31.jpg","38.jpg","44.jpg","50.jpg","57.jpg","63.jpg","7.jpg","76.jpg","82.jpg","89.jpg","95.jpg",
"10.jpg","106.jpg","112.jpg","13.jpg","2.jpg","26.jpg","32.jpg","39.jpg","45.jpg","51.jpg","58.jpg","64.jpg", "77.jpg","83.jpg","9.jpg","96.jpg",
"100.jpg","107.jpg","113.jpg","14.jpg","20.jpg","27.jpg","33.jpg","4.jpg","46.jpg","52.jpg","59.jpg","65.jpg","71.jpg","78.jpg","84.jpg","90.jpg","97.jpg",
"101.jpg","108.jpg","114.jpg","15.jpg","21.jpg","28.jpg","34.jpg","40.jpg","47.jpg","53.jpg","6.jpg","66.jpg","72.jpg","79.jpg","85.jpg","91.jpg","98.jpg",
"102.jpg","109.jpg","115.jpg","16.jpg","22.jpg","29.jpg","35.jpg","41.jpg","48.jpg","54.jpg","60.jpg","67.jpg","73.jpg","8.jpg","86.jpg","92.jpg","99.jpg",
"103.jpg","11.jpg","116.jpg","17.jpg","23.jpg","3.jpg","36.jpg","42.jpg","49.jpg","55.jpg","61.jpg","68.jpg","74.jpg","80.jpg","87.jpg","93.jpg",
"104.jpg","110.jpg","117.jpg","18.jpg","24.jpg","30.jpg","37.jpg","43.jpg","5.jpg","56.jpg","62.jpg","69.jpg","75.jpg","81.jpg","88.jpg","94.jpg", "118.jpg", "119.jpg", "120.jpg", "121.jpg", "122.jpg", "123.jpg", "124.jpg", "125.jpg"];

var imageData = [];

var total_completed = 0;

for (var image = 0; image < images.length; image++){
	try {
		(function(image){
			console.log("Reading " + images[image]);
			new ExifImage({
				image: 'images/' + images[image]
			}, function(error, exifData) {
				total_completed++;
				if (error) {
					console.log('Error with ' + image + ': ' + error.message);
				}
				else {
					if (exifData.gps.GPSVersionID){
						exifData.gps.GPSLatitude = convertDMStoDD(
							exifData.gps.GPSLatitude[0],
							exifData.gps.GPSLatitude[1],
							exifData.gps.GPSLatitude[2],
							exifData.gps.GPSLatitudeRef
						);
						exifData.gps.GPSLongitude = convertDMStoDD(
							exifData.gps.GPSLongitude[0],
							exifData.gps.GPSLongitude[1],
							exifData.gps.GPSLongitude[2],
							exifData.gps.GPSLongitude
						);

						imageData.push([images[image], exifData.gps]);
					}
				}
				if (total_completed == images.length) {
					console.log(imageData);
					fs.writeFile("./pictures.js", "var picturedata = " + JSON.stringify(imageData) + ";");
				}
			});
		})(image);
	} catch (error) {
		console.log('Error: ' + error.message);
	}
}
