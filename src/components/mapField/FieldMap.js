import FormErrorText from "@/globalComponents/ErrorText";
import TkButton from "@/globalComponents/TkButton";
import TkForm from "@/globalComponents/TkForm";
import TkInput from "@/globalComponents/TkInput";
import TkLoader from "@/globalComponents/TkLoader";
import TkRow, { TkCol } from "@/globalComponents/TkRow";
import TkSelect from "@/globalComponents/TkSelect";
import { API_BASE_URL } from "@/utils/Constants";
import tkFetch from "@/utils/fetch";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueries } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";

const schema = Yup.object({
  MappedRecordName: Yup.string().required("Mapped record name is required."),
  integrationName: Yup.object()
    .nullable()
    .required("Integration name is required."),
  recordType: Yup.object().required("Record type is required."),
  googleSheetUrl: Yup.object().required("Google sheet url is required."),
}).required();

const FieldMap = () => {
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const sourceOptions = [
    {
      label: "NetSuite™",
      value: 1,
    },
    {
      label: "Google Sheets™",
      value: 2,
    },
  ];

  const router = useRouter();
  const [integrationOptions, setIntegrationOptions] = useState([]);
  const [records, setRecords] = useState([]);
  const [googleSheetUrl, setGoogleSheetUrl] = useState([]);
  const [integrationId, setIntegrationId] = useState(null);
  const [configurationData, setConfigurationData] = useState(null);
  const [userId, setUserId] = useState();
  const [accessToken, setAccessToken] = useState(null);

  const addMappedRecord = useMutation({
    mutationFn: tkFetch.post(`${API_BASE_URL}/addMappedRecord`),
  });

  const apiResults = useQueries({
    queries: [
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
        queryKey: ["integrationData", userId],
        queryFn: tkFetch.get(`${API_BASE_URL}/getIntegrations/${userId}`),
        enabled: !!userId,
      },
      {
        queryKey: ["getAccessToken", userId],
        queryFn: tkFetch.get(`${API_BASE_URL}/getAccessToken/${userId}`),
        enabled: !!userId,
      },
      {
        queryKey: ["getFiles", accessToken],
        queryFn: tkFetch.get(`${API_BASE_URL}/getFiles`, {
          params: accessToken,
        }),
        enabled: !!accessToken,
      },
    ],
  });

  const [config, restlet, integrations, asscessToken, getFilesData] =
    apiResults;
  const {
    isLoading: isconfigLoading,
    isError: isConfigError,
    error: configError,
    data: configData,
  } = config;
  const {
    isLoading: isRestletLoading,
    isError: isRestletError,
    error: restletError,
    data: restletRecordTypes,
  } = restlet;
  const {
    isLoading: isIntegrationsLoading,
    isError: isIntegrationsError,
    error: integrationsError,
    data: integrationsData,
  } = integrations;
  const {
    isLoading: isAccessTokenLoading,
    isError: isAccessTokenError,
    error: accessTokenError,
    data: accessTokenData,
  } = asscessToken;
  const {
    isLoading: isFilesLoading,
    isError: isFilesError,
    error: filesError,
    data: filesData,
  } = getFilesData;

  useEffect(() => {
    if (accessTokenData) {
      setAccessToken({
        accessToken: accessTokenData[0].access_token,
      });
    }
  }, [accessTokenData]);

  useEffect(() => {
    if (filesData) {
      // setGoogleSheetUrl(
      //   filesData[0].files.map((item) => {
      //     if (item.mimeType === "application/vnd.google-apps.spreadsheet") {
      //       return { label: item.name, value: item.id };
      //     }
      //   })
      // );

      filesData[0].files.map((item) => {
        if (item.mimeType === "application/vnd.google-apps.spreadsheet") {
          // TODO: edit this
          setGoogleSheetUrl((prev) => [
            ...prev,
            { label: item.name, value: item.id },
          ]);
        }
      });
    }
  }, [filesData]);

  // *** record types
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
            resttype: "ListOfRecordType",
          });
        }
      });
    }
    if (restletRecordTypes) {
      setRecords(
        restletRecordTypes[0].list.map((item) => ({
          label: item.text,
          value: item.id,
        }))
      );
    } else {
      setRecords([]);
    }
  }, [configData, restletError, restletRecordTypes, setValue]);

  // *** integration names
  useEffect(() => {
    const userID = sessionStorage.getItem("userId");

    if (userID) {
      setUserId(JSON.parse(userID));
      if (integrationsData) {
        setIntegrationOptions(
          integrationsData.map((item) => ({
            label: item.integrationName,
            value: item.id,
          }))
        );
      }
    }
  }, [integrationsData]);

  const handleOnChange = (e) => {
    setRecords([]);
    if (e) {
      setIntegrationId(e.value);
    }
  };

  const onsubmit = (data) => {
    const mapprdRecord = {
      userId: userId,
      integrationId: data.integrationName.value,
      MappedRecordName: data.MappedRecordName,
      source: data.source.label,
      destination: data.destination.label,
      recordTypeLabel: data.recordType.label,
      recordTypeValue: data.recordType.value,
      UrlLabel: data.googleSheetUrl.label,
      UrlValue: data.googleSheetUrl.value,
    };

    addMappedRecord.mutate(mapprdRecord, {
      onSuccess: (data) => {
        router.push(`/fieldMapping/${data[0].id}`);
      },
      onError: (error) => {
        console.log("error==", error);
      },
    });
  };

  return (
    <>
      <TkForm onSubmit={handleSubmit(onsubmit)}>
        <TkRow className="mt-5 justify-content-center">
          <TkCol lg={5} className="mx-2 my-3">
            <TkInput
              {...register("MappedRecordName")}
              id="MappedRecordName"
              type="text"
              labelName="Name"
              placeholder="Enter mapped record name"
              requiredStarOnLabel={true}
              // invalid={errors.integrationName?.message ? true : false}
              // disabled={integrationsData ? true : false}
            />
            {errors.MappedRecordName?.message ? (
              <FormErrorText>{errors.MappedRecordName?.message}</FormErrorText>
            ) : null}
          </TkCol>

          <TkCol lg={5} className="mx-2 my-3">
            <Controller
              name="integrationName"
              control={control}
              render={({ field }) => (
                <TkSelect
                  {...field}
                  labelName="Integration"
                  id="integrationName"
                  options={integrationOptions || []}
                  maxMenuHeight="120px"
                  requiredStarOnLabel={true}
                  onChange={(e) => {
                    field.onChange(e);
                    handleOnChange(e);
                  }}
                  isSearchable={true}
                />
              )}
            />
            {errors.integrationName?.message ? (
              <FormErrorText>{errors.integrationName?.message}</FormErrorText>
            ) : null}
          </TkCol>

          <TkCol lg={5} className="mx-2 my-3">
            <Controller
              name="source"
              control={control}
              render={({ field }) => (
                <TkSelect
                  {...field}
                  labelName="Source"
                  id="source"
                  options={sourceOptions}
                  maxMenuHeight="120px"
                  requiredStarOnLabel={true}
                />
              )}
            />
            {errors.source?.message ? (
              <FormErrorText>{errors.source?.message}</FormErrorText>
            ) : null}
          </TkCol>

          <TkCol lg={5} className="mx-2 my-3">
            <Controller
              name="destination"
              control={control}
              render={({ field }) => (
                <TkSelect
                  {...field}
                  labelName="Destination"
                  id="destination"
                  options={sourceOptions}
                  maxMenuHeight="120px"
                  requiredStarOnLabel={true}
                />
              )}
            />
            {errors.destination?.message ? (
              <FormErrorText>{errors.destination?.message}</FormErrorText>
            ) : null}
          </TkCol>

          <TkCol lg={5} className="mx-2 my-3">
            <Controller
              name="recordType"
              control={control}
              render={({ field }) => (
                <TkSelect
                  {...field}
                  labelName="NetSuite™ Record Type"
                  id="recordType"
                  options={records || []}
                  maxMenuHeight="120px"
                  requiredStarOnLabel={true}
                />
              )}
            />
            {errors.recordType?.message ? (
              <FormErrorText>{errors.recordType?.message}</FormErrorText>
            ) : null}
          </TkCol>

          <TkCol lg={5} className="mx-2 my-3">
            <Controller
              name="googleSheetUrl"
              control={control}
              render={({ field }) => (
                <TkSelect
                  {...field}
                  labelName="Google Sheets™ Url"
                  id="googleSheetUrl"
                  options={googleSheetUrl}
                  maxMenuHeight="120px"
                  requiredStarOnLabel={true}
                />
              )}
            />
            {errors.googleSheetUrl?.message ? (
              <FormErrorText>{errors.googleSheetUrl?.message}</FormErrorText>
            ) : null}
          </TkCol>

          <TkCol lg={12} className="d-flex justify-content-center">
            <TkButton
              loading={addMappedRecord.isLoading}
              className="btn-success m-4"
              type="submit"
            >
              Next
            </TkButton>
            <TkButton
              className="btn-success m-4"
              type="button"
              onClick={() => history.back()}
            >
              Cancel
            </TkButton>
          </TkCol>
        </TkRow>
      </TkForm>
    </>
  );
};

export default FieldMap;
