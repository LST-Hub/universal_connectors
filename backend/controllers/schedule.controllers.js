const prisma = require("../lib/prisma");
const response = require("../lib/response");
const crypto = require("crypto");
const axios = require("axios");
// const CryptoJS = require("crypto-js");
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
    // sourceFieldValue,
    // sourceFieldLabel,
    // destinationFieldValue,
    // destinationFieldLabel,
    // operator
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
          // sourceFieldValue: sourceFieldValue,
          // sourceFieldLabel: sourceFieldLabel,
          // destinationFieldValue: destinationFieldValue,
          // destinationFieldLabel: destinationFieldLabel,
          // operator: operator,
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
    console.log("schedule", schedule)

    // const result = await syncEventData(
    //   userId,
    //   schedule.id,
    //   integrationId,
    //   mappedRecordId
    // );
    // console.log("final result", result);
    // return result;

    response({
      res,
      success: true,
      status_code: 200,
      data: [schedule],
      message: "Added realtime event",
    });
    return;

  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in creating schedule",
    });
    console.log("addRealTimeEvent error", error);
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
    // sourceFieldValue,
    // sourceFieldLabel,
    // destinationFieldValue,
    // destinationFieldLabel,
    // operator
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
          // sourceFieldValue: sourceFieldValue,
          // sourceFieldLabel: sourceFieldLabel,
          // destinationFieldValue: destinationFieldValue,
          // destinationFieldLabel: destinationFieldLabel,
          // operator: operator,
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

    // console.log("addSingleEvent schedule", schedule)
    const accessToken = await getAccessTokenByUserId(userId);

if (accessToken.success) {
    const result = await syncEventData(
      userId,
      schedule.id,
      integrationId,
      mappedRecordId
    );
    console.log("final result", result);
    // response({
    //   res,
    //   success: true,
    //   status_code: 200,
    //   data: [result],
    //   message: "Successfully schedule"
    // })
    // return; 
  } else {
    // response({
    //   res,
    //   success: true,
    //   status_code: 200,
    //   data: [accessToken],
    //   message: "Access token error"
    // })
    // return;
  }

    response({
      res,
      status_code: 200,
      success: true,
      data: [schedule],
      message: "added single event"
    })
    return

  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in creating schedule",
    });
    console.log("addSingleEvent error", error);
    return
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
    sourceFieldValue,
    sourceFieldLabel,
    destinationFieldValue,
    destinationFieldLabel,
    operator
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
          sourceFieldValue: sourceFieldValue,
          sourceFieldLabel: sourceFieldLabel,
          destinationFieldValue: destinationFieldValue,
          destinationFieldLabel: destinationFieldLabel,
          operator: operator,
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

    response({
      res,
      status_code: 200,
      success: true,
      data: [schedule],
      message: "added single event"
    })

    const accessToken = await getAccessTokenByUserId(userId);

if (accessToken.success) {
    const result = await syncEventData(
      userId,
      schedule.id,
      integrationId,
      mappedRecordId
    );
    console.log("final result", result);
    // response({
    //   res,
    //   success: true,
    //   status_code: 200,
    //   data: [result],
    //   message: "Successfully schedule"
    // })
    return;
  } else {
    response({
      res,
      success: true,
      status_code: 200,
      data: [accessToken],
      message: "Access token error"
    })
    return;
  }

  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in creating schedule",
    });
    console.log("addWeeklyEvent error", error);
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
    console.log("getSchedules error", error);
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
        // sourceFieldValue: true,
        // sourceFieldLabel: true,
        // destinationFieldValue: true,
        // destinationFieldLabel: true,
        // operator: true,
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
    console.log("getScheduleEventById error", error);
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
    // sourceFieldValue,
    // sourceFieldLabel,
    // destinationFieldValue,
    // destinationFieldLabel,
    // operator
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
        // sourceFieldValue: sourceFieldValue,
        // sourceFieldLabel: sourceFieldLabel,
        // destinationFieldValue: destinationFieldValue,
        // destinationFieldLabel: destinationFieldLabel,
        // operator: operator
      },
    });

    // const result = await syncEventData(
    //   userId,
    //   id,
    //   integrationId,
    //   mappedRecordId
    // );
    // console.log("final result", result);
    // return result;

    response({
      res,
      success: true,
      status_code: 200,
      message: "Updated realtime event",
    });
    return;

  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in updating schedule",
    });
    console.log("updateRealTimeEvent error", error);
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
    // sourceFieldValue,
    // sourceFieldLabel,
    // destinationFieldValue,
    // destinationFieldLabel,
    // operator
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
        // sourceFieldValue: sourceFieldValue,
        // sourceFieldLabel: sourceFieldLabel,
        // destinationFieldValue: destinationFieldValue,
        // destinationFieldLabel: destinationFieldLabel,
        // operator: operator
      },
    });

    response ({
      res,
      status_code: 200,
      success: true,
      data: [scheduleData],
      message: "updated single event"
    })

    const accessToken = await getAccessTokenByUserId(userId);

if (accessToken.success) {
   const result = await syncEventData(
        userId,
        id,
        integrationId,
        mappedRecordId
      );
      console.log("final result", result);
      // response({
      //   res,
      //   success: true,
      //   status_code: 200,
      //   data: [result],
      //   message: "Successfully schedule"
      // })
      // return;
    } else {
      // response({
      //   res,
      //   success: true,
      //   status_code: 200,
      //   data: [accessToken],
      //   message: "Access token error"
      // })
      // return;
    }
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in updating schedule",
    });
    console.log("updateSingleEvent error", error);
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
    // sourceFieldValue,
    // sourceFieldLabel,
    // destinationFieldValue,
    // destinationFieldLabel,
    // operator
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
    //     sourceFieldValue: sourceFieldValue,
    // sourceFieldLabel: sourceFieldLabel,
    // destinationFieldValue: destinationFieldValue,
    // destinationFieldLabel: destinationFieldLabel,
    // operator: operator
      },
    });

    response({
      res,
      status_code: 200,
      success: true,
      data: [scheduleData],
      message: "added single event"
    })

    const accessToken = await getAccessTokenByUserId(userId);

    if (accessToken.success) {
    const result = await syncEventData(
      userId,
      id,
      integrationId,
      mappedRecordId
    );
    console.log("final result", result);
    // response({
    //   res,
    //   success: true,
    //   status_code: 200,
    //   data: [result],
    //   message: "Successfully schedule"
    // })
    // return;
  } else {
    // response({
    //   res,
    //   success: true,
    //   status_code: 200,
    //   data: [accessToken],
    //   message: "Access token error"
    // })
    // return;
  }
  return

} catch (error) {
  response({
    res,
    success: false,
    status_code: 400,
    message: "Error in updating schedule",
  });
  console.log("updateWeeklyEvent error", error);
}
};

const deleteScheduleEvent = async (req, res) => {
  const { id, integrationId, userId, mappedRecord } = req.params;
  try {

    const [deleteLogs, deleteFilterFields, deleteScheduleEvent] = await prisma.$transaction(
      [
        prisma.logs.deleteMany({
          where: {
            userId: Number(userId),
            integrationId: Number(integrationId),
            mappedRecordId: Number(mappedRecord),
            scheduleId: Number(id)
          }
        }),
        prisma.customFilterFields.deleteMany({
          where: {
            userId: Number(userId),
            integrationId: Number(integrationId),
            mappedRecordId: Number(mappedRecord),
            scheduleId: Number(id)
          }
        }),
        prisma.schedule.deleteMany({
          where: {
            userId: Number(userId),
            integrationId: Number(integrationId),
            mappedRecordId: Number(mappedRecord),
            id: Number(id)
          }
        })
      ]
    )

    response({
      res,
      success: true,
      status_code: 200,
      message: "Schedule event deleted successfully"
    })
  } catch (error) {
    response({
      res,
      success: false, 
      status_code: 400,
      message: "Error in deleting schedule",
    });
    console.log("deleteScheduleEvent error", error);
  }
// const filterResult = await deleteCustomFilterField(mappedRecord, integrationId, userId)

  //   const [deleteLogs, deleteScheduleEvent] = await prisma.$transaction(
  //     [
  //       prisma.logs.deleteMany({
  //         where: {
  //           scheduleId: Number(id),
  //           userId: Number(userId),
  //           integrationId: Number(integrationId),
  //           // mappedRecordId: Number(mappedRecordId),
  //         },
  //       }),
  //       prisma.schedule.deleteMany({
  //         where: {
  //           id: Number(id),
  //           userId: Number(userId),
  //           integrationId: Number(integrationId),
  //           // mappedRecordId: Number(mappedRecordId)
  //         },
  //       }),
  //     ]
  //   );

  //   response({
  //     res,
  //     success: true,
  //     status_code: 200,
  //     message: "Schedule deleted successfully",
  //   });
  
};

// const deleteCustomFilterField = async (mappedRecordId, integrationId, userId) => {
//   try {
//     const deleteFilterResult = await prisma.customFilterFields.deleteMany({
//       where: {
//         userId: Number(userId),
//         mappedRecordId: Number(mappedRecordId),
//         integrationId: Number(integrationId)
//       }
//     })

//     return {
//       success: true,
//       error: "filter field deleted successfully",
//     };
//   } catch (error) {
//     console.log("error => ", error)
//     return {
//       success: false,
//       error: "Error in deleting filter condition",
//     };
//   }
// };

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
    console.log("addMappedFields error", error);
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
    console.log("getMappedField error", error);
  }
};

const addCustomFilterFields = async (req, res) => {
  const {
    userId,
    mappedRecordId,
    integrationId,
    scheduleId,
    sourceFieldValue,
    sourceFieldLabel,
    destinationFieldValue,
    destinationFieldLabel,
    operator,
  } = req.body;

  try {
    const customFilterFields = await prisma.customFilterFields.create({
      data: {
        userId: Number(userId),
        mappedRecordId: Number(mappedRecordId),
        integrationId: Number(integrationId),
        scheduleId: Number(scheduleId),
        sourceFieldValue: sourceFieldValue,
        sourceFieldLabel: sourceFieldLabel,
        destinationFieldValue: destinationFieldValue,
        destinationFieldLabel: destinationFieldLabel,
        operator: operator,
        creationDate: new Date(),
        modificationDate: new Date(),
      },
    });

      response({
        res,
        success: true,
        status_code: 200,
        data: [customFilterFields],
        message: "Custom filter fields added successfully",
      });
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in adding custom filter fields",
    });
    console.log("addCustomFilterFields error", error);
  }
};

const updateFilterFieldsById = async (req, res) => {
  try {
const { id } = req.params;
const {
  userId,
    mappedRecordId,
    integrationId,
    scheduleId,
    sourceFieldValue,
    sourceFieldLabel,
    destinationFieldValue,
    destinationFieldLabel,
    operator,
} = req.body;

const filterData = await prisma.customFilterFields.updateMany({
  where: {
    id:  Number(id),
    userId: Number(userId),
    integrationId: Number(integrationId),
    mappedRecordId: Number(mappedRecordId),
    scheduleId: Number(scheduleId)
  },
  data: {
    sourceFieldValue: sourceFieldValue,
    sourceFieldLabel: sourceFieldLabel,
    destinationFieldValue: destinationFieldValue,
    destinationFieldLabel: destinationFieldLabel,
    operator: operator,
    modificationDate: new Date(),
  }
})

console.log("filterData", filterData)

response({
  res,
  success: true,
  status_code: 200,
  data: [filterData],
  message: "Filter fields updated successfully."
})
return;
  } catch (error) {
    console.log("updateFilterFieldsById error", error)
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error while updating records."
    })
  }
}

const getFilterData = async (userId, eventId, integrationId, mappedRecordId) => {
    try {
      const filterFields = await prisma.customFilterFields.findMany({
        where: {
          userId: Number(userId),
          scheduleId: Number(eventId),
          integrationId: Number(integrationId),
          mappedRecordId: Number(mappedRecordId)
        }
      });
  
      return filterFields;
    } catch (error) {
      console.log("getFilterData error", error)
      return error
    }
  }

const getCustomFilterFieldsById = async (req, res) => {
const { userId, scheduleId, integrationId, mappedRecordId} = req.query

  try {
    const filterFields = await prisma.customFilterFields.findMany({
      where: {
        userId: Number(userId),
        scheduleId: Number(scheduleId),
        integrationId: Number(integrationId),
        mappedRecordId: Number(mappedRecordId)
      }
    });

    response({
      res,
      success: true,
      status_code: 200,
      data: filterFields,
      message: "Custom filter fields fetched successfully",
    })
    return
  } catch (error) {
    console.log("getCustomFilterFieldsById", error)
    response({
      res,
      success: false,
      status_code: 400,
      data: [],
      message: "Error while fetching filter fields."
    })
    return
  }
}

// const getCustomFilterFields = async (req, res) => {
//   try {
//     const { userId, integrationId, mappedRecordId } = req.query;

//     const filterData = await prisma.customFilterFields.findMany({
//       where: {
//         userId: Number(userId),
//         mappedRecordId: Number(mappedRecordId),
//         integrationId: Number(integrationId),
//       },
//     });

//     response({
//       res,
//       success: true,
//       status_code: 200,
//       data: filterData,
//       message: "Successfully get filter fields",
//     });
//   } catch (error) {
//     response({
//       res,
//       success: false,
//       status_code: 400,
//       data: [],
//       message: "Error in fetching filter fields",
//     });
//   }
// };


// Pending
const scheduleTask = async (req, res) => {
  // console.log("req.date", req.body.date);
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
      // console.log("starting...", new Date());

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
    console.log("scheduleTask error", error);
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
    console.log("getMappedRecordByIntegrationId error", error);
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
    console.log("getNetsuiteFiledsByRecordId error", error);
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
        response({
          res,
          success: true,
          status_code: 200,
          data: [values.data],
          message: "Fields fetched successfully",
        });
      })
      .catch((error) => {
        console.log("getFields error", error);
        response({
          res,
          success: false,
          status_code: 400,
          message: "Error in fetching fields",
        });
      });
  } catch (error) {
    console.log("getFields error =", error);
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
    console.log("getLogs error", error);
    response({
      res,
      success: false,
      status_code: 400,
      data: [],
      message: "Error while fetching data",
    });
  }
};

const syncEventData = async (
  userId,
  eventId,
  integrationId,
  mappedRecordId
) => {
  try {
    const [scheduleData, mappedRecord] = await prisma.$transaction([
    prisma.schedule.findMany({
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
        // sourceFieldValue: true,
        // sourceFieldLabel: true,
        // destinationFieldValue: true,
        // destinationFieldLabel: true,
        // operator: true,
      },
    }),
    prisma.mappedRecords.findMany({
      where: {
        id: Number(mappedRecordId),
        userId: Number(userId),
        integrationId: Number(integrationId),
      },
      select: {
        status: true,
        sheetLabel: true,
      },
    }),
  ]);

//     const filterFields = await getFilterData(userId, eventId, integrationId, mappedRecordId)
// console.log("^^^^^^^^^^^^^^^^^^^^^", filterFields)
    if (mappedRecord[0].status) {
    switch (scheduleData[0].eventType) {
      // case "Realtime":
      //   scheduleRealTimeEvent(
      //     userId,
      //     eventId,
      //     integrationId,
      //     mappedRecordId,
      //     scheduleData[0].startDate,
      //     scheduleData[0].endDate,
      //     scheduleData[0].noEndDate,
      //     scheduleData[0].operationType,
      //     scheduleData[0].source,
      //     scheduleData[0].range
      //   );
      //   break;

      case "Single":
        const singleEventResult = await scheduleSingleEvent(
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
          scheduleData[0].range,
          // filterFields[0].sourceFieldValue,
          // filterFields[0].sourceFieldLabel,
          // filterFields[0].destinationFieldValue,
          // filterFields[0].destinationFieldLabel,
          // filterFields[0].operator,

          // scheduleData[0].sourceFieldValue,
          // scheduleData[0].sourceFieldLabel,
          // scheduleData[0].destinationFieldValue,
          // scheduleData[0].destinationFieldLabel,
          // scheduleData[0].operator
        );
        // console.log("singleEventResult", singleEventResult)
        // return singleEventResult;
        break;

      case "Weekly":
        const weeklyEventResult = await scheduleWeeklyEvent(
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
          scheduleData[0].range,
          // scheduleData[0].sourceFieldValue,
          // scheduleData[0].sourceFieldLabel,
          // scheduleData[0].destinationFieldValue,
          // scheduleData[0].destinationFieldLabel,
          // scheduleData[0].operator
        );
        // console.log("weeklyEventResult", weeklyEventResult)
        // return weeklyEventResult;
        break;

      default:
        console.log("event not found");
    }
     } else {
      console.log("****status false", mappedRecord[0].sheetLabel);
      // return {
      //   success: false,
      //   error: `Please active mapped record status for ${mappedRecord[0].sheetLabel} sheet.`
      // }
    }

    // const res = {
    //   success: true,
    //   status_code: 200,
    //   message: "Event scheduled successfully",
    // };
    // return res;
  } catch (error) {
    console.log("syncEventData error", error);
    // return {
    //   success: false,
    //   error: "Error to sync data."
    // }
    // throw error;
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

    console.log(`date => * * ${day} ${month} *`);

    // cron.schedule(`* * ${day} ${month} *`, async function () {
      // console.log("schedule RealTime Event", new Date());

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
        accessToken.data
      );
      // result.push(res);
    // });
  } catch (error) {
    console.log("scheduleRealTimeEvent error => ", error);
  }
};

// start date, start time, repeat every day (checkbox), end date, no end date (checkbox)
const scheduleSingleEvent = async(
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
  range,
  // sourceFieldValue,
  // sourceFieldLabel,
  // destinationFieldValue,
  // destinationFieldLabel,
  // operator
) => {
  try {
    // *** startDate and startTime from user
    const dateObj = new Date(startDate);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();

    // let hour, minute;
    // console.log("startTimeValue", startTimeValue)
    // const [time, ampm] = startTimeValue.split(" ");
    // console.log("time", time, "ampm", ampm)
    // if(ampm === "pm" || ampm === "PM"){
    //   [hour, minute] = time.split(":");
    //   hour = parseInt(time) + 12;
    // } else {
    //   [hour, minute] = time.split(":");
    // }

    let hour, minute;
// console.log("startTimeValue", startTimeValue);
const [time, ampm] = startTimeValue.split(" ");
// console.log("time", time, "ampm", ampm);
if (ampm === "pm" || ampm === "PM") {
  [hour, minute] = time.split(":");
  hour = parseInt(hour, 10);  // Parse hour as an integer
  if (hour !== 12) {
    hour += 12;  // Add 12 to hour if it's not already 12 pm
  }
} else if (ampm === "am" || ampm === "AM") {
  [hour, minute] = time.split(":");
  hour = parseInt(hour, 10);  // Parse hour as an integer
  if (hour === 12) {
    hour = 0;  // Set hour to 0 if it's 12 am
  }
}

    const repeat = repeatEveryDay ? "*" : day;

    // ***todays date and time
    const date = new Date();
    const todaysYear = date.getFullYear();
    const TodaysMonth = date.getMonth() + 1;
    const TodaysDate = date.getDate();
    const todaysHour = date.getHours();
    const todaysMinute = date.getMinutes();

    console.log(`date => ${minute} ${hour} ${repeat} ${month} *`);

    if (todaysYear === year && TodaysMonth === month && TodaysDate === day) {
      cron.schedule(
        `${minute} ${hour} ${repeat} ${month} *`,
        async function () {
          // console.log("schedule Single Event", new Date());
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
            accessToken.data,
            // sourceFieldValue,
            // sourceFieldLabel,
            // destinationFieldValue,
            // destinationFieldLabel,
            // operator
          );
          // result.push(res);
          // console.log("res", res)
          // return res;
        }
      );
    } else {
      console.log("Check date and time")
    }
    // return {
    //   success: true,
    //   message: "Single event scheduled successfully."
    // };
  } catch (error) {
    console.log("scheduleSingleEvent error", error);
    // return {
    //   success: false,
    //   error: "Error for scheduling single event."
    // }
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
  range,
  // sourceFieldValue,
  // sourceFieldLabel,
  // destinationFieldValue,
  // destinationFieldLabel,
  // operator
) => {
  try {
    const dateObj = new Date(startDate);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();

    // let hour, minute;
    // console.log("startTimeValue", startTimeValue)
    // const [time, ampm] = startTimeValue.split(" ");
    // console.log("time", time, "ampm", ampm)
    // if(ampm === "pm" || ampm === "PM"){
    //   [hour, minute] = time.split(":");
    //   hour = parseInt(time) + 12;
    // } else {
    //   [hour, minute] = time.split(":");
    // }

    let hour, minute;
// console.log("startTimeValue", startTimeValue);
const [time, ampm] = startTimeValue.split(" ");
// console.log("time", time, "ampm", ampm);
if (ampm === "pm" || ampm === "PM") {
  [hour, minute] = time.split(":");
  hour = parseInt(hour, 10);  // Parse hour as an integer
  if (hour !== 12) {
    hour += 12;  // Add 12 to hour if it's not already 12 pm
  }
} else if (ampm === "am" || ampm === "AM") {
  [hour, minute] = time.split(":");
  hour = parseInt(hour, 10);  // Parse hour as an integer
  if (hour === 12) {
    hour = 0;  // Set hour to 0 if it's 12 am
  }
}

    const weekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayIndex = weekDays.indexOf(dayOfWeek);
    // console.log(dayOfWeek);

    // ***todays date and time
    const date = new Date();
    const todaysYear = date.getFullYear();
    const TodaysMonth = date.getMonth() + 1;
    const TodaysDate = date.getDate();
    const todaysHour = date.getHours();
    const todaysMinute = date.getMinutes();


    // console.log("date", minute, hour, day, month, dayIndex);
    console.log(`date => ${minute} ${hour} ${day} ${month} ${dayIndex}`);


    if (todaysYear === year && TodaysMonth === month && TodaysDate === day) {
    cron.schedule(
      `${minute} ${hour} ${day} ${month} ${dayIndex}`,
      async function () {
        // console.log("schedule Weekly Event", new Date());
        const accessToken = await getAccessTokenByUserId(userId);

        const res = await syncData(
          userId,
          mappedRecordId,
          integrationId,
          operationType,
          source,
          range,
          eventId,
          accessToken.data,
          // sourceFieldValue,
          // sourceFieldLabel,
          // destinationFieldValue,
          // destinationFieldLabel,
          // operator
        );
        // result.push(res);
        // console.log("res",res)
        // return res;
      }
    );
    } else {
      console.log("Check date and time")
    }

    // return {
    //   success: true,
    //   message: "Weekly event scheduled successfully."
    // };
  } catch (error) {
    // console.log("scheduleWeeklyEvent error", error);
    // return {
    //   success: false,
    //   error: "Error for scheduling single event."
    // }
  }
};


// Working here
const syncData = async (
  userId,
  mappedRecordId,
  integrationId,
  operationType,
  source,
  range,
  eventId,
  accessToken,
  // sourceFieldValue,
  // sourceFieldLabel,
  // destinationFieldValue,
  // destinationFieldLabel,
  // operator
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

    // if (mappedRecord[0].status) {
      switch (source) {
        case "NetSuite":
          const nsResult = await netsuiteOperations(
            userId,
            mappedRecordId,
            integrationId,
            operationType,
            range,
            eventId,
            mappedRecord,
            credentials,
            accessToken,
            // sourceFieldValue,
            // sourceFieldLabel,
            // destinationFieldValue,
            // destinationFieldLabel,
            // operator
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
            eventId,
            range,
            // sourceFieldValue,
            // sourceFieldLabel,
            // destinationFieldValue,
            // destinationFieldLabel,
            // operator
          );
          // console.log("gsResult", gsResult)
          return gsResult;

        default:
          console.log("source not matched");
      }
    // } else {
    //   console.log("****status false", mappedRecord[0].sheetLabel);
    //   return {
    //     success: false,
    //     error: "Error: mapped record status is false."
    //   }
    // }
  } catch (error) {
    console.log("syncData error", error);
    // return error;
    // return {
    //   success: false,
    //   error: "Error for sync data."
    // }
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

      console.log(response.data.access_token);
      // return response.data.access_token;
      return {
        success: true,
        data: response.data.access_token
      }
    } catch (error) {
      console.log("getAccessTokenByUserId error", error.response.data);
      // ***invalid_grant
      //   throw error;
      return {
        success: false,
        error: error.response.data.error_description
      }
    }
  } catch (error) {
    console.log("getAccessTokenByUserId error=>", error);
    // throw error;
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
  eventId,
  mappedRecord,
  credentials,
  accessToken,
  // sourceFieldValue,
  // sourceFieldLabel,
  // destinationFieldValue,
  // destinationFieldLabel,
  // operator
) => {
  try {
    const sheetsValue = await getSheetsData(mappedRecord, userId, accessToken);
    const values = sheetsValue.data.values;
    
    // sheetsValue
    //   .then((values) => {
    //     const result = getMappedFields(
    //       credentials,
    //       values.data.values,
    //       mappedRecord,
    //       userId,
    //       operationType,
    //       integrationId,
    //       range,
    //       id,
    //       accessToken
    //     );

    //     result
    //       .then((data) => {
    //         return data;
    //       })
    //       .catch((error) => {
    //         console.log("netsuiteOperations error", error);
    //         return error;
    //       });
    //   })
    //   .catch((error) => {
    //     console.log("netsuiteOperations error=>", error.data);
    //     return error;
    //   });

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
    // console.log("mappedFields", mappedFields)
    // console.log("values", values)

    if (mappedFields.length > 0 && values.length > 1) {
      switch (operationType) {
        case "add":
          const addResult = await addNetsuiteV1Api(
            credentials,
            values,
            mappedRecord,
            mappedFields,
            userId,
            integrationId,
            eventId,
            range,
            accessToken,
          );
          // return addResult;
          break;

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
            eventId,
            // sourceFieldValue,
            // sourceFieldLabel,
            // destinationFieldValue,
            // destinationFieldLabel,
            // operator
          );
          // return updateResult;
          break;

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
            eventId,
            // sourceFieldValue,
            // sourceFieldLabel,
            // destinationFieldValue,
            // destinationFieldLabel,
            // operator
          );
          // return deleteResult;
          break;

        default:
          console.log("operationType not matched");
          throw error;
      }
    } else {
      console.log("fields not mapped");
      // throw error;
      // return {
      //   success: false,
      //   error: "Fields not mapped"
      // }
    }
  } catch (error) {
    console.log("netsuiteOperations error==>", error);
    // return error;
    // return {
    //   success: false,
    //   error: "Error for NetSuite operations."
    // }
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
    console.log("getSheetsData error=", error);
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
  eventId,
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
        linefields: [{}],
      };

      // for (const field of mappedFields) {
      //   const sourceField = field.sourceFieldValue;
      //   const destinationField = field.destinationFieldValue;
      //   const fieldValue = dataRow[mappedFields.indexOf(field)];

      //   if (sourceField.includes("__")) {
      //     const [parentField, childField] = sourceField.split("__");
      //     if (!record.linefields[parentField]) {
      //       record.linefields[parentField] = [];
      //     }
      //     const lineFieldObject = record.linefields[parentField].find(
      //       (lineField) => Object.keys(lineField)[0] === childField
      //     );
      //     if (lineFieldObject) {
      //       lineFieldObject[childField] = fieldValue;
      //     } else {
      //       const newLineField = { [childField]: fieldValue };
      //       record.linefields[parentField].push(newLineField);
      //     }
      //   } else {
      //     record.bodyfields[sourceField] = fieldValue;
      //   }
      // }

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
          // linefields: record.linefields
        });
      }
    }
    // console.log("resultArray", resultArray[0].linefields)

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
// console.log("body", item.bodyfields)
// console.log("line", item.linefields)

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
            scheduleId: eventId,
            integrationId: integrationId,
            mappedRecordId: mappedRecord[0].id,
            recordType: mappedRecord[0].recordTypeLabel,
            status: "Error",
            // internalid: item.bodyfields.internalid,
            message: res.data.add_error.message,
          });
        }
      } catch (error) {
        console.log("addNetsuiteV1Api error", error);
        // return {
        //   success: false,
        //   error: "Error while adding data in NetSuite."
        // }
      }
    }

    const summaryMessage = `Successfully added ${successCount} records in NetSuite out of ${resultArray.length}`;
    if(successCount > 0){
      logs.unshift({
        userId: userId,
        scheduleId: Number(eventId),
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
    console.log("add records in NS logs", logs)
    addLogs(logs);
    // return response;
  } catch (error) {
    console.log("addNetsuiteV1Api error => ", error);
    // throw error;
    // return {
    //   success: false,
    //   error: "Error for add records in NetSuite."
    // }
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
  eventId,
  // sourceFieldValue,
  // sourceFieldLabel,
  // destinationFieldValue,
  // destinationFieldLabel,
  // operator
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
        scheduleId: Number(eventId)
      },
    });
    console.log("^^^^^^^^^^^^^^^^^^^^^", filterData)

    const sheetsData = await getSheetsDataByRange(
      userId,
      range,
      mappedRecord,
      accessToken
    );

    const sheetsValue = await getSheetsData(mappedRecord, userId, accessToken);
    
    const sheetHeader = sheetsValue.data.values[0].indexOf(
      // destinationFieldLabel
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
              scheduleId: eventId,
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
        scheduleId: Number(eventId),
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
    console.log("updated in NS logs", logs)
    addLogs(logs);
    return response;
  } catch (error) {
    console.log("Please add filter to update the record");
    console.log("updateNetsuiteV1Api error => ", error);
    // return error;
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
  eventId,
  // sourceFieldValue,
  // sourceFieldLabel,
  // destinationFieldValue,
  // destinationFieldLabel,
  // operator
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
        scheduleId: Number(eventId)
      },
    });
    console.log("^^^^^^^^^^^^^^^^^^^^^", filterData)

    const sheetsData = await getSheetsDataByRange(
      userId,
      range,
      mappedRecord,
      accessToken
    );

    const sheetsValue = await getSheetsData(mappedRecord, userId, accessToken);
   
    const sheetHeader = sheetsValue.data.values[0].indexOf(
      // filterData[0].destinationFieldLabel
      filterData[0].destinationFieldLabel
    );
    await Promise.all(
      sheetsData.values.map(async (row) => {
       
        const fieldValue = row[sheetHeader];
        const filter = [
          // filterData[0].sourceFieldValue,
          // filterData[0].operator,
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
              scheduleId: eventId,
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
        scheduleId: Number(eventId),
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
    console.log("logs", logs)
    addLogs(logs);
    return response;

  } catch (error) {
    console.log("Please add filter to delete record");
    console.log("deleteNetsuiteV1Api error => ", error);
    // return error;
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
  eventId,
  range,
  // sourceFieldValue,
  //           sourceFieldLabel,
  //           destinationFieldValue,
  //           destinationFieldLabel,
  //           operator
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

//     const filterFields = await getFilterData(userId, id, integrationId, mappedRecordId)
// console.log("^^^^^^^^^^^^^^^^^^^^^", filterFields)

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
            eventId,
            mappedFields
          );
          // console.log("addRecordResult", addRecordResult)
          // return addRecordResult;
          break;

        case "update":
          const updateRecordResult = await updateGoogleSheetRecord(
            accessToken,
            mappedRecord,
            credentials,
            userId,
            mappedRecordId,
            integrationId,
            eventId,
            range,
            mappedFields,
            // filterFields[0].sourceFieldValue,
            // filterFields[0].sourceFieldLabel,
            // filterFields[0].destinationFieldValue,
            // filterFields[0].destinationFieldLabel,
            // filterFields[0].operator
          );
          // return updateRecordResult;
          break;

        case "delete":
          const deleteRecordResult = await deleteGoogleSheetRecord(
            accessToken,
            mappedRecord,
            credentials,
            userId,
            mappedRecordId,
            integrationId,
            eventId,
            range,
            // mappedFields,
            // filterFields[0].sourceFieldValue,
            // filterFields[0].sourceFieldLabel,
            // filterFields[0].destinationFieldValue,
            // filterFields[0].destinationFieldLabel,
            // filterFields[0].operator
          );
          // return deleteRecordResult;
          break;

        default:
      }
    }
  } catch (error) {
    console.log("googleSheetsOperations error", error);
    // return error;
    // return {
    //   success: false,
    //   error: "Error occured while perfoming google sheet operations."
    // }
  }
};

const addGoogleSheetRecords = async (
  accessToken,
  mappedRecord,
  credentials,
  userId,
  mappedRecordId,
  integrationId,
  eventId,
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
      })
        // .then((res) => {
          const appendRecordResult = await appendFields(
            userId,
            mappedRecordId,
            integrationId,
            mappedRecord,
            accessToken,
            recordList,
            recordValues.length,
            eventId
          );
          // console.log("appendRecordResult", appendRecordResult)
          // return appendRecordResult;

        // })
        // .catch((error) => {
        //   console.log("addGoogleSheetRecords error", error.response.data);
        //   // access token error
        // });
    } catch (error) {
      console.log("addGoogleSheetRecords error => ", error);
      // return {
      //   success: false,
      //   error: "Error while adding records in Google Sheets."
      // }
    }
  } catch (error) {
    console.log("addGoogleSheetRecords error=> ", error.response.data);
    // return error;
    // return {
    //   success: false,
    //   error: "Error for add records in Google Sheet."
    // }
  }
};

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
//       columns: ["internalid"],
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
//       .then(async (res) => {
//         const internalIds = res.data.list.map(
//           (item) => item.values.internalid[0].text
//         );
//         const uniqueIds = [...new Set(internalIds)];
//         const fieldValues = await getCustomeRecord(
//           credentials,
//           mappedRecord[0].recordTypeValue,
//           uniqueIds,
//           columns
//         );
//         return fieldValues;
//       })
//       .catch((error) => {
//         console.log("getNetsuiteData error", error);
//         throw error;
//       });
//   } catch (error) {
//     console.log("getNetsuiteData error => ", error);
//     return error;
//   }
// };

// const getCustomeRecord = async (
//   credentials,
//   recordTypeValue,
//   uniqueIds,
//   columns
// ) => {
//   const result = [];
//   await Promise.all(
//     uniqueIds.map(async (internalId) => {
//       const record = {
//         resttype: "Record",
//         recordtype: recordTypeValue,
//         recordid: internalId,
//         bodyfields: [],
//         linefields: [{}],
//       };

//       columns.forEach((col) => {
//         if (col.includes("__")) {
//           const [parentField, childField] = col.split("__");

//           const lineField = record.linefields[0];

//           if (lineField.hasOwnProperty(parentField)) {
//             lineField[parentField].push(childField);
//           } else {
//             lineField[parentField] = [childField];
//           }
//         } else {
//           record.bodyfields.push(col);
//         }
//       });

//       const authentication = {
//         account: credentials[0].accountId,
//         consumerKey: credentials[0].consumerKey,
//         consumerSecret: credentials[0].consumerSecretKey,
//         tokenId: credentials[0].accessToken,
//         tokenSecret: credentials[0].accessSecretToken,
//         timestamp: Math.floor(Date.now() / 1000).toString(),
//         nonce: getNonce(10),
//         http_method: "POST",
//         version: "1.0",
//         scriptDeploymentId: "1",
//         scriptId: "1529",
//         signatureMethod: "HMAC-SHA256",
//       };

//       const base_url =
//         "https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl";

//       const concatenatedString = `deploy=${authentication.scriptDeploymentId}&oauth_consumer_key=${authentication.consumerKey}&oauth_nonce=${authentication.nonce}&oauth_signature_method=${authentication.signatureMethod}&oauth_timestamp=${authentication.timestamp}&oauth_token=${authentication.tokenId}&oauth_version=${authentication.version}&script=${authentication.scriptId}`;

//       const baseString = `${authentication.http_method}&${encodeURIComponent(
//         base_url
//       )}&${encodeURIComponent(concatenatedString)}`;

//       const keys = `${authentication.consumerSecret}&${authentication.tokenSecret}`;

//       const signature = crypto
//         .createHmac("sha256", keys)
//         .update(baseString)
//         .digest("base64");

//       const oAuth_String = `OAuth realm="${
//         authentication.account
//       }", oauth_consumer_key="${authentication.consumerKey}", oauth_token="${
//         authentication.tokenId
//       }", oauth_nonce="${authentication.nonce}", oauth_timestamp="${
//         authentication.timestamp
//       }", oauth_signature_method="HMAC-SHA256", oauth_version="1.0", oauth_signature="${encodeURIComponent(
//         signature
//       )}"`;

//       const url = `https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=${authentication.scriptId}&deploy=${authentication.scriptDeploymentId}`;

//       try {
//         const res = await axios({
//           method: "POST",
//           url: url,
//           headers: {
//             Authorization: oAuth_String,
//             "Content-Type": "application/json",
//           },
//           data: record,
//         });

//         result.push(res.data);
//       } catch (error) {
//         throw error;
//       }
//     })
//   );
//   return result;
// };

const appendFields = async (
  userId,
  mappedRecordId,
  integrationId,
  mappedRecord,
  accessToken,
  recordList,
  count,
  eventId
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

      const summaryMessage = `Successfully added ${
        request.data.updates.updatedRows - 1
      } records in Google Sheet out of ${count}`;
      if (count > 0) {
        logs.push({
          userId: userId,
          scheduleId: Number(eventId),
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
      console.log("logs", logs)
      addLogs(logs);
      // return response;
    } catch (error) {
      console.log("addGoogleSheetRecords error", error.response.data);
      // return error;
      // return {
      //   success: false,
      //   error: "Error for add records in Google Sheet."
      // }
    }
  } catch (error) {
    console.log("appendFields error => ", error);
    // return {
    //   success: false,
    //   error: "Error while append data in google sheet."
    // }
  }
};

const updateGoogleSheetRecord = async (
  accessToken,
  mappedRecord,
  credentials,
  userId,
  mappedRecordId,
  integrationId,
  eventId,
  range,
  mappedFields,
  // sourceFieldValue,
  //           sourceFieldLabel,
  //           destinationFieldValue,
  //           destinationFieldLabel,
  //           operator
) => {
  try {
    console.log("update record in google sheet");

    const filterFields = await getFilterData(userId, eventId, integrationId, mappedRecordId)
console.log("^^^^^^^^^^^^^^^^^^^^^", filterFields)

    // const filterData = await prisma.customFilterFields.findMany({
    //   where: {
    //     userId: Number(userId),
    //     integrationId: Number(integrationId),
    //     mappedRecordId: Number(mappedRecordId),
    //   },
    // });

    // const columns = []
    const columns = mappedFields.map((field) => {
      const item = field.sourceFieldValue
      if (item.includes('__')) {
        const col = item.split('__');
    return col[1];
      }
      return item
      // columns.push(field.sourceFieldValue)
          })
//     mappedFields.map((field) => {
// // columns.push(field.sourceFieldValue)
// const fieldId =  field.sourceFieldValue
//       if(fieldId.includes("__")){
//         const [parentId, childId] = fieldId.split("__")
//         columns.push(childId)
//       } else {
//         columns.push(fieldId)
//       }
//     })

    const sheetsData = await getSheetsDataByRange(
      userId,
      range,
      mappedRecord,
      accessToken
    );

    const sheetsValue = await getSheetsData(mappedRecord, userId, accessToken);
    const fieldIndex = sheetsValue.data.values[0].indexOf(
      // destinationFieldLabel
            filterFields[0].destinationFieldLabel,
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
            // // filterData[0].sourceFieldValue,
            // sourceFieldValue,
            // operator,
            //   row[fieldIndex]
            filterFields[0].sourceFieldValue,
            filterFields[0].operator,
            row[fieldIndex]
          ]
      ],
      columns: columns
  };
  // console.log("updated data", data)

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
      console.log("updateNetsuiteV1Api error", error.response.data);
      // throw error;
      // return {
      //   success: false,
      //   error: "Error for updating records in Google sheet."
      // }
    }
  })
    );

    const addFieldsResult = await addFields(accessToken, mappedRecord, range, results, userId, eventId, integrationId, mappedRecordId, existingRecords)
    // return addFieldsResult;

  } catch (error) {
    console.log("updateGoogleSheetRecord error=> ", error);
    // return error;
    // return {
    //   success: false,
    //   error: "Error for update records."
    // }
  }
};

const addFields = async (accessToken, mappedRecord, range, result, userId, eventId, integrationId, mappedRecordId, existingRecords) => {
  const logs = [];
  let recordCount = 0;
  let updatedrecords = 0
  const recordValues = []

 result.map((record, index) => {
   recordCount++
   if(record.list.length > 0) {
    updatedrecords++
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
        const summaryMessage = `Records are not available in Netsuite`;
        logs.push({
        userId: userId,
        scheduleId: Number(eventId),
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
    // console.log("request", request.data)

    const summaryMessage = `Successfully updated ${updatedrecords} records in Google Sheet out of ${recordCount}`;
      if (updatedrecords > 0) {
        logs.push({
          userId: userId,
          scheduleId: Number(eventId),
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
      console.log("update fields in GS logs", logs)
      addLogs(logs);
      // return response;

  } catch (error) {
    console.log("addFields error", error);
    // return error;
    // return {
    //   success: false,
    //   error: "Error for update records in Google Sheet."
    // }
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
  eventId,
  range,
  // mappedFields,
  // sourceFieldValue,
  //           sourceFieldLabel,
  //           destinationFieldValue,
  //           destinationFieldLabel,
  //           operator
) => {  
  try {
  let totalRecords = 0;
  let deleteCount = 0;
  
  // console.log("range to delete records from google sheets", range)
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${mappedRecord[0].workBookValue}:batchUpdate`;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  // // split range
  // const [startCoordinate, endCoordinate] = range.split(":")
  // const startIndex = startCoordinate.split("")
  // const endIndex = endCoordinate.split("")
const [startIndex, endIndex] = range.split(":").map((item) => parseInt(item.replace(/\D/g, "")));
  console.log("startIndex", startIndex - 1, "endIndex", endIndex)

  const data = {
    requests: [
      {
        deleteDimension: {
          range: {
            sheetId: mappedRecord[0].sheetValue,
            dimension: "ROWS",
            startIndex: startIndex - 1,
            endIndex: endIndex,
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

    // deleteCount++;
    // console.log("start", i, "end", i+1)

    // const summaryMessage = `Successfully deleted ${deleteCount} records from Google Sheet out of ${count}`;
  //   if (deleteCount > 0) {
  //     logs.push({
  //       userId: userId,
  //       scheduleId: Number(eventId),
  //       integrationId: integrationId,
  //       mappedRecordId: mappedRecordId,
  //       recordType: mappedRecord[0].recordTypeLabel,
  //       status: "Success",
  //       message: summaryMessage,
  //     });
  //   } else {
  //     logs.push({
  //       userId: userId,
  //       scheduleId: Number(eventId),
  //       integrationId: integrationId,
  //       mappedRecordId: mappedRecordId,
  //       recordType: mappedRecord[0].recordTypeLabel,
  //       status: "Success",
  //       message: "Record not available."
  //     });
  //   }

  //   const response = {
  //     success: true,
  //     data: {
  //       deleteCount,
  //       errorCount,
  //       logs,
  //     },
  //   };
  // //  const response = [deleteCount, errorCount, logs]
  // console.log("logs", logs)
  //   addLogs(logs);
  //   // return response;
  } catch (error) {
    // errorCount++;
    console.log("deleteGoogleSheetRecord error", error.response.data);
  }
} catch (error) {
  console.log("deleteGoogleSheetRecord error = ", error)
}
              // try {
              //   const res = await axios({
              //     method: "POST",
              //     url: url,
              //     headers: headers,
              //     data: data,
              //   });

              //   console.log("output => ", res.data);
              //   deleteCount++;
              //   // console.log("start", i, "end", i+1)
              // } catch (error) {
              //   errorCount++;
              //   console.log("deleterecord error", error);
              // }

//   try {
//     console.log("delete record from google sheet");

//     const filterFields = await getFilterData(userId, eventId, integrationId, mappedRecordId)
// console.log("^^^^^^^^^^^^^^^^^^^^^", filterFields)

//     // const filterData = await prisma.customFilterFields.findMany({
//     //   where: {
//     //     userId: Number(userId),
//     //     integrationId: Number(integrationId),
//     //     mappedRecordId: Number(mappedRecordId),
//     //   },
//     // });

//     // const filterCondition = filterData[0].sourceFieldValue
//     const filterCondition = filterFields[0].sourceFieldValue


// //     const columns = []
// //     mappedFields.map((field) => {
// // columns.push(field.sourceFieldValue)
// //     })
// const columns = mappedFields.map((field) => {
//   const item = field.sourceFieldValue
//   if (item.includes('__')) {
//     const col = item.split('__');
// return col[1];
//   }
//   return item
//   // columns.push(field.sourceFieldValue)
//       })

//     const sheetsData = await getSheetsDataByRange(
//       userId,
//       range,
//       mappedRecord,
//       accessToken
//     );
//     // console.log("sheetsData by range", sheetsData)

//     const sheetsValue = await getSheetsData(mappedRecord, userId, accessToken);
//     const fieldIndex = sheetsValue.data.values[0].indexOf(
//       // destinationFieldLabel
//             filterFields[0].destinationFieldLabel,
//     );
//     // console.log("fieldIndex", fieldIndex)

//     const deleteFields = []
//     const results = await Promise.all(
//       sheetsData.values.map(async(row) => {

// const authentication = {
//   account: credentials[0].accountId,
//   consumerKey: credentials[0].consumerKey,
//   consumerSecret: credentials[0].consumerSecretKey,
//   tokenId: credentials[0].accessToken,
//   tokenSecret: credentials[0].accessSecretToken,
//   timestamp: Math.floor(Date.now() / 1000).toString(),
//   nonce: getNonce(10),
//   http_method: "POST",
//   version: "1.0",
//   scriptDeploymentId: "1",
//   scriptId: "1529",
//   signatureMethod: "HMAC-SHA256",
// };

// const base_url =
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
//       resttype: "Search",
//       recordtype: mappedRecord[0].recordTypeValue,
//       filters: [
//           [
//             // sourceFieldValue,
//             // operator,
//             //   row[fieldIndex]
//             filterFields[0].sourceFieldValue,
//             filterFields[0].operator,
//             row[fieldIndex]
//           ]
//       ],
//       columns: columns
//   };

//     try {
//       const res = await axios({
//         method: "POST",
//         url: url,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: oAuth_String,
//         },
//         data: data,
//       });
// console.log("res.data", res.data)
//       if(res.data.total === 0){
//       //   Object.entries(res.data.list[0].values).map(([key, value]) => {
//       //     if(key === filterCondition) {
//       //       deleteFields.push(value)  
//       //     }
//       //  })
//       deleteFields.push(row[fieldIndex])
//       }   
//     } catch (error) {
//       console.log("deleteGoogleSheetRecord error", error.response.data);
//       // throw error;
//       // return {
//       //   success: false,
//       //   error: "Error for delete records from Google sheet."
//       // }
//     }
//   })
//   );
//   // console.log("deleteFields", deleteFields)
//   const deleteRecordResponse = await deleterecord(userId, eventId, integrationId, mappedRecordId, mappedRecord, accessToken, deleteFields, fieldIndex, filterCondition);
//   // console.log("deleteRecordResponse", deleteRecordResponse)
//   // return deleteRecordResponse;

  // } catch (error) {
  //   console.log("deleteGoogleSheetRecord error=> ", error);
  //   deleteCount++;
  //   // return error;
  //   // return {
  //   //   success: false,
  //   //   error: "Error for delete records from Google sheet."
  //   // }
  // }

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
    } else {
      logs.push({
        userId: userId,
        scheduleId: Number(id),
        integrationId: integrationId,
        mappedRecordId: mappedRecordId,
        recordType: mappedRecord[0].recordTypeLabel,
        status: "Success",
        message: "Record not available."
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
  console.log("logs", logs)
    addLogs(logs);
    // return response;

  } catch (error) {
    console.log("deleterecord error =>", error);
    // return {
    //   success: false,
    //   error: "Error for delete records from Google Sheet.",
    // };
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

// const getFilterDataById = async (req, res) => {
//   try{
//     const { id, integrationId, mappedRecordId } = req.query;

//     const filterResult = await prisma.customFilterFields.findMany({
//       where: {
//         userId: Number(id),
//         mappedRecordId: Number(mappedRecordId),
//         integrationId: Number(integrationId)
//       }
//     })

//     response({
//       res,
//       success: true,
//       status_code: 200,
//       data: filterResult,
//       message: "Successfully get filter fields."
//     })
//   } catch(error) {
//     console.log("getFilterDataById error", error)
//     response({
//       res,
//       success: false,
//       status_code: 400,
//       data: [],
//       message: "Error iwhile fetching filter fields."
//     })
//   }
// }

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
  // getCustomFilterFields,
  updateFilterFieldsById,
  getCustomFilterFieldsById,
  scheduleTask,
  getMappedRecordByIntegrationId,
  getNetsuiteFiledsByRecordId,
  getFields,
  getLogs,
  // getFilterDataById
};












// const prisma = require("../lib/prisma");
// const response = require("../lib/response");
// const crypto = require("crypto");
// const axios = require("axios");
// // const CryptoJS = require("crypto-js");
// const cron = require("node-cron");

// const addRealTimeEvent = async (req, res) => {
//   const {
//     userId,
//     integrationId,
//     mappedRecordId,
//     eventType,
//     startDate,
//     endDate,
//     noEndDate,
//     performType,
//     savedSearchLabel,
//     savedSearchValue,
//     operationType,
//     source,
//     range,
//     sourceFieldValue,
//     sourceFieldLabel,
//     destinationFieldValue,
//     destinationFieldLabel,
//     operator
//   } = req.body;

//   try {
//     const [schedule, updateCount] = await prisma.$transaction([
//       prisma.schedule.create({
//         data: {
//           userId: userId,
//           integrationId: integrationId,
//           mappedRecordId: mappedRecordId,
//           eventType: eventType,
//           startDate: startDate,
//           endDate: endDate,
//           noEndDate: noEndDate,
//           performType: performType,
//           savedSearchLabel: savedSearchLabel,
//           savedSearchValue: savedSearchValue,
//           operationType: operationType,
//           source: source,
//           range: range,
//           sourceFieldValue: sourceFieldValue,
//           sourceFieldLabel: sourceFieldLabel,
//           destinationFieldValue: destinationFieldValue,
//           destinationFieldLabel: destinationFieldLabel,
//           operator: operator,
//           creationDate: new Date(),
//           modificationDate: new Date(),
//         },
//       }),
//       prisma.integrations.updateMany({
//         where: {
//           id: Number(integrationId),
//           userId: Number(userId),
//         },
//         data: {
//           schedule: true,
//         },
//       }),
//     ]);

//     // const result = await syncEventData(
//     //   userId,
//     //   schedule.id,
//     //   integrationId,
//     //   mappedRecordId
//     // );
//     // console.log("final result", result);
//     // return result;

//     response({
//       res,
//       success: true,
//       status_code: 200,
//       message: "Added realtime event",
//     });
//     return;

//   } catch (error) {
//     response({
//       res,
//       success: false,
//       status_code: 400,
//       message: "Error in creating schedule",
//     });
//     console.log("error", error);
//   }
// };

// const addSingleEvent = async (req, res) => {
//   const {
//     userId,
//     integrationId,
//     mappedRecordId,
//     eventType,
//     startDate,
//     startTimeLabel,
//     startTimeValue,
//     repeatEveryDay,
//     endDate,
//     noEndDate,
//     performType,
//     savedSearchLabel,
//     savedSearchValue,
//     operationType,
//     source,
//     range,
//     sourceFieldValue,
//     sourceFieldLabel,
//     destinationFieldValue,
//     destinationFieldLabel,
//     operator
//   } = req.body;
//   try {
//     const [schedule, updateCount] = await prisma.$transaction([
//       prisma.schedule.create({
//         data: {
//           userId: Number(userId),
//           integrationId: Number(integrationId),
//           mappedRecordId: Number(mappedRecordId),
//           eventType: eventType,
//           startDate: startDate,
//           startTimeLabel: startTimeLabel,
//           startTimeValue: startTimeValue,
//           repeatEveryDay: repeatEveryDay,
//           endDate: endDate,
//           noEndDate: noEndDate,
//           performType: performType,
//           savedSearchLabel: savedSearchLabel,
//           savedSearchValue: savedSearchValue,
//           operationType: operationType,
//           source: source,
//           range: range,
//           sourceFieldValue: sourceFieldValue,
//     sourceFieldLabel: sourceFieldLabel,
//     destinationFieldValue: destinationFieldValue,
//     destinationFieldLabel: destinationFieldLabel,
//     operator: operator,
//           creationDate: new Date(),
//           modificationDate: new Date(),
//         },
//       }),
//       prisma.integrations.updateMany({
//         where: {
//           id: Number(integrationId),
//           userId: Number(userId),
//         },
//         data: {
//           schedule: true,
//         },
//       }),
//     ]);

//     // console.log("schedule", schedule.id)

//     const accessToken = await getAccessTokenByUserId(userId);

// if (accessToken.success) {
//     const result = await syncEventData(
//       userId,
//       schedule.id,
//       integrationId,
//       mappedRecordId
//     );
//     console.log("final result", result);
//     response({
//       res,
//       success: true,
//       status_code: 200,
//       data: [result],
//       message: "Successfully schedule"
//     })
//     return; 
//   } else {
//     response({
//       res,
//       success: true,
//       status_code: 200,
//       data: [accessToken],
//       message: "Access token error"
//     })
//     return;
//   }

//   } catch (error) {
//     response({
//       res,
//       success: false,
//       status_code: 400,
//       message: "Error in creating schedule",
//     });
//     console.log("error", error);
//   }
// };

// const addWeeklyEvent = async (req, res) => {
//   const {
//     userId,
//     integrationId,
//     mappedRecordId,
//     eventType,
//     startDate,
//     startTimeLabel,
//     startTimeValue,
//     day,
//     endDate,
//     noEndDate,
//     performType,
//     savedSearchLabel,
//     savedSearchValue,
//     operationType,
//     source,
//     range,
//     sourceFieldValue,
//     sourceFieldLabel,
//     destinationFieldValue,
//     destinationFieldLabel,
//     operator
//   } = req.body;

//   try {
//     const [schedule, updateCount] = await prisma.$transaction([
//       prisma.schedule.create({
//         data: {
//           userId: userId,
//           integrationId: integrationId,
//           mappedRecordId: mappedRecordId,
//           eventType: eventType,
//           startDate: startDate,
//           startTimeLabel: startTimeLabel,
//           startTimeValue: startTimeValue,
//           day: day,
//           endDate: endDate,
//           noEndDate: noEndDate,
//           performType: performType,
//           savedSearchLabel: savedSearchLabel,
//           savedSearchValue: savedSearchValue,
//           operationType: operationType,
//           source: source,
//           range: range,
//           sourceFieldValue: sourceFieldValue,
//           sourceFieldLabel: sourceFieldLabel,
//           destinationFieldValue: destinationFieldValue,
//           destinationFieldLabel: destinationFieldLabel,
//           operator: operator,
//           creationDate: new Date(),
//           modificationDate: new Date(),
//         },
//       }),
//       prisma.integrations.updateMany({
//         where: {
//           id: Number(integrationId),
//           userId: Number(userId),
//         },
//         data: {
//           schedule: true,
//         },
//       }),
//     ]);

//     const accessToken = await getAccessTokenByUserId(userId);

// if (accessToken.success) {
//     const result = await syncEventData(
//       userId,
//       schedule.id,
//       integrationId,
//       mappedRecordId
//     );
//     console.log("final result", result);
//     response({
//       res,
//       success: true,
//       status_code: 200,
//       data: [result],
//       message: "Successfully schedule"
//     })
//     return;
//   } else {
//     response({
//       res,
//       success: true,
//       status_code: 200,
//       data: [accessToken],
//       message: "Access token error"
//     })
//     return;
//   }

//   } catch (error) {
//     response({
//       res,
//       success: false,
//       status_code: 400,
//       message: "Error in creating schedule",
//     });
//     console.log("error", error);
//   }
// };

// const getSchedules = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const scheduleData = await prisma.schedule.findMany({
//       where: {
//         userId: Number(id),
//       },
//       select: {
//         id: true,
//         userId: true,
//         integrationId: true,
//         eventType: true,
//         creationDate: true,
//         modificationDate: true,
//         source: true,
//         operationType: true,
//         integration: {
//           select: {
//             id: true,
//             integrationName: true,
//           },
//         },
//         mappedRecord: {
//           select: {
//             id: true,
//             mappedRecordName: true,
//           },
//         },
//       },
//     });

//     if (scheduleData) {
//       response({
//         res,
//         success: true,
//         status_code: 200,
//         message: "Schedule fetched successfully",
//         data: scheduleData,
//       });
//     } else {
//       response({
//         res,
//         success: false,
//         status_code: 400,
//         message: "Error in fetching schedule",
//       });
//     }
//   } catch (error) {
//     response({
//       res,
//       success: false,
//       status_code: 400,
//       message: "Error in fetching schedule",
//     });
//     console.log("error", error);
//   }
// };

// const getScheduleEventById = async (req, res) => {
//   const { id, userId, integrationId, mappedRecordId, eventType } = req.query;
//   try {
//     const scheduleData = await prisma.schedule.findMany({
//       where: {
//         id: Number(id),
//         userId: Number(userId),
//       },
//       select: {
//         id: true,
//         userId: true,
//         integrationId: true,
//         mappedRecordId: true,
//         eventType: true,
//         startDate: true,
//         endDate: true,
//         startTimeLabel: true,
//         startTimeValue: true,
//         day: true,
//         noEndDate: true,
//         repeatEveryDay: true,
//         performType: true,
//         savedSearchLabel: true,
//         savedSearchValue: true,
//         operationType: true,
//         source: true,
//         range: true,
//         integration: {
//           select: {
//             integrationName: true,
//           },
//         },
//         mappedRecord: {
//           select: {
//             mappedRecordName: true,
//           },
//         },
//       },
//     });

//     if (scheduleData) {
//       response({
//         res,
//         success: true,
//         status_code: 200,
//         message: "Schedule fetched successfully",
//         data: scheduleData,
//       });
//     } else {
//       response({
//         res,
//         success: false,
//         status_code: 400,
//         message: "Error in fetching schedule",
//       });
//     }
//   } catch (error) {
//     response({
//       res,
//       success: false,
//       status_code: 400,
//       message: "Error in fetching schedule",
//     });
//     console.log("error", error);
//   }
// };

// const updateRealTimeEvent = async (req, res) => {
//   const { id } = req.params;
//   const {
//     userId,
//     integrationId,
//     mappedRecordId,
//     eventType,
//     startDate,
//     endDate,
//     noEndDate,
//     performType,
//     savedSearchLabel,
//     savedSearchValue,
//     operationType,
//     source,
//     range,
//     sourceFieldValue,
//     sourceFieldLabel,
//     destinationFieldValue,
//     destinationFieldLabel,
//     operator
//   } = req.body;

//   // console.log(req.body)

//   try {
//     const scheduleData = await prisma.schedule.updateMany({
//       where: {
//         id: Number(id),
//         userId: Number(userId),
//         integrationId: Number(integrationId),
//         eventType: eventType,
//       },
//       data: {
//         mappedRecordId: mappedRecordId,
//         startDate: startDate,
//         endDate: endDate,
//         noEndDate: noEndDate,
//         performType: performType,
//         savedSearchLabel: savedSearchLabel,
//         savedSearchValue: savedSearchValue,
//         operationType: operationType,
//         source: source,
//         range: range,
//         sourceFieldValue: sourceFieldValue,
//         sourceFieldLabel: sourceFieldLabel,
//         destinationFieldValue: destinationFieldValue,
//         destinationFieldLabel: destinationFieldLabel,
//         operator: operator
//       },
//     });

//     // const result = await syncEventData(
//     //   userId,
//     //   id,
//     //   integrationId,
//     //   mappedRecordId
//     // );
//     // console.log("final result", result);
//     // return result;

//     response({
//       res,
//       success: true,
//       status_code: 200,
//       message: "Updated realtime event",
//     });
//     return;

//   } catch (error) {
//     response({
//       res,
//       success: false,
//       status_code: 400,
//       message: "Error in updating schedule",
//     });
//     console.log("error", error);
//   }
// };

// const updateSingleEvent = async (req, res) => {
//   const { id } = req.params;
//   const {
//     userId,
//     integrationId,
//     mappedRecordId,
//     eventType,
//     startDate,
//     startTimeLabel,
//     startTimeValue,
//     repeatEveryDay,
//     endDate,
//     noEndDate,
//     performType,
//     savedSearchLabel,
//     savedSearchValue,
//     operationType,
//     source,
//     range,
//     sourceFieldValue,
//     sourceFieldLabel,
//     destinationFieldValue,
//     destinationFieldLabel,
//     operator
//   } = req.body;

//   try {
//     const scheduleData = await prisma.schedule.updateMany({
//       where: {
//         id: Number(id),
//         userId: Number(userId),
//         integrationId: Number(integrationId),
//         eventType: eventType,
//       },
//       data: {
//         mappedRecordId: mappedRecordId,
//         startDate: startDate,
//         startTimeLabel: startTimeLabel,
//         startTimeValue: startTimeValue,
//         repeatEveryDay: repeatEveryDay,
//         endDate: endDate,
//         noEndDate: noEndDate,
//         performType: performType,
//         savedSearchLabel: savedSearchLabel,
//         savedSearchValue: savedSearchValue,
//         operationType: operationType,
//         source: source,
//         range: range,
//         sourceFieldValue: sourceFieldValue,
//         sourceFieldLabel: sourceFieldLabel,
//         destinationFieldValue: destinationFieldValue,
//         destinationFieldLabel: destinationFieldLabel,
//         operator: operator
//       },
//     });

//     const accessToken = await getAccessTokenByUserId(userId);

// if (accessToken.success) {
//    const result = await syncEventData(
//         userId,
//         id,
//         integrationId,
//         mappedRecordId
//       );
//       console.log("final result", result);
//       response({
//         res,
//         success: true,
//         status_code: 200,
//         data: [result],
//         message: "Successfully schedule"
//       })
//       return;
//     } else {
//       response({
//         res,
//         success: true,
//         status_code: 200,
//         data: [accessToken],
//         message: "Access token error"
//       })
//       return;
//     }

//   } catch (error) {
//     response({
//       res,
//       success: false,
//       status_code: 400,
//       message: "Error in updating schedule",
//     });
//     console.log("error", error);
//   }
// };

// const updateWeeklyEvent = async (req, res) => {
//   const { id } = req.params;
//   const {
//     userId,
//     integrationId,
//     mappedRecordId,
//     eventType,
//     startDate,
//     startTimeLabel,
//     startTimeValue,
//     day,
//     endDate,
//     noEndDate,
//     performType,
//     savedSearchLabel,
//     savedSearchValue,
//     operationType,
//     source,
//     range,
//     sourceFieldValue,
//     sourceFieldLabel,
//     destinationFieldValue,
//     destinationFieldLabel,
//     operator
//   } = req.body;

//   try {
//     const scheduleData = await prisma.schedule.updateMany({
//       where: {
//         id: Number(id),
//         userId: Number(userId),
//         integrationId: Number(integrationId),
//         eventType: eventType,
//       },
//       data: {
//         mappedRecordId: mappedRecordId,
//         startDate: startDate,
//         startTimeLabel: startTimeLabel,
//         startTimeValue: startTimeValue,
//         day: day,
//         endDate: endDate,
//         noEndDate: noEndDate,
//         performType: performType,
//         savedSearchLabel: savedSearchLabel,
//         savedSearchValue: savedSearchValue,
//         operationType: operationType,
//         source: source,
//         range: range,
//         sourceFieldValue: sourceFieldValue,
//     sourceFieldLabel: sourceFieldLabel,
//     destinationFieldValue: destinationFieldValue,
//     destinationFieldLabel: destinationFieldLabel,
//     operator: operator
//       },
//     });

//     const accessToken = await getAccessTokenByUserId(userId);

//     if (accessToken.success) {
//     const result = await syncEventData(
//       userId,
//       id,
//       integrationId,
//       mappedRecordId
//     );
//     console.log("final result", result);
//     response({
//       res,
//       success: true,
//       status_code: 200,
//       data: [result],
//       message: "Successfully schedule"
//     })
//     return;
//   } else {
//     response({
//       res,
//       success: true,
//       status_code: 200,
//       data: [accessToken],
//       message: "Access token error"
//     })
//     return;
//   }

// } catch (error) {
//   response({
//     res,
//     success: false,
//     status_code: 400,
//     message: "Error in updating schedule",
//   });
//   console.log("error", error);
// }
// };

// const deleteScheduleEvent = async (req, res) => {
//   const { id, integrationId, userId, mappedRecord } = req.params;
//   try {
// // const filterResult = await deleteCustomFilterField(mappedRecord, integrationId, userId)

//     const [deleteLogs, deleteScheduleEvent] = await prisma.$transaction(
//       [
//         prisma.logs.deleteMany({
//           where: {
//             scheduleId: Number(id),
//             userId: Number(userId),
//             integrationId: Number(integrationId),
//             // mappedRecordId: Number(mappedRecordId),
//           },
//         }),
//         prisma.schedule.deleteMany({
//           where: {
//             id: Number(id),
//             userId: Number(userId),
//             integrationId: Number(integrationId),
//             // mappedRecordId: Number(mappedRecordId)
//           },
//         }),
//       ]
//     );

//     response({
//       res,
//       success: true,
//       status_code: 200,
//       message: "Schedule deleted successfully",
//     });
//   } catch (error) {
//     response({
//       res,
//       success: false,
//       status_code: 400,
//       message: "Error in deleting schedule",
//     });
//     console.log("error", error);
//   }

//   // try {
//   //   const deleteCount = await prisma.logs.deleteMany({
//   //     where: {
//   //       scheduleId: Number(id),
//   //       integrationId: Number(integrationId),
//   //       userId: Number(userId)
//   //     },
//   //   });

//   //   const [deleteScheduleEvent, updateIntegrations] = await prisma.$transaction(
//   //     [
//   //       prisma.schedule.deleteMany({
//   //         where: {
//   //           id: Number(id),
//   //           userId: Number(userId)
//   //         },
//   //       }),
//   //       prisma.integrations.updateMany({
//   //         where: {
//   //           id: Number(integrationId),
//   //           userId: Number(userId)
//   //         },
//   //         data: {
//   //           schedule: false,
//   //         },
//   //       }),
//   //     ]
//   //   );

//   //   response({
//   //     res,
//   //     success: true,
//   //     status_code: 200,
//   //     message: "Schedule deleted successfully",
//   //   });
//   // } catch (error) {
//   //   response({
//   //     res,
//   //     success: false,
//   //     status_code: 400,
//   //     message: "Error in deleting schedule",
//   //   });
//   //   console.log("error", error);
//   // }
// };

// // const deleteCustomFilterField = async (mappedRecordId, integrationId, userId) => {
// //   try {
// //     const deleteFilterResult = await prisma.customFilterFields.deleteMany({
// //       where: {
// //         userId: Number(userId),
// //         mappedRecordId: Number(mappedRecordId),
// //         integrationId: Number(integrationId)
// //       }
// //     })

// //     return {
// //       success: true,
// //       error: "filter field deleted successfully",
// //     };
// //   } catch (error) {
// //     console.log("error => ", error)
// //     return {
// //       success: false,
// //       error: "Error in deleting filter condition",
// //     };
// //   }
// // };

// const addMappedFields = async (req, res) => {
//   const {
//     userId,
//     integrationId,
//     mappedRecordId,
//     sourceFieldLabel,
//     sourceFieldValue,
//     destinationFieldValue,
//     operator,
//     fieldType,
//   } = req.body;

//   try {
//     const mappedFields = await prisma.mappedFields.create({
//       data: {
//         userId: userId,
//         integrationId: integrationId,
//         mappedRecordId: mappedRecordId,
//         sourceFieldLabel: sourceFieldLabel,
//         sourceFieldValue: sourceFieldValue,
//         destinationFieldValue: destinationFieldValue,
//         operator: operator,
//         fieldType: fieldType,
//       },
//     });

//     if (mappedFields) {
//       response({
//         res,
//         success: true,
//         status_code: 200,
//         message: "Mapped fields added successfully",
//       });
//     } else {
//       response({
//         res,
//         success: false,
//         status_code: 400,
//         message: "Mapped fields not added successfully",
//       });
//     }
//   } catch (error) {
//     response({
//       res,
//       success: false,
//       status_code: 400,
//       message: "Error in adding mapped fields",
//     });
//     console.log("error", error);
//   }
// };

// const getMappedField = async (req, res) => {
//   const { id, integrationId, mappedRecordId } = req.query;

//   try {
//     const mappedFields = await prisma.mappedFields.findMany({
//       where: {
//         userId: Number(id),
//         integrationId: Number(integrationId),
//         mappedRecordId: Number(mappedRecordId),
//       },
//     });

//     if (mappedFields) {
//       response({
//         res,
//         success: true,
//         status_code: 200,
//         message: "Mapped fields fetched successfully",
//         data: mappedFields,
//       });
//     } else {
//       response({
//         res,
//         success: false,
//         status_code: 400,
//         message: "Mapped fields not fetched successfully",
//       });
//     }
//   } catch (error) {
//     response({
//       res,
//       success: false,
//       status_code: 400,
//       message: "Error in fetching mapped fields",
//     });
//     console.log("error", error);
//   }
// };

// // const addCustomFilterFields = async (req, res) => {
// //   const {
// //     userId,
// //     mappedRecordId,
// //     integrationId,
// //     sourceFieldValue,
// //     sourceFieldLabel,
// //     destinationFieldValue,
// //     destinationFieldLabel,
// //     operator,
// //   } = req.body;

// //   try {
// //     const customFilterFields = await prisma.customFilterFields.create({
// //       data: {
// //         userId: userId,
// //         mappedRecordId: mappedRecordId,
// //         integrationId: integrationId,
// //         sourceFieldValue: sourceFieldValue,
// //         sourceFieldLabel: sourceFieldLabel,
// //         destinationFieldValue: destinationFieldValue,
// //         destinationFieldLabel: destinationFieldLabel,
// //         operator: operator,
// //         creationDate: new Date(),
// //         modificationDate: new Date(),
// //       },
// //     });

// //     if (customFilterFields) {
// //       response({
// //         res,
// //         success: true,
// //         status_code: 200,
// //         message: "Custom filter fields added successfully",
// //       });
// //     } else {
// //       response({
// //         res,
// //         success: false,
// //         status_code: 400,
// //         message: "Custom filter fields not added successfully",
// //       });
// //     }
// //   } catch (error) {
// //     response({
// //       res,
// //       success: false,
// //       status_code: 400,
// //       message: "Error in adding custom filter fields",
// //     });
// //     console.log("error", error);
// //   }
// // };

// // const getCustomFilterFields = async (req, res) => {
// //   try {
// //     const { userId, integrationId, mappedRecordId } = req.query;

// //     const filterData = await prisma.customFilterFields.findMany({
// //       where: {
// //         userId: Number(userId),
// //         mappedRecordId: Number(mappedRecordId),
// //         integrationId: Number(integrationId),
// //       },
// //     });

// //     response({
// //       res,
// //       success: true,
// //       status_code: 200,
// //       data: filterData,
// //       message: "Successfully get filter fields",
// //     });
// //   } catch (error) {
// //     response({
// //       res,
// //       success: false,
// //       status_code: 400,
// //       data: [],
// //       message: "Error in fetching filter fields",
// //     });
// //   }
// // };

// // const updateFilterFieldsById = async (req, res) => {
// //   try {
// // const { id } = req.params;
// // const {
// //   userId,
// //   mappedRecordId,
// //   integrationId,
// //   sourceFieldValue,
// //   sourceFieldLabel,
// //   destinationFieldValue,
// //   destinationFieldLabel,
// //   operator
// // } = req.body;

// // const filterData = await prisma.customFilterFields.updateMany({
// //   where: {
// //     id:  Number(id),
// //     userId: Number(userId),
// //     integrationId: Number(integrationId),
// //     mappedRecordId: Number(mappedRecordId)
// //   },
// //   data: {
// //     sourceFieldValue: sourceFieldValue,
// //     sourceFieldLabel: sourceFieldLabel,
// //     destinationFieldValue: destinationFieldValue,
// //     destinationFieldLabel: destinationFieldLabel,
// //     operator: operator,
// //     modificationDate: new Date(),
// //   }
// // })

// // response({
// //   res,
// //   success: true,
// //   status_code: 200,
// //   message: "Filter fields updated successfully."
// // })
// // return;

// //   } catch (error) {
// //     console.log("filterData error", error)
// //     response({
// //       res,
// //       success: false,
// //       status_code: 400,
// //       message: "Error while updating records."
// //     })
// //   }
// // }

// // Pending
// const scheduleTask = async (req, res) => {
//   // console.log("req.date", req.body.date);
//   try {
//     // schedule the job to a requested date and end date
//     // const date = new Date(req.body.date);
//     // const endDate = new Date(req.body.endDate);
//     // const date = new Date(2023, 4, 21, 5, 9, 1);
//     const rule = new schedule.RecurrenceRule();
//     rule.second = 1;
//     rule.minute = 0;
//     rule.hour = 0;

//     schedule.scheduleJob(rule, function () {
//       // console.log("starting...", new Date());

//       // if(new Date() == endDate){
//       //     job.cancel();
//       //     console.log("ended", new Date());
//       // }
//     });

//     response({
//       res,
//       success: true,
//       status_code: 200,
//       message: "Scheduled Task",
//     });
//   } catch (error) {
//     response({
//       res,
//       success: false,
//       status_code: 400,
//       message: "Error in creating Mapped record",
//     });
//     console.log("error", error);
//   }
// };

// const getMappedRecordByIntegrationId = async (req, res) => {
//   const { id, integrationId } = req.query;

//   try {
//     const mappedRecordData = await prisma.mappedRecords.findMany({
//       where: {
//         userId: Number(id),
//         integrationId: Number(integrationId),
//       },
//       select: {
//         id: true,
//         mappedRecordName: true,
//         recordTypeLabel: true,
//         integrationId: true,
//       },
//     });
//     if (mappedRecordData) {
//       response({
//         res,
//         success: true,
//         status_code: 200,
//         data: mappedRecordData,
//         message: "Mapped record fetched successfully",
//       });
//       return;
//     } else {
//       response({
//         res,
//         success: false,
//         status_code: 400,
//         message: "Mapped record not fetched",
//       });
//       return;
//     }
//   } catch (error) {
//     response({
//       res,
//       success: false,
//       status_code: 400,
//       message: "Error in fetching Mapped record",
//     });
//     console.log("error", error);
//     return;
//   }
// };

// const getNetsuiteFiledsByRecordId = async (req, res) => {
//   try {
//     const { recordId, userId } = req.query;
//     const mappedRecord = await prisma.mappedRecords.findMany({
//       where: {
//         userId: Number(userId),
//         id: Number(recordId),
//       },
//       select: {
//         integrationId: true,
//         recordTypeValue: true,
//       },
//     });

//     const credentials = await prisma.configurations.findMany({
//       where: {
//         userId: Number(userId),
//         id: mappedRecord[0].integrationId,
//         systemName: "NetSuite™",
//       },
//       select: {
//         accountId: true,
//         consumerKey: true,
//         consumerSecretKey: true,
//         accessToken: true,
//         accessSecretToken: true,
//       },
//     });

//     const result = {
//       recordType: mappedRecord[0].recordTypeValue,
//       credentials: credentials[0],
//       integrationId: mappedRecord[0].integrationId,
//     };

//     response({
//       res,
//       success: true,
//       status_code: 200,
//       data: [result],
//       message: "Netsuite fields fetched successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     response({
//       res,
//       success: false,
//       status_code: 400,
//       message: "Error in fetching Netsuite fields",
//     });
//   }
// };

// const getFields = async (req, res) => {
//   const {
//     accountId,
//     consumerKey,
//     consumerSecretKey,
//     accessToken,
//     accessSecretToken,
//     recordType,
//   } = req.query;
//   try {
//     const authentication = {
//       account: accountId,
//       consumerKey: consumerKey,
//       consumerSecret: consumerSecretKey,
//       tokenId: accessToken,
//       tokenSecret: accessSecretToken,
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
//       recordtype: recordType,
//     };

//     const payload = JSON.stringify(data);
//     const headers = {
//       "Content-Type": "application/json",
//       Authorization: oAuth_String,
//     };

//     await axios({
//       method: "POST",
//       url: url,
//       headers: headers,
//       data: payload,
//     })
//       .then((values) => {
//         // console.log(values.data);
//         response({
//           res,
//           success: true,
//           status_code: 200,
//           data: [values.data],
//           message: "Fields fetched successfully",
//         });
//       })
//       .catch((error) => {
//         console.log(error);
//         response({
//           res,
//           success: false,
//           status_code: 400,
//           message: "Error in fetching fields",
//         });
//       });
//   } catch (error) {
//     console.log(error);
//     response({
//       res,
//       success: false,
//       status_code: 400,
//       message: "Error in fetching fields",
//     });
//   }
// };

// const getLogs = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const result = await prisma.logs.findMany({
//       where: {
//         userId: Number(id),
//       },
//       select: {
//         id: true,
//         userId: true,
//         integrationId: true,
//         mappedRecordId: true,
//         scheduleId: true,
//         recordType: true,
//         status: true,
//         logMessage: true,
//         internalId: true,
//         integration: {
//           select: {
//             integrationName: true,
//           },
//         },
//         mappedRecord: {
//           select: {
//             recordTypeLabel: true,
//           },
//         },
//         creationDate: true,
//         modificationDate: true,
//       },
//     });

//     response({
//       res,
//       success: true,
//       status_code: 200,
//       data: result,
//       message: "Get all Logs",
//     });
//   } catch (error) {
//     console.log("error", error);
//     response({
//       res,
//       success: false,
//       status_code: 400,
//       data: [],
//       message: "Error while fetching data",
//     });
//   }
// };

// const syncEventData = async (
//   userId,
//   eventId,
//   integrationId,
//   mappedRecordId
// ) => {
//   try {
//     const [scheduleData, mappedRecord] = await prisma.$transaction([
//     prisma.schedule.findMany({
//       where: {
//         userId: Number(userId),
//         id: Number(eventId),
//         integrationId: Number(integrationId),
//         mappedRecordId: Number(mappedRecordId),
//       },
//       select: {
//         id: true,
//         userId: true,
//         integrationId: true,
//         mappedRecordId: true,
//         eventType: true,
//         startDate: true,
//         endDate: true,
//         startTimeLabel: true,
//         startTimeValue: true,
//         day: true,
//         noEndDate: true,
//         repeatEveryDay: true,
//         operationType: true,
//         source: true,
//         range: true,
//       },
//     }),
//     prisma.mappedRecords.findMany({
//       where: {
//         id: Number(mappedRecordId),
//         userId: Number(userId),
//         integrationId: Number(integrationId),
//       },
//       select: {
//         status: true,
//         sheetLabel: true,
//       },
//     }),
//   ]);
//     console.log("scheduleData", scheduleData);

//     if (mappedRecord[0].status) {
//     switch (scheduleData[0].eventType) {
//       // case "Realtime":
//       //   scheduleRealTimeEvent(
//       //     userId,
//       //     eventId,
//       //     integrationId,
//       //     mappedRecordId,
//       //     scheduleData[0].startDate,
//       //     scheduleData[0].endDate,
//       //     scheduleData[0].noEndDate,
//       //     scheduleData[0].operationType,
//       //     scheduleData[0].source,
//       //     scheduleData[0].range
//       //   );
//       //   break;

//       case "Single":
//         const singleEventResult = await scheduleSingleEvent(
//           userId,
//           eventId,
//           integrationId,
//           mappedRecordId,
//           scheduleData[0].startDate,
//           scheduleData[0].startTimeLabel,
//           scheduleData[0].startTimeValue,
//           scheduleData[0].endDate,
//           scheduleData[0].repeatEveryDay,
//           scheduleData[0].noEndDate,
//           scheduleData[0].operationType,
//           scheduleData[0].source,
//           scheduleData[0].range
//         );
//         // console.log("singleEventResult", singleEventResult)
//         return singleEventResult;
//         break;

//       case "Weekly":
//         const weeklyEventResult = await scheduleWeeklyEvent(
//           userId,
//           eventId,
//           integrationId,
//           mappedRecordId,
//           scheduleData[0].startDate,
//           scheduleData[0].startTimeLabel,
//           scheduleData[0].startTimeValue,
//           scheduleData[0].day,
//           scheduleData[0].endDate,
//           scheduleData[0].noEndDate,
//           scheduleData[0].operationType,
//           scheduleData[0].source,
//           scheduleData[0].range
//         );
//         // console.log("weeklyEventResult", weeklyEventResult)
//         return weeklyEventResult;
//         break;

//       default:
//         console.log("event not found");
//     }
//      } else {
//       console.log("****status false", mappedRecord[0].sheetLabel);
//       return {
//         success: false,
//         error: `Please active mapped record status for ${mappedRecord[0].sheetLabel} sheet.`
//       }
//     }

//     // const res = {
//     //   success: true,
//     //   status_code: 200,
//     //   message: "Event scheduled successfully",
//     // };
//     // return res;
//   } catch (error) {
//     console.log("syncEventData error", error);
//     return {
//       success: false,
//       error: "Error to sync data."
//     }
//     // throw error;
//   }
// };

// const scheduleRealTimeEvent = async (
//   userId,
//   eventId,
//   integrationId,
//   mappedRecordId,
//   startDate,
//   endDate,
//   noEndDate,
//   operationType,
//   source,
//   range
// ) => {
//   try {
//     // date format is 2023-06-13T06:50:01.308Z
//     const dateObj = new Date(startDate);
//     const year = dateObj.getFullYear();
//     const month = dateObj.getMonth() + 1;
//     const day = dateObj.getDate();

//     console.log(`date => * * ${day} ${month} *`);

//     // cron.schedule(`* * ${day} ${month} *`, async function () {
//       // console.log("schedule RealTime Event", new Date());

//       const accessToken = await getAccessTokenByUserId(userId);
//       // console.log("accessToken", accessToken);
//       const res = await syncData(
//         userId,
//         mappedRecordId,
//         integrationId,
//         operationType,
//         source,
//         range,
//         eventId,
//         accessToken.data
//       );
//       // result.push(res);
//     // });
//   } catch (error) {
//     console.log("scheduleRealTimeEvent error => ", error);
//   }
// };

// // start date, start time, repeat every day (checkbox), end date, no end date (checkbox)
// const scheduleSingleEvent = async(
//   userId,
//   eventId,
//   integrationId,
//   mappedRecordId,
//   startDate,
//   startTimeLabel,
//   startTimeValue,
//   endDate,
//   repeatEveryDay,
//   noEndDate,
//   operationType,
//   source,
//   range
// ) => {
//   try {
//     // *** startDate and startTime from user
//     const dateObj = new Date(startDate);
//     const year = dateObj.getFullYear();
//     const month = dateObj.getMonth() + 1;
//     const day = dateObj.getDate();

//     // let hour, minute;
//     // console.log("startTimeValue", startTimeValue)
//     // const [time, ampm] = startTimeValue.split(" ");
//     // console.log("time", time, "ampm", ampm)
//     // if(ampm === "pm" || ampm === "PM"){
//     //   [hour, minute] = time.split(":");
//     //   hour = parseInt(time) + 12;
//     // } else {
//     //   [hour, minute] = time.split(":");
//     // }

//     let hour, minute;
// // console.log("startTimeValue", startTimeValue);
// const [time, ampm] = startTimeValue.split(" ");
// // console.log("time", time, "ampm", ampm);
// if (ampm === "pm" || ampm === "PM") {
//   [hour, minute] = time.split(":");
//   hour = parseInt(hour, 10);  // Parse hour as an integer
//   if (hour !== 12) {
//     hour += 12;  // Add 12 to hour if it's not already 12 pm
//   }
// } else if (ampm === "am" || ampm === "AM") {
//   [hour, minute] = time.split(":");
//   hour = parseInt(hour, 10);  // Parse hour as an integer
//   if (hour === 12) {
//     hour = 0;  // Set hour to 0 if it's 12 am
//   }
// }

//     const repeat = repeatEveryDay ? "*" : day;

//     // ***todays date and time
//     const date = new Date();
//     const todaysYear = date.getFullYear();
//     const TodaysMonth = date.getMonth() + 1;
//     const TodaysDate = date.getDate();
//     const todaysHour = date.getHours();
//     const todaysMinute = date.getMinutes();

//     console.log(`date => ${minute} ${hour} ${repeat} ${month} *`);

//     if (todaysYear === year && TodaysMonth === month && TodaysDate === day) {
//       cron.schedule(
//         `${minute} ${hour} ${repeat} ${month} *`,
//         async function () {
//           // console.log("schedule Single Event", new Date());
//           // const now = new Date();
//           // const options = { timeZone: "Asia/Kolkata" };
//           // const indianDate = now.toLocaleString("en-IN", options);
//           // const [date, time] = indianDate.split(",");
//           // console.log("date", date, "time", time);

//           const accessToken = await getAccessTokenByUserId(userId);
//           // console.log("accessToken", accessToken);
//           const res = await syncData(
//             userId,
//             mappedRecordId,
//             integrationId,
//             operationType,
//             source,
//             range,
//             eventId,
//             accessToken.data
//           );
//           // result.push(res);
//           // console.log("res", res)
//           return res;
//         }
//       );
//     } else {
//       console.log("Check date and time")
//     }
//     return {
//       success: true,
//       message: "Single event scheduled successfully."
//     };
//   } catch (error) {
//     console.log("scheduleSingleEvent error", error);
//     return {
//       success: false,
//       error: "Error for scheduling single event."
//     }
//   }
// };

// // start date, start time, days, end date, no end date (checkbox)
// const scheduleWeeklyEvent = (
//   userId,
//   eventId,
//   integrationId,
//   mappedRecordId,
//   startDate,
//   startTimeLabel,
//   startTimeValue,
//   dayOfWeek,
//   endDate,
//   noEndDate,
//   operationType,
//   source,
//   range
// ) => {
//   try {
//     const dateObj = new Date(startDate);
//     const year = dateObj.getFullYear();
//     const month = dateObj.getMonth() + 1;
//     const day = dateObj.getDate();

//     // let hour, minute;
//     // console.log("startTimeValue", startTimeValue)
//     // const [time, ampm] = startTimeValue.split(" ");
//     // console.log("time", time, "ampm", ampm)
//     // if(ampm === "pm" || ampm === "PM"){
//     //   [hour, minute] = time.split(":");
//     //   hour = parseInt(time) + 12;
//     // } else {
//     //   [hour, minute] = time.split(":");
//     // }

//     let hour, minute;
// // console.log("startTimeValue", startTimeValue);
// const [time, ampm] = startTimeValue.split(" ");
// // console.log("time", time, "ampm", ampm);
// if (ampm === "pm" || ampm === "PM") {
//   [hour, minute] = time.split(":");
//   hour = parseInt(hour, 10);  // Parse hour as an integer
//   if (hour !== 12) {
//     hour += 12;  // Add 12 to hour if it's not already 12 pm
//   }
// } else if (ampm === "am" || ampm === "AM") {
//   [hour, minute] = time.split(":");
//   hour = parseInt(hour, 10);  // Parse hour as an integer
//   if (hour === 12) {
//     hour = 0;  // Set hour to 0 if it's 12 am
//   }
// }

//     const weekDays = [
//       "Sunday",
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//     ];
//     const dayIndex = weekDays.indexOf(dayOfWeek);
//     // console.log(dayOfWeek);

//     // ***todays date and time
//     const date = new Date();
//     const todaysYear = date.getFullYear();
//     const TodaysMonth = date.getMonth() + 1;
//     const TodaysDate = date.getDate();
//     const todaysHour = date.getHours();
//     const todaysMinute = date.getMinutes();


//     // console.log("date", minute, hour, day, month, dayIndex);
//     console.log(`date => ${minute} ${hour} ${day} ${month} ${dayIndex}`);


//     if (todaysYear === year && TodaysMonth === month && TodaysDate === day) {
//     cron.schedule(
//       `${minute} ${hour} ${day} ${month} ${dayIndex}`,
//       async function () {
//         // console.log("schedule Weekly Event", new Date());
//         const accessToken = await getAccessTokenByUserId(userId);

//         const res = await syncData(
//           userId,
//           mappedRecordId,
//           integrationId,
//           operationType,
//           source,
//           range,
//           eventId,
//           accessToken.data
//         );
//         // result.push(res);
//         // console.log("res",res)
//         return res;
//       }
//     );
//     } else {
//       console.log("Check date and time")
//     }

//     return {
//       success: true,
//       message: "Weekly event scheduled successfully."
//     };
//   } catch (error) {
//     // console.log("scheduleWeeklyEvent error", error);
//     return {
//       success: false,
//       error: "Error for scheduling single event."
//     }
//   }
// };

// const syncData = async (
//   userId,
//   mappedRecordId,
//   integrationId,
//   operationType,
//   source,
//   range,
//   id,
//   accessToken
// ) => {
//   try {
//     const [mappedRecord, credentials] = await prisma.$transaction([
//       prisma.mappedRecords.findMany({
//         where: {
//           id: Number(mappedRecordId),
//           userId: Number(userId),
//           integrationId: Number(integrationId),
//         },
//         select: {
//           id: true,
//           mappedRecordName: true,
//           recordTypeValue: true,
//           recordTypeLabel: true,
//           workBookLabel: true,
//           workBookValue: true,
//           sheetLabel: true,
//           sheetValue: true,
//           status: true,
//         },
//       }),

//       prisma.configurations.findMany({
//         where: {
//           userId: Number(userId),
//           integrationId: Number(integrationId),
//           systemName: "NetSuite™",
//         },
//         select: {
//           accountId: true,
//           consumerKey: true,
//           consumerSecretKey: true,
//           accessToken: true,
//           accessSecretToken: true,
//         },
//       }),
//     ]);

//     // if (mappedRecord[0].status) {
//       switch (source) {
//         case "NetSuite":
//           const nsResult = await netsuiteOperations(
//             userId,
//             mappedRecordId,
//             integrationId,
//             operationType,
//             range,
//             id,
//             mappedRecord,
//             credentials,
//             accessToken
//           );
//           return nsResult;

//         case "Google Sheet":
//           const gsResult = await googleSheetsOperations(
//             userId,
//             mappedRecordId,
//             integrationId,
//             operationType,
//             mappedRecord,
//             credentials,
//             accessToken,
//             id,
//             range
//           );
//           // console.log("gsResult", gsResult)
//           return gsResult;

//         default:
//           console.log("source not matched");
//       }
//     // } else {
//     //   console.log("****status false", mappedRecord[0].sheetLabel);
//     //   return {
//     //     success: false,
//     //     error: "Error: mapped record status is false."
//     //   }
//     // }
//   } catch (error) {
//     console.log("syncData error", error);
//     // return error;
//     return {
//       success: false,
//       error: "Error for sync data."
//     }
//   }
// };

// const getAccessTokenByUserId = async (userId) => {
//   try {
//     const token = await prisma.credentials.findMany({
//       where: {
//         userId: Number(userId),
//       },
//     });

//     const data = {
//       refresh_token: token[0].refreshToken,
//       grant_type: "refresh_token",
//       client_id:
//         "350110252536-v0id00m9oaathq39hv7o8i1nmj584et1.apps.googleusercontent.com",
//       client_secret: "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",
//     };

//     const url = `https://oauth2.googleapis.com/token?refresh_token=${data.refresh_token}&grant_type=${data.grant_type}&client_id=${data.client_id}&client_secret=${data.client_secret}`;
//     const headers = {
//       "Content-Type": "application/x-www-form-urlencoded",
//     };

//     try {
//       const response = await axios({
//         method: "POST",
//         url: url,
//         headers: headers,
//       });

//       console.log(response.data.access_token);
//       // return response.data.access_token;
//       return {
//         success: true,
//         data: response.data.access_token
//       }
//     } catch (error) {
//       console.log("getAccessTokenByUserId error", error.response.data);
//       // ***invalid_grant
//       //   throw error;
//       return {
//         success: false,
//         error: error.response.data.error_description
//       }
//     }
//   } catch (error) {
//     console.log("getAccessTokenByUserId error=>", error);
//     // throw error;
//     return {
//       success: false,
//       error: "Error while fetching access token."
//     }
//   }
// };

// const netsuiteOperations = async (
//   userId,
//   mappedRecordId,
//   integrationId,
//   operationType,
//   range,
//   id,
//   mappedRecord,
//   credentials,
//   accessToken
// ) => {
//   try {
//     const sheetsValue = await getSheetsData(mappedRecord, userId, accessToken);
//     const values = sheetsValue.data.values;
    
//     // sheetsValue
//     //   .then((values) => {
//     //     const result = getMappedFields(
//     //       credentials,
//     //       values.data.values,
//     //       mappedRecord,
//     //       userId,
//     //       operationType,
//     //       integrationId,
//     //       range,
//     //       id,
//     //       accessToken
//     //     );

//     //     result
//     //       .then((data) => {
//     //         return data;
//     //       })
//     //       .catch((error) => {
//     //         console.log("netsuiteOperations error", error);
//     //         return error;
//     //       });
//     //   })
//     //   .catch((error) => {
//     //     console.log("netsuiteOperations error=>", error.data);
//     //     return error;
//     //   });

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
//           const addResult = await addNetsuiteV1Api(
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
//           return addResult;

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
//       // throw error;
//       return {
//         success: false,
//         error: "Fields not mapped"
//       }
//     }
//   } catch (error) {
//     console.log("netsuiteOperations error==>", error);
//     // return error;
//     return {
//       success: false,
//       error: "Error for NetSuite operations."
//     }
//   }
// };

// const getSheetsData = async (mappedRecord, userId, accessToken) => {
//   try {
//     const url = `https://sheets.googleapis.com/v4/spreadsheets/${mappedRecord[0].workBookValue}/values/${mappedRecord[0].sheetLabel}!A1:ZZ100000`;
//     const headers = {
//       Authorization: `Bearer ${accessToken}`,
//     };
//     try {
//       const res = await axios({
//         method: "GET",
//         url: url,
//         headers: headers,
//       });
//       return res;
//     } catch (error) {
//       console.log("getSheetsData error", error);
//       // throw error;
//       return {
//         success: false,
//         error: "Sheets data not fetched."
//       }
//     }
//   } catch (error) {
//     console.log("getSheetsData error=>", error);
//     // throw error;
//     return {
//       success: false,
//       error: "Error while fetching sheets data."
//     }
//   }
// };

// // const getMappedFields = async (
// //   credentials,
// //   values,
// //   mappedRecord,
// //   userId,
// //   operationType,
// //   integrationId,
// //   range,
// //   id,
// //   accessToken
// // ) => {
// //   try {
// //     const mappedFields = await prisma.fields.findMany({
// //       where: {
// //         userId: Number(userId),
// //         mappedRecordId: Number(mappedRecord[0].id),
// //       },
// //       select: {
// //         id: true,
// //         sourceFieldValue: true,
// //         destinationFieldValue: true,
// //       },
// //     });

// //     if (mappedFields.length > 0 && values.length > 1) {
// //       switch (operationType) {
// //         case "add":
// //           const result = await addNetsuiteV1Api(
// //             credentials,
// //             values,
// //             mappedRecord,
// //             mappedFields,
// //             userId,
// //             integrationId,
// //             id,
// //             range,
// //             accessToken,
// //           );
// //           return result;

// //         case "update":
// //           const updateResult = await updateNetsuiteV1Api(
// //             credentials,
// //             values,
// //             mappedRecord,
// //             mappedFields,
// //             userId,
// //             integrationId,
// //             range,
// //             accessToken,
// //             id
// //           );
// //           return updateResult;

// //         case "delete":
// //           const deleteResult = await deleteNetsuiteV1Api(
// //             credentials,
// //             values,
// //             mappedRecord,
// //             mappedFields,
// //             userId,
// //             integrationId,
// //             range,
// //             accessToken,
// //             id
// //           );
// //           return deleteResult;

// //         default:
// //           console.log("operationType not matched");
// //           throw error;
// //       }
// //     } else {
// //       console.log("fields not mapped");
// //       throw error;
// //     }
// //   } catch (error) {
// //     console.log("getMappedFields error", error);
// //     throw error;
// //   }
// // };

// function getNonce(length) {
//   const alphabet =
//     "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//   return Array.from(crypto.randomFillSync(new Uint8Array(length)))
//     .map((x) => alphabet[x % alphabet.length])
//     .join("");
// }

// const addNetsuiteV1Api = async (
//   credentials,
//   values,
//   mappedRecord,
//   mappedFields,
//   userId,
//   integrationId,
//   id,
//   range,
//   accessToken,
// ) => {
//   console.log("add record in ns");
//   try {
//     const headerRow = values[0];
//     const sheetsData = await getSheetsDataByRange(
//       userId,
//       range,
//       mappedRecord,
//       accessToken
//     );
//     const dataRows = sheetsData.values;

//     const resultArray = [];

//     for (const dataRow of dataRows) {
//       const record = {
//         resttype: "Add",
//         recordtype: mappedRecord[0].recordTypeValue,
//         bodyfields: {},
//         linefields: [{}],
//       };

//       // for (const field of mappedFields) {
//       //   const sourceField = field.sourceFieldValue;
//       //   const destinationField = field.destinationFieldValue;
//       //   const fieldValue = dataRow[mappedFields.indexOf(field)];

//       //   if (sourceField.includes("__")) {
//       //     const [parentField, childField] = sourceField.split("__");
//       //     if (!record.linefields[parentField]) {
//       //       record.linefields[parentField] = [];
//       //     }
//       //     const lineFieldObject = record.linefields[parentField].find(
//       //       (lineField) => Object.keys(lineField)[0] === childField
//       //     );
//       //     if (lineFieldObject) {
//       //       lineFieldObject[childField] = fieldValue;
//       //     } else {
//       //       const newLineField = { [childField]: fieldValue };
//       //       record.linefields[parentField].push(newLineField);
//       //     }
//       //   } else {
//       //     record.bodyfields[sourceField] = fieldValue;
//       //   }
//       // }

//       for (const field of mappedFields) {
//         const sourceField = field.sourceFieldValue;
//         const destinationField = field.destinationFieldValue;
//         const fieldValue = dataRow[mappedFields.indexOf(field)];

//         if (sourceField.includes("__")) {
//           const [parentField, childField] = sourceField.split("__");
//           if (!record.linefields[parentField]) {
//             record.linefields[parentField] = [];
//           }
//           const lineFieldObject = record.linefields[parentField].find(
//             (lineField) => Object.keys(lineField)[0] === childField
//           );
//           if (lineFieldObject) {
//             lineFieldObject[childField] = fieldValue;
//           } else {
//             const newLineField = { [childField]: fieldValue };
//             record.linefields[parentField].push(newLineField);
//           }
//         } else {
//           record.bodyfields[sourceField] = fieldValue;
//         }
//       }

//       if (Object.keys(record.linefields).length > 0) {
//         resultArray.push(record);
//       } else {
//         // Only add the record if linefields have data
//         resultArray.push({
//           resttype: "Add",
//           recordtype: mappedRecord[0].recordTypeValue,
//           bodyfields: record.bodyfields,
//           // linefields: record.linefields
//         });
//       }
//     }
//     // console.log("resultArray", resultArray[0].linefields)

//     const logs = [];
//     let successCount = 0;
//     let errorCount = 0;

//     for (let i = 0; i < resultArray.length; i++) {
//       const item = resultArray[i];
//       const authentication = {
//         account: credentials[0].accountId,
//         consumerKey: credentials[0].consumerKey,
//         consumerSecret: credentials[0].consumerSecretKey,
//         tokenId: credentials[0].accessToken,
//         tokenSecret: credentials[0].accessSecretToken,
//         timestamp: Math.floor(Date.now() / 1000).toString(),
//         nonce: getNonce(10),
//         http_method: "POST",
//         version: "1.0",
//         scriptDeploymentId: "1",
//         scriptId: "1529",
//         signatureMethod: "HMAC-SHA256",
//       };

//       const base_url =
//         "https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl";
//       const concatenatedString = `deploy=${authentication.scriptDeploymentId}&oauth_consumer_key=${authentication.consumerKey}&oauth_nonce=${authentication.nonce}&oauth_signature_method=${authentication.signatureMethod}&oauth_timestamp=${authentication.timestamp}&oauth_token=${authentication.tokenId}&oauth_version=${authentication.version}&script=${authentication.scriptId}`;
//       const baseString = `${authentication.http_method}&${encodeURIComponent(
//         base_url
//       )}&${encodeURIComponent(concatenatedString)}`;
//       const keys = `${authentication.consumerSecret}&${authentication.tokenSecret}`;
//       const signature = crypto
//         .createHmac("sha256", keys)
//         .update(baseString)
//         .digest("base64");
//       const oAuth_String = `OAuth realm="${
//         authentication.account
//       }", oauth_consumer_key="${authentication.consumerKey}", oauth_token="${
//         authentication.tokenId
//       }", oauth_nonce="${authentication.nonce}", oauth_timestamp="${
//         authentication.timestamp
//       }", oauth_signature_method="HMAC-SHA256", oauth_version="1.0", oauth_signature="${encodeURIComponent(
//         signature
//       )}"`;

//       const url = `https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=${authentication.scriptId}&deploy=${authentication.scriptDeploymentId}`;
// console.log("body", item.bodyfields)
// console.log("line", item.linefields)

//       // try {
//       //   const res = await axios({
//       //     method: "POST",
//       //     url: url,
//       //     headers: {
//       //       Authorization: oAuth_String,
//       //       "Content-Type": "application/json",
//       //     },
//       //     data: item,
//       //   });

//       //   console.log("output => ", res.data);

//       //   if (res.data.add_success) {
//       //     successCount++;
//       //   } else if (res.data.add_error) {
//       //     errorCount++;
//       //     logs.push({
//       //       userId: userId,
//       //       scheduleId: id,
//       //       integrationId: integrationId,
//       //       mappedRecordId: mappedRecord[0].id,
//       //       recordType: mappedRecord[0].recordTypeLabel,
//       //       status: "Error",
//       //       internalid: item.bodyfields.internalid,
//       //       message: res.data.add_error.message,
//       //     });
//       //   }
//       // } catch (error) {
//       //   console.log("addNetsuiteV1Api error", error);
//       //   return {
//       //     success: false,
//       //     error: "Error while adding data in NetSuite."
//       //   }
//       // }
//     }

//     const summaryMessage = `Successfully added ${successCount} records in NetSuite out of ${resultArray.length}`;
//     if(successCount > 0){
//       logs.unshift({
//         userId: userId,
//         scheduleId: Number(id),
//         integrationId: integrationId,
//         mappedRecordId: mappedRecord[0].id,
//         recordType: mappedRecord[0].recordTypeLabel,
//         status: "Success",
//         message: summaryMessage,
//       });
//     }

//     const response = {
//       success: true,
//       data: {
//         successCount,
//         errorCount,
//         logs,
//       },
//     };
//     console.log("logs", logs)
//     // addLogs(logs);
//     return response;
//   } catch (error) {
//     console.log("addNetsuiteV1Api error => ", error);
//     // throw error;
//     return {
//       success: false,
//       error: "Error for add records in NetSuite."
//     }
//   }
// };

// const updateNetsuiteV1Api = async (
//   credentials,
//   values,
//   mappedRecord,
//   mappedFields,
//   userId,
//   integrationId,
//   range,
//   accessToken,
//   id
// ) => {
//   console.log("update record in ns");
//   const logs = [];
//   let updatedCount = 0;
//   let errorCount = 0;

//   try {
//     const filterData = await prisma.customFilterFields.findMany({
//       where: {
//         userId: Number(userId),
//         integrationId: Number(integrationId),
//         mappedRecordId: Number(mappedRecord[0].id),
//       },
//     });

//     const sheetsData = await getSheetsDataByRange(
//       userId,
//       range,
//       mappedRecord,
//       accessToken
//     );

//     const sheetsValue = await getSheetsData(mappedRecord, userId, accessToken);
    
//     const sheetHeader = sheetsValue.data.values[0].indexOf(
//       filterData[0].destinationFieldLabel
//     );

//     await Promise.all(
//       sheetsData.values.map(async (row) => {
//         const fieldValue = row[sheetHeader];
//         const bodyfields = {};

//         mappedFields.forEach((field) => {
//           const columnIndex = values[0].indexOf(field.destinationFieldValue);
//           if (columnIndex !== -1) {
//             bodyfields[field.sourceFieldValue] = row[columnIndex];
//           }
//         });

//         const result = {
//           resttype: "Update",
//           recordtype: mappedRecord[0].recordTypeValue,
//           bodyfields: bodyfields,
//           filters: {
//             bodyfilters: [
//               [
//                 filterData[0].sourceFieldValue,
//                 filterData[0].operator,
//                 fieldValue,
//               ],
//             ],
//           },
//         };

//         const authentication = {
//           account: credentials[0].accountId,
//           consumerKey: credentials[0].consumerKey,
//           consumerSecret: credentials[0].consumerSecretKey,
//           tokenId: credentials[0].accessToken,
//           tokenSecret: credentials[0].accessSecretToken,
//           timestamp: Math.floor(Date.now() / 1000).toString(),
//           nonce: getNonce(10),
//           http_method: "POST",
//           version: "1.0",
//           scriptDeploymentId: "1",
//           scriptId: "1529",
//           signatureMethod: "HMAC-SHA256",
//         };

//         const base_url =
//           "https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl";
//         const concatenatedString = `deploy=${authentication.scriptDeploymentId}&oauth_consumer_key=${authentication.consumerKey}&oauth_nonce=${authentication.nonce}&oauth_signature_method=${authentication.signatureMethod}&oauth_timestamp=${authentication.timestamp}&oauth_token=${authentication.tokenId}&oauth_version=${authentication.version}&script=${authentication.scriptId}`;
//         const baseString = `${authentication.http_method}&${encodeURIComponent(
//           base_url
//         )}&${encodeURIComponent(concatenatedString)}`;
//         const keys = `${authentication.consumerSecret}&${authentication.tokenSecret}`;
//         const signature = crypto
//           .createHmac("sha256", keys)
//           .update(baseString)
//           .digest("base64");
//         const oAuth_String = `OAuth realm="${
//           authentication.account
//         }", oauth_consumer_key="${authentication.consumerKey}", oauth_token="${
//           authentication.tokenId
//         }", oauth_nonce="${authentication.nonce}", oauth_timestamp="${
//           authentication.timestamp
//         }", oauth_signature_method="HMAC-SHA256", oauth_version="1.0", oauth_signature="${encodeURIComponent(
//           signature
//         )}"`;

//         const url = `https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=${authentication.scriptId}&deploy=${authentication.scriptDeploymentId}`;

//         try {
//           const res = await axios({
//             method: "POST",
//             url: url,
//             headers: {
//               Authorization: oAuth_String,
//               "Content-Type": "application/json",
//             },
//             data: result,
//           });

//           // console.log("output => ", res.data);

//           if (res.data[0].update_success) {
//             updatedCount++;
//           } else if (res.data[0].update_error) {
//             errorCount++;
//             logs.push({
//               userId: userId,
//               scheduleId: id,
//               integrationId: integrationId,
//               mappedRecordId: mappedRecord[0].id,
//               recordType: mappedRecord[0].recordTypeLabel,
//               status: "Error",
//               internalid: res.data[0].update_error.recordid,
//               message: res.data[0].update_error.message,
//             });
//           }
//         } catch (error) {
//           console.log("updateNetsuiteV1Api error", error);
//           // throw error;
//           return {
//             success: false,
//             error: "Error while updating NetSuite data."
//           }
//         }
//       })
//     );

//     const summaryMessage = `Successfully updated ${updatedCount} records in NetSuite out of ${sheetsData.values.length}`;
//     if (updatedCount > 0) {
//       logs.unshift({
//         userId: userId,
//         scheduleId: Number(id),
//         integrationId: integrationId,
//         mappedRecordId: mappedRecord[0].id,
//         recordType: mappedRecord[0].recordTypeLabel,
//         status: "Success",
//         message: summaryMessage,
//       });
//     }

//     const response = {
//       success: true,
//       data: {
//         updatedCount,
//         errorCount,
//         logs,
//       },
//     };
//     console.log("logs", logs)
//     // addLogs(logs);
//     return response;
//   } catch (error) {
//     console.log("Please add filter to update the record");
//     console.log("updateNetsuiteV1Api error => ", error);
//     // return error;
//     return {
//       success: false,
//       error: "Error for update records in Netsuite."
//     }
//   }
// };

// const getSheetsDataByRange = async (
//   userId,
//   range,
//   mappedRecord,
//   accessToken
// ) => {
//   try {

//     const url = `https://sheets.googleapis.com/v4/spreadsheets/${mappedRecord[0].workBookValue}/values/${mappedRecord[0].sheetLabel}!${range}`;
//     const headers = {
//       Authorization: `Bearer ${accessToken}`,
//     };

//     return axios({
//       method: "GET",
//       url: url,
//       headers: headers,
//     })
//       .then((values) => {
//         return values.data;
//       })
//       .catch((error) => {
//         console.log("getSheetsDataByRange error =>", error.response.data);
//         // return error;
//         return {
//           success: false,
//           error: "Error for fetching sheets data."
//         }
//       });
//   } catch (error) {
//     console.log("getSheetsDataByRange error", error);
//     // throw error;
//     return {
//       success: false,
//       error: "Error while fetching sheets data using range."
//     }
//   }
// };

// // delete data from netsuite
// const deleteNetsuiteV1Api = async (
//   credentials,
//   values,
//   mappedRecord,
//   mappedFields,
//   userId,
//   integrationId,
//   range,
//   accessToken,
//   id
// ) => {
//   console.log("delete record from ns");
//   const logs = [];
//   let deleteCount = 0;
//   let errorCount = 0;
//   try {
//     const filterData = await prisma.customFilterFields.findMany({
//       where: {
//         userId: Number(userId),
//         integrationId: Number(integrationId),
//         mappedRecordId: Number(mappedRecord[0].id),
//       },
//     });

//     const sheetsData = await getSheetsDataByRange(
//       userId,
//       range,
//       mappedRecord,
//       accessToken
//     );

//     const sheetsValue = await getSheetsData(mappedRecord, userId, accessToken);
   
//     const sheetHeader = sheetsValue.data.values[0].indexOf(
//       filterData[0].destinationFieldLabel
//     );
//     await Promise.all(
//       sheetsData.values.map(async (row) => {
       
//         const fieldValue = row[sheetHeader];
//         const filter = [
//           filterData[0].sourceFieldValue,
//           filterData[0].operator,
//           fieldValue,
//         ];

//         const deleteRecord = {
//           resttype: "Delete",
//           recordtype: mappedRecord[0].recordTypeValue,
//           filters: {
//             bodyfilters: [filter],
//           },
//         };

//         const authentication = {
//           account: credentials[0].accountId,
//           consumerKey: credentials[0].consumerKey,
//           consumerSecret: credentials[0].consumerSecretKey,
//           tokenId: credentials[0].accessToken,
//           tokenSecret: credentials[0].accessSecretToken,
//           timestamp: Math.floor(Date.now() / 1000).toString(),
//           nonce: getNonce(10),
//           http_method: "POST",
//           version: "1.0",
//           scriptDeploymentId: "1",
//           scriptId: "1529",
//           signatureMethod: "HMAC-SHA256",
//         };

//         const base_url =
//           "https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl";
//         const concatenatedString = `deploy=${authentication.scriptDeploymentId}&oauth_consumer_key=${authentication.consumerKey}&oauth_nonce=${authentication.nonce}&oauth_signature_method=${authentication.signatureMethod}&oauth_timestamp=${authentication.timestamp}&oauth_token=${authentication.tokenId}&oauth_version=${authentication.version}&script=${authentication.scriptId}`;
//         const baseString = `${authentication.http_method}&${encodeURIComponent(
//           base_url
//         )}&${encodeURIComponent(concatenatedString)}`;
//         const keys = `${authentication.consumerSecret}&${authentication.tokenSecret}`;
//         const signature = crypto
//           .createHmac("sha256", keys)
//           .update(baseString)
//           .digest("base64");
//         const oAuth_String = `OAuth realm="${
//           authentication.account
//         }", oauth_consumer_key="${authentication.consumerKey}", oauth_token="${
//           authentication.tokenId
//         }", oauth_nonce="${authentication.nonce}", oauth_timestamp="${
//           authentication.timestamp
//         }", oauth_signature_method="HMAC-SHA256", oauth_version="1.0", oauth_signature="${encodeURIComponent(
//           signature
//         )}"`;

//         const url = `https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=${authentication.scriptId}&deploy=${authentication.scriptDeploymentId}`;

//         try {
//           const res = await axios({
//             method: "POST",
//             url: url,
//             headers: {
//               Authorization: oAuth_String,
//               "Content-Type": "application/json",
//             },
//             data: deleteRecord,
//           });

//           if (res.data[0].delete_success) {
//             deleteCount++;
//           } else if (res.data[0].delete_error) {
//             errorCount++;
//             logs.push({
//               userId: userId,
//               scheduleId: id,
//               integrationId: integrationId,
//               mappedRecordId: mappedRecord[0].id,
//               recordType: mappedRecord[0].recordTypeLabel,
//               status: "Error",
//               internalid: res.data[0].delete_error.recordid,
//               message: res.data[0].delete_error.message,
//             });
//           }
//         } catch (error) {
//           console.log("deleteNetsuiteV1Api error", error);
//           // return error;
//           return {
//             success: false,
//             error: "Error while deleting records from NetSuite."
//           }
//         }
//       })
//     );

//     const summaryMessage = `Successfully deleted ${deleteCount} records from NetSuite out of ${sheetsData.values.length}`;
//     if (deleteCount > 0) {
//       logs.unshift({
//         userId: userId,
//         scheduleId: Number(id),
//         integrationId: integrationId,
//         mappedRecordId: mappedRecord[0].id,
//         recordType: mappedRecord[0].recordTypeLabel,
//         status: "Success",
//         message: summaryMessage,
//       });
//     }

//     const response = {
//       success: true,
//       data: {
//         deleteCount,
//         errorCount,
//         logs,
//       },
//     };
//     console.log("logs", logs)
//     // addLogs(logs);
//     return response;

//   } catch (error) {
//     console.log("Please add filter to delete record");
//     console.log("deleteNetsuiteV1Api error => ", error);
//     // return error;
//     return {
//       success: false,
//       error: "Error for delete recordes from NetSuite."
//     } 
//   }
// };

// const googleSheetsOperations = async (
//   userId,
//   mappedRecordId,
//   integrationId,
//   operationType,
//   mappedRecord,
//   credentials,
//   accessToken,
//   id,
//   range
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

//     if (mappedFields.length > 0) {
//       switch (operationType) {
//         case "add":
//           const addRecordResult = await addGoogleSheetRecords(
//             accessToken,
//             mappedRecord,
//             credentials,
//             userId,
//             mappedRecordId,
//             integrationId,
//             id,
//             mappedFields
//           );
//           // console.log("addRecordResult", addRecordResult)
//           return addRecordResult;

//         case "update":
//           const updateRecordResult = await updateGoogleSheetRecord(
//             accessToken,
//             mappedRecord,
//             credentials,
//             userId,
//             mappedRecordId,
//             integrationId,
//             id,
//             range,
//             mappedFields
//           );
//           return updateRecordResult;

//         case "delete":
//           const deleteRecordResult = await deleteGoogleSheetRecord(
//             accessToken,
//             mappedRecord,
//             credentials,
//             userId,
//             mappedRecordId,
//             integrationId,
//             id,
//             range,
//             mappedFields
//           );
//           return deleteRecordResult;

//         default:
//       }
//     }
//   } catch (error) {
//     console.log("googleSheetsOperations error", error);
//     // return error;
//     return {
//       success: false,
//       error: "Error occured while perfoming google sheet operations."
//     }
//   }
// };

// const addGoogleSheetRecords = async (
//   accessToken,
//   mappedRecord,
//   credentials,
//   userId,
//   mappedRecordId,
//   integrationId,
//   id,
//   mappedFields
// ) => {
//   try {
//     console.log("add record in google sheet");

//     const result = await getNetsuiteDataForAllFields(
//       userId,
//       mappedRecordId,
//       credentials,
//       mappedRecord
//     );

//     const titles = mappedFields.map((field) => field.destinationFieldValue);

//     const records = result.list.map((record) => {
//       const values = record.values;
//       const modifiedValues = {};
//       for (const key in values) {
//         if (Array.isArray(values[key])) {
//           modifiedValues[key] =
//             values[key].length > 0 ? values[key][0].text : "";
//         } else {
//           modifiedValues[key] = values[key];
//         }
//       }
//       return modifiedValues;
//     });
//     const recordValues = records.map((record) => Object.values(record));

//     const recordList = {
//       range: `${mappedRecord[0].sheetLabel}`,
//       majorDimension: "ROWS",
//       values: [titles, ...recordValues],
//     };

//     const url = `https://sheets.googleapis.com/v4/spreadsheets/${mappedRecord[0].workBookValue}/values/${mappedRecord[0].sheetLabel}!A1:ZZ100000:clear`;
//     const headers = {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${accessToken}`,
//     };
//     const bodyData = {
//       spreadsheetId: mappedRecord[0].workBookValue,
//       range: `${mappedRecord[0].sheetLabel}!A2:ZZ100000`,
//     };

//     try {
//       await axios({
//         method: "POST",
//         url: url,
//         headers: headers,
//         body: bodyData,
//       })
//         // .then((res) => {
//           const appendRecordResult = await appendFields(
//             userId,
//             mappedRecordId,
//             integrationId,
//             mappedRecord,
//             accessToken,
//             recordList,
//             recordValues.length,
//             id
//           );
//           // console.log("appendRecordResult", appendRecordResult)
//           return appendRecordResult;

//         // })
//         // .catch((error) => {
//         //   console.log("addGoogleSheetRecords error", error.response.data);
//         //   // access token error
//         // });
//     } catch (error) {
//       console.log("addGoogleSheetRecords error => ", error);
//       return {
//         success: false,
//         error: "Error while adding records in Google Sheets."
//       }
//     }
//   } catch (error) {
//     console.log("addGoogleSheetRecords error=> ", error.response.data);
//     // return error;
//     return {
//       success: false,
//       error: "Error for add records in Google Sheet."
//     }
//   }
// };

// const getNetsuiteDataForAllFields = async(
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

//     const columns = [];
//     mappedFields.map((field) =>{
//       const fieldId =  field.sourceFieldValue
//       if(fieldId.includes("__")){
//         const [parentId, childId] = fieldId.split("__")
//         columns.push(childId)
//       } else {
//         columns.push(fieldId)
//       }
//     });
//     const data = {
//       resttype: "Search",
//       recordtype: mappedRecord[0].recordTypeValue,
//     //   filters: [
//     //     [
//     //         "mainline",
//     //         "is",
//     //         "F"
//     //     ], "AND", 
//     //     // [
//     //     //   "shippingline", "is", "F"
//     //     // ], "AND", 
//     //     ["taxline", "is", "F"], "AND",
//     //     ["cogs", "is", "F"]
//     // ],
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
//         console.log("getNetsuiteDataForAllFields error", error);
//         // throw error;
//         return {
//           success: false,
//           error: "Error while fetching data."
//         }
//       });
//   } catch (error) {
//     console.log("getNetsuiteDataForAllFields error => ", error);
//     // return error;
//     return {
//       success: false,
//       error: "Error while fetching data."
//     }
//   }
// }

// // const getNetsuiteData = async (
// //   userId,
// //   mappedRecordId,
// //   credentials,
// //   mappedRecord
// // ) => {
// //   try {
// //     const mappedFields = await prisma.fields.findMany({
// //       where: {
// //         userId: Number(userId),
// //         mappedRecordId: Number(mappedRecordId),
// //       },
// //       select: {
// //         id: true,
// //         sourceFieldValue: true,
// //         destinationFieldValue: true,
// //       },
// //     });

// //     const columns = mappedFields.map((field) => field.sourceFieldValue);
// //     const data = {
// //       resttype: "Search",
// //       recordtype: mappedRecord[0].recordTypeValue,
// //       columns: ["internalid"],
// //     };

// //     const authentication = {
// //       account: credentials[0].accountId,
// //       consumerKey: credentials[0].consumerKey,
// //       consumerSecret: credentials[0].consumerSecretKey,
// //       tokenId: credentials[0].accessToken,
// //       tokenSecret: credentials[0].accessSecretToken,
// //       timestamp: Math.floor(Date.now() / 1000).toString(),
// //       nonce: getNonce(10),
// //       http_method: "POST",
// //       version: "1.0",
// //       scriptDeploymentId: "1",
// //       scriptId: "1529",
// //       signatureMethod: "HMAC-SHA256",
// //     };

// //     const base_url =
// //       "https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl";
// //     const concatenatedString = `deploy=${authentication.scriptDeploymentId}&oauth_consumer_key=${authentication.consumerKey}&oauth_nonce=${authentication.nonce}&oauth_signature_method=${authentication.signatureMethod}&oauth_timestamp=${authentication.timestamp}&oauth_token=${authentication.tokenId}&oauth_version=${authentication.version}&script=${authentication.scriptId}`;
// //     const baseString = `${authentication.http_method}&${encodeURIComponent(
// //       base_url
// //     )}&${encodeURIComponent(concatenatedString)}`;
// //     const keys = `${authentication.consumerSecret}&${authentication.tokenSecret}`;
// //     const signature = crypto
// //       .createHmac("sha256", keys)
// //       .update(baseString)
// //       .digest("base64");
// //     const oAuth_String = `OAuth realm="${
// //       authentication.account
// //     }", oauth_consumer_key="${authentication.consumerKey}", oauth_token="${
// //       authentication.tokenId
// //     }", oauth_nonce="${authentication.nonce}", oauth_timestamp="${
// //       authentication.timestamp
// //     }", oauth_signature_method="HMAC-SHA256", oauth_version="1.0", oauth_signature="${encodeURIComponent(
// //       signature
// //     )}"`;

// //     const url = `https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=${authentication.scriptId}&deploy=${authentication.scriptDeploymentId}`;

// //     return axios({
// //       method: "POST",
// //       url: url,
// //       headers: {
// //         Authorization: oAuth_String,
// //         "Content-Type": "application/json",
// //       },
// //       data: data,
// //     })
// //       .then(async (res) => {
// //         const internalIds = res.data.list.map(
// //           (item) => item.values.internalid[0].text
// //         );
// //         const uniqueIds = [...new Set(internalIds)];
// //         const fieldValues = await getCustomeRecord(
// //           credentials,
// //           mappedRecord[0].recordTypeValue,
// //           uniqueIds,
// //           columns
// //         );
// //         return fieldValues;
// //       })
// //       .catch((error) => {
// //         console.log("getNetsuiteData error", error);
// //         throw error;
// //       });
// //   } catch (error) {
// //     console.log("getNetsuiteData error => ", error);
// //     return error;
// //   }
// // };

// // const getCustomeRecord = async (
// //   credentials,
// //   recordTypeValue,
// //   uniqueIds,
// //   columns
// // ) => {
// //   const result = [];
// //   await Promise.all(
// //     uniqueIds.map(async (internalId) => {
// //       const record = {
// //         resttype: "Record",
// //         recordtype: recordTypeValue,
// //         recordid: internalId,
// //         bodyfields: [],
// //         linefields: [{}],
// //       };

// //       columns.forEach((col) => {
// //         if (col.includes("__")) {
// //           const [parentField, childField] = col.split("__");

// //           const lineField = record.linefields[0];

// //           if (lineField.hasOwnProperty(parentField)) {
// //             lineField[parentField].push(childField);
// //           } else {
// //             lineField[parentField] = [childField];
// //           }
// //         } else {
// //           record.bodyfields.push(col);
// //         }
// //       });

// //       const authentication = {
// //         account: credentials[0].accountId,
// //         consumerKey: credentials[0].consumerKey,
// //         consumerSecret: credentials[0].consumerSecretKey,
// //         tokenId: credentials[0].accessToken,
// //         tokenSecret: credentials[0].accessSecretToken,
// //         timestamp: Math.floor(Date.now() / 1000).toString(),
// //         nonce: getNonce(10),
// //         http_method: "POST",
// //         version: "1.0",
// //         scriptDeploymentId: "1",
// //         scriptId: "1529",
// //         signatureMethod: "HMAC-SHA256",
// //       };

// //       const base_url =
// //         "https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl";

// //       const concatenatedString = `deploy=${authentication.scriptDeploymentId}&oauth_consumer_key=${authentication.consumerKey}&oauth_nonce=${authentication.nonce}&oauth_signature_method=${authentication.signatureMethod}&oauth_timestamp=${authentication.timestamp}&oauth_token=${authentication.tokenId}&oauth_version=${authentication.version}&script=${authentication.scriptId}`;

// //       const baseString = `${authentication.http_method}&${encodeURIComponent(
// //         base_url
// //       )}&${encodeURIComponent(concatenatedString)}`;

// //       const keys = `${authentication.consumerSecret}&${authentication.tokenSecret}`;

// //       const signature = crypto
// //         .createHmac("sha256", keys)
// //         .update(baseString)
// //         .digest("base64");

// //       const oAuth_String = `OAuth realm="${
// //         authentication.account
// //       }", oauth_consumer_key="${authentication.consumerKey}", oauth_token="${
// //         authentication.tokenId
// //       }", oauth_nonce="${authentication.nonce}", oauth_timestamp="${
// //         authentication.timestamp
// //       }", oauth_signature_method="HMAC-SHA256", oauth_version="1.0", oauth_signature="${encodeURIComponent(
// //         signature
// //       )}"`;

// //       const url = `https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=${authentication.scriptId}&deploy=${authentication.scriptDeploymentId}`;

// //       try {
// //         const res = await axios({
// //           method: "POST",
// //           url: url,
// //           headers: {
// //             Authorization: oAuth_String,
// //             "Content-Type": "application/json",
// //           },
// //           data: record,
// //         });

// //         result.push(res.data);
// //       } catch (error) {
// //         throw error;
// //       }
// //     })
// //   );
// //   return result;
// // };

// const appendFields = async (
//   userId,
//   mappedRecordId,
//   integrationId,
//   mappedRecord,
//   accessToken,
//   recordList,
//   count,
//   id
// ) => {
//   const logs = [];
//   try {
//     const urlParams = {
//       valueInputOption: "USER_ENTERED",
//     };
//     const headers = {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${accessToken}`,
//     };
//     const url = `https://sheets.googleapis.com/v4/spreadsheets/${mappedRecord[0].workBookValue}/values/${mappedRecord[0].sheetLabel}:append?valueInputOption=${urlParams.valueInputOption}`;

//     try {
//       const request = await axios({
//         method: "POST",
//         url: url,
//         headers: headers,
//         data: recordList,
//       });
//       console.log("request", request.data);

//       const summaryMessage = `Successfully added ${
//         request.data.updates.updatedRows - 1
//       } records in Google Sheet out of ${count}`;
//       if (count > 0) {
//         logs.push({
//           userId: userId,
//           scheduleId: Number(id),
//           integrationId: integrationId,
//           mappedRecordId: mappedRecordId,
//           recordType: mappedRecord[0].recordTypeLabel,
//           status: "Success",
//           message: summaryMessage,
//         });
//       }

//       const response = {
//         success: true,
//         data: request.data,
//       };
//       console.log("logs", logs)
//       addLogs(logs);
//       return response;
//     } catch (error) {
//       console.log("addGoogleSheetRecords error", error.response.data);
//       // return error;
//       return {
//         success: false,
//         error: "Error for add records in Google Sheet."
//       }
//     }
//   } catch (error) {
//     console.log("appendFields error => ", error);
//     return {
//       success: false,
//       error: "Error while append data in google sheet."
//     }
//   }
// };

// const updateGoogleSheetRecord = async (
//   accessToken,
//   mappedRecord,
//   credentials,
//   userId,
//   mappedRecordId,
//   integrationId,
//   id,
//   range,
//   mappedFields
// ) => {
//   try {
//     console.log("update record in google sheet");

//     const filterData = await prisma.customFilterFields.findMany({
//       where: {
//         userId: Number(userId),
//         integrationId: Number(integrationId),
//         mappedRecordId: Number(mappedRecordId),
//       },
//     });

//     const columns = []
//     mappedFields.map((field) => {
//       columns.push(field.sourceFieldValue)
//           })
// //     mappedFields.map((field) => {
// // // columns.push(field.sourceFieldValue)
// // const fieldId =  field.sourceFieldValue
// //       if(fieldId.includes("__")){
// //         const [parentId, childId] = fieldId.split("__")
// //         columns.push(childId)
// //       } else {
// //         columns.push(fieldId)
// //       }
// //     })

//     const sheetsData = await getSheetsDataByRange(
//       userId,
//       range,
//       mappedRecord,
//       accessToken
//     );

//     const sheetsValue = await getSheetsData(mappedRecord, userId, accessToken);
//     const fieldIndex = sheetsValue.data.values[0].indexOf(
//       filterData[0].destinationFieldLabel
//     );

//     const existingRecords = []

//     const results = await Promise.all(
//     sheetsData.values.map(async(row) => {

// const authentication = {
//   account: credentials[0].accountId,
//   consumerKey: credentials[0].consumerKey,
//   consumerSecret: credentials[0].consumerSecretKey,
//   tokenId: credentials[0].accessToken,
//   tokenSecret: credentials[0].accessSecretToken,
//   timestamp: Math.floor(Date.now() / 1000).toString(),
//   nonce: getNonce(10),
//   http_method: "POST",
//   version: "1.0",
//   scriptDeploymentId: "1",
//   scriptId: "1529",
//   signatureMethod: "HMAC-SHA256",
// };

// const base_url =
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
//       resttype: "Search",
//       recordtype: mappedRecord[0].recordTypeValue,
//       filters: [
//           [
//             filterData[0].sourceFieldValue,
//               "is",
//               row[fieldIndex]
//           ]
//       ],
//       columns: columns
//   };
//   // console.log("updated data", data)

//   existingRecords.push(row)

//     try {
//       const res = await axios({
//         method: "POST",
//         url: url,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: oAuth_String,
//         },
//         data: data,
//       });

//       return res.data;

//     } catch (error) {
//       console.log("updateNetsuiteV1Api error", error);
//       // throw error;
//       return {
//         success: false,
//         error: "Error for updating records in Google sheet."
//       }
//     }
//   })
//     );

//     const addFieldsResult = await addFields(accessToken, mappedRecord, range, results, userId, id, integrationId, mappedRecordId, existingRecords)
//     return addFieldsResult;

//   } catch (error) {
//     console.log("updateGoogleSheetRecord error=> ", error);
//     // return error;
//     return {
//       success: false,
//       error: "Error for update records."
//     }
//   }
// };

// const addFields = async (accessToken, mappedRecord, range, result, userId, id, integrationId, mappedRecordId, existingRecords) => {
//   const logs = [];
//   let recordCount = 0;
//   const records = []
//   const recordValues = []

//  result.map((record, index) => {
//    if(record.list.length > 0) {
//       recordCount++
//       const values = record.list[0].values;
//       const modifiedValues = {};

//       for (const key in values) {
//         if (Array.isArray(values[key])) {
//           modifiedValues[key] =
//             values[key].length > 0 ? values[key][0].text : "";
//         } else {
//           modifiedValues[key] = values[key];
//         }
//       }
//       recordValues.push(Object.values(modifiedValues));

//     } else {
//       recordCount++
//         const summaryMessage = `Records are not available in Netsuite`;
//         logs.push({
//         userId: userId,
//         scheduleId: Number(id),
//         integrationId: integrationId,
//         mappedRecordId: mappedRecordId,
//         recordType: mappedRecord[0].recordTypeLabel,
//         status: "Error",
//         message: summaryMessage,
//         });

//         recordValues.push(existingRecords[index])
//     }
//   });

//     if(recordCount > 0){

//   const headers = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${accessToken}`,
//   };

//   const url = `https://sheets.googleapis.com/v4/spreadsheets/${mappedRecord[0].workBookValue}/values/${mappedRecord[0].sheetLabel}!${range}?valueInputOption=USER_ENTERED`

//   const recordList = {
//     range: `${mappedRecord[0].sheetLabel}!${range}`,
//     majorDimension: "ROWS",
//     values: recordValues
//   }

//   try {
//     const request = await axios({
//       method: "PUT",
//       url: url,
//       headers: headers,
//       data: recordList,
//     });
//     // console.log("request", request.data)

//     const summaryMessage = `Successfully updated ${request.data.updatedRows} records in Google Sheet out of ${recordCount}`;
//       if (recordCount > 0) {
//         logs.push({
//           userId: userId,
//           scheduleId: Number(id),
//           integrationId: integrationId,
//           mappedRecordId: mappedRecordId,
//           recordType: mappedRecord[0].recordTypeLabel,
//           status: "Success",
//           message: summaryMessage,
//         });
//       }

//       const response = {
//         success: true,
//         data: request.data,
//       };
//       console.log("logs", logs)
//       // addLogs(logs);
//       return response;

//   } catch (error) {
//     console.log("addFields error", error);
//     // return error;
//     return {
//       success: false,
//       error: "Error for update records in Google Sheet."
//     }
//   }
// }
// }

// const deleteGoogleSheetRecord = async (
//   accessToken,
//   mappedRecord,
//   credentials,
//   userId,
//   mappedRecordId,
//   integrationId,
//   id,
//   range,
//   mappedFields
// ) => {  
//   let deleteCount = 0;

//   try {
//     console.log("delete record from google sheet");

//     const filterData = await prisma.customFilterFields.findMany({
//       where: {
//         userId: Number(userId),
//         integrationId: Number(integrationId),
//         mappedRecordId: Number(mappedRecordId),
//       },
//     });

//     const filterCondition = filterData[0].sourceFieldValue

//     const columns = []
//     mappedFields.map((field) => {
// columns.push(field.sourceFieldValue)
//     })

//     const sheetsData = await getSheetsDataByRange(
//       userId,
//       range,
//       mappedRecord,
//       accessToken
//     );
//     // console.log("sheetsData by range", sheetsData)

//     const sheetsValue = await getSheetsData(mappedRecord, userId, accessToken);
//     const fieldIndex = sheetsValue.data.values[0].indexOf(
//       filterData[0].destinationFieldLabel
//     );
//     // console.log("fieldIndex", fieldIndex)

//     const deleteFields = []
//     const results = await Promise.all(
//       sheetsData.values.map(async(row) => {

// const authentication = {
//   account: credentials[0].accountId,
//   consumerKey: credentials[0].consumerKey,
//   consumerSecret: credentials[0].consumerSecretKey,
//   tokenId: credentials[0].accessToken,
//   tokenSecret: credentials[0].accessSecretToken,
//   timestamp: Math.floor(Date.now() / 1000).toString(),
//   nonce: getNonce(10),
//   http_method: "POST",
//   version: "1.0",
//   scriptDeploymentId: "1",
//   scriptId: "1529",
//   signatureMethod: "HMAC-SHA256",
// };

// const base_url =
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
//       resttype: "Search",
//       recordtype: mappedRecord[0].recordTypeValue,
//       filters: [
//           [
//             filterData[0].sourceFieldValue,
//               "is",
//               row[fieldIndex]
//           ]
//       ],
//       columns: columns
//   };

//     try {
//       const res = await axios({
//         method: "POST",
//         url: url,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: oAuth_String,
//         },
//         data: data,
//       });

//       if(res.data.total === 0){
//       //   Object.entries(res.data.list[0].values).map(([key, value]) => {
//       //     if(key === filterCondition) {
//       //       deleteFields.push(value)  
//       //     }
//       //  })
//       deleteFields.push(row[fieldIndex])
//       }   
//     } catch (error) {
//       console.log("deleteGoogleSheetRecord error", error.response.data);
//       // throw error;
//       return {
//         success: false,
//         error: "Error for delete records from Google sheet."
//       }
//     }
//   })
//   );
//   // console.log("deleteFields", deleteFields)
//   const deleteRecordResponse = await deleterecord(userId, id, integrationId, mappedRecordId, mappedRecord, accessToken, deleteFields, fieldIndex, filterCondition);
//   // console.log("deleteRecordResponse", deleteRecordResponse)
//   return deleteRecordResponse;

//   } catch (error) {
//     console.log("deleteGoogleSheetRecord error=> ", error.response.data);
//     deleteCount++;
//     // return error;
//     return {
//       success: false,
//       error: "Error for delete records from Google sheet."
//     }
//   }

//   // const response = {
//   //     success: true,
//   //     data: {
//   //       deleteRecordResponse[0],
//   //       deleteRecordResponse[1] + deleteCount,
//   //       deleteRecordResponse[2],
//   //     },
//   //   };
//   //   return response;
// };

// const deleterecord = async (userId, id, integrationId, mappedRecordId, mappedRecord, accessToken, deleteFields, fieldIndex, filterCondition) => {
//   try {
//     const logs = [];
//     let deleteCount = 0;
//     let count = 0;
//     let errorCount = 0;

//     await Promise.all(
//       deleteFields.map(async (field) => {
//         let sheetsValue = await getSheetsData(mappedRecord, userId, accessToken);
//         await Promise.all(
//           sheetsValue.data.values.map(async (row, i) => {
//             if (row[fieldIndex] === field) {
//               // console.log("row to delete", row)
//               count++;

//               const url = `https://sheets.googleapis.com/v4/spreadsheets/${mappedRecord[0].workBookValue}:batchUpdate`;

//               const headers = {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${accessToken}`,
//               };

//               // console.log("start", i, "end", i+1)

//               const data = {
//                 requests: [
//                   {
//                     deleteDimension: {
//                       range: {
//                         sheetId: mappedRecord[0].sheetValue,
//                         dimension: "ROWS",
//                         startIndex: i,
//                         endIndex: i + 1,
//                       },
//                     },
//                   },
//                 ],
//               };
//               try {
//                 const res = await axios({
//                   method: "POST",
//                   url: url,
//                   headers: headers,
//                   data: data,
//                 });

//                 // console.log("output => ", res.data);
//                 deleteCount++;
//                 // console.log("start", i, "end", i+1)
//               } catch (error) {
//                 errorCount++;
//                 console.log("deleterecord error", error);
//               }
//               sheetsValue = await getSheetsData(mappedRecord, userId, accessToken);
//             }
//           })
//         );
//       })
//     );

//     const summaryMessage = `Successfully deleted ${deleteCount} records from Google Sheet out of ${count}`;
//     if (deleteCount > 0) {
//       logs.push({
//         userId: userId,
//         scheduleId: Number(id),
//         integrationId: integrationId,
//         mappedRecordId: mappedRecordId,
//         recordType: mappedRecord[0].recordTypeLabel,
//         status: "Success",
//         message: summaryMessage,
//       });
//     }

//     const response = {
//       success: true,
//       data: {
//         deleteCount,
//         errorCount,
//         logs,
//       },
//     };
//   //  const response = [deleteCount, errorCount, logs]
//   console.log("logs", logs)
//     // addLogs(logs);
//     return response;

//   } catch (error) {
//     console.log("deleterecord error =>", error);
//     return {
//       success: false,
//       error: "Error for delete records from Google Sheet.",
//     };
//   }
// };

// // const recordField = async (credentials, mappedRecord) => {
// //   try {
// //     const authentication = {
// //       account: credentials[0].accountId,
// //       consumerKey: credentials[0].consumerKey,
// //       consumerSecret: credentials[0].consumerSecretKey,
// //       tokenId: credentials[0].accessToken,
// //       tokenSecret: credentials[0].accessSecretToken,
// //       timestamp: Math.floor(Date.now() / 1000).toString(),
// //       nonce: getNonce(10),
// //       http_method: "POST",
// //       version: "1.0",
// //       scriptDeploymentId: "1",
// //       scriptId: "1529",
// //       signatureMethod: "HMAC-SHA256",
// //     };

// //     const base_url =
// //       "https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl";
// //     const concatenatedString = `deploy=${authentication.scriptDeploymentId}&oauth_consumer_key=${authentication.consumerKey}&oauth_nonce=${authentication.nonce}&oauth_signature_method=${authentication.signatureMethod}&oauth_timestamp=${authentication.timestamp}&oauth_token=${authentication.tokenId}&oauth_version=${authentication.version}&script=${authentication.scriptId}`;
// //     const baseString = `${authentication.http_method}&${encodeURIComponent(
// //       base_url
// //     )}&${encodeURIComponent(concatenatedString)}`;
// //     const keys = `${authentication.consumerSecret}&${authentication.tokenSecret}`;
// //     const signature = crypto
// //       .createHmac("sha256", keys)
// //       .update(baseString)
// //       .digest("base64");
// //     const oAuth_String = `OAuth realm="${
// //       authentication.account
// //     }", oauth_consumer_key="${authentication.consumerKey}", oauth_token="${
// //       authentication.tokenId
// //     }", oauth_nonce="${authentication.nonce}", oauth_timestamp="${
// //       authentication.timestamp
// //     }", oauth_signature_method="HMAC-SHA256", oauth_version="1.0", oauth_signature="${encodeURIComponent(
// //       signature
// //     )}"`;

// //     const url = `https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=${authentication.scriptId}&deploy=${authentication.scriptDeploymentId}`;

// //     const data = {
// //       resttype: "ListOfRecordField",
// //       recordtype: mappedRecord[0].recordTypeValue,
// //     };

// //     const payload = JSON.stringify(data);
// //     const headers = {
// //       "Content-Type": "application/json",
// //       Authorization: oAuth_String,
// //     };

// //     const res = await axios({
// //       method: "POST",
// //       url: url,
// //       headers: headers,
// //       data: payload,
// //     });
// //     return res.data;
// //   } catch (error) {
// //     console.log("recordField error => ", error);
// //     return error;
// //   }
// // };

// const addLogs = async (values) => {
//   try {
//     const logResult = await prisma.logs.createMany({
//       data: values.map((value) => ({
//         userId: Number(value.userId),
//         integrationId: Number(value.integrationId),
//         mappedRecordId: Number(value.mappedRecordId),
//         scheduleId: Number(value.scheduleId),
//         recordType: value.recordType,
//         status: value.status,
//         logMessage: value.message,
//         internalId: value.internalid && Number(value.internalid),
//       })),
//     });

//     const result = {
//       status_code: 200,
//       success: true,
//       message: "Added logs",
//       data: logResult,
//     };
//     // console.log("logResult", result);

//     return result;
//   } catch (error) {
//     console.log("logs error", error);
//     return error;
//   }
// };

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

// // const getFilterDataById = async (req, res) => {
// //   try{
// //     const { id, integrationId, mappedRecordId } = req.query;

// //     const filterResult = await prisma.customFilterFields.findMany({
// //       where: {
// //         userId: Number(id),
// //         mappedRecordId: Number(mappedRecordId),
// //         integrationId: Number(integrationId)
// //       }
// //     })

// //     response({
// //       res,
// //       success: true,
// //       status_code: 200,
// //       data: filterResult,
// //       message: "Successfully get filter fields."
// //     })
// //   } catch(error) {
// //     console.log("getFilterDataById error", error)
// //     response({
// //       res,
// //       success: false,
// //       status_code: 400,
// //       data: [],
// //       message: "Error iwhile fetching filter fields."
// //     })
// //   }
// // }

// module.exports = {
//   addRealTimeEvent,
//   addSingleEvent,
//   addWeeklyEvent,
//   getSchedules,
//   getScheduleEventById,
//   updateRealTimeEvent,
//   updateSingleEvent,
//   updateWeeklyEvent,
//   deleteScheduleEvent,
//   addMappedFields,
//   getMappedField,
//   // addCustomFilterFields,
//   // getCustomFilterFields,
//   // updateFilterFieldsById,
//   scheduleTask,
//   getMappedRecordByIntegrationId,
//   getNetsuiteFiledsByRecordId,
//   getFields,
//   getLogs,
//   // getFilterDataById
// };
