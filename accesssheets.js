const { GoogleSpreadsheet } = require('google-spreadsheet');
 
// spreadsheet key is the long id in the sheets URL
const doc = new GoogleSpreadsheet('1n1be8qVx0mISawXYvzTvIe9__8uVQO9rnvRQw7udOgw');
 
doc.useApiKey('AIzaSyDC040R3Jl1KNJrH02gjbLIhaA1-M-xZLg');
 
await doc.loadInfo(); // loads document properties and worksheets
console.log(doc.title);
await doc.updateProperties({ title: 'renamed doc' });
 
const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
console.log(sheet.title);
console.log(sheet.rowCount);
