const prisma = require("../lib/prisma");
const response = require("../lib/response");

const addMappedRecord = async (req, res) => {
  const {
    userId,
    integrationId,
    mappedRecordName,
    recordTypeLabel,
    recordTypeValue,
    workBookLabel,
    workBookValue,
    sheetLabel,
    sheetValue
  } = req.body;
  try {
    const [recordMapping, updateCount] = await prisma.$transaction([
      prisma.mappedRecords.create({
        data: {
          userId: Number(userId),
          integrationId: Number(integrationId),
          mappedRecordName: mappedRecordName,
          recordTypeLabel: recordTypeLabel,
          recordTypeValue: recordTypeValue,
          workBookLabel: workBookLabel,
          workBookValue: workBookValue,
          sheetLabel: sheetLabel,
          sheetValue: Number(sheetValue),
          status: false,
        },
      }),
      prisma.integrations.updateMany({
        where: {
          id: Number(req.body.integrationId),
          userId: Number(userId),
        },
        data: {
          fieldMapping: true,
        },
      }),
    ]);

    if (recordMapping) {
      response({
        res,
        success: true,
        status_code: 200,
        data: [recordMapping],
        message: "Mapped record added successfully",
      });
      return;
    } else {
      response({
        res,
        success: false,
        status_code: 400,
        message: "Mapped record not added",
      });
      return;
    }
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

const updateFieldMappingState = async (req, res) => {
  const { id } = req.params;
  const { userId, stateValue } = req.body;

  try {
    const updateFieldMapping = await prisma.mappedRecords.updateMany({
      where: {
        id: Number(id),
        userId: Number(userId),
      },
      data: {
        status: stateValue,
      },
    });

    if (updateFieldMapping) {
      response({
        res,
        success: true,
        status_code: 200,
        data: [updateFieldMapping],
        message: "Field Mapping state updated successfully",
      });
      return;
    } else {
      response({
        res,
        success: false,
        status_code: 400,
        message: "Field Mapping state not updated",
      });
      return;
    }
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in updating Field Mapping state",
    });
    console.log("error", error);
  }
};

const getMappedRecordById = async (req, res) => {
  const { id } = req.params;
  try {
    const recordMapping = await prisma.mappedRecords.findMany({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        userId: true,
        integrationId: true,
        mappedRecordName: true,
        recordTypeLabel: true,
        recordTypeValue: true,
        workBookLabel: true,
        workBookValue: true,
        sheetLabel: true,
        sheetValue: true,
        integration: {
          select: {
            integrationName: true,
          },
        },
      },
    });

    if (recordMapping) {
      response({
        res,
        success: true,
        status_code: 200,
        data: recordMapping,
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

const deleteMappedRecordByID = async (req, res) => {
  // console.log("req.params", req.params)

  try {
    const [deleteRecordMapping, updateIntegrations] = await prisma.$transaction(
      [
        prisma.mappedRecords.delete({
          where: {
            id: Number(req.params.id),
          },
        }),
        prisma.integrations.updateMany({
          where: {
            id: Number(req.params.integrationId),
          },
          data: {
            fieldMapping: false,
          },
        }),
      ]
    );
    // console.log("deleteRecordMapping", deleteRecordMapping)
    if (deleteRecordMapping) {
      response({
        res,
        success: true,
        status_code: 200,
        data: [deleteRecordMapping],
        message: "Mapped record deleted successfully",
      });
      return;
    }
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in deleting Mapped record",
    });
    console.log("error", error);
    return;
  }
};

const getMappedFieldsDetails = async (req, res) => {
  // console.log("req.params.id",req.params.id)
  try {
    const recordMapping = await prisma.mappedRecords.findMany({
      where: {
        userId: Number(req.params.id),
      },
      select: {
        id: true,
        userId: true,
        integrationId: true,
        mappedRecordName: true,
        recordTypeLabel: true,
        workBookLabel: true,
        sheetLabel: true,
        status: true,
        creationDate: true,
        modificationDate: true,
        integration: {
          select: {
            integrationName: true,
            sourceName: true,
            destinationName: true,
          },
        },
      },
    });

    if (recordMapping) {
      response({
        res,
        success: true,
        status_code: 200,
        data: [recordMapping],
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
  }
};

const addFields = async (req, res) => {
  // console.log("req.body", req.body);
  try {
    const [deleteFields, addFields] = await prisma.$transaction([
      prisma.fields.deleteMany({
        where: {
          mappedRecordId: {
            in: req.body.map((field) => field.mappedRecordId),
          },
        },
      }),
      prisma.fields.createMany({
        data: req.body.map((field) => ({
          userId: field.userId,
          mappedRecordId: field.mappedRecordId,
          sourceField: field.sourceField,
          destinationField: field.destinationField,
          sourceFieldValue: field.sourceFieldValue,
          sourceFieldLabel: field.sourceFieldLabel,
          destinationFieldValue: field.destinationFieldValue,
        })),
      }),
    ]);

    if (addFields) {
      response({
        res,
        success: true,
        status_code: 200,
        data: [addFields],
        message: "Fields added successfully",
      });
      return;
    } else {
      response({
        res,
        success: false,
        status_code: 400,
        message: "Fields not added",
      });
      return;
    }
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in adding fields",
    });
    console.log("error", error);
  }
};

const getFields = async (req, res) => {
  // console.log( "req",(req.params.id))
  try {
    const fields = await prisma.fields.findMany({
      where: {
        mappedRecordId: Number(req.params.id),
      },
    });

    if (fields) {
      response({
        res,
        success: true,
        status_code: 200,
        data: fields,
        message: "Fields fetched successfully",
      });
      return;
    } else {
      response({
        res,
        success: false,
        status_code: 400,
        message: "Fields not fetched",
      });
      return;
    }
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in fetching fields",
    });
    console.log("error", error);
    return;
  }
};

const deleteField = async (req, res) => {
  try {
    const field = await prisma.fields.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    if (field) {
      response({
        res,
        success: true,
        status_code: 200,
        data: [field],
        message: "Field deleted successfully",
      });
      return;
    } else {
      response({
        res,
        success: false,
        status_code: 400,
        message: "Field not deleted",
      });
      return;
    }
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      message: "Error in deleting field",
    });
    console.log("error", error);
    return;
  }
};

module.exports = {
  addMappedRecord,
  updateFieldMappingState,
  getMappedRecordById,
  deleteMappedRecordByID,
  getMappedFieldsDetails,
  addFields,
  getFields,
  deleteField,
};
