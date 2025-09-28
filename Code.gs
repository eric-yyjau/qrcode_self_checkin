// const SHEET_NAME = 'qrcode_self_checkin_example';
const SPREADSHEET_ID = '1xM2FEM6wCVwmeNHdaP_OuKCAn43TVb375r0bosGjmCk';
const SHEET_NAME = 'Guests';


function debugSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  for (let i = 0; i < sheets.length; i++) {
    Logger.log("Tab found: " + sheets[i].getName());
  }
}

function accessSheet() {
  const ss = SpreadsheetApp.openById('1xM2FEM6wCVwmeNHdaP_OuKCAn43TVb375r0bosGjmCk'); // Use your own ID
  const sheet = ss.getSheetByName('Guests'); // Tab name
  const data = sheet.getDataRange().getValues();
  Logger.log(data); // Check in Logs
}


function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}


// Search guest by Guest ID, partial Name, or partial Email
function searchGuest(query) {
  // query = "abc"
  query = query.toString().toLowerCase();
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const idIndex = headers.indexOf('Guest ID');   // New column
  const nameIndex = headers.indexOf('Name');
  const emailIndex = headers.indexOf('Email');
  const ticketIndex = headers.indexOf('Drink Tickets');
  const paymentIndex = headers.indexOf('Payment Status');
  const checkedInIndex = headers.indexOf('Checked In');
  const timeIndex = headers.indexOf('Check-in Time');

  const matches = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const guestId = row[idIndex].toString().toLowerCase();
    const name = row[nameIndex].toString().toLowerCase();
    const email = row[emailIndex].toString().toLowerCase();

    if (
      guestId === query || // exact match on Guest ID
      name.includes(query) || 
      email.includes(query)
    ) {
      matches.push({
        row: i + 1,
        guestId: row[idIndex],
        name: row[nameIndex],
        email: row[emailIndex],
        drinkTickets: row[ticketIndex],
        paymentStatus: row[paymentIndex],
        checkedIn: row[checkedInIndex],
        time: row[timeIndex] ? row[timeIndex].toString() : null  
      });
      Logger.log(`Matched: ${row[nameIndex]}, Checked In: ${row[checkedInIndex]}`);
    }
  }

  Logger.log(`Matched: ${matches.length}, ${matches[0].checkedIn}`)
  if (matches.length === 0) return null;
  if (matches.length === 1) return matches[0];

  return { multiple: true, count: matches.length }; // more than 1 match
}

// Mark guest as checked-in
function checkInGuest(rowNumber) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  sheet.getRange(rowNumber, 6).setValue(1);       // Checked In (adjust column if needed)
  sheet.getRange(rowNumber, 7).setValue(new Date()); // Timestamp
  return true;
}