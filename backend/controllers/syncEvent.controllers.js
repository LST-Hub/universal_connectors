const prisma = require("../lib/prisma");
const response = require("../lib/response");
// const schedule = require("node-schedule");
const crypto = require("crypto");
const axios = require("axios");
// const cron = require("node-cron");

const syncEvent = async (req, res) => {
  try {
    const eventIds = req.body;
    const result = []

    const promises = eventIds.map(async (ids) => {
      // console.log("event id", ids);
      const scheduleData = await prisma.schedule.findMany({
        where: {
          userId: Number(ids.userId),
          id: Number(ids.id),
          integrationId: Number(ids.integrationId),
          mappedRecordId: Number(ids.mappedRecordId),
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

      const accessToken = await getAccessTokenByUserId(ids.userId);

      const resultItem = await syncData(
        ids.userId,
        ids.mappedRecordId,
        ids.integrationId,
        scheduleData[0].operationType,
        scheduleData[0].source,
        scheduleData[0].range,
        ids.id,
        accessToken
      );
      result.push(resultItem);
    })

    await Promise.all(promises);
    console.log("final result", result)
    const allPromisesResolved = result.every((resultItem) => resultItem.success);

    // response({
    //   res,
    //   success: allPromisesResolved,
    //   status_code: 200,
    //   data: result,
    //   message: allPromisesResolved ? "success" : "Some promises failed",
    // });

    response({
      res,
      success: true,
      status_code: 200,
      data: result,
      message: "success"
    });
    return;
  } catch (error) {
    console.log("syncEvent error", error);
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in sync event",
    });
    // throw error;
    return;
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

        case "Google Sheet":
          const gsResult = await googleSheetsOperations(
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
      return {
        success: false,
        error: "Error: mapped record status is false."
      }
    }
  } catch (error) {
    console.log("syncData error", error);
    return {
      success: false,
      error: "Error for syncing events."
    }
    // return error;
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
      });
      return response.data.access_token;
    } catch (error) {
      console.log("getAccessTokenByUserId error", error);
      // ***invalid_grant
        // return error;
        return {
          success: false,
          error: "invalid_grant type error."
        }
    }
  } catch (error) {
    console.log("getAccessTokenByUserId error=>", error);
    // ***invalid_grant
    // return error;
    return {
      success: false,
      error: "Error while fetching access token."
    }
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
    const sheetsValue = await getSheetsData(mappedRecord, userId, accessToken);
   
        // const result = await getMappedFields(
        //   credentials,
        //   sheetsValue.data.values,
        //   mappedRecord,
        //   userId,
        //   operationType,
        //   integrationId,
        //   range,
        //   id,
        //   accessToken
        // );
        // return result;
        const values = sheetsValue.data.values;

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
                  id,
                  range,
                  accessToken,
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
            // throw error;
            return {
              success: false,
              error: "Fields not mapped"
            }
          }

  } catch (error) {
    console.log("netsuiteOperations error==>", error);
    // return error;
    return {
      success: false,
      error: "Error for NetSuite operations."
    }
  }
};

const getSheetsData = async (mappedRecord, userId, accessToken) => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${mappedRecord[0].workBookValue}/values/${mappedRecord[0].sheetLabel}!A1:ZZ100000`;
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
      // throw error;
      return {
        success: false,
        error: "Sheets data not fetched."
      }
    }
  } catch (error) {
    console.log("getSheetsData error=>", error);
    // throw error;
    return {
      success: false,
      error: "Error while fetching sheets data."
    }
  }
};

// const getMappedFields = async (
//   credentials,
//   values,
//   mappedRecord,
//   userId,
//   operationType,
//   integrationId,
//   range,
//   id,
//   accessToken
// ) => {
//   try {
//     const mappedFields = await prisma.fields.findMany({
//       where: {
//         userId: Number(userId),
//         mappedRecordId: Number(mappedRecord[0].id),
//       },
//       select: {
//         id: true,
//         sourceFieldValue: true,
//         destinationFieldValue: true,
//       },
//     });

//     if (mappedFields.length > 0 && values.length > 1) {
//       switch (operationType) {
//         case "add":
//           const result = await addNetsuiteV1Api(
//             credentials,
//             values,
//             mappedRecord,
//             mappedFields,
//             userId,
//             integrationId,
//             id,
//             range,
//             accessToken,
//           );
//           return result;

//         case "update":
//           const updateResult = await updateNetsuiteV1Api(
//             credentials,
//             values,
//             mappedRecord,
//             mappedFields,
//             userId,
//             integrationId,
//             range,
//             accessToken,
//             id
//           );
//           return updateResult;

//         case "delete":
//           const deleteResult = await deleteNetsuiteV1Api(
//             credentials,
//             values,
//             mappedRecord,
//             mappedFields,
//             userId,
//             integrationId,
//             range,
//             accessToken,
//             id
//           );
//           return deleteResult;

//         default:
//           console.log("operationType not matched");
//           throw error;
//       }
//     } else {
//       console.log("fields not mapped");
//       throw error;
//     }
//   } catch (error) {
//     console.log("getMappedFields error", error);
//     throw error;
//   }
// };

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
  id,
  range,
  accessToken,
) => {
  console.log("add record in ns");
  try {
    const headerRow = values[0];

    const sheetsData = await getSheetsDataByRange(
      userId,
      range,
      mappedRecord,
      accessToken
    );
    const dataRows = sheetsData.values;

    const resultArray = [];

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
          resttype:  "Add",
          recordtype: mappedRecord[0].recordTypeValue,
          bodyfields: record.bodyfields,
        });
      }
    }

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

        // console.log("output => ", res.data);

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
        console.log("addNetsuiteV1Api error", error.response.data);
        return {
          success: false,
          error: "Error while adding data in NetSuite."
        }
      }
    }

    const summaryMessage = `Successfully added ${successCount} records in NetSuite out of ${resultArray.length}`;
    if(successCount > 0){
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

    const response = {
      success: true,
      data: {
        successCount,
        errorCount,
        logs,
      },
    };
    // addLogs(logs);
    return response;

  } catch (error) {
    console.log("addNetsuiteV1Api error => ", error);
    return {
      success: false,
      error: "Error for add records in NetSuite."
    }
  }
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

          // console.log("output => ", res.data);

          if (res.data[0].update_success) {
            updatedCount++;
          } else if (res.data[0].update_error) {
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
          // throw error;
          return {
            success: false,
            error: "Error while updating NetSuite data."
          }
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

    const response = {
      success: true,
      data: {
        updatedCount,
        errorCount,
        logs,
      },
    };
    // addLogs(logs);
    return response;

  } catch (error) {
    console.log("Please add filter to update the record");
    console.log("updateNetsuiteV1Api error => ", error);
    return {
      success: false,
      error: "Error for update records in Netsuite."
    }
  }
};

const getSheetsDataByRange = async (
  userId,
  range,
  mappedRecord,
  accessToken
) => {
  try {

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
        return values.data;
      })
      .catch((error) => {
        console.log("getSheetsDataByRange error =>", error.response.data);
        // return error;
        return {
          success: false,
          error: "Error for fetching sheets data."
        }
      });
  } catch (error) {
    console.log("getSheetsDataByRange error", error);
    // throw error;
    return {
      success: false,
      error: "Error while fetching sheets data using range."
    }
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
    
    const sheetHeader = sheetsValue.data.values[0].indexOf(
      filterData[0].destinationFieldLabel
    );
    await Promise.all(
      sheetsData.values.map(async (row) => {
        
        const fieldValue = row[sheetHeader];
        const filter = [
          filterData[0].sourceFieldValue,
          filterData[0].operator,
          fieldValue,
        ];

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
          // return error;
          return {
            success: false,
            error: "Error while deleting records from NetSuite."
          }
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

    const response = {
      success: true,
      data: {
        deleteCount,
        errorCount,
        logs,
      },
    };
    // addLogs(logs);
    return response;

  } catch (error) {
    console.log("Please add filter to delete record");
    console.log("deleteNetsuiteV1Api error => ", error);
    return {
      success: false,
      error: "Error for delete recordes from NetSuite."
    } 
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
          const addRecordResult = await addGoogleSheetRecords(
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
          const updateRecordResult = await updateGoogleSheetRecord(
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
          const deleteRecordResult = await deleteGoogleSheetRecord(
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
          return deleteRecordResult;

        default:
      }
    }
  } catch (error) {
    console.log("googleSheetsOperations error", error);
    // return error;
    return {
      success: false,
      error: "Error while performing operations with Google Sheet."
    }
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

    const result = await getNetsuiteDataForAllFields(
      userId,
      mappedRecordId,
      credentials,
      mappedRecord
    );

    const titles = mappedFields.map((field) => field.destinationFieldValue);
  
    const records = result.list.map((record) => {
      const values = record.values;
      const modifiedValues = {};
      for (const key in values) {
       
        if (Array.isArray(values[key])) {
          
          modifiedValues[key] =
            values[key].length > 0 ? values[key][0].text : "";
        } else {
          modifiedValues[key] = values[key];
        }
      }
      return modifiedValues;
    });
    const recordValues = records.map((record) => Object.values(record));

    const recordList = {
      range: `${mappedRecord[0].sheetLabel}`,
      majorDimension: "ROWS",
      values: [titles, ...recordValues],
    };

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
      });

      const appendFieldsResult = await appendFields(
            userId,
            mappedRecordId,
            integrationId,
            mappedRecord,
            accessToken,
            recordList,
            recordValues.length,
            id
          );

          return appendFieldsResult;

    } catch (error) {
      console.log("addGoogleSheetRecords error => ", error);
      return {
        success: false,
        error: "Error while adding records in Google Sheets."
      }
    }
  } catch (error) {
    console.log("addGoogleSheetRecords error=> ", error.response.data);
    // return error;
    return {
      success: false,
      error: "Error for add records in Google Sheet."
    }
  }
};

// const getNetsuiteData = async (
//   userId,
//   mappedRecordId,
//   credentials,
//   mappedRecord
// ) => {
//   try {
//     const mappedFields = await prisma.fields.findMany({
//       where: {
//         userId: Number(userId),
//         mappedRecordId: Number(mappedRecordId),
//       },
//       select: {
//         id: true,
//         sourceFieldValue: true,
//         destinationFieldValue: true,
//       },
//     });

//     const columns = mappedFields.map((field) => field.sourceFieldValue);
    
//     const data = {
//       resttype: "Search",
//       recordtype: mappedRecord[0].recordTypeValue,
//       columns: columns,
//     };

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

//     return axios({
//       method: "POST",
//       url: url,
//       headers: {
//         Authorization: oAuth_String,
//         "Content-Type": "application/json",
//       },
//       data: data,
//     })
//       .then((res) => {
//         return res.data;
//       })
//       .catch((error) => {
//         console.log("getNetsuiteData error", error);
//         // throw error;
//         return {
//           success: false,
//           error: "Error to fetch NetSuite data."
//         }
//       });
//   } catch (error) {
//     console.log("getNetsuiteData error => ", error);
//     // return error;
//     return {
//       success: false,
//       error: "Error while fetching data from NetSuite."
//     }
//   }
// };

const getNetsuiteDataForAllFields = async(
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

    const columns = [];
    mappedFields.map((field) =>{
      const fieldId =  field.sourceFieldValue
      if(fieldId.includes("__")){
        const [parentId, childId] = fieldId.split("__")
        columns.push(childId)
      } else {
        columns.push(fieldId)
      }
    });
    const data = {
      resttype: "Search",
      recordtype: mappedRecord[0].recordTypeValue,
    //   filters: [
    //     [
    //         "mainline",
    //         "is",
    //         "F"
    //     ], "AND", 
    //     // [
    //     //   "shippingline", "is", "F"
    //     // ], "AND", 
    //     ["taxline", "is", "F"], "AND",
    //     ["cogs", "is", "F"]
    // ],
      columns: columns,
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
        return res.data;
      })
      .catch((error) => {
        console.log("getNetsuiteDataForAllFields error", error);
        // throw error;
        return {
          success: false,
          error: "Error while fetching data."
        }
      });
  } catch (error) {
    console.log("getNetsuiteDataForAllFields error => ", error);
    // return error;
    return {
      success: false,
      error: "Error while fetching data."
    }
  }
}

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

      const summaryMessage = `Successfully added ${request.data.updates.updatedRows - 1} records in Google Sheet out of ${count}`;
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

      const response = {
        success: true,
        data: request.data,
      };
      // addLogs(logs);
      return response;
      
    } catch (error) {
      console.log("addGoogleSheetRecords error", error.response.data);
      return {
        success: false,
        error: "Error for add records in Google Sheet."
      }
    }

  } catch (error) {
    console.log("appendFields error => ", error);
    return {
      success: false,
      error: "Error while append data in google sheet."
    }
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
      // throw error;
      return {
        success: false,
        error: "Error for updating records in Google sheet."
      }
    }
  })
    );

    const addFieldsResult = await addFields(accessToken, mappedRecord, range, results, userId, id, integrationId, mappedRecordId, existingRecords);
    return addFieldsResult;

  } catch (error) {
    console.log("updateGoogleSheetRecords error=> ", error);
    // return error;
    return {
      success: false,
      error: "Error for update records in Google Sheet.",
    };
  }
};

const addFields = async (accessToken, mappedRecord, range, result, userId, id, integrationId, mappedRecordId, existingRecords) => {
  const logs = [];
  let recordCount = 0;
  const records = []
  const recordValues = []

 result.map((record, index) => {
   if(record.list.length > 0) {
      recordCount++
      const values = record.list[0].values;
      const modifiedValues = {};

      for (const key in values) {
        if (Array.isArray(values[key])) {
          modifiedValues[key] =
            values[key].length > 0 ? values[key][0].text : "";
        } else {
          modifiedValues[key] = values[key];
        }
      }
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

        recordValues.push(existingRecords[index])
    }
  });

    if(recordCount > 0){

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

  try {
    const request = await axios({
      method: "PUT",
      url: url,
      headers: headers,
      data: recordList,
    });

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

      const response = {
        success: true,
        data: request.data,
      };
      // addLogs(logs);
      return response;

  } catch (error) {
    console.log("updateGoogleSheetRecords error", error);
    return {
      success: false,
      error: "Error for update records in Google Sheet.",
    };
  }
    }
}

const deleteGoogleSheetRecord = async (
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
  let deleteCount = 0;

  try {
    console.log("delete record from google sheet");

    const filterData = await prisma.customFilterFields.findMany({
      where: {
        userId: Number(userId),
        integrationId: Number(integrationId),
        mappedRecordId: Number(mappedRecordId),
      },
    });

    const filterCondition = filterData[0].sourceFieldValue

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
    // console.log("sheetsData by range", sheetsData)

    const sheetsValue = await getSheetsData(mappedRecord, userId, accessToken);
    const fieldIndex = sheetsValue.data.values[0].indexOf(
      filterData[0].destinationFieldLabel
    );
    // console.log("fieldIndex", fieldIndex)

    const deleteFields = []
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

      if(res.data.total === 0){
      //   Object.entries(res.data.list[0].values).map(([key, value]) => {
      //     if(key === filterCondition) {
      //       deleteFields.push(value)  
      //     }
      //  })
      deleteFields.push(row[fieldIndex])
      }   
    } catch (error) {
      console.log("deleteGoogleSheetRecord error", error.response.data);
      // throw error;
      return {
        success: false,
        error: "Error for delete records from Google sheet."
      }
    }
  })
  );
  // console.log("deleteFields", deleteFields)
  const deleteRecordResponse = await deleterecord(userId, id, integrationId, mappedRecordId, mappedRecord, accessToken, deleteFields, fieldIndex, filterCondition);
  // console.log("deleteRecordResponse", deleteRecordResponse)
  return deleteRecordResponse;

  } catch (error) {
    console.log("deleteGoogleSheetRecord error=> ", error.response.data);
    deleteCount++;
    // return error;
    return {
      success: false,
      error: "Error for delete records from Google sheet."
    }
  }

  // const response = {
  //     success: true,
  //     data: {
  //       deleteRecordResponse[0],
  //       deleteRecordResponse[1] + deleteCount,
  //       deleteRecordResponse[2],
  //     },
  //   };
  //   return response;
};

const deleterecord = async (userId, id, integrationId, mappedRecordId, mappedRecord, accessToken, deleteFields, fieldIndex, filterCondition) => {
  try {
    const logs = [];
    let deleteCount = 0;
    let count = 0;
    let errorCount = 0;

    await Promise.all(
      deleteFields.map(async (field) => {
        let sheetsValue = await getSheetsData(mappedRecord, userId, accessToken);
        await Promise.all(
          sheetsValue.data.values.map(async (row, i) => {
            if (row[fieldIndex] === field) {
              // console.log("row to delete", row)
              count++;

              const url = `https://sheets.googleapis.com/v4/spreadsheets/${mappedRecord[0].workBookValue}:batchUpdate`;

              const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              };

              // console.log("start", i, "end", i+1)

              const data = {
                requests: [
                  {
                    deleteDimension: {
                      range: {
                        sheetId: mappedRecord[0].sheetValue,
                        dimension: "ROWS",
                        startIndex: i,
                        endIndex: i + 1,
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
                // console.log("start", i, "end", i+1)
              } catch (error) {
                errorCount++;
                console.log("deleterecord error", error);
              }
              sheetsValue = await getSheetsData(mappedRecord, userId, accessToken);
            }
          })
        );
      })
    );

    const summaryMessage = `Successfully deleted ${deleteCount} records from Google Sheet out of ${count}`;
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

    const response = {
      success: true,
      data: {
        deleteCount,
        errorCount,
        logs,
      },
    };
  //  const response = [deleteCount, errorCount, logs]
    // addLogs(logs);
    return response;

  } catch (error) {
    console.log("deleterecord error =>", error);
    return {
      success: false,
      error: "Error for delete records from Google Sheet.",
    };
  }
};

// const recordField = async (credentials, mappedRecord) => {
//   try {
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

//     const data = {
//       resttype: "ListOfRecordField",
//       recordtype: mappedRecord[0].recordTypeValue,
//     };

//     const payload = JSON.stringify(data);
//     const headers = {
//       "Content-Type": "application/json",
//       Authorization: oAuth_String,
//     };

//     const res = await axios({
//       method: "POST",
//       url: url,
//       headers: headers,
//       data: payload,
//     });
//     return res.data;
//   } catch (error) {
//     console.log("recordField error => ", error);
//     return error;
//   }
// };

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
    // console.log("logResult", result);

    return result;
  } catch (error) {
    console.log("logs error", error);
    return error;
  }
};

// const getScheduleEvent = async (
//   userId,
//   eventId,
//   integrationId,
//   mappedRecordId
// ) => {
//   try {
//     const eventData = await prisma.schedule.findMany({
//       where: {
//         userId: Number(userId),
//         id: Number(eventId),
//         integrationId: Number(integrationId),
//         mappedRecordId: Number(mappedRecordId),
//       },
//       select: {
//         eventType: true,
//         startDate: true,
//         endDate: true,
//         startTime: true,
//         day: true,
//         noEndDate: true,
//         repeatEveryDay: true,
//       },
//     });

//     return eventData;
//   } catch (error) {
//     console.log("getScheduleEvent error", error);
//     return error;
//   }
// };

module.exports = {
  syncEvent,
  // getAccessTokenByUserId,
};