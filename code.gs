function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data.shift();
  
  var jsonArray = data.map(function (row) {
    var questionData = {};
    var questionOptionData = {};

    headers.forEach(function (header, index) {
      if (row[index] === "") {
        return; // Skip empty values in the row
      } else if (header.toLowerCase().includes("option")) { 
        questionOptionData[header] = row[index];
      } else {
        questionData[header] = row[index];
      }
    });

    if (Object.keys(questionOptionData).length > 0) {
      questionData.options = questionOptionData;
    }

    return questionData;
  });

  var json = JSON.stringify(jsonArray);
  Logger.log(json);
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}
