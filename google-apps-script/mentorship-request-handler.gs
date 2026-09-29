/**
 * Albanian Aviators Worldwide — Mentorship Request Handler
 *
 * This file is a reference copy for version control. It is NOT deployed
 * automatically — copy its contents into the Apps Script editor bound to
 * your Google Sheet. See MENTORSHIP-FORM-SETUP.md for the full walkthrough.
 *
 * On each POST request it:
 *   1. Appends a row to the sheet with the submitted details.
 *   2. Emails the mentee a confirmation.
 *   3. Emails the mentor a notification about the new request.
 */

const SHEET_NAME = "Requests"; // must match your sheet tab's name
const ORG_NAME = "Albanian Aviators Worldwide";

function doPost(e) {
  const data = JSON.parse(e.postData.contents);

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  sheet.appendRow([
    new Date(),
    data.menteeName || "",
    data.menteeEmail || "",
    data.menteeRole || "",
    data.location || "",
    data.mentorName || "",
    data.mentorEmail || "",
    data.message || "",
  ]);

  if (data.menteeEmail) {
    MailApp.sendEmail({
      to: data.menteeEmail,
      subject: `${ORG_NAME}: Your mentorship request to ${data.mentorName}`,
      body:
        `Hi ${data.menteeName || "there"},\n\n` +
        `Thanks for reaching out to ${data.mentorName} through ${ORG_NAME}. ` +
        `Your request has been received and ${data.mentorName} will be in touch directly.\n\n` +
        `Your message:\n${data.message || "(none)"}\n\n` +
        `— ${ORG_NAME}`,
    });
  }

  if (data.mentorEmail) {
    MailApp.sendEmail({
      to: data.mentorEmail,
      subject: `${ORG_NAME}: New mentorship request from ${data.menteeName}`,
      body:
        `Hi ${data.mentorName || "there"},\n\n` +
        `${data.menteeName || "Someone"} (${data.menteeEmail || "no email given"}) has requested mentorship ` +
        `through ${ORG_NAME}.\n\n` +
        `Role: ${data.menteeRole || "n/a"}\n` +
        `Location: ${data.location || "n/a"}\n\n` +
        `Their message:\n${data.message || "(none)"}\n\n` +
        `Please reach out to them directly when you have a chance.\n\n` +
        `— ${ORG_NAME}`,
    });
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
