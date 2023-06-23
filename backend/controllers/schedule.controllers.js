const prisma = require("../lib/prisma");
const response = require("../lib/response");
// const schedule = require("node-schedule");
const crypto = require("crypto");
const axios = require("axios");
const CryptoJS = require("crypto-js");
const cron = require("node-cron");

const addRealTimeEvent = async (req, res) => {
  const {
    userId,
    integrationId,
    mappedRecordId,
    eventType,
    startDate,
    endDate,
    noEndDate,
    performType,
    savedSearchLabel,
    savedSearchValue,
    operationType,
    source,
    range,
  } = req.body;

  try {
    const [schedule, updateCount] = await prisma.$transaction([
      prisma.schedule.create({
        data: {
          userId: userId,
          integrationId: integrationId,
          mappedRecordId: mappedRecordId,
          eventType: eventType,
          startDate: startDate,
          endDate: endDate,
          noEndDate: noEndDate,
          performType: performType,
          savedSearchLabel: savedSearchLabel,
          savedSearchValue: savedSearchValue,
          operationType: operationType,
          source: source,
          range: range,
          creationDate: new Date(),
          modificationDate: new Date(),
        },
      }),
      prisma.integrations.updateMany({
        where: {
          id: Number(integrationId),
          userId: Number(userId),
        },
        data: {
          schedule: true,
        },
      }),
    ]);

    if (schedule) {
      response({
        res,
        success: true,
        status_code: 200,
        message: "Schedule created successfully",
        data: [schedule],
      });
    } else {
      response({
        res,
        success: false,
        status_code: 400,
        message: "Error in creating schedule",
      });
    }
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in creating schedule",
    });
    console.log("error", error);
  }
};

const addSingleEvent = async (req, res) => {
  const {
    userId,
    integrationId,
    mappedRecordId,
    eventType,
    startDate,
    startTimeLabel,
    startTimeValue,
    repeatEveryDay,
    endDate,
    noEndDate,
    performType,
    savedSearchLabel,
    savedSearchValue,
    operationType,
    source,
    range,
  } = req.body;
  try {
    const [schedule, updateCount] = await prisma.$transaction([
      prisma.schedule.create({
        data: {
          userId: Number(userId),
          integrationId: Number(integrationId),
          mappedRecordId: Number(mappedRecordId),
          eventType: eventType,
          startDate: startDate,
          startTimeLabel: startTimeLabel,
          startTimeValue: startTimeValue,
          repeatEveryDay: repeatEveryDay,
          endDate: endDate,
          noEndDate: noEndDate,
          performType: performType,
          savedSearchLabel: savedSearchLabel,
          savedSearchValue: savedSearchValue,
          operationType: operationType,
          source: source,
          range: range,
          creationDate: new Date(),
          modificationDate: new Date(),
        },
      }),
      prisma.integrations.updateMany({
        where: {
          id: Number(integrationId),
          userId: Number(userId),
        },
        data: {
          schedule: true,
        },
      }),
    ]);

    if (schedule) {
      response({
        res,
        success: true,
        status_code: 200,
        message: "Schedule created successfully",
        data: [schedule],
      });
    } else {
      response({
        res,
        success: false,
        status_code: 400,
        message: "Error in creating schedule",
      });
    }
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in creating schedule",
    });
    console.log("error", error);
  }
};

const addWeeklyEvent = async (req, res) => {
  const {
    userId,
    integrationId,
    mappedRecordId,
    eventType,
    startDate,
    startTimeLabel,
    startTimeValue,
    day,
    endDate,
    noEndDate,
    performType,
    savedSearchLabel,
    savedSearchValue,
    operationType,
    source,
    range,
  } = req.body;

  try {
    const [schedule, updateCount] = await prisma.$transaction([
      prisma.schedule.create({
        data: {
          userId: userId,
          integrationId: integrationId,
          mappedRecordId: mappedRecordId,
          eventType: eventType,
          startDate: startDate,
          startTimeLabel: startTimeLabel,
          startTimeValue: startTimeValue,
          day: day,
          endDate: endDate,
          noEndDate: noEndDate,
          performType: performType,
          savedSearchLabel: savedSearchLabel,
          savedSearchValue: savedSearchValue,
          operationType: operationType,
          source: source,
          range: range,
          creationDate: new Date(),
          modificationDate: new Date(),
        },
      }),
      prisma.integrations.updateMany({
        where: {
          id: Number(integrationId),
          userId: Number(userId),
        },
        data: {
          schedule: true,
        },
      }),
    ]);

    if (schedule) {
      response({
        res,
        success: true,
        status_code: 200,
        message: "Schedule created successfully",
        data: [schedule],
      });
    } else {
      response({
        res,
        success: false,
        status_code: 400,
        message: "Error in creating schedule",
      });
    }
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in creating schedule",
    });
    console.log("error", error);
  }
};

const getSchedules = async (req, res) => {
  const { id } = req.params;
  try {
    const scheduleData = await prisma.schedule.findMany({
      where: {
        userId: Number(id),
      },
      select: {
        id: true,
        userId: true,
        integrationId: true,
        eventType: true,
        creationDate: true,
        modificationDate: true,
        source: true,
        operationType: true,
        integration: {
          select: {
            id: true,
            integrationName: true,
          },
        },
        mappedRecord: {
          select: {
            id: true,
          },
        },
      },
    });

    if (scheduleData) {
      response({
        res,
        success: true,
        status_code: 200,
        message: "Schedule fetched successfully",
        data: scheduleData,
      });
    } else {
      response({
        res,
        success: false,
        status_code: 400,
        message: "Error in fetching schedule",
      });
    }
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in fetching schedule",
    });
    console.log("error", error);
  }
};

const getScheduleEventById = async (req, res) => {
  const { id, userId, integrationId, mappedRecordId, eventType } = req.query;

  try {
    const scheduleData = await prisma.schedule.findMany({
      where: {
        id: Number(id),
        userId: Number(userId),
      },
      select: {
        id: true,
        userId: true,
        integrationId: true,
        mappedRecordId: true,
        eventType: true,
        startDate: true,
        endDate: true,
        startTimeLabel: true,
        startTimeValue: true,
        day: true,
        noEndDate: true,
        repeatEveryDay: true,
        performType: true,
        savedSearchLabel: true,
        savedSearchValue: true,
        operationType: true,
        source: true,
        range: true,
        integration: {
          select: {
            integrationName: true,
          },
        },
        mappedRecord: {
          select: {
            mappedRecordName: true,
          },
        },
      },
    });

    if (scheduleData) {
      response({
        res,
        success: true,
        status_code: 200,
        message: "Schedule fetched successfully",
        data: scheduleData,
      });
    } else {
      response({
        res,
        success: false,
        status_code: 400,
        message: "Error in fetching schedule",
      });
    }
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in fetching schedule",
    });
    console.log("error", error);
  }
};

const updateRealTimeEvent = async (req, res) => {
  const { id } = req.params;
  const {
    userId,
    integrationId,
    mappedRecordId,
    eventType,
    startDate,
    endDate,
    noEndDate,
    performType,
    savedSearchLabel,
    savedSearchValue,
    operationType,
    source,
    range,
  } = req.body;

  try {
    const scheduleData = await prisma.schedule.updateMany({
      where: {
        id: Number(id),
        userId: Number(userId),
        integrationId: Number(integrationId),
        eventType: eventType,
      },
      data: {
        mappedRecordId: mappedRecordId,
        startDate: startDate,
        endDate: endDate,
        noEndDate: noEndDate,
        performType: performType,
        savedSearchLabel: savedSearchLabel,
        savedSearchValue: savedSearchValue,
        operationType: operationType,
        source: source,
        range: range,
      },
    });

    const result = await syncEventData(
      userId,
      id,
      integrationId,
      mappedRecordId
    );
    console.log("final result", result);
    return result;
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in updating schedule",
    });
    console.log("error", error);
  }
};

const updateSingleEvent = async (req, res) => {
  const { id } = req.params;
  const {
    userId,
    integrationId,
    mappedRecordId,
    eventType,
    startDate,
    startTimeLabel,
    startTimeValue,
    repeatEveryDay,
    endDate,
    noEndDate,
    performType,
    savedSearchLabel,
    savedSearchValue,
    operationType,
    source,
    range,
  } = req.body;

  try {
    const scheduleData = await prisma.schedule.updateMany({
      where: {
        id: Number(id),
        userId: Number(userId),
        integrationId: Number(integrationId),
        eventType: eventType,
      },
      data: {
        mappedRecordId: mappedRecordId,
        startDate: startDate,
        startTimeLabel: startTimeLabel,
        startTimeValue: startTimeValue,
        repeatEveryDay: repeatEveryDay,
        endDate: endDate,
        noEndDate: noEndDate,
        performType: performType,
        savedSearchLabel: savedSearchLabel,
        savedSearchValue: savedSearchValue,
        operationType: operationType,
        source: source,
        range: range,
      },
    });

    const result = await syncEventData(
      userId,
      id,
      integrationId,
      mappedRecordId
    );
    console.log("final result", result);
    return result;
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in updating schedule",
    });
    console.log("error", error);
  }
};

const updateWeeklyEvent = async (req, res) => {
  const { id } = req.params;
  const {
    userId,
    integrationId,
    mappedRecordId,
    eventType,
    startDate,
    startTimeLabel,
    startTimeValue,
    day,
    endDate,
    noEndDate,
    performType,
    savedSearchLabel,
    savedSearchValue,
    operationType,
    source,
    range,
  } = req.body;

  try {
    const scheduleData = await prisma.schedule.updateMany({
      where: {
        id: Number(id),
        userId: Number(userId),
        integrationId: Number(integrationId),
        eventType: eventType,
      },
      data: {
        mappedRecordId: mappedRecordId,
        startDate: startDate,
        startTimeLabel: startTimeLabel,
        startTimeValue: startTimeValue,
        day: day,
        endDate: endDate,
        noEndDate: noEndDate,
        performType: performType,
        savedSearchLabel: savedSearchLabel,
        savedSearchValue: savedSearchValue,
        operationType: operationType,
        source: source,
        range: range,
      },
    });

    const result = await syncEventData(
      userId,
      id,
      integrationId,
      mappedRecordId
    );
    console.log("final result", result);
    return result;
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in updating schedule",
    });
    console.log("error", error);
  }
};

const deleteScheduleEvent = async (req, res) => {
  const { id, integrationId } = req.params;
  console.log("req.params", req.params);

  try {
    const deleteCount = await prisma.logs.deleteMany({
      where: {
        scheduleId: Number(id),
        integrationId: Number(integrationId),
      },
    });

    const [deleteScheduleEvent, updateIntegrations] = await prisma.$transaction(
      [
        prisma.schedule.deleteMany({
          where: {
            id: Number(id),
          },
        }),
        prisma.integrations.updateMany({
          where: {
            id: Number(integrationId),
          },
          data: {
            schedule: false,
          },
        }),
      ]
    );

    response({
      res,
      success: true,
      status_code: 200,
      message: "Schedule deleted successfully",
    });
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in deleting schedule",
    });
    console.log("error", error);
  }
};

const addMappedFields = async (req, res) => {
  const {
    userId,
    integrationId,
    mappedRecordId,
    sourceFieldLabel,
    sourceFieldValue,
    destinationFieldValue,
    operator,
    fieldType,
  } = req.body;

  try {
    const mappedFields = await prisma.mappedFields.create({
      data: {
        userId: userId,
        integrationId: integrationId,
        mappedRecordId: mappedRecordId,
        sourceFieldLabel: sourceFieldLabel,
        sourceFieldValue: sourceFieldValue,
        destinationFieldValue: destinationFieldValue,
        operator: operator,
        fieldType: fieldType,
      },
    });

    if (mappedFields) {
      response({
        res,
        success: true,
        status_code: 200,
        message: "Mapped fields added successfully",
      });
    } else {
      response({
        res,
        success: false,
        status_code: 400,
        message: "Mapped fields not added successfully",
      });
    }
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in adding mapped fields",
    });
    console.log("error", error);
  }
};

const getMappedField = async (req, res) => {
  const { id, integrationId, mappedRecordId } = req.query;

  try {
    const mappedFields = await prisma.mappedFields.findMany({
      where: {
        userId: Number(id),
        integrationId: Number(integrationId),
        mappedRecordId: Number(mappedRecordId),
      },
    });

    if (mappedFields) {
      response({
        res,
        success: true,
        status_code: 200,
        message: "Mapped fields fetched successfully",
        data: mappedFields,
      });
    } else {
      response({
        res,
        success: false,
        status_code: 400,
        message: "Mapped fields not fetched successfully",
      });
    }
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in fetching mapped fields",
    });
    console.log("error", error);
  }
};

const addCustomFilterFields = async (req, res) => {
  const {
    userId,
    mappedRecordId,
    integrationId,
    sourceFieldValue,
    sourceFieldLabel,
    destinationFieldValue,
    destinationFieldLabel,
    operator,
  } = req.body;

  try {
    const customFilterFields = await prisma.customFilterFields.create({
      data: {
        userId: userId,
        mappedRecordId: mappedRecordId,
        integrationId: integrationId,
        sourceFieldValue: sourceFieldValue,
        sourceFieldLabel: sourceFieldLabel,
        destinationFieldValue: destinationFieldValue,
        destinationFieldLabel: destinationFieldLabel,
        operator: operator,
        creationDate: new Date(),
        modificationDate: new Date(),
      },
    });

    if (customFilterFields) {
      response({
        res,
        success: true,
        status_code: 200,
        message: "Custom filter fields added successfully",
      });
    } else {
      response({
        res,
        success: false,
        status_code: 400,
        message: "Custom filter fields not added successfully",
      });
    }
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in adding custom filter fields",
    });
    console.log("error", error);
  }
};

const getCustomFilterFields = async (req, res) => {
  try {
    const { userId, integrationId, mappedRecordId } = req.query;

    const filterData = await prisma.customFilterFields.findMany({
      where: {
        userId: Number(userId),
        mappedRecordId: Number(mappedRecordId),
        integrationId: Number(integrationId),
      },
    });

    response({
      res,
      success: true,
      status_code: 200,
      data: filterData,
      message: "Successfully get filter fields",
    });
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      data: [],
      message: "Error in fetching filter fields",
    });
  }
};

// Pending
const scheduleTask = async (req, res) => {
  console.log("req.date", req.body.date);
  try {
    // schedule the job to a requested date and end date
    // const date = new Date(req.body.date);
    // const endDate = new Date(req.body.endDate);
    // const date = new Date(2023, 4, 21, 5, 9, 1);
    const rule = new schedule.RecurrenceRule();
    rule.second = 1;
    rule.minute = 0;
    rule.hour = 0;

    schedule.scheduleJob(rule, function () {
      console.log("starting...", new Date());

      // if(new Date() == endDate){
      //     job.cancel();
      //     console.log("ended", new Date());
      // }
    });

    response({
      res,
      success: true,
      status_code: 200,
      message: "Scheduled Task",
    });
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in creating Mapped record",
    });
    console.log("error", error);
  }
};

const getMappedRecordByIntegrationId = async (req, res) => {
  const { id, integrationId } = req.query;

  try {
    const mappedRecordData = await prisma.mappedRecords.findMany({
      where: {
        userId: Number(id),
        integrationId: Number(integrationId),
      },
      select: {
        id: true,
        mappedRecordName: true,
        recordTypeLabel: true,
        integrationId: true,
      },
    });
    if (mappedRecordData) {
      response({
        res,
        success: true,
        status_code: 200,
        data: mappedRecordData,
        message: "Mapped record fetched successfully",
      });
      return;
    } else {
      response({
        res,
        success: false,
        status_code: 400,
        message: "Mapped record not fetched",
      });
      return;
    }
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in fetching Mapped record",
    });
    console.log("error", error);
    return;
  }
};

const getNetsuiteFiledsByRecordId = async (req, res) => {
  try {
    const { recordId, userId } = req.query;
    const mappedRecord = await prisma.mappedRecords.findMany({
      where: {
        userId: Number(userId),
        id: Number(recordId),
      },
      select: {
        integrationId: true,
        recordTypeValue: true,
      },
    });

    const credentials = await prisma.configurations.findMany({
      where: {
        userId: Number(userId),
        id: mappedRecord[0].integrationId,
        systemName: "NetSuite™",
      },
      select: {
        accountId: true,
        consumerKey: true,
        consumerSecretKey: true,
        accessToken: true,
        accessSecretToken: true,
      },
    });

    const result = {
      recordType: mappedRecord[0].recordTypeValue,
      credentials: credentials[0],
      integrationId: mappedRecord[0].integrationId,
    };

    response({
      res,
      success: true,
      status_code: 200,
      data: [result],
      message: "Netsuite fields fetched successfully",
    });
  } catch (error) {
    console.log(error);
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in fetching Netsuite fields",
    });
  }
};

const getFields = async (req, res) => {
  const {
    accountId,
    consumerKey,
    consumerSecretKey,
    accessToken,
    accessSecretToken,
    recordType,
  } = req.query;
  try {
    const authentication = {
      account: accountId,
      consumerKey: consumerKey,
      consumerSecret: consumerSecretKey,
      tokenId: accessToken,
      tokenSecret: accessSecretToken,
      timestamp: Math.floor(Date.now() / 1000).toString(),
      nonce: getNonce(10),
      http_method: "POST",
      version: "1.0",
      scriptDeploymentId: "1",
      scriptId: "1529",
      signatureMethod: "HMAC-SHA256",
    };

    const base_url =
      "https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl";
    const concatenatedString = `deploy=${authentication.scriptDeploymentId}&oauth_consumer_key=${authentication.consumerKey}&oauth_nonce=${authentication.nonce}&oauth_signature_method=${authentication.signatureMethod}&oauth_timestamp=${authentication.timestamp}&oauth_token=${authentication.tokenId}&oauth_version=${authentication.version}&script=${authentication.scriptId}`;
    const baseString = `${authentication.http_method}&${encodeURIComponent(
      base_url
    )}&${encodeURIComponent(concatenatedString)}`;
    const keys = `${authentication.consumerSecret}&${authentication.tokenSecret}`;
    const signature = crypto
      .createHmac("sha256", keys)
      .update(baseString)
      .digest("base64");
    const oAuth_String = `OAuth realm="${
      authentication.account
    }", oauth_consumer_key="${authentication.consumerKey}", oauth_token="${
      authentication.tokenId
    }", oauth_nonce="${authentication.nonce}", oauth_timestamp="${
      authentication.timestamp
    }", oauth_signature_method="HMAC-SHA256", oauth_version="1.0", oauth_signature="${encodeURIComponent(
      signature
    )}"`;

    const url = `https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=${authentication.scriptId}&deploy=${authentication.scriptDeploymentId}`;

    const data = {
      resttype: "ListOfRecordField",
      recordtype: recordType,
    };

    const payload = JSON.stringify(data);
    const headers = {
      "Content-Type": "application/json",
      Authorization: oAuth_String,
    };

    await axios({
      method: "POST",
      url: url,
      headers: headers,
      data: payload,
    })
      .then((values) => {
        console.log(values.data);
        response({
          res,
          success: true,
          status_code: 200,
          data: [values.data],
          message: "Fields fetched successfully",
        });
      })
      .catch((error) => {
        console.log(error);
        response({
          res,
          success: false,
          status_code: 400,
          message: "Error in fetching fields",
        });
      });
  } catch (error) {
    console.log(error);
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in fetching fields",
    });
  }
};

const getLogs = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await prisma.logs.findMany({
      where: {
        userId: Number(id),
      },
      select: {
        id: true,
        userId: true,
        integrationId: true,
        mappedRecordId: true,
        scheduleId: true,
        recordType: true,
        status: true,
        logMessage: true,
        internalId: true,
        integration: {
          select: {
            integrationName: true,
          },
        },
        mappedRecord: {
          select: {
            recordTypeLabel: true,
          },
        },
        creationDate: true,
        modificationDate: true,
      },
    });

    response({
      res,
      success: true,
      status_code: 200,
      data: result,
      message: "Get all Logs",
    });
  } catch (error) {
    console.log("error", error);
    response({
      res,
      success: false,
      status_code: 400,
      data: [],
      message: "Error while fetching data",
    });
  }
};

// // ***
// // const prisma = require("../lib/prisma");
// // const response = require("../lib/response");
// // const schedule = require("node-schedule");
// // const crypto = require("crypto");
// // const axios = require("axios");
// // const cron = require("node-cron");

const syncEventData = async (
  userId,
  eventId,
  integrationId,
  mappedRecordId
) => {
  try {
    const scheduleData = await prisma.schedule.findMany({
      where: {
        userId: Number(userId),
        id: Number(eventId),
        integrationId: Number(integrationId),
        mappedRecordId: Number(mappedRecordId),
      },
      select: {
        id: true,
        userId: true,
        integrationId: true,
        mappedRecordId: true,
        eventType: true,
        startDate: true,
        endDate: true,
        startTimeLabel: true,
        startTimeValue: true,
        day: true,
        noEndDate: true,
        repeatEveryDay: true,
        operationType: true,
        source: true,
        range: true,
      },
    });
    console.log("scheduleData", scheduleData);

    switch (scheduleData[0].eventType) {
      case "Realtime":
        scheduleRealTimeEvent(
          userId,
          eventId,
          integrationId,
          mappedRecordId,
          scheduleData[0].startDate,
          scheduleData[0].endDate,
          scheduleData[0].noEndDate,
          scheduleData[0].operationType,
          scheduleData[0].source,
          scheduleData[0].range
        );
        break;

      case "Single":
        scheduleSingleEvent(
          userId,
          eventId,
          integrationId,
          mappedRecordId,
          scheduleData[0].startDate,
          scheduleData[0].startTimeLabel,
          scheduleData[0].startTimeValue,
          scheduleData[0].endDate,
          scheduleData[0].repeatEveryDay,
          scheduleData[0].noEndDate,
          scheduleData[0].operationType,
          scheduleData[0].source,
          scheduleData[0].range
        );
        break;

      case "Weekly":
        scheduleWeeklyEvent(
          userId,
          eventId,
          integrationId,
          mappedRecordId,
          scheduleData[0].startDate,
          scheduleData[0].startTimeLabel,
          scheduleData[0].startTimeValue,
          scheduleData[0].day,
          scheduleData[0].endDate,
          scheduleData[0].noEndDate,
          scheduleData[0].operationType,
          scheduleData[0].source,
          scheduleData[0].range
        );
        break;

      default:
        console.log("event not found");
    }

    const res = {
      success: true,
      status_code: 200,
      message: "Event scheduled successfully",
    };
    return res;
  } catch (error) {
    console.log("syncEventData error", error);
    throw error;
  }
};

const scheduleRealTimeEvent = async (
  userId,
  eventId,
  integrationId,
  mappedRecordId,
  startDate,
  endDate,
  noEndDate,
  operationType,
  source,
  range
) => {
  try {
    // date format is 2023-06-13T06:50:01.308Z
    const dateObj = new Date(startDate);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();

    console.log(`date * * ${day} ${month} *`);

    // cron.schedule(`* * ${day} ${month} *`, async function () {
      console.log("schedule RealTime Event", new Date());

      const accessToken = await getAccessTokenByUserId(userId);
      // console.log("accessToken", accessToken);
      const res = await syncData(
        userId,
        mappedRecordId,
        integrationId,
        operationType,
        source,
        range,
        eventId,
        accessToken
      );
      // result.push(res);
    // });
  } catch (error) {
    console.log("scheduleRealTimeEvent error => ", error);
  }
};

// start date, start time, repeat every day (checkbox), end date, no end date (checkbox)
const scheduleSingleEvent = (
  userId,
  eventId,
  integrationId,
  mappedRecordId,
  startDate,
  startTimeLabel,
  startTimeValue,
  endDate,
  repeatEveryDay,
  noEndDate,
  operationType,
  source,
  range
) => {
  try {
    // *** startDate and startTime from user
    const dateObj = new Date(startDate);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const [hour, minutes] = startTimeValue.split(":");
    const minute = minutes.split(" ")[0];

    const repeat = repeatEveryDay ? "*" : day;

    // ***todays date and time
    const date = new Date();
    const todaysYear = date.getFullYear();
    const TodaysMonth = date.getMonth() + 1;
    const TodaysDate = date.getDate();
    const todaysHour = date.getHours();
    const todaysMinute = date.getMinutes();

    console.log(`date ${minute} ${hour} ${repeat} ${month} *`);

    if (todaysYear === year && TodaysMonth === month && TodaysDate === day) {
      cron.schedule(
        `${minute} ${hour} ${repeat} ${month} *`,
        async function () {
          console.log("schedule Single Event", new Date());
          // const now = new Date();
          // const options = { timeZone: "Asia/Kolkata" };
          // const indianDate = now.toLocaleString("en-IN", options);
          // const [date, time] = indianDate.split(",");
          // console.log("date", date, "time", time);

          const accessToken = await getAccessTokenByUserId(userId);
          // console.log("accessToken", accessToken);
          const res = await syncData(
            userId,
            mappedRecordId,
            integrationId,
            operationType,
            source,
            range,
            eventId,
            accessToken
          );
          // result.push(res);
        }
      );
    }
  } catch (error) {
    console.log("scheduleSingleEvent error", error);
  }
};

// start date, start time, days, end date, no end date (checkbox)
const scheduleWeeklyEvent = (
  userId,
  eventId,
  integrationId,
  mappedRecordId,
  startDate,
  startTimeLabel,
  startTimeValue,
  dayOfWeek,
  endDate,
  noEndDate,
  operationType,
  source,
  range
) => {
  try {
    const dateObj = new Date(startDate);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();

    const [hour, minutes] = startTimeValue.split(":");
    const minute = minutes.split(" ")[0];
    // const hour = "12";
    // const minute = "39";

    const weekDays = [
      "sunday",
      "monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayIndex = weekDays.indexOf(dayOfWeek);
    console.log(dayOfWeek);

    console.log("date", minute, hour, day, month, dayIndex);

    cron.schedule(
      `${minute} ${hour} ${day} ${month} ${dayIndex}`,
      async function () {
        console.log("schedule Weekly Event", new Date());
        const accessToken = await getAccessTokenByUserId(userId);

        const res = await syncData(
          userId,
          mappedRecordId,
          integrationId,
          operationType,
          source,
          range,
          eventId,
          accessToken
        );
        // result.push(res);
      }
    );
  } catch (error) {
    console.log("scheduleWeeklyEvent error", error);
  }
};

const syncData = async (
  userId,
  mappedRecordId,
  integrationId,
  operationType,
  source,
  range,
  id,
  accessToken
) => {
  try {
    const [mappedRecord, credentials] = await prisma.$transaction([
      prisma.mappedRecords.findMany({
        where: {
          id: Number(mappedRecordId),
          userId: Number(userId),
          integrationId: Number(integrationId),
        },
        select: {
          id: true,
          mappedRecordName: true,
          recordTypeValue: true,
          recordTypeLabel: true,
          workBookLabel: true,
          workBookValue: true,
          sheetLabel: true,
          sheetValue: true,
          status: true,
        },
      }),

      prisma.configurations.findMany({
        where: {
          userId: Number(userId),
          integrationId: Number(integrationId),
          systemName: "NetSuite™",
        },
        select: {
          accountId: true,
          consumerKey: true,
          consumerSecretKey: true,
          accessToken: true,
          accessSecretToken: true,
        },
      }),
    ]);

    if (mappedRecord[0].status) {
      switch (source) {
        case "NetSuite":
          const nsResult = await netsuiteOperations(
            userId,
            mappedRecordId,
            integrationId,
            operationType,
            range,
            id,
            mappedRecord,
            credentials,
            accessToken
          );
          return nsResult;

        case "GoogleSheet":
          const gsResult = googleSheetsOperations(
            userId,
            mappedRecordId,
            integrationId,
            operationType,
            mappedRecord,
            credentials,
            accessToken,
            id,
            range
          );
          return gsResult;

        default:
          console.log("source not matched");
      }
    } else {
      console.log("****status false", mappedRecord[0].sheetLabel);
    }
  } catch (error) {
    console.log("syncData error", error);
    return error;
  }
};

const getAccessTokenByUserId = async (userId) => {
  try {
    const token = await prisma.credentials.findMany({
      where: {
        userId: Number(userId),
      },
    });

    const data = {
      refresh_token: token[0].refreshToken,
      grant_type: "refresh_token",
      client_id:
        "350110252536-v0id00m9oaathq39hv7o8i1nmj584et1.apps.googleusercontent.com",
      client_secret: "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",
    };

    const url = `https://oauth2.googleapis.com/token?refresh_token=${data.refresh_token}&grant_type=${data.grant_type}&client_id=${data.client_id}&client_secret=${data.client_secret}`;
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    try {
      const response = await axios({
        method: "POST",
        url: url,
        headers: headers,
        // data: data
      });
      // const response = await axios.post(url, JSON.stringify(data), {
      //     headers, timeout: 300000
      // })
      //   console.timeEnd("time");

      console.log(response.data.access_token);
      return response.data.access_token;
    } catch (error) {
      console.log("getAccessTokenByUserId error", error.response.data);
      // ***invalid_grant
      //   throw error;
    }
  } catch (error) {
    console.log("getAccessTokenByUserId error=>", error);
    // throw error;
  }
};

const netsuiteOperations = async (
  userId,
  mappedRecordId,
  integrationId,
  operationType,
  range,
  id,
  mappedRecord,
  credentials,
  accessToken
) => {
  try {
    const sheetsValue = getSheetsData(mappedRecord, userId, accessToken);
    sheetsValue
      .then((values) => {
        const result = getMappedFields(
          credentials,
          values.data.values,
          mappedRecord,
          userId,
          operationType,
          integrationId,
          range,
          id,
          accessToken
        );

        result
          .then((data) => {
            return data;
          })
          .catch((error) => {
            console.log("netsuiteOperations error", error);
            return error;
          });
      })
      .catch((error) => {
        console.log("netsuiteOperations error=>", error.data);
        return error;
      });
  } catch (error) {
    console.log("netsuiteOperations error==>", error);
    return error;
  }
};

const getSheetsData = async (mappedRecord, userId, accessToken) => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${mappedRecord[0].workBookValue}/values/${mappedRecord[0].sheetLabel}!A1:ZZ100000`;
    // const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}/values/A1:ZZ100000`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    try {
      const res = await axios({
        method: "GET",
        url: url,
        headers: headers,
      });
      return res;
    } catch (error) {
      console.log("getSheetsData error", error);
      throw error;
    }
  } catch (error) {
    console.log("getSheetsData error=>", error);

    throw error;
  }
};

const getMappedFields = async (
  credentials,
  values,
  mappedRecord,
  userId,
  operationType,
  integrationId,
  range,
  id,
  accessToken
) => {
  try {
    const mappedFields = await prisma.fields.findMany({
      where: {
        userId: Number(userId),
        mappedRecordId: Number(mappedRecord[0].id),
      },
      select: {
        id: true,
        sourceFieldValue: true,
        destinationFieldValue: true,
      },
    });

    if (mappedFields.length > 0 && values.length > 1) {
      switch (operationType) {
        case "add":
          const result = await addNetsuiteV1Api(
            credentials,
            values,
            mappedRecord,
            mappedFields,
            userId,
            integrationId,
            id
          );
          return result;

        case "update":
          const updateResult = await updateNetsuiteV1Api(
            credentials,
            values,
            mappedRecord,
            mappedFields,
            userId,
            integrationId,
            range,
            accessToken,
            id
          );
          return updateResult;

        case "delete":
          const deleteResult = await deleteNetsuiteV1Api(
            credentials,
            values,
            mappedRecord,
            mappedFields,
            userId,
            integrationId,
            range,
            accessToken,
            id
          );
          return deleteResult;

        default:
          console.log("operationType not matched");
          throw error;
      }
    } else {
      console.log("fields not mapped");
      throw error;
    }
  } catch (error) {
    console.log("getMappedFields error", error);
    throw error;
  }
};

function getNonce(length) {
  const alphabet =
    "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return Array.from(crypto.randomFillSync(new Uint8Array(length)))
    .map((x) => alphabet[x % alphabet.length])
    .join("");
}

const addNetsuiteV1Api = async (
  credentials,
  values,
  mappedRecord,
  mappedFields,
  userId,
  integrationId,
  id
) => {
  console.log("add record in ns");
  try {
    const headerRow = values[0];
    const dataRows = values.slice(1);

    // const data = {
    //   resttype: "Add",
    //   recordtype: mappedRecord[0].recordTypeValue,
    //   internalid: null,
    // };

    // const resultArray = [];

    // dataRows.forEach((row) => {
    //   const obj = {};
    //   mappedFields.forEach((field) => {
    //     const columnIndex = headerRow.indexOf(field.destinationFieldValue);
    //     if (columnIndex !== -1) {
    //       obj[field.sourceFieldValue] = row[columnIndex];
    //     }
    //   });

    //   const result = { ...data, bodyfields: { ...obj } };
    //   resultArray.push(result);
    // });
    // const recordFilelds = await recordField(credentials, mappedRecord);
    // console.log("recordFilelds", recordFilelds)

    const resultArray = [];
    // console.log("dataRows", dataRows)

    for (const dataRow of dataRows) {
      const record = {
        resttype: "Add",
        recordtype: mappedRecord[0].recordTypeValue,
        bodyfields: {},
        linefields: {},
      };

      for (const field of mappedFields) {
        const sourceField = field.sourceFieldValue;
        const destinationField = field.destinationFieldValue;
        const fieldValue = dataRow[mappedFields.indexOf(field)];

        if (sourceField.includes("__")) {
          const [parentField, childField] = sourceField.split("__");
          if (!record.linefields[parentField]) {
            record.linefields[parentField] = [];
          }
          const lineFieldObject = record.linefields[parentField].find(
            (lineField) => Object.keys(lineField)[0] === childField
          );
          if (lineFieldObject) {
            lineFieldObject[childField] = fieldValue;
          } else {
            const newLineField = { [childField]: fieldValue };
            record.linefields[parentField].push(newLineField);
          }
        } else {
          record.bodyfields[sourceField] = fieldValue;
        }
      }
      if (Object.keys(record.linefields).length > 0) {
        resultArray.push(record);
      } else {
        // Only add the record if linefields have data
        resultArray.push({
          resttype: "Add",
          recordtype: mappedRecord[0].recordTypeValue,
          bodyfields: record.bodyfields,
        });
      }
    }

    console.log("data to add", resultArray);

    const logs = [];
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < resultArray.length; i++) {
      const item = resultArray[i];
      const authentication = {
        account: credentials[0].accountId,
        consumerKey: credentials[0].consumerKey,
        consumerSecret: credentials[0].consumerSecretKey,
        tokenId: credentials[0].accessToken,
        tokenSecret: credentials[0].accessSecretToken,
        timestamp: Math.floor(Date.now() / 1000).toString(),
        nonce: getNonce(10),
        http_method: "POST",
        version: "1.0",
        scriptDeploymentId: "1",
        scriptId: "1529",
        signatureMethod: "HMAC-SHA256",
      };

      const base_url =
        "https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl";
      const concatenatedString = `deploy=${authentication.scriptDeploymentId}&oauth_consumer_key=${authentication.consumerKey}&oauth_nonce=${authentication.nonce}&oauth_signature_method=${authentication.signatureMethod}&oauth_timestamp=${authentication.timestamp}&oauth_token=${authentication.tokenId}&oauth_version=${authentication.version}&script=${authentication.scriptId}`;
      const baseString = `${authentication.http_method}&${encodeURIComponent(
        base_url
      )}&${encodeURIComponent(concatenatedString)}`;
      const keys = `${authentication.consumerSecret}&${authentication.tokenSecret}`;
      const signature = crypto
        .createHmac("sha256", keys)
        .update(baseString)
        .digest("base64");
      const oAuth_String = `OAuth realm="${
        authentication.account
      }", oauth_consumer_key="${authentication.consumerKey}", oauth_token="${
        authentication.tokenId
      }", oauth_nonce="${authentication.nonce}", oauth_timestamp="${
        authentication.timestamp
      }", oauth_signature_method="HMAC-SHA256", oauth_version="1.0", oauth_signature="${encodeURIComponent(
        signature
      )}"`;

      const url = `https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=${authentication.scriptId}&deploy=${authentication.scriptDeploymentId}`;

      try {
        const res = await axios({
          method: "POST",
          url: url,
          headers: {
            Authorization: oAuth_String,
            "Content-Type": "application/json",
          },
          data: item,
        });

        console.log("output => ", res.data);

        if (res.data.add_success) {
          successCount++;
        } else if (res.data.add_error) {
          errorCount++;
          logs.push({
            userId: userId,
            scheduleId: id,
            integrationId: integrationId,
            mappedRecordId: mappedRecord[0].id,
            recordType: mappedRecord[0].recordTypeLabel,
            status: "Error",
            internalid: item.bodyfields.internalid,
            message: res.data.add_error.message,
          });
        }
      } catch (error) {
        console.log("addNetsuiteV1Api error", error);
      }
    }

    // const summaryMessage = `Successfully added ${successCount} records in NetSuite out of ${resultArray.length}`;
    // if(successCount > 0){
    //   logs.unshift({
    //     userId: userId,
    //     scheduleId: Number(id),
    //     integrationId: integrationId,
    //     mappedRecordId: mappedRecord[0].id,
    //     recordType: mappedRecord[0].recordTypeLabel,
    //     status: "Success",
    //     message: summaryMessage,
    //   });
    // }

    // addLogs(logs);
    // console.log("added record logs => ", logs);
    // return logs;
  } catch (error) {
    console.log("addNetsuiteV1Api error => ", error);
    throw error;
  }

  // console.log("add record in ns");
  // try {
  //   const headerRow = values[0];
  //   const dataRows = values.slice(1);

  //   const data = {
  //     resttype: "Add",
  //     recordtype: mappedRecord[0].recordTypeValue,
  //     internalid: null,
  //   };

  //   const resultArray = [];

  //   dataRows.forEach((row) => {
  //     const obj = {};
  //     mappedFields.forEach((field) => {
  //       const columnIndex = headerRow.indexOf(field.destinationFieldValue);
  //       if (columnIndex !== -1) {
  //         obj[field.sourceFieldValue] = row[columnIndex];
  //       }
  //     });

  //     const result = { ...data, bodyfields: { ...obj } };
  //     resultArray.push(result);
  //   });

  //   const logs = [];
  //   let successCount = 0;
  //   let errorCount = 0;

  //   for (let i = 0; i < resultArray.length; i++) {
  //     const item = resultArray[i];
  //     const authentication = {
  //       account: credentials[0].accountId,
  //       consumerKey: credentials[0].consumerKey,
  //       consumerSecret: credentials[0].consumerSecretKey,
  //       tokenId: credentials[0].accessToken,
  //       tokenSecret: credentials[0].accessSecretToken,
  //       timestamp: Math.floor(Date.now() / 1000).toString(),
  //       nonce: getNonce(10),
  //       http_method: "POST",
  //       version: "1.0",
  //       scriptDeploymentId: "1",
  //       scriptId: "1529",
  //       signatureMethod: "HMAC-SHA256",
  //     };

  //     const base_url =
  //       "https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl";
  //     const concatenatedString = `deploy=${authentication.scriptDeploymentId}&oauth_consumer_key=${authentication.consumerKey}&oauth_nonce=${authentication.nonce}&oauth_signature_method=${authentication.signatureMethod}&oauth_timestamp=${authentication.timestamp}&oauth_token=${authentication.tokenId}&oauth_version=${authentication.version}&script=${authentication.scriptId}`;
  //     const baseString = `${authentication.http_method}&${encodeURIComponent(
  //       base_url
  //     )}&${encodeURIComponent(concatenatedString)}`;
  //     const keys = `${authentication.consumerSecret}&${authentication.tokenSecret}`;
  //     const signature = crypto
  //       .createHmac("sha256", keys)
  //       .update(baseString)
  //       .digest("base64");
  //     const oAuth_String = `OAuth realm="${
  //       authentication.account
  //     }", oauth_consumer_key="${authentication.consumerKey}", oauth_token="${
  //       authentication.tokenId
  //     }", oauth_nonce="${authentication.nonce}", oauth_timestamp="${
  //       authentication.timestamp
  //     }", oauth_signature_method="HMAC-SHA256", oauth_version="1.0", oauth_signature="${encodeURIComponent(
  //       signature
  //     )}"`;

  //     const url = `https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=${authentication.scriptId}&deploy=${authentication.scriptDeploymentId}`;

  //     // try {
  //     //   const res = await axios({
  //     //     method: "POST",
  //     //     url: url,
  //     //     headers: {
  //     //       Authorization: oAuth_String,
  //     //       "Content-Type": "application/json",
  //     //     },
  //     //     data: item,
  //     //   });

  //     //   // console.log("output => ", res.data);

  //     //   if (res.data.add_success) {
  //     //     successCount++;
  //     //   } else if (res.data.add_error) {
  //     //     errorCount++;
  //     //     logs.push({
  //     //       userId: userId,
  //     //       scheduleId: id,
  //     //       integrationId: integrationId,
  //     //       mappedRecordId: mappedRecord[0].id,
  //     //       recordType: mappedRecord[0].recordTypeLabel,
  //     //       status: "Error",
  //     //       internalid: item.bodyfields.internalid,
  //     //       message: res.data.add_error.message,
  //     //     });
  //     //   }
  //     // } catch (error) {
  //     //   console.log("addNetsuiteV1Api error", error);
  //     // }
  //   }

  //   // const summaryMessage = `Successfully added ${successCount} records in NetSuite out of ${resultArray.length}`;
  //   // if(successCount > 0){
  //   //   logs.unshift({
  //   //     userId: userId,
  //   //     scheduleId: Number(id),
  //   //     integrationId: integrationId,
  //   //     mappedRecordId: mappedRecord[0].id,
  //   //     recordType: mappedRecord[0].recordTypeLabel,
  //   //     status: "Success",
  //   //     message: summaryMessage,
  //   //   });
  //   // }

  //   // addLogs(logs);
  //   // console.log("added record logs => ", logs);
  //   return logs;
  // } catch (error) {
  //   console.log("addNetsuiteV1Api error => ", error);
  //   throw error;
  // }
};

const updateNetsuiteV1Api = async (
  credentials,
  values,
  mappedRecord,
  mappedFields,
  userId,
  integrationId,
  range,
  accessToken,
  id
) => {
  console.log("update record in ns");
  const logs = [];
  let updatedCount = 0;
  let errorCount = 0;

  try {
    const filterData = await prisma.customFilterFields.findMany({
      where: {
        userId: Number(userId),
        integrationId: Number(integrationId),
        mappedRecordId: Number(mappedRecord[0].id),
      },
    });

    const sheetsData = await getSheetsDataByRange(
      userId,
      range,
      mappedRecord,
      accessToken
    );

    const sheetsValue = await getSheetsData(mappedRecord, userId, accessToken);
    // console.log("sheetsValue", sheetsValue.data)
    const sheetHeader = sheetsValue.data.values[0].indexOf(
      filterData[0].destinationFieldLabel
    );

    await Promise.all(
      sheetsData.values.map(async (row) => {
        const fieldValue = row[sheetHeader];
        const bodyfields = {};

        mappedFields.forEach((field) => {
          const columnIndex = values[0].indexOf(field.destinationFieldValue);
          if (columnIndex !== -1) {
            bodyfields[field.sourceFieldValue] = row[columnIndex];
          }
        });

        const result = {
          resttype: "Update",
          recordtype: mappedRecord[0].recordTypeValue,
          bodyfields: bodyfields,
          filters: {
            bodyfilters: [
              [
                filterData[0].sourceFieldValue,
                filterData[0].operator,
                fieldValue,
              ],
            ],
          },
        };

        const authentication = {
          account: credentials[0].accountId,
          consumerKey: credentials[0].consumerKey,
          consumerSecret: credentials[0].consumerSecretKey,
          tokenId: credentials[0].accessToken,
          tokenSecret: credentials[0].accessSecretToken,
          timestamp: Math.floor(Date.now() / 1000).toString(),
          nonce: getNonce(10),
          http_method: "POST",
          version: "1.0",
          scriptDeploymentId: "1",
          scriptId: "1529",
          signatureMethod: "HMAC-SHA256",
        };

        const base_url =
          "https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl";
        const concatenatedString = `deploy=${authentication.scriptDeploymentId}&oauth_consumer_key=${authentication.consumerKey}&oauth_nonce=${authentication.nonce}&oauth_signature_method=${authentication.signatureMethod}&oauth_timestamp=${authentication.timestamp}&oauth_token=${authentication.tokenId}&oauth_version=${authentication.version}&script=${authentication.scriptId}`;
        const baseString = `${authentication.http_method}&${encodeURIComponent(
          base_url
        )}&${encodeURIComponent(concatenatedString)}`;
        const keys = `${authentication.consumerSecret}&${authentication.tokenSecret}`;
        const signature = crypto
          .createHmac("sha256", keys)
          .update(baseString)
          .digest("base64");
        const oAuth_String = `OAuth realm="${
          authentication.account
        }", oauth_consumer_key="${authentication.consumerKey}", oauth_token="${
          authentication.tokenId
        }", oauth_nonce="${authentication.nonce}", oauth_timestamp="${
          authentication.timestamp
        }", oauth_signature_method="HMAC-SHA256", oauth_version="1.0", oauth_signature="${encodeURIComponent(
          signature
        )}"`;

        const url = `https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=${authentication.scriptId}&deploy=${authentication.scriptDeploymentId}`;

        try {
          const res = await axios({
            method: "POST",
            url: url,
            headers: {
              Authorization: oAuth_String,
              "Content-Type": "application/json",
            },
            data: result,
          });

          console.log("output => ", res.data);

          if (res.data[0].update_success) {
            console.log("res", res.data);
            updatedCount++;
          } else if (res.data[0].update_error) {
            console.log("updation error", res.data);
            errorCount++;
            logs.push({
              userId: userId,
              scheduleId: id,
              integrationId: integrationId,
              mappedRecordId: mappedRecord[0].id,
              recordType: mappedRecord[0].recordTypeLabel,
              status: "Error",
              internalid: res.data[0].update_error.recordid,
              message: res.data[0].update_error.message,
            });
          }
        } catch (error) {
          console.log("updateNetsuiteV1Api error", error);
          throw error;
        }
      })
    );

    const summaryMessage = `Successfully updated ${updatedCount} records in NetSuite out of ${sheetsData.values.length}`;
    if (updatedCount > 0) {
      logs.unshift({
        userId: userId,
        scheduleId: Number(id),
        integrationId: integrationId,
        mappedRecordId: mappedRecord[0].id,
        recordType: mappedRecord[0].recordTypeLabel,
        status: "Success",
        message: summaryMessage,
      });
    }

    addLogs(logs);
    console.log("updated record logs => ", logs);
    return logs;
  } catch (error) {
    console.log("Please add filter to update the record");
    console.log("updateNetsuiteV1Api error => ", error);
    return error;
  }
};

const getSheetsDataByRange = async (
  userId,
  range,
  mappedRecord,
  accessToken
) => {
  try {
    console.log(userId, range, mappedRecord[0].workBookValue, accessToken);

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${mappedRecord[0].workBookValue}/values/${mappedRecord[0].sheetLabel}!${range}`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    return axios({
      method: "GET",
      url: url,
      headers: headers,
    })
      .then((values) => {
        console.log("values.data", values.data);
        return values.data;
      })
      .catch((error) => {
        console.log("getSheetsDataByRange error =>", error.response.data);
        return error;
      });
  } catch (error) {
    console.log("getSheetsDataByRange error", error);
    throw error;
  }
};

// delete data from netsuite
const deleteNetsuiteV1Api = async (
  credentials,
  values,
  mappedRecord,
  mappedFields,
  userId,
  integrationId,
  range,
  accessToken,
  id
) => {
  console.log("delete record from ns");
  const logs = [];
  let deleteCount = 0;
  let errorCount = 0;
  try {
    const filterData = await prisma.customFilterFields.findMany({
      where: {
        userId: Number(userId),
        integrationId: Number(integrationId),
        mappedRecordId: Number(mappedRecord[0].id),
      },
    });

    const sheetsData = await getSheetsDataByRange(
      userId,
      range,
      mappedRecord,
      accessToken
    );

    const sheetsValue = await getSheetsData(mappedRecord, userId, accessToken);
    // console.log("sheetsValue", sheetsValue.data)
    const sheetHeader = sheetsValue.data.values[0].indexOf(
      filterData[0].destinationFieldLabel
    );
    await Promise.all(
      sheetsData.values.map(async (row) => {
        // console.log("****************row", row);
        const fieldValue = row[sheetHeader];
        const filter = [
          filterData[0].sourceFieldValue,
          filterData[0].operator,
          fieldValue,
        ];
        // console.log("^^^^^^^^^filter", filter);

        const deleteRecord = {
          resttype: "Delete",
          recordtype: mappedRecord[0].recordTypeValue,
          filters: {
            bodyfilters: [filter],
          },
        };

        const authentication = {
          account: credentials[0].accountId,
          consumerKey: credentials[0].consumerKey,
          consumerSecret: credentials[0].consumerSecretKey,
          tokenId: credentials[0].accessToken,
          tokenSecret: credentials[0].accessSecretToken,
          timestamp: Math.floor(Date.now() / 1000).toString(),
          nonce: getNonce(10),
          http_method: "POST",
          version: "1.0",
          scriptDeploymentId: "1",
          scriptId: "1529",
          signatureMethod: "HMAC-SHA256",
        };

        const base_url =
          "https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl";
        const concatenatedString = `deploy=${authentication.scriptDeploymentId}&oauth_consumer_key=${authentication.consumerKey}&oauth_nonce=${authentication.nonce}&oauth_signature_method=${authentication.signatureMethod}&oauth_timestamp=${authentication.timestamp}&oauth_token=${authentication.tokenId}&oauth_version=${authentication.version}&script=${authentication.scriptId}`;
        const baseString = `${authentication.http_method}&${encodeURIComponent(
          base_url
        )}&${encodeURIComponent(concatenatedString)}`;
        const keys = `${authentication.consumerSecret}&${authentication.tokenSecret}`;
        const signature = crypto
          .createHmac("sha256", keys)
          .update(baseString)
          .digest("base64");
        const oAuth_String = `OAuth realm="${
          authentication.account
        }", oauth_consumer_key="${authentication.consumerKey}", oauth_token="${
          authentication.tokenId
        }", oauth_nonce="${authentication.nonce}", oauth_timestamp="${
          authentication.timestamp
        }", oauth_signature_method="HMAC-SHA256", oauth_version="1.0", oauth_signature="${encodeURIComponent(
          signature
        )}"`;

        const url = `https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=${authentication.scriptId}&deploy=${authentication.scriptDeploymentId}`;

        try {
          const res = await axios({
            method: "POST",
            url: url,
            headers: {
              Authorization: oAuth_String,
              "Content-Type": "application/json",
            },
            data: deleteRecord,
          });

          // console.log("output =>", res);

          if (res.data[0].delete_success) {
            deleteCount++;
          } else if (res.data[0].delete_error) {
            errorCount++;
            logs.push({
              userId: userId,
              scheduleId: id,
              integrationId: integrationId,
              mappedRecordId: mappedRecord[0].id,
              recordType: mappedRecord[0].recordTypeLabel,
              status: "Error",
              internalid: res.data[0].delete_error.recordid,
              message: res.data[0].delete_error.message,
            });
          }
        } catch (error) {
          console.log("deleteNetsuiteV1Api error", error);
          return error;
        }
      })
    );

    const summaryMessage = `Successfully deleted ${deleteCount} records from NetSuite out of ${sheetsData.values.length}`;
    if (deleteCount > 0) {
      logs.unshift({
        userId: userId,
        scheduleId: Number(id),
        integrationId: integrationId,
        mappedRecordId: mappedRecord[0].id,
        recordType: mappedRecord[0].recordTypeLabel,
        status: "Success",
        message: summaryMessage,
      });
    }
    addLogs(logs);
    console.log("deleted record logs => ", logs);
  } catch (error) {
    console.log("Please add filter to delete record");
    console.log("deleteNetsuiteV1Api error => ", error);
    return error;
  }
};

const googleSheetsOperations = async (
  userId,
  mappedRecordId,
  integrationId,
  operationType,
  mappedRecord,
  credentials,
  accessToken,
  id,
  range
) => {
  try {
    const mappedFields = await prisma.fields.findMany({
      where: {
        userId: Number(userId),
        mappedRecordId: Number(mappedRecord[0].id),
      },
      select: {
        id: true,
        sourceFieldValue: true,
        destinationFieldValue: true,
      },
    });

    if (mappedFields.length > 0) {
      switch (operationType) {
        case "add":
          const addRecordResult = addGoogleSheetRecords(
            accessToken,
            mappedRecord,
            credentials,
            userId,
            mappedRecordId,
            integrationId,
            id,
            mappedFields
          );
          return addRecordResult;

        case "update":
          const updateRecordResult = updateGoogleSheetRecord(
            accessToken,
            mappedRecord,
            credentials,
            userId,
            mappedRecordId,
            integrationId,
            id,
            range,
            mappedFields
          );
          return updateRecordResult;

        case "delete":
          const deleteRecordResult = deleteGoogleSheetRecord(
            accessToken,
            mappedRecord,
            credentials,
            userId,
            mappedRecordId,
            integrationId,
            id
          );
          return deleteRecordResult;

        default:
      }
    }
  } catch (error) {
    console.log("googleSheetsOperations error", error);
    return error;
  }
};

const addGoogleSheetRecords = async (
  accessToken,
  mappedRecord,
  credentials,
  userId,
  mappedRecordId,
  integrationId,
  id,
  mappedFields
) => {
  try {
    console.log("add record in google sheet");

    const result = await getNetsuiteData(
      userId,
      mappedRecordId,
      credentials,
      mappedRecord
    );

    // console.log("mappedFields", mappedFields)
    const titles = mappedFields.map((field) => field.destinationFieldValue);
    const mappedKeys = mappedFields.map((field) => field.sourceFieldValue);
    // console.log(titles);

    console.log("result", result);
    // const records = result.map((record) => {
    //   const values = record.bodyValues;
    //   const lineValues = record.lineValues;

    //   const recordValues = [];
    //   // *pushn only values
    //   // for (const key in values) {
    //   //   if (Array.isArray(values[key])) {
    //   //     values[key].length > 0
    //   //       ? recordValues.push(values[key][0].text)
    //   //       : recordValues.push("");
    //   //     // recordValues.push(values[key][0].text);
    //   //   } else {
    //   //     recordValues.push(values[key]);
    //   //   }
    //   // }
    //   // *push both
    //   for (const key in values) {
    //     if (Array.isArray(values[key])) {
    //       values[key].length > 0 ?
    //       recordValues.push({ [key]: values[key][0].text }) :
    //       recordValues.push({ [key]: "" });
    //     } else {
    //       recordValues.push({ [key]: values[key] });
    //     }
    //   }

    //   // *push only values lineValues
    //   // console.log("lineValues", lineValues)
    //   // for (const key in lineValues) {
    //   //   if (Array.isArray(lineValues[key])) {
    //   //     // console.log("array is", lineValues[key])
    //   //     if (lineValues[key].length > 0) {
    //   //       lineValues[key].forEach((item) => {
    //   //         Object.entries(item).forEach(([keys, values]) => {
    //   //           // console.log(key, value);
    //   //           if (Array.isArray(values)) {
    //   //             // console.log("val", values[0].text)
    //   //             recordValues.push(values[0].text);
    //   //           } else {
    //   //             // console.log("val2", values)
    //   //             recordValues.push(values);
    //   //           }
    //   //         });
    //   //       });
    //   //     } else {
    //   //       // console.log("val3", lineValues[key])
    //   //       recordValues.push("");
    //   //     }
    //   //   }
    //   // }

    //   // *push both for lineValues
    //   for (const key in lineValues) {
    //     console.log("lineValues", lineValues)
    //     if (Array.isArray(lineValues[key])) {
    //       if (lineValues[key].length > 0) {
    //         lineValues[key].forEach((item) => {
    //           Object.entries(item).forEach(([itemKey, itemValue]) => {
    //             if (Array.isArray(itemValue)) {
    //               // console.log("itemValue", itemKey, itemValue[0].text)
    //               itemValue.length > 0 ?
    //               recordValues.push({ [itemKey]: itemValue[0].text }) :
    //               recordValues.push({[itemKey]: ""});
    //             } else {
    //               recordValues.push({ [itemKey]: itemValue });
    //             }
    //           });
    //         });
    //       } else {
    //         // console.log("lineValues[key]", lineValues[key])
    //         recordValues.push({ [key]: "" });
    //       }
    //     }
    //   }

    //   //## // console.log("lineValues", lineValues)
    //   // for (const key in lineValues) {
    //   //   if (Array.isArray(lineValues[key])) {
    //   //     console.log("line array", lineValues)

    //   //     for (const lineItem of lineValues[key]) {
    //   //       // lineItem[key].length > 0 ? recordValues.push(lineItem[key][0].text) : recordValues.push("");
    //   //       // recordValues.push(lineItem[key]);
    //   //       console.log("lineItem", lineItem)
    //   //     }
    //   //   }
    //   //  // ###// else {
    //   //   //   // recordValues.push(lineValues[key]);
    //   //   //   console.log("line", lineValues)

    //   //   // }
    //   // }

    //   return recordValues;
    // });

    const records = result.map((record) => {
      const values = record.bodyValues;
      const lineValues = record.lineValues;

      const recordValues = {};

      // Extract values from bodyValues
      for (const key in values) {
        if (Array.isArray(values[key])) {
          recordValues[key] = values[key].length > 0 ? values[key][0].text : "";
        } else {
          recordValues[key] = values[key];
        }
      }

      // Extract values from lineValues
      for (const key in lineValues) {
        if (Array.isArray(lineValues[key])) {
          if (lineValues[key].length > 0) {
            recordValues[key] = lineValues[key].map((item) => {
              const itemValues = {};
              for (const itemKey in item) {
                if (Array.isArray(item[itemKey])) {
                  itemValues[itemKey] =
                    item[itemKey].length > 0 ? item[itemKey][0].text : "";
                } else {
                  itemValues[itemKey] = item[itemKey];
                }
              }
              return itemValues;
            });
          } else {
            recordValues[key] = [];
          }
        }
      }

      return recordValues;
    });

    console.log("records ==> ", records);
    console.log("mappedKeys", mappedKeys);

    // const sheetValues = [];

    // records.forEach((record) => {
    //   Object.entries(record).forEach(([key, value]) => {
    //     if (Array.isArray(value)) {
    //       // sheetValues.push(value);
    //       if(value.length > 0){
    //         console.log("value array", value);
    //       } else {
    //         sheetValues.push("");
    //       }
    //     } else {
    //       // console.log("value", value)

    //       sheetValues.push(value);
    //     }
    //   });
    // });
const resultArray = []
    records.forEach((record) => {
      const sheetValues = []
      mappedKeys.forEach((key) => {
        if (key.includes("__")) {
          const [mainKey, subKey] = key.split("__");

          if (
            record[mainKey] &&
            record[mainKey][0] &&
            record[mainKey][0][subKey]
          ) {
            sheetValues.push(record[mainKey][0][subKey]);
          } else {
            sheetValues.push("");
          }
        } else {
          sheetValues.push(record[key] || "");
        }
      });
      resultArray.push(sheetValues)
    });

    console.log("sheetValues", resultArray);

    const recordList = {
      range: `${mappedRecord[0].sheetLabel}`,
      majorDimension: "ROWS",
    values: [titles, ...resultArray],
    };

    // console.log("recordList", recordList)

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${mappedRecord[0].workBookValue}/values/${mappedRecord[0].sheetLabel}!A1:ZZ100000:clear`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const bodyData = {
      spreadsheetId: mappedRecord[0].workBookValue,
      range: `${mappedRecord[0].sheetLabel}!A2:ZZ100000`,
    };

    try {
      await axios({
        method: "POST",
        url: url,
        headers: headers,
        body: bodyData,
      })
        .then((res) => {
          appendFields(
            userId,
            mappedRecordId,
            integrationId,
            mappedRecord,
            accessToken,
            recordList,
            resultArray.length,
            id
          );
        })
        .catch((error) => {
          console.log("addGoogleSheetRecords error", error);
        });
    } catch (error) {
      console.log("addGoogleSheetRecords error => ", error);
    }
  } catch (error) {
    console.log("addGoogleSheetRecords error=> ", error);
    return error;
  }
};

const getNetsuiteData = async (
  userId,
  mappedRecordId,
  credentials,
  mappedRecord
) => {
  try {
    const mappedFields = await prisma.fields.findMany({
      where: {
        userId: Number(userId),
        mappedRecordId: Number(mappedRecordId),
      },
      select: {
        id: true,
        sourceFieldValue: true,
        destinationFieldValue: true,
      },
    });

    const columns = mappedFields.map((field) => field.sourceFieldValue);
    // console.log("columns", columns)
    const data = {
      resttype: "Search",
      recordtype: mappedRecord[0].recordTypeValue,
      // columns: columns,
      columns: ["internalid"],
    };
    // console.log("data", data)

    const authentication = {
      account: credentials[0].accountId,
      consumerKey: credentials[0].consumerKey,
      consumerSecret: credentials[0].consumerSecretKey,
      tokenId: credentials[0].accessToken,
      tokenSecret: credentials[0].accessSecretToken,
      timestamp: Math.floor(Date.now() / 1000).toString(),
      nonce: getNonce(10),
      http_method: "POST",
      version: "1.0",
      scriptDeploymentId: "1",
      scriptId: "1529",
      signatureMethod: "HMAC-SHA256",
    };

    const base_url =
      "https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl";
    const concatenatedString = `deploy=${authentication.scriptDeploymentId}&oauth_consumer_key=${authentication.consumerKey}&oauth_nonce=${authentication.nonce}&oauth_signature_method=${authentication.signatureMethod}&oauth_timestamp=${authentication.timestamp}&oauth_token=${authentication.tokenId}&oauth_version=${authentication.version}&script=${authentication.scriptId}`;
    const baseString = `${authentication.http_method}&${encodeURIComponent(
      base_url
    )}&${encodeURIComponent(concatenatedString)}`;
    const keys = `${authentication.consumerSecret}&${authentication.tokenSecret}`;
    const signature = crypto
      .createHmac("sha256", keys)
      .update(baseString)
      .digest("base64");
    const oAuth_String = `OAuth realm="${
      authentication.account
    }", oauth_consumer_key="${authentication.consumerKey}", oauth_token="${
      authentication.tokenId
    }", oauth_nonce="${authentication.nonce}", oauth_timestamp="${
      authentication.timestamp
    }", oauth_signature_method="HMAC-SHA256", oauth_version="1.0", oauth_signature="${encodeURIComponent(
      signature
    )}"`;

    const url = `https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=${authentication.scriptId}&deploy=${authentication.scriptDeploymentId}`;

    return axios({
      method: "POST",
      url: url,
      headers: {
        Authorization: oAuth_String,
        "Content-Type": "application/json",
      },
      data: data,
    })
      .then(async (res) => {
        // console.log("res.data", res.data);
        const internalIds = res.data.list.map(
          (item) => item.values.internalid[0].text
        );
        const uniqueIds = [...new Set(internalIds)];
        console.log(uniqueIds);
        const fieldValues = await getCustomeRecord(
          credentials,
          mappedRecord[0].recordTypeValue,
          uniqueIds,
          columns
        );
        console.log("fieldValues", fieldValues);
        // return res.data;
        return fieldValues;
      })
      .catch((error) => {
        console.log("getNetsuiteData error", error);
        throw error;
      });
  } catch (error) {
    console.log("getNetsuiteData error => ", error);
    return error;
  }
};

const getCustomeRecord = async (
  credentials,
  recordTypeValue,
  uniqueIds,
  columns
) => {
  const result = [];
  await Promise.all(
    uniqueIds.map(async (internalId) => {
      const record = {
        resttype: "Record",
        recordtype: recordTypeValue,
        recordid: internalId,
        bodyfields: [],
        linefields: [{}],
      };

      console.log("columns", columns);
      // columns.forEach((col) => {
      //   if (col.includes("__")) {
      //     const [parentField, childField] = col.split("__");

      //     const lineField = record.linefields.find((lineField) => lineField[parentField]);

      //     if (lineField) {
      //       lineField[parentField].push(childField);
      //     } else {
      //       record.linefields.push({ [parentField]: [childField] });
      //     }
      //   } else {
      //     record.bodyfields.push(col);
      //   }
      // });

      // console.log("record", record);

      columns.forEach((col) => {
        if (col.includes("__")) {
          const [parentField, childField] = col.split("__");

          const lineField = record.linefields[0];

          if (lineField.hasOwnProperty(parentField)) {
            lineField[parentField].push(childField);
          } else {
            lineField[parentField] = [childField];
          }
        } else {
          record.bodyfields.push(col);
        }
      });

      console.log("record", record);

      const authentication = {
        account: credentials[0].accountId,
        consumerKey: credentials[0].consumerKey,
        consumerSecret: credentials[0].consumerSecretKey,
        tokenId: credentials[0].accessToken,
        tokenSecret: credentials[0].accessSecretToken,
        timestamp: Math.floor(Date.now() / 1000).toString(),
        nonce: getNonce(10),
        http_method: "POST",
        version: "1.0",
        scriptDeploymentId: "1",
        scriptId: "1529",
        signatureMethod: "HMAC-SHA256",
      };

      const base_url =
        "https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl";

      const concatenatedString = `deploy=${authentication.scriptDeploymentId}&oauth_consumer_key=${authentication.consumerKey}&oauth_nonce=${authentication.nonce}&oauth_signature_method=${authentication.signatureMethod}&oauth_timestamp=${authentication.timestamp}&oauth_token=${authentication.tokenId}&oauth_version=${authentication.version}&script=${authentication.scriptId}`;

      const baseString = `${authentication.http_method}&${encodeURIComponent(
        base_url
      )}&${encodeURIComponent(concatenatedString)}`;

      const keys = `${authentication.consumerSecret}&${authentication.tokenSecret}`;

      const signature = crypto
        .createHmac("sha256", keys)
        .update(baseString)
        .digest("base64");

      const oAuth_String = `OAuth realm="${
        authentication.account
      }", oauth_consumer_key="${authentication.consumerKey}", oauth_token="${
        authentication.tokenId
      }", oauth_nonce="${authentication.nonce}", oauth_timestamp="${
        authentication.timestamp
      }", oauth_signature_method="HMAC-SHA256", oauth_version="1.0", oauth_signature="${encodeURIComponent(
        signature
      )}"`;

      const url = `https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=${authentication.scriptId}&deploy=${authentication.scriptDeploymentId}`;

      try {
        const res = await axios({
          method: "POST",
          url: url,
          headers: {
            Authorization: oAuth_String,
            "Content-Type": "application/json",
          },
          data: record,
        });

        result.push(res.data);
      } catch (error) {
        throw error;
      }
    })
  );
  // console.log("***result", result)
  return result;
};

const appendFields = async (
  userId,
  mappedRecordId,
  integrationId,
  mappedRecord,
  accessToken,
  recordList,
  count,
  id
) => {
  const logs = [];
  try {
    const urlParams = {
      valueInputOption: "USER_ENTERED",
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${mappedRecord[0].workBookValue}/values/${mappedRecord[0].sheetLabel}:append?valueInputOption=${urlParams.valueInputOption}`;

    try {
      const request = await axios({
        method: "POST",
        url: url,
        headers: headers,
        data: recordList,
      });
      console.log("request", request.data);

      const summaryMessage = `Successfully added ${
        request.data.updates.updatedRows - 1
      } records in Google Sheet out of ${count}`;
      if (count > 0) {
        logs.push({
          userId: userId,
          scheduleId: Number(id),
          integrationId: integrationId,
          mappedRecordId: mappedRecordId,
          recordType: mappedRecord[0].recordTypeLabel,
          status: "Success",
          message: summaryMessage,
        });
      }
    } catch (error) {
      console.log("addGoogleSheetRecords error", error.response.data);
      return error;
    }

    // addLogs(logs);
    console.log("added GS record logs =>", logs);
  } catch (error) {
    console.log("appendFields error => ", error);
  }
};

const updateGoogleSheetRecord = async (
  accessToken,
  mappedRecord,
  credentials,
  userId,
  mappedRecordId,
  integrationId,
  id,
  range,
  mappedFields
) => {
  try {
    console.log("update record in google sheet");

    const filterData = await prisma.customFilterFields.findMany({
      where: {
        userId: Number(userId),
        integrationId: Number(integrationId),
        mappedRecordId: Number(mappedRecordId),
      },
    });

    const columns = []
    mappedFields.map((field) => {
columns.push(field.sourceFieldValue)
    })

    const sheetsData = await getSheetsDataByRange(
      userId,
      range,
      mappedRecord,
      accessToken
    );

    const sheetsValue = await getSheetsData(mappedRecord, userId, accessToken);
    const fieldIndex = sheetsValue.data.values[0].indexOf(
      filterData[0].destinationFieldLabel
    );

    const existingRecords = []

    const results = await Promise.all(
    sheetsData.values.map(async(row) => {

const authentication = {
  account: credentials[0].accountId,
  consumerKey: credentials[0].consumerKey,
  consumerSecret: credentials[0].consumerSecretKey,
  tokenId: credentials[0].accessToken,
  tokenSecret: credentials[0].accessSecretToken,
  timestamp: Math.floor(Date.now() / 1000).toString(),
  nonce: getNonce(10),
  http_method: "POST",
  version: "1.0",
  scriptDeploymentId: "1",
  scriptId: "1529",
  signatureMethod: "HMAC-SHA256",
};

const base_url =
      "https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl";
    const concatenatedString = `deploy=${authentication.scriptDeploymentId}&oauth_consumer_key=${authentication.consumerKey}&oauth_nonce=${authentication.nonce}&oauth_signature_method=${authentication.signatureMethod}&oauth_timestamp=${authentication.timestamp}&oauth_token=${authentication.tokenId}&oauth_version=${authentication.version}&script=${authentication.scriptId}`;
    const baseString = `${authentication.http_method}&${encodeURIComponent(
      base_url
    )}&${encodeURIComponent(concatenatedString)}`;
    const keys = `${authentication.consumerSecret}&${authentication.tokenSecret}`;
    const signature = crypto
      .createHmac("sha256", keys)
      .update(baseString)
      .digest("base64");
    const oAuth_String = `OAuth realm="${
      authentication.account
    }", oauth_consumer_key="${authentication.consumerKey}", oauth_token="${
      authentication.tokenId
    }", oauth_nonce="${authentication.nonce}", oauth_timestamp="${
      authentication.timestamp
    }", oauth_signature_method="HMAC-SHA256", oauth_version="1.0", oauth_signature="${encodeURIComponent(
      signature
    )}"`;

    const url = `https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=${authentication.scriptId}&deploy=${authentication.scriptDeploymentId}`;

    const data = {
      resttype: "Search",
      recordtype: mappedRecord[0].recordTypeValue,
      filters: [
          [
            filterData[0].sourceFieldValue,
              "is",
              row[fieldIndex]
          ]
      ],
      columns: columns
  };

  existingRecords.push(row)

    try {
      const res = await axios({
        method: "POST",
        url: url,
        headers: {
          "Content-Type": "application/json",
          Authorization: oAuth_String,
        },
        data: data,
      });

      return res.data;

    } catch (error) {
      console.log("updateNetsuiteV1Api error", error);
      throw error;
    }
  })
    );

    addFields(accessToken, mappedRecord, range, results, userId, id, integrationId, mappedRecordId, existingRecords)

  } catch (error) {
    console.log("updateGoogleSheetRecords error=> ", error);
    return error;
  }
};

const addFields = async (accessToken, mappedRecord, range, result, userId, id, integrationId, mappedRecordId, existingRecords) => {
  const logs = [];
  let recordCount = 0;
  const records = []
  const recordValues = []

 result.map((record, index) => {
   console.log("***record.list", record.list.length)
   if(record.list.length > 0) {
      recordCount++
      const values = record.list[0].values;
      const modifiedValues = {};

      console.log("values", values)
      for (const key in values) {
        if (Array.isArray(values[key])) {
          modifiedValues[key] =
            values[key].length > 0 ? values[key][0].text : "";
        } else {
          modifiedValues[key] = values[key];
        }
      }
      // return modifiedValues;
      // records.push(modifiedValues)
      recordValues.push(Object.values(modifiedValues));

    } else {
      recordCount++
        const summaryMessage = `Records are not available in Netsuite`;
        logs.push({
        userId: userId,
        scheduleId: Number(id),
        integrationId: integrationId,
        mappedRecordId: mappedRecordId,
        recordType: mappedRecord[0].recordTypeLabel,
        status: "Error",
        message: summaryMessage,
        });

        // console.log("not found", existingRecords[index])
        recordValues.push(existingRecords[index])
    }
  });

    if(recordCount > 0){
      // const recordValues = records.map((record) => Object.values(record));

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${mappedRecord[0].workBookValue}/values/${mappedRecord[0].sheetLabel}!${range}?valueInputOption=USER_ENTERED`

  const recordList = {
    range: `${mappedRecord[0].sheetLabel}!${range}`,
    majorDimension: "ROWS",
    values: recordValues
  }

  console.log("recordValues", recordValues)

  try {
    const request = await axios({
      method: "PUT",
      url: url,
      headers: headers,
      data: recordList,
    });
    console.log("request", request.data)

    const summaryMessage = `Successfully updated ${request.data.updatedRows} records in Google Sheet out of ${recordCount}`;
      if (recordCount > 0) {
        logs.push({
          userId: userId,
          scheduleId: Number(id),
          integrationId: integrationId,
          mappedRecordId: mappedRecordId,
          recordType: mappedRecord[0].recordTypeLabel,
          status: "Success",
          message: summaryMessage,
        });
      }
  } catch (error) {
    console.log("updateGoogleSheetRecords error", error);
    return error;
  }
    }
      

  // addLogs(logs);
  console.log("updated GS record logs =>", logs);
}

const deleteGoogleSheetRecord = async (
  accessToken,
  mappedRecord,
  credentials,
  userId,
  mappedRecordId,
  integrationId,
  id
) => {
  const logs = [];
  let deleteCount = 0;
  let totalRecords = 0;
  try {
    console.log("delete record in google sheet");

    // ***filter condition
    const filterData = await prisma.customFilterFields.findMany({
      where: {
        userId: Number(userId),
        integrationId: Number(integrationId),
        mappedRecordId: Number(mappedRecordId),
      },
    });

    const sourceField = filterData[0].sourceFieldValue;
    const destinationField = filterData[0].destinationFieldValue;

    // ***ns data
    let filterValues = [];
    const result = await getNetsuiteData(
      userId,
      mappedRecordId,
      credentials,
      mappedRecord
    );
    result.list.map((item) => {
      if (item.values.hasOwnProperty(sourceField)) {
        const nsValue = item.values[sourceField];
        if (Array.isArray(nsValue)) {
          filterValues.push(nsValue[0].value);
        } else {
          filterValues.push(nsValue);
        }
      }
    });
    // console.log("filterValues", filterValues)

    // *** gs data
    const gsIds = [];
    const sheetsValue = getSheetsData(mappedRecord, userId, accessToken);
    sheetsValue
      .then(async (res) => {
        const titles = res.data.values[0];

        if (titles.includes(destinationField)) {
          const itemIndex = titles.indexOf(destinationField);
          for (let i = 1; i < res.data.values.length; i++) {
            const row = res.data.values[i];
            gsIds.push(row[itemIndex]);
          }
        }

        // console.log("gsIds", gsIds)
        await Promise.all(
          gsIds.map(async (element, index) => {
            if (!filterValues.includes(element)) {
              totalRecords++;

              const url = `https://sheets.googleapis.com/v4/spreadsheets/${mappedRecord[0].workBookValue}:batchUpdate`;
              const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              };

              const data = {
                requests: [
                  {
                    deleteDimension: {
                      range: {
                        sheetId: mappedRecord[0].sheetValue,
                        dimension: "ROWS",
                        startIndex: index + 1,
                        endIndex: index + 2,
                      },
                    },
                  },
                ],
              };

              try {
                const res = await axios({
                  method: "POST",
                  url: url,
                  headers: headers,
                  data: data,
                });

                // console.log("output => ", res.data);
                deleteCount++;
              } catch (error) {
                console.log("deleteGoogleSheetRecord error", error);
              }
            }
          })
        );
        const summaryMessage = `Successfully deleted ${deleteCount} records in Google Sheet out of ${totalRecords}`;
        if (deleteCount > 0) {
          logs.push({
            userId: userId,
            scheduleId: Number(id),
            integrationId: integrationId,
            mappedRecordId: mappedRecordId,
            recordType: mappedRecord[0].recordTypeLabel,
            status: "Success",
            message: summaryMessage,
          });
        }

        addLogs(logs);
        console.log("deleted GS record logs => ", logs);
      })
      .catch((err) => {
        console.log("getSheetsData error", err);
      });
  } catch (error) {
    console.log("deleteGoogleSheetRecord error=> ", error);
    return error;
  }
};

const recordField = async (credentials, mappedRecord) => {
  try {
    const authentication = {
      account: credentials[0].accountId,
      consumerKey: credentials[0].consumerKey,
      consumerSecret: credentials[0].consumerSecretKey,
      tokenId: credentials[0].accessToken,
      tokenSecret: credentials[0].accessSecretToken,
      timestamp: Math.floor(Date.now() / 1000).toString(),
      nonce: getNonce(10),
      http_method: "POST",
      version: "1.0",
      scriptDeploymentId: "1",
      scriptId: "1529",
      signatureMethod: "HMAC-SHA256",
    };

    const base_url =
      "https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl";
    const concatenatedString = `deploy=${authentication.scriptDeploymentId}&oauth_consumer_key=${authentication.consumerKey}&oauth_nonce=${authentication.nonce}&oauth_signature_method=${authentication.signatureMethod}&oauth_timestamp=${authentication.timestamp}&oauth_token=${authentication.tokenId}&oauth_version=${authentication.version}&script=${authentication.scriptId}`;
    const baseString = `${authentication.http_method}&${encodeURIComponent(
      base_url
    )}&${encodeURIComponent(concatenatedString)}`;
    const keys = `${authentication.consumerSecret}&${authentication.tokenSecret}`;
    const signature = crypto
      .createHmac("sha256", keys)
      .update(baseString)
      .digest("base64");
    const oAuth_String = `OAuth realm="${
      authentication.account
    }", oauth_consumer_key="${authentication.consumerKey}", oauth_token="${
      authentication.tokenId
    }", oauth_nonce="${authentication.nonce}", oauth_timestamp="${
      authentication.timestamp
    }", oauth_signature_method="HMAC-SHA256", oauth_version="1.0", oauth_signature="${encodeURIComponent(
      signature
    )}"`;

    const url = `https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=${authentication.scriptId}&deploy=${authentication.scriptDeploymentId}`;

    const data = {
      resttype: "ListOfRecordField",
      recordtype: mappedRecord[0].recordTypeValue,
    };

    const payload = JSON.stringify(data);
    const headers = {
      "Content-Type": "application/json",
      Authorization: oAuth_String,
    };

    const res = await axios({
      method: "POST",
      url: url,
      headers: headers,
      data: payload,
    });
    return res.data;
  } catch (error) {
    console.log("recordField error => ", error);
    return error;
  }
};

const addLogs = async (values) => {
  try {
    const logResult = await prisma.logs.createMany({
      data: values.map((value) => ({
        userId: Number(value.userId),
        integrationId: Number(value.integrationId),
        mappedRecordId: Number(value.mappedRecordId),
        scheduleId: Number(value.scheduleId),
        recordType: value.recordType,
        status: value.status,
        logMessage: value.message,
        internalId: value.internalid && Number(value.internalid),
      })),
    });

    const result = {
      status_code: 200,
      success: true,
      message: "Added logs",
      data: logResult,
    };
    console.log("logResult", result);

    return result;
  } catch (error) {
    console.log("logs error", error);
    return error;
  }
};

const getScheduleEvent = async (
  userId,
  eventId,
  integrationId,
  mappedRecordId
) => {
  try {
    const eventData = await prisma.schedule.findMany({
      where: {
        userId: Number(userId),
        id: Number(eventId),
        integrationId: Number(integrationId),
        mappedRecordId: Number(mappedRecordId),
      },
      select: {
        eventType: true,
        startDate: true,
        endDate: true,
        startTime: true,
        day: true,
        noEndDate: true,
        repeatEveryDay: true,
      },
    });

    return eventData;
  } catch (error) {
    console.log("getScheduleEvent error", error);
    return error;
  }
};

// // module.exports = {
// //   syncEvent,
// //   getAccessTokenByUserId,
// //   //   scheduleRealTimeEvent,
// //   //   scheduleSingleEvent,
// //   //   scheduleWeeklyEvent,
// // };

module.exports = {
  addRealTimeEvent,
  addSingleEvent,
  addWeeklyEvent,
  getSchedules,
  getScheduleEventById,
  updateRealTimeEvent,
  updateSingleEvent,
  updateWeeklyEvent,
  deleteScheduleEvent,
  addMappedFields,
  getMappedField,
  addCustomFilterFields,
  getCustomFilterFields,
  scheduleTask,
  getMappedRecordByIntegrationId,
  getNetsuiteFiledsByRecordId,
  getFields,
  getLogs,
};
