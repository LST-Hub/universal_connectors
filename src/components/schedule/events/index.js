import TkContainer from "@/globalComponents/TkContainer";
import TkRadioButton from "@/globalComponents/TkRadioButton";
import TkRow, { TkCol } from "@/globalComponents/TkRow";
import React, { useEffect, useRef, useState } from "react";
import RealtimeEvent from "./RealtimeEvent";
import SingleEvent from "./SingleEvent";
import WeeklyEvent from "./WeeklyEvent";
import { Controller, useForm } from "react-hook-form";
import TkSelect from "@/globalComponents/TkSelect";
import FormErrorText from "@/globalComponents/ErrorText";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import tkFetch from "@/utils/fetch";
import { API_BASE_URL } from "@/utils/Constants";
import TkCheckBox from "@/globalComponents/TkCheckBox";
import TkLabel from "@/globalComponents/TkLabel";
import { useRouter } from "next/router";
import TkInput from "@/globalComponents/TkInput";
import TkForm from "@/globalComponents/TkForm";
import TkButton from "@/globalComponents/TkButton";
import Event from "./event";

const schema = Yup.object({
  integrationName: Yup.object().nullable().required("Integration is required."),
  mappedRecords: Yup.object().nullable().required("Mapped record is required."),
}).required();

const EventSchedule = ({ eventId }) => {
  let id = useRef(null);
  let source = useRef(null);
  let destination = useRef(null);
  // let searchType = useRef(null);
  let recordId = useRef(null);
  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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

  const router = useRouter();

  const [userId, setUserId] = useState();
  const [integrationOptions, setIntegrationOptions] = useState([]);
  const [mappedRecordOptions, setMappedRecordOptions] = useState([]);
  const [mappedRecordId, setMappedRecordId] = useState(null);
  const [ids, setIds] = useState(null);
  const [integrationId, setIntegrationId] = useState(null);
  const [operationsValue, setOperationsValue] = useState(false);
  const [configurationData, setConfigurationData] = useState(null);
  const [savedSearchOptions, setSavedSearchOptions] = useState([]);
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const [addValue, setAddValue] = useState(false);
  const [updateValue, setUpdateValue] = useState(false);
  const [deleteValue, setDeleteValue] = useState(false);
  const sourceOptions = [
    {
      label: "NetSuite",
      value: "NetSuite",
    },
    {
      label: "Google Sheet",
      value: "GoogleSheet",
    },
  ]

  const queryClient = useQueryClient();
  const apiResults = useQueries({
    queries: [
      {
        queryKey: ["integrationData", userId],
        queryFn: tkFetch.get(`${API_BASE_URL}/getIntegrations/${userId}`),
        enabled: !!userId,
      },
      {
        queryKey: ["mappedRecordData", ids],
        queryFn: tkFetch.get(`${API_BASE_URL}/getMappedRecordByIntegrationId`, {
          params: ids,
        }),
        enabled: !!ids,
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
        queryKey: ["eventData", recordId.current],
        queryFn: tkFetch.get(`${API_BASE_URL}/getScheduleEventById`, {
          params: recordId.current,
        }),
        enabled: !!recordId.current,
      },
    ],
  });

  const [integrations, getMappedRecordData, config, restletAPI, scheduleEvent] =
    apiResults;
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
    isLoading: isScheduleEventLoading,
    isError: isScheduleEventError,
    error: scheduleEventError,
    data: scheduleEventData,
  } = scheduleEvent;

  // backend data
  useEffect(() => {
    if (scheduleEventData) {
      console.log("scheduleEventData", scheduleEventData)
      setValue("integrationName", {
        label: scheduleEventData[0].integration.integrationName,
        value: scheduleEventData[0].integrationId,
      });
      setValue("mappedRecords", {
        label: scheduleEventData[0].mappedRecord.MappedRecordName,
        value: scheduleEventData[0].mappedRecordId,
      });
      setValue("perform", {
        label: scheduleEventData[0].performType,
        value: scheduleEventData[0].performType,
      });
      setValue("source", {
        label: scheduleEventData[0].source,
        value: scheduleEventData[0].source,
      })
      setInputValue(scheduleEventData[0].range)
      // searchType.current = scheduleEventData[0].savedSearchType;

      setMappedRecordId(scheduleEventData[0].mappedRecordId);
      setData((prev) => ({
        ...prev,
        integrationId: scheduleEventData[0].integrationId,
        mappedRecordId: scheduleEventData[0].mappedRecordId,
        perform: scheduleEventData[0].performType,
        operationType: scheduleEventData[0].operationType,
        source: scheduleEventData[0].source,
        range: scheduleEventData[0].range,
        // savedSearchType: scheduleEventData[0].savedSearchType,
      }));

      if (scheduleEventData[0].savedSearchValue) {
        setValue("savedSearches", {
          label: scheduleEventData[0].savedSearchLabel,
          value: scheduleEventData[0].savedSearchValue,
        });
        setData((prev) => ({
          ...prev,
          savedSearchLabel: scheduleEventData[0].savedSearchLabel,
          savedSearchValue: scheduleEventData[0].savedSearchValue,
        }));
      }

      setAddValue(scheduleEventData[0].operationType === "add" ? true : false);
      setUpdateValue(
        scheduleEventData[0].operationType === "update" ? true : false
      );
      setDeleteValue(
        scheduleEventData[0].operationType === "delete" ? true : false
      );
    }
  }, [scheduleEventData, setValue]);

  useEffect(() => {
    const userID = sessionStorage.getItem("userId");

    // get Integretion data
    if (userID) {
      setData((prev) => ({ ...prev, userId: JSON.parse(userID) }));
      setUserId(JSON.parse(userID));
      if (integrationsData) {
        source.current = integrationsData[0].sourceName;
        destination.current = integrationsData[0].destinationName;
        if (integrationsData.length === 1) {
          setValue("integrationName", {
            label: integrationsData[0].integrationName,
            value: integrationsData[0].id,
          });

          setIds({
            id: userId,
            integrationId: integrationsData[0].id,
          });
          setIntegrationId(integrationsData[0].id);
          setData((prev) => ({
            ...prev,
            integrationId: integrationsData[0].id,
          }));
        }

        setIntegrationOptions(
          integrationsData.map((item) => ({
            label: item.integrationName,
            value: item.id,
          }))
        );
      }
    }
  }, [integrationsData, setValue, userId]);

  // Mapped record options
  useEffect(() => {
    if (mappedRecordData) {
      console.log("mappedRecordData==>", mappedRecordData);
      if (mappedRecordData.length === 1) {
        setValue("mappedRecords", {
          label: mappedRecordData[0].name,
          value: mappedRecordData[0].id,
        });
        setMappedRecordId(mappedRecordData[0].id);
        id.current = {
          id: userId,
          mappedRecordId: mappedRecordData[0].id,
          integrationId: integrationId,
        };
        setData((prev) => ({ ...prev, mappedRecordId: e.value }));
      } else {
        setMappedRecordOptions(
          mappedRecordData?.map((item) => ({
            label: item.MappedRecordName,
            value: item.id,
          }))
        );
      }
    }
  }, [integrationId, mappedRecordData, setValue, userId]);

  useEffect(() => {
    const userID = sessionStorage.getItem("userId");

    if (userID && eventId) {
      recordId.current = {
        id: eventId,
        userId: JSON.parse(userID),
      };
    }
  });

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

  // saved search list
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

  const onClickSourceFilter = (value) => {
    // router.push(`/schedule/NetSuite/${mappedRecordId}`);
    if(value === "NetSuite™"){
      router.push(`/schedule/NetSuite/${mappedRecordId}`);
    } else{
      router.push(`/schedule/GoogleSheet/${mappedRecordId}`);
    }
  };

  const onClickDestinationFilter = () => {
  }

  // integrations dropdown
  const onChangeIntegration = (e) => {
    queryClient.invalidateQueries({
      queryKey: ["mappedRecordData", ids],
    });
    setValue("mappedRecords", null);
    if (e) {
      setIds({
        id: userId,
        integrationId: e.value,
      });
      setIntegrationId(e.value);
      setData((prev) => ({ ...prev, integrationId: e.value }));
    }
  };

  // mapped record dropdown
  const onChangeMappedRecord = (e) => {
    setValue("filter", null);
    if (e) {
      setMappedRecordId(e.value);
      id.current = {
        id: userId,
        mappedRecordId: e.value,
        integrationId: integrationId,
      };
      setData((prev) => ({ ...prev, mappedRecordId: e.value }));
    }
  };

  // perform dropdown
  const onClickPerform = (e) => {
    if (e) {
      setOperationsValue(e.value === "export" ? true : false);
      setData((prev) => ({ ...prev, perform: e.label }));

      if(e.value === "export"){
        setAddValue(false);
        setUpdateValue(false);
        setDeleteValue(false);
        setData((prev) => ({
          ...prev,
          operationType: null,
        }));
      }
    }
  };

  // // saved search radio button
  // const onOptionChange = (e) => {
  //   searchType.current = e.target.value;
  //   setData((prev) => ({ ...prev, savedSearchType: e.target.value }));
  // };

  // saved searches dropdown
  const onChangeSavedSearch = (e) => {
   
    if (e) {
      console.log("e", e)
      setData((prev) => ({
        ...prev,
        savedSearchLabel: e.label,
        savedSearchValue: e.value,
      }));
    } else {
      setData((prev) => ({
        ...prev,
        savedSearchLabel: null,
        savedSearchValue: null,
      }));
    }
  };

  const onChangeOption = (e) => {
    if (e) {
      setData((prev) => ({ ...prev, source: e.value }));
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setData((prev) => ({ ...prev, range: event.target.value }));
  };

  const toggleComponet = (value) => {
    setAddValue(value === "add" ? true : false);
    setUpdateValue(value === "update" ? true : false);
    setDeleteValue(value === "delete" ? true : false);
    setData((prev) => ({
      ...prev,
      operationType: value,
    }));
  };

  return (
    <>
      {/* <TkForm onSubmit={handleSubmit(onSubmit)}> */}
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
          <TkLabel htmlFor="sourceFilter" requiredStarOnLabel={true}>
            How can we find existing records ({source.current})
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
              onClick={handleSubmit(() => onClickSourceFilter(source.current))}
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
        {/* <TkCol lg={4} className="d-flex align-items-end">
          <TkLabel>Saved Search Type :</TkLabel>
          <TkRadioButton
            type="radio"
            name="savedSearchType"
            label="Saved Search"
            value="public"
            className="mb-2 mx-1"
            checked={searchType.current === "public"}
            onChange={onOptionChange}
          >
            Public
          </TkRadioButton>

          <TkRadioButton
            type="radio"
            name="savedSearchType"
            label="Saved Search"
            value="private"
            className="mb-2 mx-1"
            checked={searchType.current === "private"}
            onChange={onOptionChange}
          >
            Private
          </TkRadioButton>
        </TkCol> */}

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
                onChange={(e) => {
                  field.onChange(e);
                  onChangeSavedSearch(e);
                }}
              />
            )}
          />
        </TkCol>

        <TkCol lg={4}>
          <TkLabel htmlFor="destinationFilter" requiredStarOnLabel={true}>
            How can we find existing records ({destination.current})
          </TkLabel>

          <div className="d-flex">
            <TkInput
              {...register("destinationFilter")}
              id="destinationFilter"
              type="text"
              disabled={true}
            />
            <TkButton
              className="btn btn-light"
              type="button"
              onClick={handleSubmit(() => onClickSourceFilter(destination.current))}
            >
              <i className="ri-filter-2-fill" />
            </TkButton>
          </div>
        </TkCol>
        

        {/* <TkButton className="btn btn-primary mt-3" type="submit">
            Perform
          </TkButton> */}
      </TkRow>
      {/* </TkForm> */}

      <TkRow className="mt-3">
        <TkCol lg={1}>
          <TkLabel className="my-2">Operations :</TkLabel>
        </TkCol>

        <TkCol lg={4}>
          <Controller
            name="source"
            control={control}
            render={({ field }) => (
              <TkSelect
                {...field}
                // labelName="Source"
                id="source"
                maxMenuHeight="120px"
                options={sourceOptions}
                onChange={(e) => {
                  field.onChange(e);
                  onChangeOption(e);
                }}
              />
            )}
          />
        </TkCol>

        <TkCol lg={3} className="d-flex align-self-center">
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

        <TkCol lg={4}>
          <TkInput
            {...register("range")}
            id="range"
            type="text"
            labelName="Range"
            placeholder="Range"
            value={inputValue}
            onChange={handleInputChange}
          />
        </TkCol>
      </TkRow>
      <hr />

      <Event eventId={eventId} syncData={data} />
    </>
  );
};

export default EventSchedule;
