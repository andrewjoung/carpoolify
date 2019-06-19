var drivers = [
    // should appear
	{name: "Cersei", originLat: 47.668460, originLong: -122.311951, destLat: 47.657845, destLong: -122.318802, availableSeats: 3},
    // should not appear - destination too far
    {name: "Jaime", originLat: 47.668460, originLong: -122.311951, destLat: 47.655555, destLong: -122.329144, availableSeats: 3},
    // should not appear - no seats left
    {name: "Tywin", originLat: 47.670474, originLong: -122.314219, destLat: 47.659027, destLong: -122.317850, availableSeats: 0},
    // should not appear - origin too far
    {name: "Joffrey", originLat: 47.675693, originLong: -122.309862, destLat: 47.656322, destLong: -122.318263, availableSeats: 3},
    // should appear
    {name: "Tommen", originLat: 47.667419, originLong: -122.314045, destLat: 47.658415, destLong: -122.316864, availableSeats: 3},
    // should appear
    {name: "Tyrion", originLat: 47.668671, originLong: -122.314231, destLat: 47.658166, destLong: -122.317881, availableSeats: 3},
    // should appear
    {name: "Jon", originLat: 47.668991, originLong: -122.313117, destLat: 47.658308, destLong: -122.317671, availableSeats: 3},
    // should not appear - origin and dest too far
    {name: "Ned", originLat: 47.668461, originLong: -122.295625, destLat: 47.665025, destLong: -122.290087, availableSeats: 3}
];

var ref = database.ref("drivers");

for (driver of drivers) {
    //console.log(driver.name);
    
    var usersRef = ref.child(driver.name);
    usersRef.set({
        dbOriginLat: driver.originLat,
        dbOriginLong: driver.originLong,
        dbDestLat: driver.destLat,
        dbDestLong: driver.destLong,
        dbSeatsAvail: driver.availableSeats,
        dbPickupRange: 402,
        dbDepartTime: "17:00" 
    });
}