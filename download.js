const fs = require("fs");
const csv = require("csvtojson");
const request = require("request");

const url = "https://www.caa.co.uk/uploadedFiles/CAA/Content/Standard_Content/Data_and_analysis/Datasets/Airport_stats/Airport_data_2019_annual/Table_12_2_Domestic_Air_Pax_Traffic_Route_Analysis.csv";

const caajson = "caa-airport-stats.json";

csv()
  .fromStream(
    request.get(url)
  )
  .then((data) => {
    fs.writeFile(caajson,
      JSON.stringify(data, null, 4),
      (err) => {
        if (err) {
          throw err;
        }
        console.log("JSON array is saved.");
      },
      () => {
        const dataJSON = fs.readFileSync(caajson);
        const data = JSON.parse(dataJSON);

        console.log(data);
      }
    );
  })
  .catch((err) => {
    console.log(err);
  });
