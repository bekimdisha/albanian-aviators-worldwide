/**
 * Albanian Aviators Worldwide — Mentorship Program
 * The 1-on-1 matching engine described in "3 - AAW Form Builder and
 * Matching Instructions.pdf". This produces a ranked SHORTLIST only — it
 * never announces or confirms a match. You (the Coordinator) review the
 * "Suggested Matches" tab, read the free-text answers, and log your actual
 * decision in "Confirmed Matches" yourself.
 *
 * Office Hours and Career Calls are NOT run through this engine — per doc 3
 * they're a grouping exercise and a hand-picked process respectively, not
 * the scored 1-on-1 algorithm.
 *
 * Run "AAW Mentorship → Run Matching" from the spreadsheet's menu, or run
 * runMatching() directly from the Apps Script editor.
 */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("AAW Mentorship")
    .addItem("Run Matching", "runMatching")
    .addToUi();
}

function ensureConfirmedMatchesSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  if (!ss.getSheetByName(SHEET_NAMES.CONFIRMED)) {
    const sheet = ss.insertSheet(SHEET_NAMES.CONFIRMED);
    sheet.appendRow(["Mentee Name", "Mentee Email", "Mentor Name", "Mentor Email", "Confirmed Date"]);
  }
}

function runMatching() {
  const mentees = getMenteeRows().filter((m) => wantsOneOnOne(m));
  const mentors = getMentorRows();
  const capacityUsed = getConfirmedCountsByMentorEmail();

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let out = ss.getSheetByName(SHEET_NAMES.MATCHES);
  if (out) {
    out.clear();
  } else {
    out = ss.insertSheet(SHEET_NAMES.MATCHES);
  }
  out.appendRow(["Run At", "Mentee Name", "Mentee Email", "Rank", "Mentor Name", "Mentor Email", "Score"]);

  mentees.forEach((mentee) => {
    const candidates = mentors
      .filter((mentor) => passesFilters(mentee, mentor, capacityUsed))
      .map((mentor) => ({ mentor: mentor, score: scorePair(mentee, mentor) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (candidates.length === 0) {
      out.appendRow([new Date(), mentee.name, mentee.email, "—", "(no eligible mentor found)", "", ""]);
      return;
    }
    candidates.forEach((c, i) => {
      out.appendRow([new Date(), mentee.name, mentee.email, i + 1, c.mentor.name, c.mentor.email, c.score]);
    });
  });

  ensureConfirmedMatchesSheet();
}

// ---- filters (doc 3, section 2) ----

function passesFilters(mentee, mentor, capacityUsed) {
  if (mentee.isAdult !== true) return false;
  if (!sharedLanguage(mentee, mentor)) return false;
  if (mentor.formats.indexOf("1-on-1 Mentor (6 months)") === -1) return false;

  const statedCapacity = parseInt(mentor.capacity, 10) || 1;
  const used = capacityUsed[mentor.email] || 0;
  if (used >= statedCapacity) return false;

  if (!mentor.verified) return false;
  if (!mentee.disclosureCleared || !mentor.disclosureCleared) return false;

  return true;
}

function sharedLanguage(mentee, mentor) {
  return mentee.languages.some((l) => mentor.languages.indexOf(l) !== -1);
}

function wantsOneOnOne(mentee) {
  return mentee.formats.indexOf("1-on-1 Mentor (6 months)") !== -1;
}

// ---- scoring (doc 3, section 2 point table) ----

function scorePair(mentee, mentor) {
  let score = 0;

  const areaOverlap = mentee.areas.filter((a) => a !== "Not sure yet" && mentor.areas.indexOf(a) !== -1);
  if (areaOverlap.length > 0) score += 3;
  if (mentee.areas.indexOf("Not sure yet") !== -1) score += 1;

  const sharedTopics = mentee.helpTopics.filter((t) => mentor.helpTopics.indexOf(t) !== -1);
  score += Math.min(sharedTopics.length, 3);

  if (mentee.timeZoneRegion && mentee.timeZoneRegion === mentor.timeZoneRegion) score += 2;

  if (compatibleFrequency(mentee.meetingFrequency, mentor.meetingFrequency)) score += 1;

  return score;
}

function compatibleFrequency(menteeFreq, mentorFreq) {
  if (!menteeFreq || !mentorFreq) return false;
  return mentorFreq === "Every two weeks" || mentorFreq === menteeFreq;
}

// ---- reading the two application sheets into plain objects ----

function readSheetAsObjects(sheetName) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  return values.slice(1).map((row) => {
    const obj = {};
    headers.forEach((h, i) => (obj[h] = row[i]));
    return obj;
  });
}

function splitChecklist(cellValue) {
  if (!cellValue) return [];
  return String(cellValue)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function isYes(cellValue) {
  return String(cellValue || "").trim().toUpperCase().charAt(0) === "Y";
}

function getMenteeRows() {
  return readSheetAsObjects(SHEET_NAMES.MENTEE).map((row) => ({
    name: row["Full name"],
    email: row["Email"],
    isAdult: row["Are you 18 or older?"] === "Yes",
    languages: splitChecklist(row["Languages you're comfortable being mentored in"]),
    timeZoneRegion: row["Time zone region"],
    areas: splitChecklist(row["Which area of aviation interests you most? (Check up to two)"]),
    helpTopics: splitChecklist(row["What do you most want help with? (Check up to three)"]),
    formats: splitChecklist(row["How would you like to take part? (Check all that apply)"]),
    meetingFrequency: row["How often would you like to meet?"],
    disclosureCleared: isYes(row["Disclosure Cleared? (Y/N)"]),
  }));
}

function getMentorRows() {
  return readSheetAsObjects(SHEET_NAMES.MENTOR).map((row) => ({
    name: row["Full name"],
    email: row["Email"],
    languages: splitChecklist(row["Languages you can mentor in"]),
    timeZoneRegion: row["Time zone region"],
    areas: splitChecklist(row["Your area of aviation (check all that apply)"]),
    helpTopics: splitChecklist(row["What can you help with? (Check all that apply)"]),
    formats: splitChecklist(row["How would you like to help? (Check all that apply)"]),
    meetingFrequency: row["If 1-on-1: how often?"],
    capacity: row["If 1-on-1: how many mentees?"],
    verified: isYes(row["Verified? (Y/N)"]),
    disclosureCleared: isYes(row["Disclosure Cleared? (Y/N)"]),
  }));
}

function getConfirmedCountsByMentorEmail() {
  const rows = readSheetAsObjects(SHEET_NAMES.CONFIRMED);
  const counts = {};
  rows.forEach((row) => {
    const email = row["Mentor Email"];
    if (!email) return;
    counts[email] = (counts[email] || 0) + 1;
  });
  return counts;
}
