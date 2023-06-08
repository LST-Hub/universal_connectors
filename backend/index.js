const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const userController = require("./controllers/user.controllers");
const integrationController = require("./controllers/integration.controllers");
const resletController = require("./controllers/restletsApi.controllers");
const fieldMappingController = require("./controllers/fieldMapping.controllers");
const scheduleController = require("./controllers/schedule.controllers");

const app = express();
dotenv.config();
const port = process.env.PORT || 4000;

var allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};

app.use(bodyParser.json());
app.use(allowCrossDomain);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const v1Router = express.Router();
app.use("/v1", v1Router);

v1Router.get("/", (req, res) => {
  res.send("test api working");
});

// *** user routes ***
v1Router.post("/", userController.createUser);
v1Router.get("/login", userController.userLogin);
v1Router.post("/verifyToken", userController.verifyToken);
v1Router.get("/getUser/:token", userController.getUser);
v1Router.put("/updateUser/:id", userController.updateUser);

// *** integration routes ***
v1Router.post("/addIntegration", integrationController.createIntegration);
v1Router.get("/getIntegrations/:id", integrationController.getIntegrations);
v1Router.get(
  "/getIntegrationById/:id",
  integrationController.getIntegrationById
);
v1Router.post("/deleteIntegration", integrationController.deleteIntegration);
v1Router.put("/updateIntegration/:id", integrationController.updateIntegration);
v1Router.post("/addConfigurations", integrationController.addConfigurations);
v1Router.get(
  "/getConfigurationById/:id",
  integrationController.getConfigurationById
);
v1Router.put(
  "/updateConfiguration/:id",
  integrationController.updateConfiguration
);
v1Router.get(
  "/getConfigurationByIntegrationId/:id",
  integrationController.getConfigurationByIntegrationId
);

// *** restlet routes ***
v1Router.get("/getRecordTypes", resletController.getRecordTypes);
v1Router.post("/restletAuthentication", resletController.authentication);
v1Router.post("/getOptions", resletController.getOptions);
v1Router.get("/getRedirectPage", resletController.getRedirectPage);
v1Router.post("/addRefreshToken", resletController.addRefreshToken);
v1Router.get("/getAccessToken/:id", resletController.getAccessToken);
v1Router.get("/getFiles", resletController.getFiles);
v1Router.get("/getSheetsData", resletController.getSheetsData);
v1Router.get(
  "/getcredentialDetailsById/:id",
  resletController.getcredentialDetailsById
);
v1Router.post("/updateSheetValues", resletController.updateSheetValues);
v1Router.post("/deleteSheetValue", resletController.deleteSheetValue);

// *** field mapping routes ***
v1Router.post("/addMappedRecord", fieldMappingController.addMappedRecord);
v1Router.put(
  "/updateFieldMappingState/:id",
  fieldMappingController.updateFieldMappingState
);
v1Router.get(
  "/getMappedRecordById/:id",
  fieldMappingController.getMappedRecordById
);
v1Router.delete(
  "/deleteMappedRecordByID/:id/:integrationId",
  fieldMappingController.deleteMappedRecordByID
);
v1Router.get(
  "/getMappedFieldsDetails/:id",
  fieldMappingController.getMappedFieldsDetails
);

// *** fields routes
v1Router.post("/addFields", fieldMappingController.addFields);
v1Router.get("/getFields/:id", fieldMappingController.getFields);
v1Router.delete("/deleteField/:id", fieldMappingController.deleteField);

// *** schedule routes
v1Router.post("/addRealTimeEvent", scheduleController.addRealTimeEvent);
v1Router.post("/addSingleEvent", scheduleController.addSingleEvent);
v1Router.post("/addWeeklyEvent", scheduleController.addWeeklyEvent);
v1Router.get("/getSchedules/:id", scheduleController.getSchedules);
v1Router.get("/getScheduleEventById", scheduleController.getScheduleEventById);
v1Router.put(
  "/updateRealTimeEvent/:id",
  scheduleController.updateRealTimeEvent
);
v1Router.put("/updateSingleEvent/:id", scheduleController.updateSingleEvent);
v1Router.put("/updateWeeklyEvent/:id", scheduleController.updateWeeklyEvent);
v1Router.delete(
  "/deleteScheduleEvent/:id/:integrationId",
  scheduleController.deleteScheduleEvent
);
v1Router.post(
  "/addCustomFilterFields",
  scheduleController.addCustomFilterFields
);
v1Router.get(
  "/getCustomFilterFields",
  scheduleController.getCustomFilterFields
);
v1Router.post("/syncData", scheduleController.syncData);
v1Router.get(
  "/getNetsuiteFiledsByRecordId",
  scheduleController.getNetsuiteFiledsByRecordId
);
v1Router.get("/getFields", scheduleController.getFields);
v1Router.post("/scheduleTask", scheduleController.scheduleTask);
v1Router.get(
  "/getMappedRecordByIntegrationId",
  scheduleController.getMappedRecordByIntegrationId
);

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
