import Link from "next/link";

const MinEmailLength = 6;
const MaxEmailLength = 100;

const MinPasswordLength = 8;
const MaxPasswordLength = 32;

const MinNameLength = 1;
const MaxNameLength = 50;

const MaxAttachmentSize = 25 * 1024 * 1024; // 25MB

const MaxPhoneNumberLength = 15;
const MinPhoneNumberLength = 4;

const MaxEstimatedHoursLength = 9; // as we dotn want to allow to enter more than 99999 hours, so 100000:00 is 9 characters which is just greater that 99999:59 which is 8 characters
const MaxHoursLimit = 99999;
const MaxAmountLength = 100000;

const smallInputMinLength = 1;
const smallInputMaxLength = 100;

const bigInpuMaxLength = 2000;
const bigInpuMinLength = 0;

const length10 = 10;

const minSearchLength = 2;

// we have created a enum type for the different epmloyee types in schema.prisma file.
// here we are treating the below values "Contractor", "Employee" as id's in database.
// we are doing this manully (hard coding in UI) as we are saving a api request to DB and backend..
// in future if you want to chnage names of eemployee types then chnage the label of below fields
// if you want to add new employee types thee add it below and make sure to add its id in schema.prisma file also
// types in enum once added cannot be removed so yoou cannot remove below tyypes from DB but add new one
const employeeTypes = [
  { value: "Employee", label: "Employee" },
  { value: "Contractor", label: "Contractor" },
];

// same as above  we have created a enum in Db  for employee type
const genderTypes = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const PUBLIC_BUCKET_BASE_URL = process.env.NEXT_PUBLIC_BUCKET_BASE_URL; // for public files

const RQ = {
  user: "user",
  workspace: "workspace",
  allUsers: "allUsers",
  project: "project",
  allProjects: "allProjects",
  task: "task",
  allTasks: "allTasks",
  client: "client",
  allClients: "allClients",
  supervisor: "supervisor",
  allSupervisors: "allSupervisors",
  allPMs: "allPMs",
  department: "department",
  allDepts: "allDepartments",
  attachment: "attachment",
  expense: "expense",
  employee: "employee",
  role: "role",
  allRoles: "allRoles",
  permission: "permission",
  allWorkCals: "allWorkCals",
  workCal: "workCal",
  allPriority: "allPriority",
  allStatus: "allStatus",
  allExpenseStatus: "allExpenseStatus",
  allTimesheets: "allTimesheet",
  allPendingTimesheets: "allPendingTimesheet",
  allApprovedTimesheets: "allApprovedTimesheet",
  allRejectedTimesheets: "allRejectedTimesheet",
  allPendindDayStartReports: "allPendindDayStartReport",
  allApprovedDayStartReports: "allApprovedDayStartReport",
  allRejectedDayStartReports: "allRejectedDayStartReport",
  allPendingExpenses: "allPendingExpenses",
  allApprovedExpenses: "allApprovedExpenses",
  allRejectedExpenses: "allRejectedExpenses",
  timesheet: "timesheet",
  allDayStartReport: "allDayStartReport",
  dayStartReport: "dayStartReport",
  allExpenseCategories: "allExpenseCategories",
  expenseCategory: "expenseCategory",
  expense: "expense",
  allExpenses: "allExpenses",
  currencyCode: "currencyCode",
  allCurrencyCode: "allCurrencyCode",
  allCurriencies: "allCurriencies",
  allProjectList: "allProjectList",
  allTaskList: "allTaskList",
  allClientList: "allClientList",
  allUsersList: "allUsersList",
  allRolesList: "allRolesList",
  allPriorityList: "allPriorityList",
  allStatusList: "allStatusList",
  allCurrenciesList: "allCurrenciesList",
};

const dropZone = {
  maxFiles: 10,
  maxFileSize: 25 * 1024 * 1024, // 25MB
  maxFileSizeMb: 25,
};

const roleRestrictionLabels = {
  own: "Own",
  none: "None",
  subordinates: "Subordinates",
};

const permissionAccessLabels = {
  view: "View",
  create: "Create",
  edit: "Edit",
  all: "All",
};

const modes = {
  create: "create",
  view: "view",
  edit: "edit",
};

const statusOptions = [
  { value: "open", label: "Open" },
  { value: "not started", label: "Not Started" },
  { value: "incomplete", label: "Incomplete" },
  { value: "compeleted", label: "Completed" },
  { value: "halted", label: "Halted" },
  { value: "closed", label: "Closed" },
  { value: "cancled", label: "Cancled" },
];

const expenseStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "unpending", label: "Unpending" },
  { value: "approved", label: "Approved" },
  { value: "unapproved", label: "Unapproved" },
];

const sourceName = [
  {
    value: "netSuite",
    label: "NetSuite™",
  },
  // {
  //   value: "quickBooks",
  //   label: "QuickBooks",
  // },
  // {
  //   value: "xero",
  //   label: "Xero",
  // },
];

const destinationName = [
  {
    value: "googleSheets",
    label: "Google Sheets™",
  },
  // {
  //   value: "microsoftExcel",
  //   label: "Microsoft Excel",
  // },
  // {
  //   value: "microsoftOneDrive",
  //   label: "Microsoft OneDrive",
  // },
];

const integrations = [
  {
    value: "nsgs",
    label: "NSGS",
  },
];

const recordType = [
  {
    value: "customer",
    label: "Customer",
  },
  {
    value: "employee",
    label: "Employee",
  },
  {
    value: "contact",
    label: "Contact",
  },
  {
    value: "vendor",
    label: "Vendor",
  },
];

const editValue = [
  {
    value: "text",
    label: "Text",
  },
  {
    value: "value",
    label: "Value",
  },
];

const netsuiteValues = [
  {
    value: "internalId",
    label: "Internal Id",
  },
  {
    value: "name",
    label: "Name",
  },
  {
    value: "email",
    label: "Email",
  },
];

const booleanValues = [
  {
    value: "yes",
    label: "Y",
  },
  {
    value: "no",
    label: "N",
  },
];

const netsuiteRecordTypes = [
  {
    value: "internalId",
    label: "Internal Id",
  },
  {
    value: "name",
    label: "Name",
  },
  {
    value: "email",
    label: "Email",
  },
];

const timeOptions = [
  {
    value: "00:00 AM",
    label: "12:00 AM",
  },
  {
    value: "00:30 AM",
    label: "12:30 AM",
  },
  {
    value: "1:00 AM",
    label: "1:00 AM",
  },
  {
    value: "1:30 AM",
    label: "1:30 AM",
  },
  {
    value: "2:00 AM",
    label: "2:00 AM",
  },
  {
    value: "2:30 AM",
    label: "2:30 AM",
  },
  {
    value: "3:00 AM",
    label: "3:00 AM",
  },
  {
    value: "3:30 AM",
    label: "3:30 AM",
  },
  {
    value: "4:00 AM",
    label: "4:00 AM",
  },
  {
    value: "4:30 AM",
    label: "4:30 AM",
  },
  {
    value: "5:00 AM",
    label: "5:00 AM",
  },
  {
    value: "5:30 AM",
    label: "5:30 AM",
  },
  {
    value: "6:00 AM",
    label: "6:00 AM",
  },
  {
    value: "6:30 AM",
    label: "6:30 AM",
  },
  {
    value: "7:00 AM",
    label: "7:00 AM",
  },
  {
    value: "7:30 AM",
    label: "7:30 AM",
  },
  {
    value: "8:00 AM",
    label: "8:00 AM",
  },
  {
    value: "8:30 AM",
    label: "8:30 AM",
  },
  {
    value: "9:00 AM",
    label: "9:00 AM",
  },
  {
    value: "9:30 AM",
    label: "9:30 AM",
  },
  {
    value: "10:00 AM",
    label: "10:00 AM",
  },
  {
    value: "10:30 AM",
    label: "10:30 AM",
  },
  {
    value: "11:00 AM",
    label: "11:00 AM",
  },
  {
    value: "11:30 AM",
    label: "11:30 AM",
  },
  {
    value: "12:00 PM",
    label: "12:00 PM",
  },
  {
    value: "12:30 PM",
    label: "12:30 PM",
  },
  {
    value: "13:00 PM",
    label: "1:00 PM",
  },
  {
    value: "13:30 PM",
    label: "1:30 PM",
  },
  {
    value: "14:00 PM",
    label: "2:00 PM",
  },
  {
    value: "14:30 PM",
    label: "2:30 PM",
  },
  {
    value: "15:00 PM",
    label: "3:00 PM",
  },
  {
    value: "15:30 PM",
    label: "3:30 PM",
  },
  {
    value: "16:00 PM",
    label: "4:00 PM",
  },
  {
    value: "16:30 PM",
    label: "4:30 PM",
  },
  {
    value: "17:00 PM",
    label: "5:00 PM",
  },
  {
    value: "17:30 PM",
    label: "5:30 PM",
  },
  {
    value: "18:00 PM",
    label: "6:00 PM",
  },
  {
    value: "18:30 PM",
    label: "6:30 PM",
  },
  {
    value: "19:00 PM",
    label: "7:00 PM",
  },
  {
    value: "19:30 PM",
    label: "7:30 PM",
  },
  {
    value: "20:00 PM",
    label: "8:00 PM",
  },
  {
    value: "20:30 PM",
    label: "8:30 PM",
  },
  {
    value: "21:00 PM",
    label: "9:00 PM",
  },
  {
    value: "21:30 PM",
    label: "9:30 PM",
  },
  {
    value: "22:00 PM",
    label: "10:00 PM",
  },
  {
    value: "22:30 PM",
    label: "10:30 PM",
  },
  {
    value: "23:00 PM",
    label: "11:00 PM",
  },
  {
    value: "23:30 PM",
    label: "11:30 PM",
  },
];

const repeatOptions = [
  {
    value: "every 15 minutes",
    label: "Every 15 minutes",
  },
  {
    value: "every 30 minutes",
    label: "Every 30 minutes",
  },
  {
    value: "every hour",
    label: "Every hour",
  },
  {
    label: "every 2 hours",
    value: "every 2 hours",
  },
  {
    label: "every 4 hours",
    value: "every 4 hours",
  },
  {
    label: "every 6 hours",
    value: "every 6 hours",
  },
  {
    label: "every 8 hours",
    value: "every 8 hours",
  },
  {
    label: "every 12 hours",
    value: "every 12 hours",
  },
];

const options = [
  {
    value: "1",
    label: "First",
  },
  {
    value: "2",
    label: "Second",
  },
  {
    value: "3",
    label: "Third",
  },
  {
    value: "4",
    label: "Fourth",
  },
  {
    value: "5",
    label: "Last",
  },
];

const days = [
  {
    value: "sunday",
    label: "Sunday",
  },
  {
    value: "monday",
    label: "Monday",
  },
  {
    value: "tuesday",
    label: "Tuesday",
  },
  {
    value: "wednesday",
    label: "Wednesday",
  },
  {
    value: "thursday",
    label: "Thursday",
  },
  {
    value: "friday",
    label: "Friday",
  },
  {
    value: "saturday",
    label: "Saturday",
  },
];

const months = [
  {
    value: "january",
    label: "January",
  },
  {
    value: "february",
    label: "February",
  },
  {
    value: "march",
    label: "March",
  },
  {
    value: "april",
    label: "April",
  },
  {
    value: "may",
    label: "May",
  },
  {
    value: "june",
    label: "June",
  },
  {
    value: "july",
    label: "July",
  },
  {
    value: "august",
    label: "August",
  },
  {
    value: "september",
    label: "September",
  },
  {
    value: "october",
    label: "October",
  },
  {
    value: "november",
    label: "November",
  },
  {
    value: "december",
    label: "December",
  },
];

const data = [
  {
    id: 1,
    // integrationName: "NSGS",
    sourceName: "NetSuite™",
    destinationName: "Google Sheets™",
    creationDate: "04 May, 2021",
    creationTime: "12:00 AM",
    modifiedDate: "16 Jan, 2022",
    modificationTime: "1:24 PM",
    schedule: (
      <>
        <Link href="/schedule/event" className="">
          <span className="">No</span>
          <i className="ri-add-fill ps-2"></i>
        </Link>
      </>
    ),
    fieldMapping: (
      <>
        <Link href="/fieldMapping/mapTable" className="">
          <span className="">Yes</span>
          <i className="ri-edit-2-fill ps-2"></i>
        </Link>
      </>
    ),
    status: "Completed",
    logs: "Logs",
    // error: 0,
    action: "Action",
  },
  // {
  //   id: 9402,
  //   sourceName: "NetSuite™",
  //   destinationName: "QuickBooks",
  //   creationDate: "12 Jan, 2022",
  //   creationTime: "3:30 AM",
  //   modifiedDate: "23 Feb, 2022",
  //   modificationTime: "7:00 PM",
  //   schedule: (
  //     <>
  //       <Link href="/schedule/event" className="">
  //         <span className="">No</span>
  //         <i className="ri-add-fill ps-2"></i>
  //       </Link>
  //     </>
  //   ),
  //   fieldMapping: (
  //     <>
  //       <Link href="/fieldMapping/mapTable" className="">
  //         <span className="">Yes</span>
  //         <i className="ri-edit-2-fill ps-2"></i>
  //       </Link>
  //     </>
  //   ),
  //   status: "Completed",
  //   logs: "Logs",
  //   // error: 0,
  //   action: "Action",
  // }
];

const serachFields = {
  dashboard: [
    "integrationName",
    "sourceName",
    "destinationName",
    "creationDate",
    "modificationDate",
    "schedule",
    "fieldMapping",
    "status"
  ],
  MappedRecordTable: [
    "name",
    "integrationName",
    "recordTypeTitle",
    "creationDate",
    "modificationDate",
    "systemOne",
    "systemTwo"
  ]
};

const filterFields = {
  dashboard: {
    integrationName: "integrationName",
    // creationDate: "creationDate",
    // endDate: "endDate",
    sourceName: "sourceName",
    destinationName: "destinationName",
  },
};

// we take maxTake as 100 from database for all queries, but here I have set it to 99 to be safe from any future changes
const maxDataLengthForUISearch = 99;

// I have made debounce time 500 intentionally, to reduce database calls if happenned in a short time
// later if you have more database and backend resources then you can reduce this time
const backendDebounceTime = 500;

//made UI debounce time 200ms, as we are searchi on UI and no api calls, so search feels faster
const UIDebounceTime = 200;

const environment = process.env.NODE_ENV;

export {
  MinEmailLength,
  MaxEmailLength,
  MinPasswordLength,
  MaxPasswordLength,
  MinNameLength,
  MaxNameLength,
  MaxAttachmentSize,
  MaxPhoneNumberLength,
  MinPhoneNumberLength,
  bigInpuMaxLength,
  bigInpuMinLength,
  employeeTypes,
  genderTypes,
  MaxEstimatedHoursLength,
  MaxHoursLimit,
  MaxAmountLength,
  smallInputMinLength,
  smallInputMaxLength,
  API_BASE_URL,
  RQ,
  length10,
  dropZone,
  roleRestrictionLabels,
  permissionAccessLabels,
  modes,
  PUBLIC_BUCKET_BASE_URL,
  statusOptions,
  expenseStatusOptions,
  maxDataLengthForUISearch,
  backendDebounceTime,
  UIDebounceTime,
  environment,
  minSearchLength,
  sourceName,
  destinationName,
  integrations,
  recordType,
  editValue,
  netsuiteValues,
  booleanValues,
  netsuiteRecordTypes,
  timeOptions,
  repeatOptions,
  options,
  days,
  months,
  data,
  serachFields,
  filterFields,
};
