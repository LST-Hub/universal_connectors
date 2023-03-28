import FormErrorText from "@/globalComponents/ErrorText";
import TkButton from "@/globalComponents/TkButton";
import TkForm from "@/globalComponents/TkForm";
import TkInput from "@/globalComponents/TkInput";
import TkRow, { TkCol } from "@/globalComponents/TkRow";
import TkSelect from "@/globalComponents/TkSelect";
import {
  API_BASE_URL,
  destinationName,
  integrations,
  recordType,
  sourceName,
} from "@/utils/Constants";
import tkFetch from "@/utils/fetch";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";

const schema = Yup.object({
  integrationName: Yup.object().required("Integration name is required."),
  recordType: Yup.object().required("Record type is required."),
  googleSheetUrl: Yup.string().required("Google sheet url is required."),
}).required();

const FieldMap = () => {
  const {
    register,
    control,
    formState: { errors, isDirty },
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    // setValue("integrationName", integrations[0]);
  }, []);

  const router = useRouter();
  const [userID, setUserID] = useState();
  const [integrationOptions, setIntegrationOptions] = useState([]);
  const [recordTypes, setRecordTypes] = useState();
  const [records, setRecords] = useState([]);

  const integrations = useMutation({
    // mutationFn: tkFetch.post(`http://localhost:4000/v1/getIntegrations`),
    mutationFn: tkFetch.post(`${API_BASE_URL}/getIntegrations`),
  });

  const getResletRecordType = useMutation({
    mutationFn: tkFetch.post(`${API_BASE_URL}/getRecordTypes`),
  });

  const AddMappedRecord = useMutation({
    // mutationFn: tkFetch.post("http://localhost:4000/v1/AddMappedRecord"),
    mutationFn: tkFetch.post(`${API_BASE_URL}/AddMappedRecord`),

  });

  useEffect(() => {
    // const userID = sessionStorage.getItem("userId");
    setUserID(sessionStorage.getItem("userId"));

    if (userID) {
      const id = {
        userId: JSON.parse(userID),
      };

      integrations.mutate(id, {
        onSuccess: (data) => {
          console.log("integrations data==> ", data);
          data.map((item) => {
            setIntegrationOptions((prev) => [
              ...prev,
              { label: item.integrationName, value: item.id },
            ]);
          });
        },
        onError: (error) => {
          console.log("error", error);
        },
      });
    }

    // for reslet record types data
    const data = {
      account: "TSTDRV1423092",
      consumerKey:
        "7c5f5179740c2fd6bb6c73a6c1235d369ccc61f608abed76acf7cc1bc0245caf",
      consumerSecret:
        "f02dc5c3720c99b35efd1713941477e7bd34c9467d43727199a222d3596b11a3",
      tokenId:
        "df85b218f1627ea731b61d503330947261b512ca88a5e12beaa4a4316ee0cbe6",
      tokenSecret:
        "508004293fd1a44799817805c39208d781f909e69456f3b9d0184a54d51739ea",
      scriptDeploymentId: "1",
      scriptId: "1529",
      base_url:
        "https://tstdrv1423092.restlets.api.netsuite.com/app/site/hosting/restlet.nl",
      resttype: "ListOfRecordType",
    };
    getResletRecordType.mutate(data, {
      onSuccess: (data) => {
        console.log("data==", data);
        setRecordTypes(data[0]);
        data[0].list.map((item) => {
          // console.log("item==", item);
          setRecords((prev) => [...prev, { label: item.text, value: item.id }]);
        });
      },
      onError: (error) => {
        console.log("error==", error);
      },
    });
  }, [userID]);
  console.log("recordTypes==", recordTypes);
  console.log("records==", records);

  const onsubmit = (data) => {
    // console.log("data==", data);
    const userID = sessionStorage.getItem("userId");
    const mapprdRecord = {
      userId: JSON.parse(userID),
      integrationId: data.integrationName.value,
      recordType: data.recordType.value,
      url: data.googleSheetUrl,
    };
    // console.log("mapprdRecord==>", mapprdRecord);
    AddMappedRecord.mutate(mapprdRecord, {
      onSuccess: (data) => {
        // console.log("data==", data);
        router.push(
          {
            pathname: "/fieldMapping/mapTable",
            query: { mappedRecordId: JSON.stringify(data[0].id) },
            // query: { mappedRecordId: JSON.stringify(4) }
          },
          "/fieldMapping/mapTable"
        );
      },
      onError: (error) => {
        console.log("error==", error);
      },
    });
  };

  // const handleSubmit = () => {
  //   router.push(route);
  // };

  return (
    <>
      <TkForm onSubmit={handleSubmit(onsubmit)}>
        <TkRow className="mt-5 justify-content-center">
          {/* <TkCol lg={4}>
          <TkSelect
            id="sourceName"
            name="sourceName"
            labelName="Source Integration Name"
            options={sourceName}
            maxMenuHeight="120px"
          />
        </TkCol> */}

          <TkCol lg={4}>
            <Controller
              name="integrationName"
              control={control}
              render={({ field }) => (
                <TkSelect
                  {...field}
                  labelName="Integration Name"
                  id="integrationName"
                  // options={integrations}
                  options={integrationOptions || []}
                  // defaultValue={integrations[0]}
                  // disabled={true}
                  maxMenuHeight="120px"
                  requiredStarOnLabel={true}
                />
              )}
            />
            {errors.integrationName?.message ? (
              <FormErrorText>{errors.integrationName?.message}</FormErrorText>
            ) : null}
          </TkCol>

          <TkCol lg={4}>
            <Controller
              name="recordType"
              control={control}
              render={({ field }) => (
                <TkSelect
                  {...field}
                  labelName="NetSuite™ Record Type"
                  id="recordType"
                  // options={recordType}
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

          <TkCol lg={4}>
            <TkInput
              {...register("googleSheetUrl")}
              id="googleSheetUrl"
              type="text"
              labelName="Google Sheets™ Url"
              placeholder="Enter Google Sheets™ url"
              requiredStarOnLabel={true}
              invalid={errors.googleSheetUrl?.message ? true : false}
              // className={errors.integrationName?.message && "form-control is-invalid"}
            />
            {errors.googleSheetUrl?.message ? (
              <FormErrorText>{errors.googleSheetUrl?.message}</FormErrorText>
            ) : null}
          </TkCol>
          {/* </TkRow> */}

          {/* <TkRow className="mt-3 justify-content-center"> */}
          <TkCol lg={12} className="d-flex justify-content-center">
            <TkButton
              className="btn-success my-4"
              type="submit"
              // onClick={handleSubmit}
            >
              Next
            </TkButton>
          </TkCol>
        </TkRow>
      </TkForm>
    </>
  );
};

export default FieldMap;
