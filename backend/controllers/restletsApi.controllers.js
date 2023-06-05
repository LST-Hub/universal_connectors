const response = require("../lib/response");
const crypto = require("crypto");
const axios = require("axios");

function getNonce(length) {
  const alphabet =
    "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return Array.from(crypto.randomFillSync(new Uint8Array(length)))
    .map((x) => alphabet[x % alphabet.length])
    .join("");
}

const getRecordTypes = async (req, res) => {
  try {
    const authentication = {
      account: req.query.accountId,
      consumerKey: req.query.consumerKey,
      consumerSecret: req.query.consumerSecretKey,
      tokenId: req.query.accessToken,
      tokenSecret: req.query.accessSecretToken,
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
      resttype: req.query.resttype,
      recordtype: req.query.recordtype,
      columns: req.query.columns,
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
        response({
          res,
          success: true,
          status_code: 200,
          data: [values.data],
          message: "Record types fetched successfully",
        });
        return;
      })
      .catch((error) => {
        if (error.response.status === 403) {
          response({
            res,
            success: false,
            status_code: 401,
            message: "Invalid credentials",
          });
          return;
        } else {
          response({
            res,
            success: false,
            status_code: 400,
            data: [],
            message: "Record types not fetched",
          });
          return;
        }
      });
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      data: [],
      message: " Error while fetching record types",
    });
    return;
  }
};

const getOptions = async (req, res) => {
  try {
    const authentication = {
      account: req.body.account,
      consumerKey: req.body.consumerKey,
      consumerSecret: req.body.consumerSecret,
      tokenId: req.body.tokenId,
      tokenSecret: req.body.tokenSecret,
      timestamp: Math.floor(Date.now() / 1000).toString(),
      nonce: getNonce(10),
      http_method: "POST",
      version: "1.0",
      scriptDeploymentId: req.body.scriptDeploymentId,
      scriptId: req.body.scriptId,
      signatureMethod: "HMAC-SHA256",
    };

    if (req.body.recordtype) {
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
        resttype: req.body.resttype,
        recordtype: req.body.recordtype,
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
          response({
            res,
            success: true,
            status_code: 200,
            data: [values.data],
            message: "Record types fetched successfully",
          });
        })
        .catch((error) => {
          response({
            res,
            success: false,
            status_code: 400,
            data: [],
            message: "Record types not fetched",
          });
          console.log("error", error);
        });
    } else {
      response({
        res,
        success: false,
        status_code: 400,
        data: [],
        message: "Send all the required parameters",
      });
    }
  } catch (error) {
    console.log("error==>", error);
    response({
      res,
      success: false,
      status_code: 400,
      data: [],
      message: " Error while fetching record types",
    });
  }
};

const authentication = async (req, res) => {
  try {
    const authentication = {
      account: req.body.accountId,
      consumerKey: req.body.consumerKey,
      consumerSecret: req.body.consumerSecretKey,
      tokenId: req.body.accessToken,
      tokenSecret: req.body.accessSecretToken,
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
      resttype: req.body.resttype,
      recordtype: req.body.recordtype,
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
        response({
          res,
          success: true,
          status_code: 200,
          data: [values.data],
          message: "Record types fetched successfully",
        });
        return;
      })
      .catch((error) => {
        if (error.response.status === 403) {
          response({
            res,
            success: false,
            status_code: 401,
            message: "Invalid credentials",
          });
          return;
        } else {
          response({
            res,
            success: false,
            status_code: 400,
            data: [],
            message: "Record types not fetched",
          });
          return;
        }
      });
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      data: [],
      message: " Error while fetching record types",
    });
    return;
  }
};

const getRedirectPage = async (req, res) => {
  try {
    const urlParams = {
      client_id:
        "350110252536-v0id00m9oaathq39hv7o8i1nmj584et1.apps.googleusercontent.com",
      scope:
        "https%3A//www.googleapis.com/auth/drive%20https%3A//www.googleapis.com/auth/drive.readonly%20https%3A//www.googleapis.com/auth/spreadsheets",
      access_type: "offline",
      prompt: "consent",
      include_granted_scopes: "true",
      response_type: "code",
      redirect_uri: process.env.REDIRECT_URI,
    };
    const url = `https://accounts.google.com/o/oauth2/auth?client_id=${urlParams.client_id}&scope=${urlParams.scope}&access_type=${urlParams.access_type}&prompt=${urlParams.prompt}&include_granted_scopes=${urlParams.include_granted_scopes}&response_type=${urlParams.response_type}&redirect_uri=${urlParams.redirect_uri}`;

    response({
      res,
      success: true,
      status_code: 200,
      data: [url],
      message: "Redirect url",
    });
    return;
  } catch {
    response({
      res,
      success: false,
      status_code: 400,
      data: [],
      message: "Error while fetching redirect url",
    });
    return;
  }
};

const addRefreshToken = async (req, res) => {
  try {
    const code = req.body.code;

    const url = "https://oauth2.googleapis.com/token";
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const payload = {
      code: code,
      client_id:
        "350110252536-v0id00m9oaathq39hv7o8i1nmj584et1.apps.googleusercontent.com",
      client_secret: "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",
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: "authorization_code",
    };

    await axios({
      method: "POST",
      url: url,
      headers: headers,
      data: payload,
    })
      .then((values) => {
        response({
          res,
          success: true,
          status_code: 200,
          data: [values.data],
          message: "Refresh token fetched successfully",
        });
        takeAction(req.body.userId, values.data.refresh_token);
      })
      .catch((error) => {
        response({
          res,
          success: false,
          status_code: 400,
          data: [],
          message: "Refresh token not fetched",
        });
        return;
      });
  } catch {
    response({
      res,
      success: false,
      status_code: 400,
      data: [],
      message: "Error while fetching refresh token",
    });
    return;
  }
};

const takeAction = async (userId, token) => {
  // const integrationID = Number(id);
  const userID = Number(userId);

  try {
    const getID = await prisma.credentials.findMany({
      where: {
        userId: userID,
      },
      select: {
        userId: true,
        // integrationID: true,
      },
    });

    if (getID.length > 0) {
      updateCredentials(userID, token);
    } else {
      addCredentials(userID, token);
    }
  } catch (error) {
    console.log("error", error);
  }
};

const addCredentials = async (user_id, refresh_token) => {
  const id = Number(user_id);

  try {
    const credentials = await prisma.credentials.create({
      data: {
        userId: id,
        refreshToken: refresh_token,
      },
    });
    if (credentials) {
      console.log("credentials added");
    } else {
      console.log("credentials not added");
    }
  } catch (error) {
    console.log("error", error);
  }
};

const updateCredentials = async (user_id, refresh_token) => {
  const id = Number(user_id);

  try {
    const credentials = await prisma.credentials.updateMany({
      where: {
        userId: id,
      },
      data: {
        refreshToken: refresh_token,
        modificationDate: new Date(),
      },
    });

    if (credentials) {
      console.log("credentials updated");
    } else {
      console.log("credentials not updated");
    }
  } catch (error) {
    console.log("error", error);
  }
};

const getAccessToken = async (req, res) => {
  const { id } = req.params;
  try {
    const token = await prisma.credentials.findMany({
      where: {
        userId: Number(id),
      },
    });

    if (token) {
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

      await axios({
        method: "POST",
        url: url,
        headers: headers,
      })
        .then((values) => {
          // console.log(values.data);
          response({
            res,
            success: true,
            status_code: 200,
            data: [values.data],
            message: "Access token fetched successfully",
          });
        })
        .catch((error) => {
          response({
            res,
            success: false,
            status_code: 400,
            data: [],
            message: "Access token not fetched",
          });
          return;
        });
    } else {
      response({
        res,
        success: false,
        status_code: 400,
        data: [],
        message: "No token found",
      });
      return;
    }
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      data: [],
      message: "Error while fetching access token",
    });
    return;
  }
};

const getFiles = async (req, res) => {
  const { accessToken } = req.query;

  const url = "https://www.googleapis.com/drive/v3/files";
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  try {
    await axios({
      method: "GET",
      url: url,
      headers: headers,
    })
      .then((values) => {
        response({
          res,
          success: true,
          status_code: 200,
          data: [values.data],
          message: "Files fetched successfully",
        });
      })
      .catch((error) => {
        response({
          res,
          success: false,
          status_code: 400,
          data: [],
          message: "Files not fetched",
        });
        return;
      });
  } catch {
    response({
      res,
      success: false,
      status_code: 400,
      data: [],
      message: "Error while fetching files",
    });
    return;
  }
};

const getSheetsData = async (req, res) => {
  const { sheetsId, accessToken } = req.query;
  // console.log("oo", req.query);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}/values/A1:ZZ100000`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  try {
    await axios({
      method: "GET",
      url: url,
      headers: headers,
    })
      .then((values) => {
        response({
          res,
          success: true,
          status_code: 200,
          data: [values.data],
          message: "Sheets data fetched successfully",
        });
      })
      .catch((error) => {
        response({
          res,
          success: false,
          status_code: 400,
          data: [],
          message: "Sheets data not fetched",
        });
        return;
      });
  } catch {
    response({
      res,
      success: false,
      status_code: 400,
      data: [],
      message: "Error while fetching sheets data",
    });
    return;
  }
};

const getcredentialDetailsById = async (req, res) => {
  try {
    const credentials = await prisma.credentials.findMany({
      where: {
        userId: Number(req.params.id),
      },
      select: {
        id: true,
        userId: true,
      },
    });
    if (credentials) {
      response({
        res,
        success: true,
        status_code: 200,
        data: credentials,
        message: "Credentials fetched successfully",
      });
      return;
    } else {
      response({
        res,
        success: false,
        status_code: 400,
        data: [],
        message: "Credentials not fetched",
      });
      return;
    }
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error while fetching credentials",
    });
  }
};

// const getSheetValuesById = async (sheetId, accessToken) => {
//   const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:ZZ100000`;
//   const headers = {
//     Authorization: `Bearer ${accessToken}`,
//   };
//   try {
//     await axios({
//       method: "GET",
//       url: url,
//       headers: headers,
//     })
//       .then((values) => {
//         return values.data;
//       })
//       .catch((error) => {
//         console.log("getSheetValuesById error==>", error);
//       });
//   } catch(error) {
//     console.log("getSheetValuesById Error ==>", error);
//   }
// };

const getAccessTokenByUserId = async (userId) => {
  try {
    const token = await prisma.credentials.findMany({
      where: {
        userId: Number(userId),
      },
    });

    if (token && token.length > 0) {
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

      const response = await axios({
        method: "POST",
        url: url,
        headers: headers,
      });

      return response.data.access_token;
    } else {
      console.log("getAccessTokenByUserId Error: Token not found");
      return null; // Return null or handle the case where the token is not found
    }
  } catch (error) {
    console.log("getAccessTokenByUserId Error:", error);
    return null; // Return null or handle the error accordingly
  }
};

const updateSheetValues = async (req, res) => {
  const { sheetsId, sheetsLabel, values } = req.body;

  const accessToken = await getAccessTokenByUserId(req.body.userId);
  // console.log("accessToken", accessToken);

  const sheetValues = [];
  let columnID;
  const allData = [];

  if (accessToken) {
    // *** get current sheet values
    const sheetValuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}/values/A2:ZZ100000`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    try {
      await axios({
        method: "GET",
        url: sheetValuesUrl,
        headers: headers,
      })
        .then((values) => {
          const range = values.data.range;
          const rangeArray = range.split("!");
          columnID = rangeArray[1].split(":")[0].split("");
          // response({
          //   res,
          //   success: true,
          //   status_code: 200,
          //   data: [values.data],
          //   message: "Sheets data fetched successfully",
          // });
          sheetValues.push(values.data.values);
        })
        .catch((error) => {
          // console.log("getSheetValues error==>", error);
          response({
            res,
            success: false,
            status_code: 400,
            data: [],
            message: "Sheets data not fetched",
          });
        });
    } catch (error) {
      // console.log("getSheetValues Error ==>", error);
      response({
        res,
        success: false,
        status_code: 400,
        data: [],
        message: "Error while fetching sheets data",
      });
    }

    const urlParams = {
      includeValuesInResponse: true,
      responseDateTimeRenderOption: "SERIAL_NUMBER",
      responseValueRenderOption: "FORMATTED_VALUE",
      valueInputOption: "USER_ENTERED",
    };

    // *** to update values

    // * "sheetValues" from google sheets
    for (const element of sheetValues[0]) {
      ++columnID[1];
      // * "values" from frontend
      for (const value of values) {
        if (element[0] === value[0]) {
          // console.log("updated value==>",columnID[0],columnID[1]-1, "=", value);
          const data = {
            majorDimension: "ROWS",
            range: `${sheetsLabel}!${columnID[0]}${columnID[1] - 1}`,
            values: [value],
          };
          const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}/values/${sheetsLabel}!${
            columnID[0]
          }${columnID[1] - 1}?includeValuesInResponse=${
            urlParams.includeValuesInResponse
          }&responseDateTimeRenderOption=${
            urlParams.responseDateTimeRenderOption
          }&responseValueRenderOption=${
            urlParams.responseValueRenderOption
          }&valueInputOption=${urlParams.valueInputOption}`;
          allData.push({
            url: url,
            data: data,
          });
        }
      }
    }

    // *** to add values
    for (const value of values) {
      const uniqueValue = sheetValues[0].find(
        (sheetValue) => sheetValue[0] === value[0]
      );
      if (!uniqueValue) {
        // console.log("updated value==>",columnID[0],columnID[1], "=", value);

        const data = {
          majorDimension: "ROWS",
          range: `${sheetsLabel}!${columnID[0]}${columnID[1]}`,
          values: [value],
        };
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}/values/${sheetsLabel}!${columnID[0]}${columnID[1]}?includeValuesInResponse=${urlParams.includeValuesInResponse}&responseDateTimeRenderOption=${urlParams.responseDateTimeRenderOption}&responseValueRenderOption=${urlParams.responseValueRenderOption}&valueInputOption=${urlParams.valueInputOption}`;
        allData.push({
          url: url,
          data: data,
        });

        ++columnID[1];
      }
    }

    // console.log("allData", allData);

    // *** added and updated data in google sheet using v4 api
    try {
      const promises = allData.map(async (data) => {
        try {
          const response = await axios({
            method: "PUT",
            url: data.url,
            headers: headers,
            data: data.data,
          });
          return response.data;
        } catch (error) {
          console.log("error =>", error);
          throw error;
        }
      });

      const results = await Promise.all(promises);

      response({
        res,
        success: true,
        status_code: 200,
        data: results,
        message: "Values added successfully",
      });
    } catch (error) {
      console.log("Error ==>", error);
      response({
        res,
        success: false,
        status_code: 400,
        data: [],
        message: "Error while adding values",
      });
    }
  } else {
    response({
      res,
      success: false,
      status_code: 400,
      data: [],
      message: "Access token not found",
    });
  }
};

const deleteSheetValue = async (req, res) => {
  const { sheetsId, sheetsLabel, value, userId } = req.body;

  const accessToken = await getAccessTokenByUserId(userId);
  let startId;
  let endId;

  if (accessToken) {
    try {
      // *** get current sheet values
      const sheetValuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}/values/A1:ZZ100000`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };

      await axios({
        method: "GET",
        url: sheetValuesUrl,
        headers: headers,
      })
        .then((values) => {
          const range = values.data.range;
          const rangeArray = range.split("!");
          startId = rangeArray[1].split(":")[0].split("");

          const data = values.data.values;
          const deleteRowRange = [];
          for (const element of data) {
            startId[1]++;
            if (element[0] === value) {
              // console.log(element, "match at", startId[0], startId[1] - 1);
              const length = element.length;
              endId = String.fromCharCode(64 + length);
              deleteRowRange.push({
                range: `${startId[0]}${startId[1] - 1}:${endId}${
                  startId[1] - 1
                }`,
                value: element,
              });
            }
          }

          // *** delete row from google sheet
          const deleteRowResult = deleteGoggleSheetRow(
            sheetsId,
            sheetsLabel,
            deleteRowRange,
            accessToken,
            startId
          );

          deleteRowResult
            .then((result) => {
              // console.log("result", result);
              response({
                res,
                success: true,
                status_code: 200,
                data: [result],
                message: "Row deleted successfully",
              });
            })
            .catch((error) => {
              // console.log("error", error);
              response({
                res,
                success: false,
                status_code: 400,
                data: [],
                message: "Error while deleting row",
              });
            });
        })
        .catch((error) => {
          // console.log("getSheetValues error==>", error);
          response({
            res,
            success: false,
            status_code: 400,
            data: [],
            message: "Sheets data not fetched",
          });
        });
    } catch (error) {
      // console.log("getSheetValues Error ==>", error);
      response({
        res,
        success: false,
        status_code: 400,
        data: [],
        message: "Error while fetching sheets data",
      });
    }
  }
};

const deleteGoggleSheetRow = async (
  sheetsId,
  sheetsLabel,
  deleteRowRange,
  accessToken
) => {
  // if (deleteRowRange.length > 0){
  // console.log("deleteRowRange", deleteRowRange[0].range);
  // }
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}/values/${deleteRowRange[0].range}:clear`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const data = {
      range: `${sheetsLabel}!${deleteRowRange[0].range}`,
      // shiftDimension: "ROWS"
    };

    try {
      const promises = await axios({
        method: "POST",
        url: url,
        headers: headers,
        data: data,
      });
      console.log("promises.data", promises.data);
      // getData(sheetsId, accessToken, sheetsLabel);
      return promises.data;
    } catch (error) {
      // console.log("deleteGoggleSheetRow error==>", error);
      throw error;
    }
  } catch (error) {
    // console.log("deleteGoggleSheetRow Error ==>", error);
    throw error;
  }
};

const getData = async (sheetsId, accessToken, sheetsLabel) => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}/values/A1:ZZ100000`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  const urlParams = {
    includeValuesInResponse: true,
    responseDateTimeRenderOption: "SERIAL_NUMBER",
    responseValueRenderOption: "FORMATTED_VALUE",
    valueInputOption: "USER_ENTERED",
  };

  try {
    await axios({
      method: "GET",
      url: url,
      headers: headers,
    })
      .then((values) => {
        // console.log(values.data.range)
        const range = values.data.range;
        const rangeArray = range.split("!");
        const columnId = rangeArray[1].split(":")[0].split("");

        const sheetData = [];
        const rows = values.data.values;
        rows.map((row) => {
          if (row.length > 0) {
            // sheetData.push(row)
            const data = {
              majorDimension: "ROWS",
              range: `${sheetsLabel}!${columnId[0]}${columnId[1]}`,
              values: [row],
            };

            const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}/values/${sheetsLabel}!${columnId[0]}${columnId[1]}?includeValuesInResponse=${urlParams.includeValuesInResponse}&responseDateTimeRenderOption=${urlParams.responseDateTimeRenderOption}&responseValueRenderOption=${urlParams.responseValueRenderOption}&valueInputOption=${urlParams.valueInputOption}`;
            sheetData.push({
              url: url,
              data: data,
            });
            ++columnId[1];
          }
        });

        console.log("sheetData", sheetData);
        addData(sheetData, headers);

        // // console.log(sheetData)
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};

const addData = async (sheetData, headers) => {
  try {
    const promises = sheetData.map(async (data) => {
      try {
        const response = await axios({
          method: "PUT",
          url: data.url,
          headers: headers,
          data: data.data,
        });
        return response.data;
      } catch (error) {
        console.log("error =>", error);
        throw error;
      }
    });

    const results = await Promise.all(promises);

    console.log("results", results);
  } catch (error) {
    console.log("Error ==>", error);
  }
};

module.exports = {
  getRecordTypes,
  getOptions,
  authentication,
  getRedirectPage,
  addRefreshToken,
  getAccessToken,
  getFiles,
  getSheetsData,
  getcredentialDetailsById,
  updateSheetValues,
  deleteSheetValue,
};

//  // const sheetColumnData = values.find((value) => value[0] === element[0]);
//  const sheetColumnData = sheetValues[0].find((element) => element[0] === value[0]);

//  if (sheetColumnData) {
//    console.log("updated value==>",columnID[1]-1, "=", sheetColumnData);
//    // allData.push({
//    //   url: `https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}/values/${sheetsLabel}!${columnID[0]}${columnID[1] - 1}?includeValuesInResponse=${urlParams.includeValuesInResponse}&responseDateTimeRenderOption=${urlParams.responseDateTimeRenderOption}&responseValueRenderOption=${urlParams.responseValueRenderOption}&valueInputOption=${urlParams.valueInputOption}`,
//    //   data: {
//    //     majorDimension: "ROWS",
//    //     range: `${sheetsLabel}!${columnID[0]}${columnID[1] - 1}`,
//    //     values: [sheetColumnData],
//    //   },
//    // });
//  } else {
//    // console.log("added value==>", element);
//    // allData.push({
//    //   url: `https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}/values/${sheetsLabel}!${columnID[0]}${columnID[1]}?includeValuesInResponse=${urlParams.includeValuesInResponse}&responseDateTimeRenderOption=${urlParams.responseDateTimeRenderOption}&responseValueRenderOption=${urlParams.responseValueRenderOption}&valueInputOption=${urlParams.valueInputOption}`,
//    //   data: {
//    //     majorDimension: "ROWS",
//    //     range: `${sheetsLabel}!${columnID[0]}${columnID[1]}`,
//    //     values: [element],
//    //   },
//    // });
//  }
