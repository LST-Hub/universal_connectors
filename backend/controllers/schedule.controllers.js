const prisma = require("../lib/prisma");
const response = require("../lib/response");
const schedule = require("node-schedule");
const crypto = require("crypto");
const axios = require("axios");
const CryptoJS = require("crypto-js");

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
    startTime,
    repeatEveryDay,
    endDate,
    noEndDate,
    performType,
    savedSearchLabel,
    savedSearchValue,
    operationType,
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
          startTime: startTime,
          repeatEveryDay: repeatEveryDay,
          endDate: endDate,
          noEndDate: noEndDate,
          performType: performType,
          savedSearchLabel: savedSearchLabel,
          savedSearchValue: savedSearchValue,
          operationType: operationType,
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
    startTime,
    day,
    endDate,
    noEndDate,
    performType,
    savedSearchLabel,
    savedSearchValue,
    operationType,
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
          startTime: startTime,
          day: day,
          endDate: endDate,
          noEndDate: noEndDate,
          performType: performType,
          savedSearchLabel: savedSearchLabel,
          savedSearchValue: savedSearchValue,
          operationType: operationType,
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
        integration: {
          select: {
            integrationName: true,
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
        startTime: true,
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
            MappedRecordName: true,
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

    if (scheduleData) {
      response({
        res,
        success: true,
        status_code: 200,
        message: "Schedule updated successfully",
      });
    } else {
      response({
        res,
        success: false,
        status_code: 400,
        message: "Schedule not updated successfully",
      });
    }
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
    startTime,
    repeatEveryDay,
    endDate,
    noEndDate,
    performType,
    savedSearchLabel,
    savedSearchValue,
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
        startTime: startTime,
        repeatEveryDay: repeatEveryDay,
        endDate: endDate,
        noEndDate: noEndDate,
        performType: performType,
        savedSearchLabel: savedSearchLabel,
        savedSearchValue: savedSearchValue,
      },
    });

    if (scheduleData) {
      response({
        res,
        success: true,
        status_code: 200,
        message: "Schedule updated successfully",
      });
    } else {
      response({
        res,
        success: false,
        status_code: 400,
        message: "Schedule not updated successfully",
      });
    }
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
    startTime,
    day,
    endDate,
    noEndDate,
    performType,
    savedSearchLabel,
    savedSearchValue,
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
        startTime: startTime,
        day: day,
        endDate: endDate,
        noEndDate: noEndDate,
        modificationDate: new Date(),
        performType: performType,
        savedSearchLabel: savedSearchLabel,
        savedSearchValue: savedSearchValue,
      },
    });

    if (scheduleData) {
      response({
        res,
        success: true,
        status_code: 200,
        message: "Schedule updated successfully",
      });
    } else {
      response({
        res,
        success: false,
        status_code: 400,
        message: "Schedule not updated successfully",
      });
    }
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

  try {
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

    if (deleteScheduleEvent) {
      response({
        res,
        success: true,
        status_code: 200,
        message: "Schedule deleted successfully",
      });
    } else {
      response({
        res,
        success: false,
        status_code: 400,
        message: "Schedule not deleted successfully",
      });
    }
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
        MappedRecordName: true,
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

const syncData = async (req, res) => {
  try {
    const {
      userId,
      mappedRecordId,
      integrationId,
      operationType,
      source,
      range,
      id,
    } = req.body;

    const accessToken = await getAccessTokenByUserId(userId);

    const [mappedRecord, credentials] = await prisma.$transaction([
      prisma.mappedRecords.findMany({
        where: {
          id: Number(mappedRecordId),
          userId: Number(userId),
          integrationId: Number(integrationId),
        },
        select: {
          id: true,
          MappedRecordName: true,
          recordTypeValue: true,
          recordTypeLabel: true,
          UrlLabel: true,
          UrlValue: true,
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
        response({
          res,
          status_code: 200,
          success: true,
          data: [nsResult],
          message: "success",
        });
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
          id
        );
        response({
          res,
          status_code: 200,
          success: true,
          data: [gsResult],
          message: "success",
        });
        return gsResult;

      default:
        console.log("source not matched");
    }
  } catch (error) {
    console.log("syncData error", error);
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in sync data",
    });
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
    const sheetsValue = getSheetsData(
      mappedRecord[0].UrlValue,
      userId,
      accessToken
    );
    sheetsValue
      .then((values) => {
        const result = getMappedFields(
          credentials,
          values.data.values,
          mappedRecord[0].recordTypeValue,
          mappedRecord[0].recordTypeLabel,
          mappedRecord[0].id,
          userId,
          operationType,
          integrationId,
          range,
          mappedRecord[0].UrlValue,
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

const getSheetsData = async (sheetsId, userId, accessToken) => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}/values/A1:ZZ100000`;
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

const getAccessTokenByUserId = async (userId) => {
  try {
    const token = await prisma.credentials.findMany({
      where: {
        userId: Number(userId),
      },
    });

    const data = {
      refreshToken: token[0].refreshToken,
      grantType: "refresh_token",
      clientId:
        "350110252536-v0id00m9oaathq39hv7o8i1nmj584et1.apps.googleusercontent.com",
      clientSecret: "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",
    };

    const url = `https://oauth2.googleapis.com/token?refresh_token=${data.refreshToken}&grant_type=${data.grantType}&client_id=${data.clientId}&client_secret=${data.clientSecret}`;
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    try {
      const response = await axios({
        method: "POST",
        url: url,
        headers: headers,
      });

      return response.data.access_token;
    } catch (error) {
      console.log("getAccessTokenByUserId error=>", error);
      throw error;
    }
  } catch (error) {
    console.log("getAccessTokenByUserId error", error);
    throw error;
  }
};

const getMappedFields = async (
  credentials,
  values,
  recordType,
  recordTypeLabel,
  mappedRecordId,
  userId,
  operationType,
  integrationId,
  range,
  UrlValue,
  id,
  accessToken
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

    if (mappedFields.length > 0 && values.length > 1) {
      switch (operationType) {
        case "add":
          const result = await addNetsuiteV1Api(
            credentials,
            values,
            recordType,
            recordTypeLabel,
            mappedFields,
            userId,
            integrationId,
            mappedRecordId,
            id
          );
          return result;
          break;

        case "update":
          const updateResult = await updateNetsuiteV1Api(
            credentials,
            values,
            recordType,
            recordTypeLabel,
            mappedFields,
            userId,
            integrationId,
            mappedRecordId,
            range,
            UrlValue,
            accessToken,
            id
          );
          return updateResult;
          break;

        case "delete":
          const deleteResult = await deleteNetsuiteV1Api(
            credentials,
            values,
            recordType,
            recordTypeLabel,
            mappedFields,
            userId,
            integrationId,
            mappedRecordId,
            range,
            UrlValue,
            accessToken,
            id
          );
          return deleteResult;
          break;

        default:
          console.log("operationType not matched");
          throw error;
          break;
      }
    } else {
      console.log("fields not mapped");
      throw error;
    }
  } catch (error) {
    console.log("getMappedFields error", error.response.data);
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

// // add data in netsuite
const addNetsuiteV1Api = async (
  credentials,
  values,
  recordType,
  recordTypeLabel,
  mappedFields,
  userId,
  integrationId,
  mappedRecordId,
  id
) => {
  console.log("add record in ns");
  try {
    const headerRow = values[0];
    const dataRows = values.slice(1);

    const data = {
      resttype: "Add",
      recordtype: recordType,
      internalid: null,
    };

    const resultArray = [];

    dataRows.forEach((row) => {
      const obj = {};
      mappedFields.forEach((field) => {
        const columnIndex = headerRow.indexOf(field.destinationFieldValue);
        if (columnIndex !== -1) {
          obj[field.sourceFieldValue] = row[columnIndex];
        }
      });

      const result = { ...data, bodyfields: { ...obj } };
      resultArray.push(result);
    });

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
            mappedRecordId: mappedRecordId,
            recordType: recordTypeLabel,
            status: "error",
            internalid: item.bodyfields.internalid,
            message: res.data.add_error.message,
          });
        }
      } catch (error) {
        console.log("addNetsuiteV1Api error", error);
        // errorCount++;
        // logs.push({
        //   userId: userId,
        //   scheduleId: id,
        //   integrationId: integrationId,
        //   mappedRecordId: mappedRecordId,
        //   recordType: recordTypeLabel,
        //   status: "error",
        //   internalid: item.bodyfields.internalid,
        //   message: error.response.data,
        // });
      }
    }

    const summaryMessage = `Successfully added ${successCount} records in NetSuite out of ${resultArray.length}`;
    logs.unshift({
      userId: userId,
      scheduleId: Number(id),
      integrationId: integrationId,
      mappedRecordId: mappedRecordId,
      recordType: recordTypeLabel,
      status: "success",
      message: summaryMessage,
    });

    addLogs(logs);
    console.log("added record logs => ", logs);
    return logs;
  } catch (error) {
    console.log("addNetsuiteV1Api error => ", error);
    throw error;
  }
};

// update data in netsuite
const updateNetsuiteV1Api = async (
  credentials,
  values,
  recordType,
  recordTypeLabel,
  mappedFields,
  userId,
  integrationId,
  mappedRecordId,
  range,
  UrlValue,
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
        mappedRecordId: Number(mappedRecordId),
      },
    });

    const sheetsData = await getSheetsDataByRange(
      userId,
      range,
      UrlValue,
      accessToken
    );

    await Promise.all(
      sheetsData.values.map(async (row) => {
        const internalId = row[0];
        const bodyfields = {};

        mappedFields.forEach((field) => {
          const columnIndex = values[0].indexOf(field.destinationFieldValue);
          if (columnIndex !== -1) {
            bodyfields[field.sourceFieldValue] = row[columnIndex];
          }
        });

        const result = {
          resttype: "Update",
          recordtype: recordType,
          bodyfields: bodyfields,
          filters: {
            bodyfilters: [
              [
                filterData[0].sourceFieldValue,
                filterData[0].operator,
                internalId,
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
              mappedRecordId: mappedRecordId,
              recordType: recordTypeLabel,
              status: "error",
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
    logs.unshift({
      userId: userId,
      scheduleId: Number(id),
      integrationId: integrationId,
      mappedRecordId: mappedRecordId,
      recordType: recordTypeLabel,
      status: "success",
      message: summaryMessage,
    });

    addLogs(logs);
    console.log("updated record logs => ", logs);
    return logs;
  } catch (error) {
    console.log("Please add filter to update the record");
    console.log("updateNetsuiteV1Api error => ", error);
    return error;
  }
};

const getSheetsDataByRange = async (userId, range, UrlValue, accessToken) => {
  try {
    console.log(userId, range, UrlValue, accessToken);

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${UrlValue}/values/${range}`;
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
        console.log("getSheetsDataByRange error =>", error);
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
  recordType,
  recordTypeLabel,
  mappedFields,
  userId,
  integrationId,
  mappedRecordId,
  range,
  UrlValue,
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
        mappedRecordId: Number(mappedRecordId),
      },
    });

    const sheetsData = await getSheetsDataByRange(
      userId,
      range,
      UrlValue,
      accessToken
    );

    await Promise.all(
      sheetsData.values.map(async (row) => {
        const fieldValue = row[0];
        const filter = [
          filterData[0].sourceFieldValue,
          filterData[0].operator,
          fieldValue,
        ];

        const deleteRecord = {
          resttype: "Delete",
          recordtype: recordType,
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

          console.log("output =>", res);

          if (res.data[0].delete_success) {
            deleteCount++;
          } else if (res.data[0].delete_error) {
            errorCount++;
            logs.push({
              userId: userId,
              scheduleId: id,
              integrationId: integrationId,
              mappedRecordId: mappedRecordId,
              recordType: recordTypeLabel,
              status: "error",
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
    logs.unshift({
      userId: userId,
      scheduleId: Number(id),
      integrationId: integrationId,
      mappedRecordId: mappedRecordId,
      recordType: recordTypeLabel,
      status: "success",
      message: summaryMessage,
    });
    addLogs(logs);
    console.log("deleted record logs => ", logs);
  } catch (error) {
    console.log("Please add filter to delete record");
    console.log("deleteNetsuiteV1Api error => ", error);
    return error;
  }
};

const deleteV1Api = async (url, oAuth_String, deleteRecord) => {
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
    return res;
  } catch (error) {
    console.log("addNetsuiteV1Api error", error.response.data);
    throw error;
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
  id
) => {
  try {
    switch (operationType) {
      case "add":
        const addRecordResult = addGoogleSheetRecords(
          accessToken,
          mappedRecord,
          credentials,
          userId,
          mappedRecordId,
          integrationId,
          id
        );
        return addRecordResult;

      case "update":
        const updateRecordResult = addGoogleSheetRecords(
          accessToken,
          mappedRecord,
          credentials,
          userId,
          mappedRecordId,
          integrationId,
          id
        );
        return updateRecordResult;
      // const updateRecordResult = updateGoogleSheetRecord(
      //   accessToken,
      //   mappedRecord,
      //   credentials,
      //   userId,
      //   mappedRecordId
      // );
      // return updateRecordResult;

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
  id
) => {
  const logs = [];
  try {
    console.log("add or update record in google sheet");

    const result = await getNetsuiteData(
      userId,
      mappedRecordId,
      credentials,
      mappedRecord[0].recordTypeValue
    );

    const records = result.list.map((record) => {
      const values = record.values;
      const modifiedValues = {};
      for (const key in values) {
        if (Array.isArray(values[key])) {
          modifiedValues[key] = values[key][0].text;
        } else {
          modifiedValues[key] = values[key];
        }
      }
      return modifiedValues;
    });
    const recordValues = records.map((record) => Object.values(record));

    const recordList = {
      range: `${mappedRecord[0].UrlLabel}!A2:ZZ100000`,
      majorDimension: "ROWS",
      values: recordValues,
    };

    const urlParams = {
      includeValuesInResponse: true,
      responseDateTimeRenderOption: "SERIAL_NUMBER",
      responseValueRenderOption: "FORMATTED_VALUE",
      valueInputOption: "USER_ENTERED",
    };

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${mappedRecord[0].UrlValue}/values/${mappedRecord[0].UrlLabel}!A2:ZZ100000?includeValuesInResponse=${urlParams.includeValuesInResponse}&responseDateTimeRenderOption=${urlParams.responseDateTimeRenderOption}&responseValueRenderOption=${urlParams.responseValueRenderOption}&valueInputOption=${urlParams.valueInputOption}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      const request = await axios({
        method: "PUT",
        url: url,
        headers: headers,
        data: recordList,
      });
      console.log("output =>", request.data);
      const summaryMessage = `Successfully added ${request.data.updatedRows} records in Google Sheet out of ${recordValues.length}`;
      logs.push({
        userId: userId,
        scheduleId: Number(id),
        integrationId: integrationId,
        mappedRecordId: mappedRecordId,
        recordType: mappedRecord[0].recordTypeLabel,
        status: "success",
        message: summaryMessage,
      });
    } catch (error) {
      console.log("addGoogleSheetRecords error", error);
      return error;
    }

    addLogs(logs);
    console.log("added GS record logs => ", logs);
  } catch (error) {
    console.log("addGoogleSheetRecords error=> ", error);
    return error;
  }
};

const getNetsuiteData = async (
  userId,
  mappedRecordId,
  credentials,
  recordType
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
      recordtype: recordType,
      columns: columns,
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
      .then((res) => {
        // console.log("res.data", res.data)
        return res.data;
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

// const updateGoogleSheetRecord = async (
//   accessToken,
//   mappedRecord,
//   credentials,
//   userId,
//   mappedRecordId
// ) => {
//   console.log("update record in google sheet");
// };

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
      mappedRecord[0].recordTypeValue
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

    // *** gs data
    const gsIds = [];
    const sheetsValue = getSheetsData(
      mappedRecord[0].UrlValue,
      userId,
      accessToken
    );
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

        const filterIdsWithIndex = gsIds.reduce((acc, element, index) => {
          if (!filterValues.includes(element)) {
            acc.push({
              value: element,
              startIndex: index + 1,
              endIndex: index + 2,
            });
          }
          return acc;
        }, []);

        const deletePromises = filterIdsWithIndex.map(async (item) => {
          const url = `https://sheets.googleapis.com/v4/spreadsheets/${mappedRecord[0].UrlValue}:batchUpdate`;
          const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          };

          const data = {
            requests: [
              {
                deleteDimension: {
                  range: {
                    sheetId: 0,
                    dimension: "ROWS",
                    startIndex: item.startIndex,
                    endIndex: item.endIndex,
                  },
                },
              },
            ],
          };

          try {
            const result = await axios({
              method: "POST",
              url: url,
              headers: headers,
              data: data,
            });

            console.log("output => ", result.data);
            deleteCount++;
          } catch (error) {
            console.log("deleteGoogleSheetRecord error", error);
          }
        });
        await Promise.all(deletePromises);

        const summaryMessage = `Successfully deleted ${deleteCount} records from Google Sheet out of ${filterIdsWithIndex.length}`;
        logs.push({
          userId: userId,
          scheduleId: Number(id),
          integrationId: integrationId,
          mappedRecordId: mappedRecordId,
          recordType: mappedRecord[0].recordTypeLabel,
          status: "success",
          message: summaryMessage,
        });
        addLogs(logs);
        console.log("deleted GS record logs => ", logs);
      })
      .catch((error) => {
        console.log("deleteGoogleSheetRecord error => ", error);
      });
  } catch (error) {
    console.log("deleteGoogleSheetRecord error ==> ", error)
    return error;
  }
};

const deleteRecord = async (
  userId,
  sheetsId,
  startIndex,
  endIndex,
  accessToken
) => {
  console.log(accessToken);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}:batchUpdate`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  const data = {
    requests: [
      {
        deleteDimension: {
          range: {
            sheetId: 0,
            dimension: "ROWS",
            startIndex: startIndex,
            endIndex: endIndex,
          },
        },
      },
    ],
  };

  await axios({
    method: "POST",
    url: url,
    headers: headers,
    data: data,
  })
    .then((values) => {
      console.log("deleteGoogleSheetRecord", values.data);
      return values.data;
    })
    .catch((error) => {
      console.log("deleteGoogleSheetRecord error", error);
      return error;
    });
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
  syncData,
  getNetsuiteFiledsByRecordId,
  getFields,
  getLogs,
};
