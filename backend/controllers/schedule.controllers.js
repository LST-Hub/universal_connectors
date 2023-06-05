const prisma = require("../lib/prisma");
const response = require("../lib/response");
const schedule = require("node-schedule");
const crypto = require("crypto");
const axios = require("axios");
const CryptoJS = require("crypto-js");
// const https = require("https");

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
    // savedSearchType,
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
          endDate: endDate,
          noEndDate: noEndDate,
          performType: performType,
          // savedSearchType: savedSearchType,
          savedSearchLabel: savedSearchLabel,
          savedSearchValue: savedSearchValue,
          operationType: operationType,
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
    // savedSearchType,
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
          // savedSearchType: savedSearchType,
          savedSearchLabel: savedSearchLabel,
          savedSearchValue: savedSearchValue,
          operationType: operationType,
          // creationDate: new Date(),
          // modificationDate: new Date(),
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
    // savedSearchType,
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
          // savedSearchType: savedSearchType,
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
        // savedSearchType: true,
        savedSearchLabel: true,
        savedSearchValue: true,
        operationType: true,
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
    // savedSearchType,
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
        endDate: endDate,
        noEndDate: noEndDate,
        performType: performType,
        // savedSearchType: savedSearchType,
        savedSearchLabel: savedSearchLabel,
        savedSearchValue: savedSearchValue,
        // modificationDate: new Date(),
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
    // savedSearchType,
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
        // savedSearchType: savedSearchType,
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
    // savedSearchType,
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
        // savedSearchType: savedSearchType,
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
        // creationDate: new Date(),
        // modificationDate: new Date(),
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
  // const { userId } = req.params.id;
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
    fieldType,
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
        fieldType: fieldType,
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
    // console.log(req.query)
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
  // console.log(id, integrationId)

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
    // console.log(mappedRecordData)
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

const addNetsuiteFields = async (req, res) => {
  const { userId, mappedRecordId, integrationId, operationType } = req.body;
  console.log(operationType, userId, mappedRecordId, integrationId);
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
          MappedRecordName: true,
          recordTypeValue: true,
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
          // id: true,
          accountId: true,
          consumerKey: true,
          consumerSecretKey: true,
          accessToken: true,
          accessSecretToken: true,
        },
      }),
    ]);

    // console.log("mappedRecord", mappedRecord);
    // console.log("credentials", credentials);
    const sheetsValue = getSheetsData(mappedRecord[0].UrlValue, userId);
    sheetsValue
      .then((values) => {
        const result = getMappedFields(
          credentials,
          values.data.values,
          mappedRecord[0].recordTypeValue,
          mappedRecord[0].id,
          userId,
          operationType,
          integrationId
        );

        result
          .then((data) => {
            response({
              res,
              success: true,
              status_code: 200,
              data: [data],
              message: "Netsuite fields added successfully",
            });
            return;
          })
          .catch((error) => {
            // console.log("addNetsuiteFields error", error.response.data);
            response({
              res,
              success: false,
              status_code: 400,
              message: "Error in adding Netsuite fields",
            });
          });
      })
      .catch((error) => {
        // console.log("addNetsuiteFields error==>", error.data);
        response({
          res,
          success: false,
          status_code: 400,
          message: "Error in fetching sheets record",
        });
      });
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error while fetching mapped record",
    });
    console.log("First error", error);
  }
};

const getSheetsData = async (sheetsId, userId) => {
  try {
    const accessToken = await getAccessTokenByUserId(userId);
    // console.log("accessToken", accessToken);

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
      console.log("getSheetsData error=>", error);
      throw error;
    }
  } catch (error) {
    console.log("getSheetsData error", error);

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
  mappedRecordId,
  userId,
  operationType,
  integrationId
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
            mappedFields
          );
          return result;
          break;

        case "update":
          const updateResult = await updateNetsuiteV1Api(
            credentials,
            values,
            recordType,
            mappedFields
          );
          return updateResult;
          break;

        case "delete":
          const deleteResult = await deleteNetsuiteV1Api(
            credentials,
            values,
            recordType,
            mappedFields,
            userId,
            integrationId,
            mappedRecordId
          );
          return deleteResult;
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

// add data in netsuite
const addNetsuiteV1Api = async (
  credentials,
  values,
  recordType,
  mappedFields
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

    const result = dataRows.map((row) => {
      const obj = {};
      mappedFields.forEach((field) => {
        const columnIndex = headerRow.indexOf(field.destinationFieldValue);
        if (columnIndex !== -1) {
          obj[field.sourceFieldValue] = row[columnIndex];
        }
      });

      return { ...data, bodyfields: { ...obj } };
    });

    console.log(result);
    // return result;
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

    //   async function executeRequests() {
    //     const responses = [];
    //     for (const item of result) {
    //       try {
    //         const response = await axios({
    //           method: "POST",
    //           url: url,
    //           headers: {
    //             Authorization: oAuth_String,
    //             "Content-Type": "application/json",
    //           },
    //           data: item,
    //         });
    //         responses.push(response.data);
    //       } catch (error) {
    //         console.log("************Error:", error.response.data);
    //       }
    //     }
    //     return responses;
    //   }

    //   executeRequests()
    // .then((responses) => {
    //   console.log("All Responses:", responses);
    // })
    // .catch((error) => {
    //   console.log("Error:", error);
    // });

    // ***
    const requests = [];
    for (const item of result) {
      const request = axios({
        method: "POST",
        url: url,
        headers: {
          Authorization: oAuth_String,
          "Content-Type": "application/json",
        },
        data: item,
      })
        .then((res) => {
          console.log("res=>", res.data);
        })
        .catch((error) => {
          console.log("*******error", error.response.data);
        });
      // requests.push(request);
    }

    // Promise.all(requests)
    //   .then((responses) => {
    //     const res = responses.map((response) => response.data);
    //     console.log("res =>", res);
    //     return res;
    //   })
    //   .catch((error) => {
    //     console.log("addNetsuiteV1Api error =>");
    //     // throw error; // propagate the error further if needed
    //   });
  } catch (error) {
    console.log("addNetsuiteV1Api error");
    // throw error;
  }
};

// update data in netsuite
const updateNetsuiteV1Api = async (credentials, values, recordType) => {
  console.log("update record in ns");
};

// delete data from netsuite
const deleteNetsuiteV1Api = async (
  credentials,
  values,
  recordType,
  mappedFields,
  userId,
  integrationId,
  mappedRecordId
) => {
  console.log("delete record from ns");
  try {
    const filterFields = filterData(userId, integrationId, mappedRecordId);
    filterFields
      .then((res) => {
        console.log("res=>", res);
        const deleteRecord = {
          resttype: "Delete",
          recordtype: recordType,
          filters: {
            bodyfilters: [
              [
                `${res[0].sourceFieldValue}`,
                `${res[0].operator}`,
                `${res[0].destinationFieldValue}`,
              ],
            ],
          },
        };
        // console.log(deleteRecord);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log("error==>", error);
  }

  // try {
  // //   const data = {
  // //     resttype: "Delete",
  // //     recordtype: recordType,
  // //     filters: {
  // //       bodyfilters: [
  // //         ["internalid", "is", "1513"],
  // //         // "AND",
  // //         // ["name", "noneOf", "test position"]
  // //       ],
  // //     },
  // //   };

  //   const authentication = {
  //     account: credentials[0].accountId,
  //     consumerKey: credentials[0].consumerKey,
  //     consumerSecret: credentials[0].consumerSecretKey,
  //     tokenId: credentials[0].accessToken,
  //     tokenSecret: credentials[0].accessSecretToken,
  //     timestamp: Math.floor(Date.now() / 1000).toString(),
  //     nonce: getNonce(10),
  //     http_method: "POST",
  //     version: "1.0",
  //     scriptDeploymentId: "1",
  //     scriptId: "1529",
  //     signatureMethod: "HMAC-SHA256",
  //   };

  //   const base_url =
  //     "https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl";
  //   const concatenatedString = `deploy=${authentication.scriptDeploymentId}&oauth_consumer_key=${authentication.consumerKey}&oauth_nonce=${authentication.nonce}&oauth_signature_method=${authentication.signatureMethod}&oauth_timestamp=${authentication.timestamp}&oauth_token=${authentication.tokenId}&oauth_version=${authentication.version}&script=${authentication.scriptId}`;
  //   const baseString = `${authentication.http_method}&${encodeURIComponent(
  //     base_url
  //   )}&${encodeURIComponent(concatenatedString)}`;
  //   const keys = `${authentication.consumerSecret}&${authentication.tokenSecret}`;
  //   const signature = crypto
  //     .createHmac("sha256", keys)
  //     .update(baseString)
  //     .digest("base64");
  //   const oAuth_String = `OAuth realm="${
  //     authentication.account
  //   }", oauth_consumer_key="${authentication.consumerKey}", oauth_token="${
  //     authentication.tokenId
  //   }", oauth_nonce="${authentication.nonce}", oauth_timestamp="${
  //     authentication.timestamp
  //   }", oauth_signature_method="HMAC-SHA256", oauth_version="1.0", oauth_signature="${encodeURIComponent(
  //     signature
  //   )}"`;

  //   const url = `https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=${authentication.scriptId}&deploy=${authentication.scriptDeploymentId}`;

  //   // ***
  //   const requests = [];
  //   const request = axios({
  //     method: "POST",
  //     url: url,
  //     headers: {
  //       Authorization: oAuth_String,
  //       "Content-Type": "application/json",
  //     },
  //     data: deleteRecord,
  //   })
  //     .then((res) => {
  //       console.log("res=>", res.data);
  //       if (res.data[0].delete_error) {
  //         const resData = {
  //           success: false,
  //           status_code: 400,
  //           message: res.data[0].delete_error,
  //         };
  //         return resData;
  //         // throw error
  //       } else {
  //         const resData = {
  //           success: true,
  //           status_code: 200,
  //           data: res.data,
  //           message: "Record deleted successfully",
  //         };
  //         return resData;
  //       }
  //       // return res.data;
  //     })
  //     .catch((error) => {
  //       console.log("*******error", error.response.data);
  //       // return error.response.data;
  //       throw error;
  //     });
  //   // requests.push(request);
  //   return request;
  // } catch (error) {
  //   console.log("addNetsuiteV1Api error", error);
  //   // throw error;
  // }
};

const filterData = async (userId, integrationId, mappedRecordId) => {
  try {
    const filterData = await prisma.customFilterFields.findMany({
      where: {
        userId: Number(userId),
        mappedRecordId: Number(mappedRecordId),
        integrationId: Number(integrationId),
      },
    });
    return filterData;
  } catch (error) {
    console.log("error", error);
    return error;
  }
};

// const netsuiteV1Api = async (credentials, values) => {
//   try {
//     const { consumerKey, consumerSecretKey, accessToken, accessSecretToken } =
//       credentials[0];

//     try {
//       const authentication = {
//         consumerKey: consumerKey,
//         consumerSecret: consumerSecretKey,
//         tokenId: accessToken,
//         tokenSecret: accessSecretToken,
//         signatureMethod: "HMAC-SHA256",
//         version: "1.0",
//         realm: "TSTDRV1423092"
//       };

//       const url = `https://tstdrv1423092.suitetalk.api.netsuite.com/services/rest/record/v1/customer/5271`;
//       const headers = {
//         "content-type": "application/json",
//       }

//       const result = await axios({
//         method: "POST",
//         url: url,
//         headers: headers,
//         auth: authentication,
//       });

//       console.log("result", result);

//     } catch (error) {
//       console.log("error=>", error);
//     }
//   } catch (error) {
//     console.log("Error=>", error);
//   }

//   // ***
//   //   const authentication = {
//   //     signature_method: "HMAC-SHA256",
//   //     consumer_key: consumerKey,
//   //     consumer_secret: consumerSecretKey,
//   //     accessToken: accessToken,
//   //     tokenSecret: accessSecretToken,
//   //     version: "1.0",
//   //     realm: "TSTDRV1423092",
//   //   }
//   // // const addRecordUrl = `https://tstdrv1423092.suitetalk.api.netsuite.com/services/rest/record/v1/${recordTypeValue}`;
//   // const url = `https://tstdrv1423092.suitetalk.api.netsuite.com/services/rest/record/v1/${recordTypeValue}/5271`;
//   // const headers = {
//   //   "Content-Type": "application/json",
//   // }
//   // // const body = {
//   // //   MappedRecordName: MappedRecordName,
//   // //   UrlLabel: UrlLabel,
//   // //   UrlValue: UrlValue,
//   // // }

//   // const result = await axios({
//   //   method: "GET",
//   //   url: url,
//   //   headers: headers,
//   //   // data: body,
//   //   oauth: authentication,
//   // });
//   // console.log("result", result);

//   // }catch(error){
//   //   console.log("error", error);
//   // }
// };

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

    // const result = getFields(credentials, mappedRecord[0].recordTypeValue);
    // result
    //   .then((values) => {
    //     // console.log("values=>", values.data);
    //     response({
    //       res,
    //       success: true,
    //       status_code: 200,
    //       data: [values.data],
    //       message: "Netsuite fields fetched successfully",
    //     })
    //     return;
    //   })
    //   .catch((error) => {
    //     // console.log(error);
    //     response({
    //       res,
    //       success: false,
    //       status_code: 400,
    //       message: "Error in fetching Netsuite fields",
    //     })
    //     return;
    //   });

    // console.log("mappedRecord", mappedRecord)
    // console.log("credentials", credentials)
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
  addNetsuiteFields,
  getNetsuiteFiledsByRecordId,
  getFields,
  // scheduleRealtimeEvent,
};
