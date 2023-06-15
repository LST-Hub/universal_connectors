import TkButton from "@/globalComponents/TkButton";
import TkInput from "@/globalComponents/TkInput";
import TkRow, { TkCol } from "@/globalComponents/TkRow";
import TkSelect from "@/globalComponents/TkSelect";
import TkTableContainer from "@/globalComponents/TkTableContainer";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import TkLabel from "@/globalComponents/TkLabel";
import { useRouter } from "next/router";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import tkFetch from "@/utils/fetch";
import { API_BASE_URL } from "@/utils/Constants";
import { TkToastError, TkToastInfo } from "@/globalComponents/TkToastContainer";
import { useFieldArray } from "react-hook-form";
import TkLoader from "@/globalComponents/TkLoader";
import TkNoData from "@/globalComponents/TkNoData";
import DeleteModal from "@/utils/DeleteModal";
import useFullPageLoader from "@/globalComponents/useFullPageLoader";

const MapTableComponent = ({ mappedRecordId, integrationsName }) => {
  let sheetData = useRef(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { register, handleSubmit, setValue, control } = useForm();
  const [netsuiteValues, setNetsuiteValues] = useState([]);
  const [rows, setRows] = useState([]);
  const [integrationId, setIntegrationId] = useState(null);
  const [mappedRecordDetails, setMappedRecordDetails] = useState([]);
  const [configurationData, setConfigurationData] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteFieldId, setDeleteFieldId] = useState();
  const [userId, setUserId] = useState(null);

  const [loader, showLoader, hideLoader] = useFullPageLoader();

  const apiResults = useQueries({
    queries: [
      {
        queryKey: ["getMappedRecordById", mappedRecordId],
        queryFn: tkFetch.get(
          `${API_BASE_URL}/getMappedRecordById/${mappedRecordId}`
        ),
        enabled: !!mappedRecordId,
      },
      {
        queryKey: ["config", integrationId],
        queryFn: tkFetch.get(
          `${API_BASE_URL}/getConfigurationByIntegrationId/${integrationId}`
        ),
        enabled: !!integrationId,
      },
      {
        queryKey: ["configDetails"],
        queryFn: tkFetch.get(`${API_BASE_URL}/getRecordTypes`, {
          params: configurationData,
        }),
        enabled: !!configurationData,
      },
      {
        queryKey: ["getFields", mappedRecordId],
        queryFn: tkFetch.get(`${API_BASE_URL}/getFields/${mappedRecordId}`),
        enabled: !!mappedRecordId,
      },
      {
        queryKey: ["getAccessToken", userId],
        queryFn: tkFetch.get(`${API_BASE_URL}/getAccessToken/${userId}`),
        enabled: !!userId,
      },
      {
        queryKey: ["getSheetsData", sheetData.current],
        queryFn: tkFetch.get(`${API_BASE_URL}/getSheetsData`, {
          params: sheetData.current,
        }),
        enabled: !!sheetData.current,
      },
    ],
  });

  const [
    mappedRecord,
    config,
    restletData,
    getFields,
    asscessToken,
    googleSheetApi,
  ] = apiResults;
  const {
    data: mappedRecordData,
    isLoading: mappedRecordLoading,
    isError: mappedRecordError,
    error: mappedRecordErrorData,
  } = mappedRecord;
  const {
    data: configData,
    isLoading: configLoading,
    isError: configError,
    error: configErrorData,
  } = config;
  const {
    data: restletOptions,
    isLoading: restletLoading,
    isError: restletError,
    error: restletErrorData,
  } = restletData;
  const {
    data: fieldsData,
    isLoading: fieldsLoading,
    isError: fieldsError,
    error: fieldsErrorData,
  } = getFields;
  const {
    isLoading: isAccessTokenLoading,
    isError: isAccessTokenError,
    error: accessTokenError,
    data: accessTokenData,
  } = asscessToken;
  const {
    isLoading: excelSheetLoading,
    isError: excelSheetError,
    error: excelSheetErrorData,
    data: excelSheetData,
    status: excelSheetStatus,
    isFetched: excelSheetFetched,
    isFetching: excelSheetFetching,
  } = googleSheetApi;

  const addFields = useMutation({
    mutationFn: tkFetch.post(`${API_BASE_URL}/addFields`),
  });

  const deleteFields = useMutation({
    mutationFn: tkFetch.deleteWithIdInUrl(`${API_BASE_URL}/deleteField`),
  });

  useEffect(() => {
    const userID = sessionStorage.getItem("userId");

    if (userID) {
      setUserId(JSON.parse(userID));
      //TODO: use let for user id
    }
  }, []);

  useEffect(() => {
    if (accessTokenData && mappedRecordData) {
      sheetData.current = {
        workBookId: mappedRecordData[0].workBookValue,
        sheetLabel: mappedRecordData[0].sheetLabel,
        accessToken: accessTokenData[0].access_token,
      };
    }
  }, [accessTokenData, mappedRecordData]);
  useEffect(() => {
    if (configData) {
      configData.map((item) => {
        if (item.systemName === "NetSuite™") {
          setConfigurationData({
            accountId: item.accountId,
            consumerKey: item.consumerKey,
            consumerSecretKey: item.consumerSecretKey,
            accessToken: item.accessToken,
            accessSecretToken: item.accessSecretToken,
            resttype: "ListOfRecordField",
            recordtype: mappedRecordDetails.recordTypeValue,
          });
        }
      });
    }

    if (restletOptions) {
      // console.log("*********restletOptions", restletOptions)
      setNetsuiteValues([]);
      if (
        restletOptions[0].body.length > 0 ||
        restletOptions[0].lines.length > 0
      ) {
        const entries = Object.entries(restletOptions[0]?.body[0]);
        entries.map(([key, value], index) => {
          // TODO: map inside state fun
          setNetsuiteValues((netsuiteValues) => [
            ...netsuiteValues,
            { label: value + " (field Id: " + key + ")", value: key },
          ]);
        });
        restletOptions[0]?.lines.map((item) => {
          const lineEntries = Object.entries(item);
          lineEntries.map(([key, value], index) => {
            const valueEntries = Object.entries(value);
            valueEntries.map(([key1, value1], index) => {
              const value1Entries = Object.entries(value1);
              value1Entries.map(([key2, value2], index) => {
                // TODO: map inside state fun
                setNetsuiteValues((netsuiteValues) => [
                  ...netsuiteValues,
                  {
                    label: key + ": " + value2 + " (Field Id: " + key2 + ")",
                    value: key + "__" + key2,
                  },
                ]);
              });
            });
          });
        });
      }
    }
  }, [configData, mappedRecordDetails.recordTypeValue, mappedRecordDetails.source, restletOptions]);

  useEffect(() => {
    console.log("fieldsData", fieldsData)
    if (fieldsData?.length > 0) {
      fieldsData.map((field, index) => {
        setValue(
          `destinationFieldValue[${index}]`,
          field.destinationFieldValue || field.googleSheets
        );
        setValue(`sourceFieldValue[${index}]`, {
          value: field.sourceFieldValue,
          label: field.sourceFieldLabel,
        });
      });
      setRows(fieldsData);
      return;
    }
  }, [fieldsData, setValue]);

  useEffect(() => {
    if (fieldsData?.length === 0 && excelSheetData != undefined) {
      const sheetsData = [];
      excelSheetData[0]?.values[0].map((item, index) => {
        setValue(`destinationFieldValue[${index}]`, item);
        setValue(`sourceFieldValue[${index}]`, null);
        sheetsData.push({
          destinationFieldValue: item,
          sourceFieldValue: null,
        });
      });
      setRows([...sheetsData]);
      return;
    }
  }, [excelSheetData, fieldsData, setValue]);
  // excelSheetData, fieldsData, setValue

  useEffect(() => {
    if (mappedRecordData) {
      // TODO: use direct data insted of state :ERROR
      setMappedRecordDetails(mappedRecordData[0]);
      setIntegrationId(mappedRecordData[0].integrationId);

      integrationsName(mappedRecordData[0].integration?.integrationName);
    }
  }, [integrationsName, mappedRecordData]);

  // const customFilter = (option, searchText) => {
  //   console.log("option", option);
  //   console.log("searchText", searchText)
  //   const label = option.label.toLowerCase();
  //   const text = searchText.toLowerCase();
  //   return label.includes(text);
  // }

  const columns = [
    {
      Header: "Google Sheets™ Columns",
      accessor: "destinationFieldValue",
      Cell: ({ row }) => {
        return (
          <TkInput
            type="text"
            {...register(`destinationFieldValue[${row.index}]`)}
            disabled={row.original.destinationFieldValue ? true : false}
          />
        );
      },
    },
    {
      Header: "NetSuite™ Fields",
      accessor: "sourceFieldValue",
      Cell: ({ row }) => {
        return (
          <Controller
            control={control}
            name={`sourceFieldValue[${row.index}]`}
            render={({ field }) => (
              <TkSelect
                {...field}
                options={netsuiteValues}
                maxMenuHeight="100px"
                isSerchable={true}
                // getOptionLabel={(option) => option.label}
                // filterOption={customFilter}
              />
            )}
          />
        );
      },
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: (props) => {
        return (
          <i
            className="ri-delete-bin-5-line pe-auto px-3"
            onClick={() => toggleDeleteModel(props.row.original?.id)}
          />
        );
      },
    },
  ];

  const handleAddRow = () => {
    setRows([...rows, { googleSheets: "", netSuite: null }]);
  };

  const onSubmit = (values) => {
    const userId = sessionStorage.getItem("userId");
    const tableRecord = values.destinationFieldValue.map(
      (destinationFieldValue, index) => {
        return {
          // id: values.id || null,
          userId: JSON.parse(userId),
          mappedRecordId: JSON.parse(mappedRecordId),
          sourceField: "NetSuite™",
          destinationField: "Google Sheets™",
          sourceFieldValue: values.sourceFieldValue[index]?.value,
          sourceFieldLabel: values.sourceFieldValue[index]?.label,
          destinationFieldValue: destinationFieldValue,
        };
      }
    );
    addFields.mutate(tableRecord, {
      onSuccess: (data) => {
        // TkToastInfo("Added Successfully", { hideProgressBar: true });
        queryClient.invalidateQueries({
          queryKey: ["getFields"],
        });
        router.push("/fieldMapping");
      },
      onError: (error) => {
        console.log("error", error);
        TkToastError("Error for add fields");
      },
    });
  };

  const toggleDeleteModel = (fieldId) => {
    setDeleteFieldId(fieldId);
    setDeleteModal(true);
  };

  const onClickDelete = () => {
    deleteFields.mutate(
      { id: deleteFieldId },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ["getFields"],
          });
          setDeleteModal(false);
        },
        onError: (error) => {
          console.log("error", error);
          TkToastError("Error for delete fields");
          setDeleteModal(false);
        },
      }
    );
  };

  const onClickCancel = () => {
    history.back();
  };

  const onClickRefresh = () => {
    showLoader();
    setValue("destinationFieldValue", null);
    setValue("sourceFieldValue", null);
    queryClient.invalidateQueries({
      queryKey: ["getSheetsData"],
    });

    if (excelSheetData?.length > 0) {
      const sheetsRecord = [];

      // using return
      excelSheetData[0]?.values[0].map((item, index) => {
        const row = rows.find((row) => row.destinationFieldValue === item);
        if (row) {
          sheetsRecord.push({
            destinationFieldValue: row.destinationFieldValue,
            sourceFieldValue: row.sourceFieldValue,
          });
        } else {
          sheetsRecord.push({
            id: index,
            destinationFieldValue: item,
            sourceFieldValue: null,
          });
        }
      });
      // set values to table rows
      sheetsRecord.map((item, index) => {
        setValue(`destinationFieldValue[${index}]`, item.destinationFieldValue);
        setValue(
          `sourceFieldValue[${index}]`,
          item.sourceFieldValue
            ? {
                label: item.sourceFieldValue,
                value: item.sourceFieldValue,
              }
            : null
        );
      });

      setRows([...sheetsRecord]);
    }
    hideLoader();
  };

  return (
    <>
      <TkRow className="mb-2">
        <TkCol lg={3}>
          <TkButton className="btn-success" onClick={onClickRefresh}>
            Refresh
          </TkButton>
        </TkCol>
      </TkRow>
      <TkRow>
        <TkCol>
          <TkLabel>
            <span className="fw-bold">
              Record Type: {mappedRecordDetails.recordTypeLabel}
            </span>
            &nbsp;&nbsp;
          </TkLabel>
        </TkCol>
        <TkCol>
          <TkLabel>
            <span className="fw-bold">
              Google Sheet: {mappedRecordDetails.workBookLabel}
            </span>
            &nbsp;&nbsp;
          </TkLabel>
        </TkCol>
      </TkRow>
      <hr />
      <form onSubmit={handleSubmit(onSubmit)}>
        {fieldsLoading ? (
          <TkLoader />
        ) : integrationId ? (
          <>
            <DeleteModal
              show={deleteModal}
              onDeleteClick={onClickDelete}
              onCloseClick={() => setDeleteModal(false)}
              label="Are you sure you want to remove this record ?"
            image={true}
            />
            <TkTableContainer
              columns={columns}
              data={rows || []}
              showPagination={true}
              thClass="text-dark"
            />
          </>
        ) : (
          <TkNoData />
        )}
        {loader}
        <TkButton
          className="btn-success my-2 me-2"
          onClick={handleAddRow}
          type="button"
        >
          Add Row
        </TkButton>
        <TkButton className="btn-success m-2" type="submit">
          Save
        </TkButton>
        <TkButton
          className="btn-success m-2"
          type="button"
          onClick={onClickCancel}
        >
          Cancel
        </TkButton>
      </form>
    </>
  );
};
export default MapTableComponent;
