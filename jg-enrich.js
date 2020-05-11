const fs = require("fs");
const csv = require("csvtojson");

const caajson = "caa-airport-stats.json";
const caaenrichedjson = "caa-airport-stats-enriched.json";
const airportiata = "airport-iata.csv";
const airportdata = "airports.csv";

// get the CAA data loaded
const caaJSON = fs.readFileSync(caajson);
const caaData = JSON.parse(caaJSON);

console.log("Starting enrichment");

// get the airports-iata csv loade
csv()
  .fromFile(airportiata)
  .then((iata) => {
        csv()
        .fromFile(airportdata)
        .then((airports)=>{
            // both iata and airport data loaded

            caaData.forEach(route => {
              // find the IATA code for apt1_apt
              var found = iata.find(element => element.name === route.apt1_apt_name);
              if (found) {  
                route.apt1_apt_iata = found.iata; 

                // find the lat/long
                var found2 = airports.find(element => element.IATA = route.apt1_apt_iata);
                if (found2) {
                  route.apt1_apt_latitude = found2.Latitude;
                  route.apt1_apt_longitude = found2.Longitude;
                }

              }

              // find the IATA code for apt2_apt
              var found = iata.find(element => element.name === route.apt2_apt_name);
              if (found) {  
                route.apt2_apt_iata = found.iata; 
              
                // find the lat/long
                var found2 = airports.find(element => element.IATA = route.apt2_apt_iata);
                if (found2) {
                  route.apt2_apt_latitude = found2.Latitude;
                  route.apt2_apt_longitude = found2.Longitude;
                }              
              }
          });

          
          fs.writeFile(caaenrichedjson,
          JSON.stringify(caaData, null, 4),
          (err) => {
            if (err) {
              throw err;
            }
            console.log("Enriched JSON array is saved.");
          });

        })
        .catch((err)=>{
            console.log(err);           
        })
  })
  .catch((err) => {
    console.log(err);
  });

  