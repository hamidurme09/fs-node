const csv = require("csvtojson");
const fs = require("fs");
const request = require("request");

const caajson = "caa-airport-stats.json";
const airportdata =
  "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat";
const airportmatching = "airport-name-iata.json";
const enrichedairports = "enriched-airports.json";

const airportiata = "airport-iata.csv";

// Load caajson file

// Iterate over the json looking for "rpt_apt_name"

// Look up "rpt_apt_name" in airport-iata.csv and append the IATA to caajson (first enrichment)

// Lookup IATA in airportdata and add lattitude and longtitude to caajson (second enrichment)

// Write new json file ... enriched-airports.json

const caaJSON = fs.readFileSync(caajson);
const caaData = JSON.parse(caaJSON);

console.log("caaData.length =", caaData.length);

function IATAadded() {
  return csv({
    noheader: false,
    headers: ["IATA", "AirportName"],
  })
    .fromFile(airportiata)
    .then((jsonObj) => {
      let caaWithIATA = [];

      caaData.map((e1) => {
        jsonObj.map((e2) => {
          if (e1.apt1_apt_name.toUpperCase() === e2.AirportName.toUpperCase()) {
            caaWithIATA.push({ ...e2, ...e1 });
          }
        });
      });

      // delete AirportName from every obj
      caaWithIATA.map((obj) => {
        delete obj.AirportName;
      });

      // only for checking data structure
      fs.writeFile('forChecking.json',
      JSON.stringify(caaWithIATA, null, 4),
      (err) => {
        if (err) {
          throw err;
        }
        console.log("forChecking JSON array is saved.");
  })

      //   console.log("caaWithIATA.length =", caaWithIATA.length);
      //   console.log("caadata.length =", caaData.length);

      return caaWithIATA;
    });
}

function IATAmissing() {
  return csv({
    noheader: false,
    headers: ["IATA", "AirportName"],
  })
    .fromFile(airportiata)
    .then((jsonObj) => {

      let airportnameFromJsonObj = [];
      let missingCaaData = [];

      jsonObj.map((e1) => {
        airportnameFromJsonObj.push(e1.AirportName);
      });

      caaData.map((e1) => {
        missingCaaData.push(e1);
      });

      missingCaaData.reduceRight(function (acc, obj, idx) {
        if (airportnameFromJsonObj.indexOf(obj.apt1_apt_name) > -1)
          missingCaaData.splice(idx, 1);
      }, 0);

      // console.log("missingCaaData.length", missingCaaData.length);
      // console.log("missingarray1", airportnameFromJsonObj.length);

      return missingCaaData;
    });
}

IATAadded().then((res) => {
  console.log("AddedIATA.length =", res.length);
//   console.log("AddedIATA =", res);
});

IATAmissing().then((missing) => {
  console.log("missingIATA.length =", missing.length);
  console.log("missingIATA =", missing);
});
        