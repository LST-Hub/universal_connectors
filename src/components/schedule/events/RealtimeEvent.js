import FormErrorText from "@/globalComponents/ErrorText";
import TkButton from "@/globalComponents/TkButton";
import TkCheckBox from "@/globalComponents/TkCheckBox";
import TkDate from "@/globalComponents/TkDate";
import TkForm from "@/globalComponents/TkForm";
import TkInput from "@/globalComponents/TkInput";
import TkLabel from "@/globalComponents/TkLabel";
import TkRadioButton from "@/globalComponents/TkRadioButton";
import TkRow, { TkCol } from "@/globalComponents/TkRow";
import TkSelect from "@/globalComponents/TkSelect";
import { API_BASE_URL } from "@/utils/Constants";
import DeleteModal from "@/utils/DeleteModal";
import tkFetch from "@/utils/fetch";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import AlertBoxModal from "@/utils/AlertBoxModal";
import TkLoader from "@/globalComponents/TkLoader";

const schema = Yup.object({
  startDate: Yup.date().nullable().required("Start date is required"),
  integrationName: Yup.object().nullable().required("Integration is required."),
  mappedRecords: Yup.object().nullable().required("Mapped record is required."),
  source: Yup.object().nullable().required("Operation is required."),
}).required();

const RealtimeEvent = ({ checkBoxValue, eventId }) => {
  let userId = useRef(null);
  let scheduleEventData = useRef(null);
  let id = useRef(null);
  let source = useRef(null);
  let destination = useRef(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const router = useRouter();
  const queryClient = useQueryClient();

  const [checkboxValue, setCheckboxValue] = useState(false);
  const [ids, setIds] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [operationsValue, setOperationsValue] = useState(false);
  const [addValue, setAddValue] = useState(false);
  const [updateValue, setUpdateValue] = useState(false);
  const [deleteValue, setDeleteValue] = useState(false);
  const [integrationOptions, setIntegrationOptions] = useState([]);
  const [mappedRecordOptions, setMappedRecordOptions] = useState([]);
  const [savedSearchOptions, setSavedSearchOptions] = useState([]);
  const [mappedRecordId, setMappedRecordId] = useState(null);
  const [integrationRecordId, setIntegrationRecordId] = useState(null);
  const [integrationId, setIntegrationId] = useState(null);
  const [configurationData, setConfigurationData] = useState(null);
  const [alertBoxModal, setAlertBoxModal] = useState(false);
  const [alertBoxLabel, setAlertBoxLabel] = useState();

  const sourceOptions = [
    {
      label: "NetSuite",
      value: "NetSuite",
    },
    {
      label: "Google Sheet",
      value: "Google Sheet",
    }, 
  ]
  
  let options = [
    {
      label: "Export",
      value: "export",
    },
    {
      label: "Import",
      value: "import",
    },
  ];

  const addEvent = useMutation({
    mutationFn: tkFetch.post(`${API_BASE_URL}/addRealTimeEvent`),
  });

  const syncDataMutation = useMutation({
    mutationFn: tkFetch.post(`${API_BASE_URL}/syncData`),
  });

  const updateRealTimeEvent = useMutation({
    mutationFn: tkFetch.putWithIdInUrl(`${API_BASE_URL}/updateRealTimeEvent`),
  });

  const addNetsuiteFields = useMutation({
    mutationFn: tkFetch.post(`${API_BASE_URL}/addNetsuiteFields`),
  });

let temp = null;

  const apiResults = useQueries({
    queries: [
  {
    queryKey: ["eventData", ids],
    queryFn: tkFetch.get(`${API_BASE_URL}/getScheduleEventById`, {
      params: ids,
    }),
    enabled: !!ids,
  },
  {
    queryKey: ["integrationData", userId.current],
    queryFn: tkFetch.get(`${API_BASE_URL}/getIntegrations/${userId.current}`),
    enabled: !!userId.current,
  },
  {
    queryKey: ["mappedRecordData", integrationRecordId],
    queryFn: tkFetch.get(`${API_BASE_URL}/getMappedRecordByIntegrationId`, {
      params: integrationRecordId,
    }),
    enabled: !!integrationRecordId,
  },
  {
    queryKey: ["integrations", integrationId],
    queryFn: tkFetch.get(
      `${API_BASE_URL}/getConfigurationByIntegrationId/${integrationId}`
    ),
    enabled: !!integrationId,
  },
  {
    queryKey: ["configData", configurationData],
    queryFn: tkFetch.get(`${API_BASE_URL}/getRecordTypes`, {
      params: configurationData,
    }),
    enabled: !!configurationData,
  },
  {
    queryKey: ["getFilterDataById", id.current],
    queryFn: tkFetch.get(`${API_BASE_URL}/getFilterDataById`, {
      params: id.current,
    }),
    enabled: !!id.current,
  },
],
  });

  const [scheduleEvent, integrations, getMappedRecordData, config, restletAPI, filterData] = apiResults;

  const {
    data: eventData,
    isLoading: isEventDataLoading,
    error: eventDataError,
  } = scheduleEvent;
  const {
    isLoading: isIntegrationsLoading,
    isError: isIntegrationsError,
    error: integrationsError,
    data: integrationsData,
  } = integrations;
  const {
    isLoading: isMappedRecordDataLoading,
    isError: isMappedRecordDataError,
    error: mappedRecordDataError,
    data: mappedRecordData,
  } = getMappedRecordData;
  const {
    isLoading: isconfigLoading,
    isError: isConfigError,
    error: configError,
    data: configData,
  } = config;
  const {
    data: savedSearchData,
    isLoading: isSavedSearchLoading,
    isError: isSavedSearchError,
    error: savedSearchError,
  } = restletAPI;
  const {
    data: filterFields,
    isLoading: filterFieldsLoading,
    error: filterFieldsError
  } = filterData;

  useEffect(() => {
    userId.current = sessionStorage.getItem("userId");
    if (userId.current && eventId) {
      setIds({
        id: eventId,
        userId: JSON.parse(userId.current),
      });
    }
  }, [eventId]);

   // set existing data
  useEffect(() => {
    if (eventData) {
      if (eventData[0]?.eventType === "Realtime") {
        id.current={
          id: userId.current,
          mappedRecordId: eventData[0].mappedRecordId,
          integrationId: eventData[0].integrationId,
        }

        setValue("integrationName", {
          label: eventData[0].integration.integrationName,
          value: eventData[0].integrationId,
        });
        setValue("mappedRecords", {
          label: eventData[0].mappedRecord.mappedRecordName,
          value: eventData[0].mappedRecordId,
        });
        setValue("perform", {
          label: eventData[0].performType,
          value: eventData[0].performType,
        });
        setValue("source", {
          label: eventData[0].source,
          value: eventData[0].source,
        })
        setValue("range", eventData[0].range)
        setMappedRecordId(eventData[0].mappedRecordId);

          eventData[0].savedSearchValue ?
          setValue("savedSearches", {
            label: eventData[0].savedSearchLabel,
            value: eventData[0].savedSearchValue,
          }) : setValue("savedSearches", null);

        setAddValue(eventData[0].operationType === "add" ? true : false);
      setUpdateValue(
        eventData[0].operationType === "update" ? true : false
      );
      setDeleteValue(
        eventData[0].operationType === "delete" ? true : false
      );

        setValue("startDate", eventData[0].startDate);
        setValue("endDate", eventData[0].endDate);
        setCheckboxValue(eventData[0].noEndDate);
      }
    } else {
      setValue("startDate", new Date());
      setValue("endDate", new Date());
    }
  }, [eventData, setValue]);

  // get Integretion data and check length
  useEffect(() => {
    if (userId.current) {
      queryClient.invalidateQueries({
        queryKey: ["integrationData"]
      })
      if (integrationsData) {
        source.current = integrationsData[0].sourceName;
        destination.current = integrationsData[0].destinationName;
        if (integrationsData.length === 1) {
          setValue("integrationName", {
            label: integrationsData[0].integrationName,
            value: integrationsData[0].id,
          });

          setIntegrationRecordId({
            id: userId.current,
            integrationId: integrationsData[0].id,
          });
          setIntegrationId(integrationsData[0].id);
        }
        setIntegrationOptions(
          integrationsData.map((item) => ({
            label: item.integrationName,
            value: item.id,
          }))
        );
      }
    }
  }, [integrationsData, queryClient, setValue]);

   // Mapped record options and check length
   useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["mappedRecordData"]
    })
    if (mappedRecordData) {
      if (mappedRecordData.length === 1) {
        setValue("mappedRecords", {
          label: mappedRecordData[0].mappedRecordName,
          value: mappedRecordData[0].id,
        });
        setMappedRecordId(mappedRecordData[0].id);
        id.current = {
          id: userId.current,
          mappedRecordId: mappedRecordData[0].id,
          integrationId: integrationId,
        };
      } else {
        setMappedRecordOptions(
          mappedRecordData?.map((item) => ({
            label: item.mappedRecordName,
            value: item.id,
          }))
        );
      }
    }
  }, [integrationId, mappedRecordData, queryClient, setValue]);

  // get config data
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
            resttype: "Search",
            recordtype: "savedsearch",
            columns: ["id", "title"],
          });
        }
      });
    }
  }, [configData]);

   // saved search list options
   useEffect(() => {
    if (savedSearchData) {
      setSavedSearchOptions(
        savedSearchData[0].list.map((item) => ({
          label: item.values.title,
          value: item.values.id,
        }))
      );
    }
  }, [savedSearchData]);

  // endDate handler
  const handleOnChange = (dates) => {
    if (dates) {
      setCheckboxValue(false);
    } else {
      setCheckboxValue(true);
    }
  };

  // noEndDate checkbox handler
  const handleOnChangeCheckbox = (e) => {
    if (e.target.checked) {
      setCheckboxValue(true);
      setValue("endDate", null);
    } else {
      setCheckboxValue(false);
      setValue("endDate", new Date());
    }
  };

  // integrations dropdown handler
  const onChangeIntegration = (e) => {
    queryClient.invalidateQueries({
      queryKey: ["mappedRecordData", ids],
    });
    setValue("mappedRecords", null);
    if (e) {
      // setIds({
        //   id: userId.current,
      //   integrationId: e.value,
      // });
      setIntegrationRecordId({
        id: userId.current,
        integrationId: e.value,
      });
      setIntegrationId(e.value);
    }
  };

    // mapped record dropdown handler
   const onChangeMappedRecord = (e) => {
    if (e) {
      setMappedRecordId(e.value);
      id.current = {
        id: userId.current,
        mappedRecordId: e.value,
        integrationId: integrationId,
      };
    }
  };

 // move to filter page
  const onClickSourceFilter = () => {
    if(mappedRecordId){
      router.push(`/schedule/${mappedRecordId}`);
    }
  };

  // perform dropdown handler
  const onClickPerform = (e) => {
    if (e) {
      setOperationsValue(e.value === "export" ? true : false);

      if(e.value === "export"){
        setAddValue(false);
        setUpdateValue(false);
        setDeleteValue(false);
      }
    }
  };

  // radio button for operations
  const toggleComponet = (value) => {
    setAddValue(value === "add" ? true : false);
    setUpdateValue(value === "update" ? true : false);
    setDeleteValue(value === "delete" ? true : false);
  };

  const onSubmit = (data) => {
    if (data.endDate) {
      data.noEndDate = false;
      setCheckboxValue(false);
    } else {
      data.noEndDate = true;
      setCheckboxValue(true);
    }
    addValue ? (data.operationType = "add") : updateValue ? (data.operationType = "update") : deleteValue ? (data.operationType = "delete") : data.operationType = null;

    let shouldLogData = true;

    if(data.perform.label === "Import"){
      switch (data.source.label) {
        case "Google Sheet":
          switch (data.operationType) {
            case "update":
              if (data.range === "" || data.range === null) {
                // alert("add range");
                const alertMsg = "Please select range to update records."
                toggleAlertBoxModel(alertMsg)
                shouldLogData = false;
              } else if (!filterFields.length > 0) {
                // alert("add filter");
                const alertMsg = "Please add filter to update records."
                toggleAlertBoxModel(alertMsg)
                shouldLogData = false;
              }
              break;
      
            case "delete":
              if (data.range === "" || data.range === null) {
                // alert("add range");
                const alertMsg = "Please select range to delete records."
                toggleAlertBoxModel(alertMsg)
                shouldLogData = false;
              } else if (!filterFields.length > 0) {
                // alert("add filter");
                const alertMsg = "Please add filter to delete records."
                toggleAlertBoxModel(alertMsg)
                shouldLogData = false;
              }
              break;
          }
          break;
      
        case "NetSuite":
          switch (data.operationType) {
            case "add":
              if (data.range === "" || data.range === null) {
                // alert("add range");
                const alertMsg = "Please select range to add records."
                toggleAlertBoxModel(alertMsg)
                shouldLogData = false;
              }
              break;
      
            case "update":
              if (data.range === "" || data.range === null) {
                // alert("add range");
                const alertMsg = "Please select range to update records."
                toggleAlertBoxModel(alertMsg)
                shouldLogData = false;
              } else if (!filterFields.length > 0) {
                // alert("add filter");
                const alertMsg = "Please add filter to update records."
                toggleAlertBoxModel(alertMsg)
                shouldLogData = false;
              }
              break;
      
            case "delete":
              if (data.range === "" || data.range === null) {
                // alert("add range");
                const alertMsg = "Please select range to delete records."
                toggleAlertBoxModel(alertMsg)
                shouldLogData = false;
              } else if (!filterFields.length > 0) {
                // alert("add filter");
                const alertMsg = "Please add filter to delete records."
                toggleAlertBoxModel(alertMsg)
                shouldLogData = false;
              }
              break;
          }
          break;
        }
    }

if (shouldLogData) {
  if (eventId) {
      console.log("update realtime Event**********");
      const realtimeEventData = {
        id: eventId,
        userId: JSON.parse(userId.current),
        integrationId: data.integrationName.value,
        mappedRecordId: data.mappedRecords.value,
        eventType: "Realtime",
        startDate: data.startDate,
        endDate: data.endDate,
        noEndDate: data.noEndDate,
        performType: data.perform.label,
        operationType: data.operationType,
        source: data.source.label,
        range: data.range,
        savedSearchLabel: data?.savedSearches === null  ? null : data?.savedSearches?.label,
        savedSearchValue: data?.savedSearches === null ? null : data?.savedSearches?.value

      };

        // realtimeEventData.savedSearchLabel = data?.savedSearches === null  ? null : data?.savedSearches?.label ;
        // realtimeEventData.savedSearchValue = data?.savedSearches === null ? null : data?.savedSearches?.value;

      // ***API call to update event

      console.log("realtimeEventData", realtimeEventData)
      if (
        data.operationType === "add" &&
        data.source.label === "Google Sheet"
      ) {
        toggleDeleteModel(realtimeEventData);
      } else {
        updateRealTimeEvent.mutate(realtimeEventData, {
          onSuccess: (res) => {
            console.log("update realTime event res", res);
            router.push("/schedule");
          },
          onError: (err) => {
            console.log("err", err);
          },
        });
      }
    } else {
      console.log("add realtime Event**********");
      const eventData = {
        userId: JSON.parse(userId.current),
        integrationId: data.integrationName.value,
        mappedRecordId: data.mappedRecords.value,
        eventType: "Realtime",
        startDate: data.startDate,
        endDate: data.endDate,
        noEndDate: data.noEndDate,
        performType: data.perform.label,
        operationType: data.operationType,
        source: data.source.label,
        range: data.range,
        savedSearchLabel: data?.savedSearches === null  ? null : data?.savedSearches?.label,
        savedSearchValue: data?.savedSearches === null ? null : data?.savedSearches?.value

      };

      // if (data.savedSearches) {
      //   eventData.savedSearchLabel = data.savedSearches.label;
      //   eventData.savedSearchValue = data.savedSearches.value;
      // } else {
      //   eventData.savedSearchLabel = null;
      //   eventData.savedSearchValue = null;
      // }

      console.log("eventData", eventData);

      // ***API call to add event
      if (
        data.operationType === "add" &&
        data.source.label === "Google Sheet"
      ) {
        toggleDeleteModel(eventData);
      } else {
        addEvent.mutate(eventData, {
          onSuccess: (res) => {
            console.log("add realtime event res", res);
            router.push("/schedule");
          },
          onError: (err) => {
            console.log("err", err);
          },
        });
      }
    }
}
  };

  const onCancel = () => {
    history.back();
  };

   // alert modal
  const onClickDelete = () => {
    console.log("scheduleEventData", scheduleEventData.current);

    if (scheduleEventData.current.id) {
      updateRealTimeEvent.mutate(scheduleEventData.current, {
        onSuccess: (res) => {
          console.log("update realTime event res", res);
        },
        onError: (err) => {
          console.log("err", err);
        },
      });
    } else {
      addEvent.mutate(scheduleEventData.current, {
        onSuccess: (res) => {
          console.log("add realtime event res", res);
        },
        onError: (err) => {
          console.log("err", err);
        },
      });
    }
    setDeleteModal(false);
    router.push("/schedule");
  };

  // modal state
  const toggleDeleteModel = (eventData) => {
    scheduleEventData.current = eventData;
    setDeleteModal(true);
  };

  const toggleAlertBoxModel = (alertMsg) => {
    setAlertBoxLabel(alertMsg)
    setAlertBoxModal(true);
  };

  // console.log("ids", ids)
  // console.log("isEventDataLoading", isEventDataLoading)
  // console.log("isIntegrationsLoading", isIntegrationsLoading)
  return (
    <>
    {/* {isEventDataLoading ? (
      <TkLoader />
    ) : ( */}
      <TkForm className="mb-4" onSubmit={handleSubmit(onSubmit)}>
      <TkRow className="my-1">
        <TkCol lg={4}>
          <Controller
            name="integrationName"
            control={control}
            render={({ field }) => (
              <TkSelect
                {...field}
                labelName="Integration"
                id="integrationName"
                options={integrationOptions}
                maxMenuHeight="120px"
                requiredStarOnLabel={true}
                onChange={(e) => {
                  field.onChange(e);
                  onChangeIntegration(e);
                }}
              />
            )}
          />
          {errors.integrationName?.message ? (
            <FormErrorText>{errors.integrationName?.message}</FormErrorText>
          ) : null}
        </TkCol>

        <TkCol lg={4}>
          <Controller
            name="mappedRecords"
            control={control}
            render={({ field }) => (
              <TkSelect
                {...field}
                labelName="Mapped Records"
                id="mappedRecords"
                options={mappedRecordOptions}
                maxMenuHeight="120px"
                requiredStarOnLabel={true}
                onChange={(e) => {
                  field.onChange(e);
                  onChangeMappedRecord(e);
                }}
              />
            )}
          />
          {errors.mappedRecords?.message ? (
            <FormErrorText>{errors.mappedRecords?.message}</FormErrorText>
          ) : null}
        </TkCol>

        <TkCol lg={4}>
          <TkLabel htmlFor="sourceFilter">
            How can we find existing records
          </TkLabel>

          <div className="d-flex">
            <TkInput
              {...register("sourceFilter")}
              id="sourceFilter"
              type="text"
              disabled={true}
            />
            <TkButton
              className="btn btn-light"
              type="button"
              onClick={handleSubmit(onClickSourceFilter)}
            >
              <i className="ri-filter-2-fill" />
            </TkButton>
          </div>
        </TkCol>
      </TkRow>

      <TkRow className="mt-4">
        <TkCol lg={4}>
          <Controller
            name="perform"
            control={control}
            render={({ field }) => (
              <TkSelect
                {...field}
                labelName="Perform"
                options={options}
                id="perform"
                maxMenuHeight="120px"
                onChange={(e) => {
                  field.onChange(e);
                  onClickPerform(e);
                }}
              />
            )}
          />
        </TkCol>

        <TkCol lg={4}>
          <Controller
            name="savedSearches"
            control={control}
            render={({ field }) => (
              <TkSelect
                {...field}
                labelName="Saved Searches"
                id="savedSearches"
                maxMenuHeight="120px"
                options={savedSearchOptions}
              />
            )}
          />
        </TkCol>

        <TkCol lg={4}>
          <TkInput
            {...register("range")}
            id="range"
            type="text"
            labelName="Range"
            placeholder="Range"
          />
        </TkCol>
      </TkRow>

      <TkRow className="mt-3">
        <TkCol lg={4}>
          <Controller
            name="source"
            control={control}
            render={({ field }) => (
              <TkSelect
                {...field}
                labelName="Operations"
                id="source"
                maxMenuHeight="120px"
                options={sourceOptions}
                requiredStarOnLabel={true}
              />
            )}
          />

{errors.source?.message ? (
            <FormErrorText>{errors.source?.message}</FormErrorText>
          ) : null}
        </TkCol>

        <TkCol lg={6} className="d-flex align-self-center">
          <TkRadioButton
            type="radio"
            name="operations"
            label="Add Operation"
            value="addOperation"
            className="me-2"
            disabled={operationsValue}
            checked={addValue}
            onChange={() => toggleComponet("add")}
          >
            Add
          </TkRadioButton>

          <TkRadioButton
            type="radio"
            name="operations"
            label="Update Operation"
            value="updateOperation"
            className="mx-1"
            disabled={operationsValue}
            checked={updateValue}
            onChange={() => toggleComponet("update")}
          >
            Update
          </TkRadioButton>

          <TkRadioButton
            type="radio"
            name="operations"
            label="Delete Operation"
            value="deleteOperation"
            className="mx-1"
            disabled={operationsValue}
            checked={deleteValue}
            onChange={() => toggleComponet("delete")}
          >
            Delete
          </TkRadioButton>
        </TkCol>

      </TkRow>
      <hr />

      <h4 className="text-center mb-4 fw-bold"> Realtime Event </h4>

        <TkRow className="justify-content-center">
          <TkCol lg={6} sm={6}>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <TkDate
                  {...field}
                  labelName="Start Date"
                  id="startDate"
                  placeholder="Start Date"
                  className="mb-3"
                  requiredStarOnLabel={true}
                  options={{
                    dateFormat: "d M, Y",
                  }}
                />
              )}
            />
            {errors.startDate?.message ? (
              <FormErrorText>{errors.startDate?.message}</FormErrorText>
            ) : null}
          </TkCol>
        </TkRow>

        <TkRow className="justify-content-center">
          <TkCol lg={6} sm={6}>
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <TkDate
                  {...field}
                  labelName="End By"
                  id="endDate"
                  placeholder="End Date"
                  className="mb-3"
                  onChange={(e) => {
                    handleOnChange(e);
                    field.onChange(e);
                  }}
                  options={{
                    dateFormat: "d M, Y",
                  }}
                />
              )}
            />

            <TkCheckBox
              {...register("noEndDate")}
              className="form-check-input mb-3"
              type="checkbox"
              id="noEndDate"
              checked={checkboxValue}
              onChange={handleOnChangeCheckbox}
            />
            <TkLabel className="form-check-label mx-2 mb-3" id="noEndDate">
              No End Date
            </TkLabel>
          </TkCol>
        </TkRow>

        <TkRow className="justify-content-center mt-2">
          <TkCol lg={1} sm={2}>
            <TkButton
              type="submit"
              className="btn-success"
              disabled={checkBoxValue}
            >
              Save
            </TkButton>
          </TkCol>

          <TkCol lg={1} sm={2}>
            <TkButton type="button" onClick={onCancel} className="btn-success">
              Cancel
            </TkButton>
          </TkCol>
        </TkRow>
      </TkForm>
        {/* )} */}

      <DeleteModal
        show={deleteModal}
        onDeleteClick={onClickDelete}
        onCloseClick={() => setDeleteModal(false)}
        label="This will erase all the data from Google Sheet and it will add new data from Netsuite. Are you sure you want to continue?"
        image={false}
      />

<AlertBoxModal
      show={alertBoxModal}
      onCloseClick={() => {setAlertBoxModal(false)}}
      label={alertBoxLabel}
      />
    </>
  );
};

export default RealtimeEvent;
