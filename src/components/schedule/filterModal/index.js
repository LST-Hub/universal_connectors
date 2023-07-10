import TkButton from "@/globalComponents/TkButton";
import TkForm from "@/globalComponents/TkForm";
import TkModal, {
  TkModalBody,
  TkModalHeader,
} from "@/globalComponents/TkModal";
import TkTableContainer from "@/globalComponents/TkTableContainer";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import TkSelect from "@/globalComponents/TkSelect";
import tkFetch from "@/utils/fetch";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/utils/Constants";

const FilterModal = ({
  modal,
  toggle,
  mappedRecordId,
  getFilterDetails,
  eventId,
  integrationId,
}) => {
  // console.log("eventData in modal", eventData);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: undefined,
  });

  const queryClient = useQueryClient();
  const [userId, setUserId] = useState(null);
  const [sourceFieldOptions, setSourceFieldOptions] = useState([]);
  const [destinationFieldOptions, setDestinationFieldOptions] = useState([]);
  const [credentials, setCredentials] = useState(null);
  const [filterIds, setFilterIds] = useState(null);
  const [rows, setRows] = useState([]);

  const operators = [
    { label: "is", value: "is" },
    { label: "equalTo", value: "equalTo" },
    { label: "anyOf", value: "anyOf" },
  ];
  0;

  const addCustomFilterFields = useMutation({
    mutationFn: tkFetch.post(`${API_BASE_URL}/addCustomFilterFields`),
  });

  const updateFilterFieldsById = useMutation({
    mutationFn: tkFetch.putWithIdInUrl(
      `${API_BASE_URL}/updateFilterFieldsById`
    ),
  });

  const apiResults = useQueries({
    queries: [
      {
        queryKey: ["getNetsuiteFiledsByRecordId", mappedRecordId],
        queryFn: tkFetch.get(`${API_BASE_URL}/getNetsuiteFiledsByRecordId`, {
          params: { recordId: mappedRecordId, userId: userId },
        }),
        enabled: !!mappedRecordId && !!userId,
      },
      {
        queryKey: ["configData"],
        queryFn: tkFetch.get(`${API_BASE_URL}/getRecordTypes`, {
          params: credentials,
        }),
        enabled: !!credentials,
      },
      // {
      //   queryKey: ["customFilterFields"],
      //   queryFn: tkFetch.get(`${API_BASE_URL}/getCustomFilterFields`, {
      //     params: filterIds,
      //   }),
      //   enabled: !!filterIds,
      // },
      {
        queryKey: ["getFields", mappedRecordId],
        queryFn: tkFetch.get(`${API_BASE_URL}/getFields/${mappedRecordId}`),
        enabled: !!mappedRecordId,
      },
      {
        queryKey: ["getCustomFilterFieldsById", eventId],
        queryFn: tkFetch.get(`${API_BASE_URL}/getCustomFilterFieldsById`, {
          // params: filterIds
          params: {
            userId: userId,
            scheduleId: eventId,
            integrationId: integrationId,
            mappedRecordId: mappedRecordId,
          },
        }),
        // enabled: !!filterIds,
        enabled: !!userId && !!eventId && !!integrationId && !!mappedRecordId,
      },
    ],
  });

  const [configuration, recodTypeFields, getFields, filterFields] = apiResults;

  const {
    isLoading: configurationLoading,
    isError: configurationError,
    error: configurationErrorData,
    data: configurationData,
  } = configuration;
  const {
    isLoading: recodTypeFieldsLoading,
    isError: recodTypeFieldsError,
    error: recodTypeFieldsErrorData,
    data: recodTypeFieldsData,
  } = recodTypeFields;
  // const {
  //   isLoading: customFilterFieldsLoading,
  //   isError: customFilterFieldsError,
  //   error: customFilterFieldsErrorData,
  //   data: customFilterFieldsData,
  // } = customFilterFields;
  const {
    data: fieldsData,
    isLoading: fieldsLoading,
    isError: fieldsError,
    error: fieldsErrorData,
  } = getFields;
  const {
    data: filterFieldsData,
    isLoading: filterFieldsLoading,
    isError: filterFieldsError,
    error: filterFieldsErrorData,
  } = filterFields;

  const columns = [
    {
      Header: "NetSuite™ fields",
      accessor: "netsuiteFields",
      Cell: ({ row }) => {
        return (
          <Controller
            name={`netsuiteFields[${row.index}]`}
            control={control}
            render={({ field }) => (
              <TkSelect
                {...field}
                options={sourceFieldOptions}
                maxMenuHeight="100px"
                isSerchable={true}
              />
            )}
          />
        );
      },
    },
    {
      Header: "Operator",
      accessor: "operator",
      Cell: ({ row }) => {
        return (
          <Controller
            name={`operator[${row.index}]`}
            control={control}
            render={({ field }) => (
              <TkSelect
                {...field}
                options={operators}
                maxMenuHeight="100px"
                isSerchable={true}
              />
            )}
          />
        );
      },
    },
    {
      Header: "Google sheet fields",
      accessor: "googleSheetFields",
      Cell: ({ row }) => {
        return (
          <Controller
            name={`googleSheetFields[${row.index}]`}
            control={control}
            render={({ field }) => (
              <TkSelect
                {...field}
                maxMenuHeight="100px"
                options={destinationFieldOptions}
              />
            )}
          />
        );
      },
    },
  ];

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["getCustomFilterFieldsById", eventId],
    });
    const userId = sessionStorage.getItem("userId");
    setUserId(JSON.parse(userId));
    setFilterIds({
      userId: JSON.parse(userId),
      scheduleId: eventId,
      integrationId: integrationId,
      mappedRecordId: mappedRecordId,
    });
  }, [eventId, integrationId, mappedRecordId, queryClient]);

  useEffect(() => {
    if (configurationData && userId) {
      setCredentials({
        accountId: configurationData[0].credentials.accountId,
        consumerKey: configurationData[0].credentials.consumerKey,
        consumerSecretKey: configurationData[0].credentials.consumerSecretKey,
        accessToken: configurationData[0].credentials.accessToken,
        accessSecretToken: configurationData[0].credentials.accessSecretToken,
        resttype: "ListOfRecordField",
        recordtype: configurationData[0].recordType,
      });

      // setFilterIds({
      //   userId: userId,
      //   integrationId: configurationData[0].integrationId,
      //   mappedRecordId: mappedRecordId,
      // });
    }
  }, [configurationData, mappedRecordId, userId]);

  // options for fields dropdown
  useEffect(() => {
    if (fieldsData) {
      setSourceFieldOptions(
        fieldsData.map((item) => {
          return {
            label: item.sourceFieldLabel,
            value: item.sourceFieldValue,
          };
        })
      );

      setDestinationFieldOptions(
        fieldsData.map((item) => {
          return {
            label: item.destinationFieldValue,
            value: item.destinationFieldValue,
          };
        })
      );
    }
  }, [fieldsData]);

  // Existing filter fields data
  useEffect(() => {
    if (filterFieldsData) {
      // if (filterFieldsData[0].operator) {
      // console.log("eventData in modal", eventData[0].operator);
      // getFilterDetails(filterFieldsData);
      filterFieldsData.map((item, index) => {
        // console.log("item", item);
        setValue(`netsuiteFields[${index}]`, {
          label: item.sourceFieldLabel,
          value: item.sourceFieldValue,
        });
        setValue(`operator[${index}]`, {
          label: item.operator,
          value: item.operator,
        });
        setValue(`googleSheetFields[${index}]`, {
          label: item.destinationFieldValue,
          value: item.destinationFieldValue,
        });
      });
      setRows(filterFieldsData);
    } else {
      setRows([
        {
          netsuiteFields: "",
          operator: "",
          googleSheetFields: "",
        },
      ]);
    }
    // }
  }, [filterFieldsData, getFilterDetails, setValue]);

  // useEffect(() => {
  //   if (eventData) {
  //     if (eventData[0].operator) {
  //       // console.log("eventData in modal", eventData[0].operator);
  //       eventData.map((item, index) => {
  //         console.log("item", item);
  //         setValue(`netsuiteFields[${index}]`, {
  //           label: item.sourceFieldLabel,
  //           value: item.sourceFieldValue,
  //         });
  //         setValue(`operator[${index}]`, {
  //           label: item.operator,
  //           value: item.operator,
  //         });
  //         setValue(`googleSheetFields[${index}]`, {
  //           label: item.destinationFieldValue,
  //           value: item.destinationFieldValue,
  //         });
  //       });
  //       setRows(eventData);
  //     } else {
  //       setRows([
  //         {
  //           netsuiteFields: "",
  //           operator: "",
  //           googleSheetFields: "",
  //         },
  //       ]);
  //     }
  //   }
  // }, [eventData, setValue]);

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        netsuiteFields: "",
        operator: "",
        googleSheetFields: "",
      },
    ]);
  };

  const onClickCancel = () => {
    //   history.back();
    toggle();
  };

  const onSubmit = (data) => {
    const fiterItem = {
      sourceFieldValue: data.netsuiteFields[0].value,
      sourceFieldLabel: data.netsuiteFields[0].label,
      destinationFieldValue: data.googleSheetFields[0].value,
      destinationFieldLabel: data.googleSheetFields[0].label,
      operator: data.operator[0].label,
    };

    getFilterDetails(fiterItem);
    toggle();

    // if (filterFieldsData?.length > 0) {
    //   console.log("*** update filter data");
    //   const fiterItem = {
    //     id: filterFieldsData[0].id,
    //     userId: userId,
    //     mappedRecordId: JSON.parse(mappedRecordId),
    //     integrationId: configurationData[0].integrationId,
    //     scheduleId: eventId,
    //     sourceFieldValue: data.netsuiteFields[0].value,
    //     sourceFieldLabel: data.netsuiteFields[0].label,
    //     destinationFieldValue: data.googleSheetFields[0].value,
    //     destinationFieldLabel: data.googleSheetFields[0].label,
    //     operator: data.operator[0].label,
    //   };
      
    //   updateFilterFieldsById.mutate(fiterItem, {
    //     onSuccess: (data) => {
    //       console.log("updated filter fields", data);
    //       getFilterDetails(data);
    //     },
    //     onError: (error) => {
    //       console.log(error);
    //     },
    //   });
    // } else {
    //   console.log("*** add filter data");
    //   const fiterItem = {
    //     userId: userId,
    //     mappedRecordId: JSON.parse(mappedRecordId),
    //     integrationId: configurationData[0].integrationId,
    //     scheduleId: eventId,
    //     sourceFieldValue: data.netsuiteFields[0].value,
    //     sourceFieldLabel: data.netsuiteFields[0].label,
    //     destinationFieldValue: data.googleSheetFields[0].value,
    //     destinationFieldLabel: data.googleSheetFields[0].label,
    //     operator: data.operator[0].label,
    //   };

    //   addCustomFilterFields.mutate(fiterItem, {
    //     onSuccess: (data) => {
    //       console.log(data);
    //       console.log("add filter data", data)
    //       getFilterDetails(data);
    //     },
    //     onError: (error) => {
    //       console.log(error);
    //     },
    //   });
    // }
    // toggle();
  };

  return (
    <>
      <TkModal
        isOpen={modal}
        centered
        size="xl"
        // fullscreen
        className="border-0"
        modalClassName="modal fade zoomIn"
      >
        <TkModalHeader className="p-3" toggle={toggle}>
          {"Add Filter"}
        </TkModalHeader>

        <TkModalBody className="modal-body">
          {/* <h4>Add Filter</h4> */}

          <TkForm onSubmit={handleSubmit(onSubmit)}>
            <TkTableContainer
              columns={columns}
              data={rows || []}
              thClass="text-dark"
            />
            <TkButton
              className="btn-success my-2 me-2"
              onClick={handleAddRow}
              type="button"
            >
              Add Row
            </TkButton>
            <TkButton className="btn-success m-2">Save</TkButton>
            <TkButton
              className="btn-success m-2"
              type="button"
              onClick={onClickCancel}
            >
              Cancel
            </TkButton>
          </TkForm>
        </TkModalBody>
      </TkModal>
    </>
  );
};

export default FilterModal;
