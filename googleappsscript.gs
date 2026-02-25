// ================================================
// WHITE ROSE HOTEL — Google Sheets Booking Logger
// FINAL VERSION — works from local file:// and web
// ================================================
// IMPORTANT: After pasting this, you MUST re-deploy:
//   Deploy → Manage deployments → Edit (pencil) → New version → Deploy
// ================================================

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(decodeURIComponent(e.parameter.data));
    var callback = e.parameter.callback || 'callback';

    // Add header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp", "Guest Name", "Phone Number",
        "Room Type", "No. of Guests", "Check-In Date",
        "Check-Out Date", "Booking Method"
      ]);
      var headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setBackground('#d4af37');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // Append booking row
    sheet.appendRow([
      data.timestamp,
      data.name,
      data.phone,
      data.room,
      data.guests,
      data.checkin,
      data.checkout,
      data.method
    ]);

    sheet.autoResizeColumns(1, 8);

    // Return JSONP response
    return ContentService
      .createTextOutput(callback + '({"status":"success"})')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);

  } catch(err) {
    var callback = (e && e.parameter && e.parameter.callback) ? e.parameter.callback : 'callback';
    return ContentService
      .createTextOutput(callback + '({"status":"error","message":"' + err.toString() + '"})')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
}

// Also keep doPost for future use if hosted on a real server
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data;
    if (e.parameter && e.parameter.data) {
      data = JSON.parse(decodeURIComponent(e.parameter.data));
    } else {
      data = JSON.parse(e.postData.contents);
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp","Guest Name","Phone Number","Room Type","No. of Guests","Check-In Date","Check-Out Date","Booking Method"]);
      var h = sheet.getRange(1,1,1,8);
      h.setBackground('#d4af37'); h.setFontColor('#ffffff'); h.setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([data.timestamp, data.name, data.phone, data.room, data.guests, data.checkin, data.checkout, data.method]);
    sheet.autoResizeColumns(1, 8);

    return ContentService.createTextOutput('{"status":"success"}').setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput('{"status":"error"}').setMimeType(ContentService.MimeType.JSON);
  }
}

// Run this manually to test
function testBooking() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp","Guest Name","Phone Number","Room Type","No. of Guests","Check-In Date","Check-Out Date","Booking Method"]);
    var h = sheet.getRange(1,1,1,8); h.setBackground('#d4af37'); h.setFontColor('#ffffff'); h.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  sheet.appendRow([new Date().toLocaleString(), "Test Guest", "010 00000000", "1 Bedroom", 2, "2026-03-01", "2026-03-05", "test"]);
  sheet.autoResizeColumns(1, 8);
  Logger.log("Test row added successfully!");
}
