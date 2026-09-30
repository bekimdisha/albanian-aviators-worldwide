/**
 * Albanian Aviators Worldwide — Mentorship Program
 * Shared configuration and constants.
 *
 * The option lists below are copied character-for-character from
 * "3 - AAW Form Builder and Matching Instructions.pdf". They are defined
 * ONCE here and reused by both FormBuilder.gs (so the two forms can never
 * drift apart) and Matching.gs (so scoring reads the same values it wrote).
 *
 * See MENTORSHIP-APPLICATIONS-SETUP.md for how to use this project.
 */

const ORG_NAME = "Albanian Aviators Worldwide";

// TODO: confirm this is who should get "new application" notification emails.
const COORDINATOR_EMAIL = "bekimdisha@gmail.com";

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

const SHEET_NAMES = {
  MENTEE: "Mentee Applications",
  MENTOR: "Mentor Applications",
  MATCHES: "Suggested Matches",
  CONFIRMED: "Confirmed Matches",
};

// ---- The 7 matching-field option lists (must stay identical on both forms) ----

const OPTIONS = {
  LANGUAGE: ["Albanian", "English", "Italian", "German", "Greek"], // "Other" added separately via showOtherOption
  TIME_ZONE_REGION: [
    "Americas (UTC−10 to −3)",
    "Europe and Africa (UTC−1 to +3)",
    "Middle East and Asia (UTC+4 to +9)",
    "Australia and Pacific (UTC+10 to +12)",
  ],
  AREA_OF_AVIATION: [
    "Airline pilot",
    "Corporate/private pilot",
    "Military pilot",
    "Flight instructor",
    "Maintenance",
    "ATC",
    "Dispatch",
    "Cabin crew",
    "Airport / ground operations",
    "Engineering",
  ],
  AREA_OF_AVIATION_MENTEE_EXTRA: "Not sure yet", // mentee form only; matches any mentor
  HELP_TOPICS: [
    "Career path",
    "Choosing a school or training program",
    "Exams and checkrides",
    "License conversion between countries",
    "Interviews and first job",
    "Airline or company-specific advice",
    "Financing and scholarships",
    "Motivation and balance",
  ],
  FORMAT: ["Office Hours (group video call)", "Career Call (one-time, 30 minutes)", "1-on-1 Mentor (6 months)"],
  MEETING_FREQUENCY: ["Every two weeks", "Monthly"],
  MENTOR_CAPACITY: ["1", "2"],
};
