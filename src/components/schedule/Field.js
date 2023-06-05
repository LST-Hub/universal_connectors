import FormErrorText from "@/globalComponents/ErrorText";
import TkButton from "@/globalComponents/TkButton";
import TkForm from "@/globalComponents/TkForm";
import TkInput from "@/globalComponents/TkInput";
import TkLabel from "@/globalComponents/TkLabel";
import TkModal, {
  TkModalBody,
  TkModalHeader,
} from "@/globalComponents/TkModal";
import TkRadioButton from "@/globalComponents/TkRadioButton";
import TkRow, { TkCol } from "@/globalComponents/TkRow";
import TkSelect from "@/globalComponents/TkSelect";
import { API_BASE_URL } from "@/utils/Constants";
import ToggleButton from "@/utils/ToggleButton";
import tkFetch from "@/utils/fetch";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueries } from "@tanstack/react-query";
import { set } from "date-fns";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";

const schema = Yup.object({
  netsuiteFields: Yup.object().required("Field name is required."),
  operator: Yup.object().required("Operator is required."),
  // googleSheetFields: Yup.object().required("Field name is required."),
}).required();

const Field = ({ mappedRecordId }) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [userId, setUserId] = useState(null);
  const [netsuiteOptions, setNetsuiteOptions] = useState([]);
  const [dropdownFieldValue, setDropdownFieldValue] = useState(true);
  const [inputBoxFieldValue, setInputBoxFieldValue] = useState(false);
  const [checkedValue, setCheckedValue] = useState("dropdownField");
  const [credentials, setCredentials] = useState(null);
  const [filterIds, setFilterIds] = useState(null);
  const [filterData, setFillterData] = useState([]);

  const operators = [
    { label: "is", value: 1 },
    { label: "equalTo", value: 2 },
    { label: "contain", value: 3 },
    { label: "startsWith", value: 4 },
    { label: "anyOf", value: 5 },
    { label: "noneOf", value: 6 },
    { label: "on", value: 7 },
    { label: "empty", value: 8 },
    { label: "notEmpty", value: 9 },
  ];

  const addCustomFilterFields = useMutation({
    mutationFn: tkFetch.post(`${API_BASE_URL}/addCustomFilterFields`),
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
      {
        queryKey: ["customFilterFields"],
        queryFn: tkFetch.get(`${API_BASE_URL}/getCustomFilterFields`, {
          params: filterIds,
        }),
        enabled: !!filterIds,
      },
    ],
  });

  const [configuration, recodTypeFields, customFilterFields] = apiResults;

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
  const {
    isLoading: customFilterFieldsLoading,
    isError: customFilterFieldsError,
    error: customFilterFieldsErrorData,
    data: customFilterFieldsData,
  } = customFilterFields;

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    setUserId(JSON.parse(userId));
  }, []);

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

      setFilterIds({
        userId: userId,
        integrationId: configurationData[0].integrationId,
        mappedRecordId: mappedRecordId,
      });
    }
  }, [configurationData, mappedRecordId, userId]);

  useEffect(() => {
    if (recodTypeFieldsData) {
      // console.log("recodTypeFields", recodTypeFieldsData);
      setNetsuiteOptions([]);
      if (
        recodTypeFieldsData[0].body.length > 0 ||
        recodTypeFieldsData[0].lines.length > 0
      ) {
        const entries = Object.entries(recodTypeFieldsData[0]?.body[0]);
        entries.map(([key, value], index) => {
          setNetsuiteOptions((netsuiteValues) => [
            ...netsuiteValues,
            { label: value + " (field Id: " + key + ")", value: key },
          ]);
        });
        recodTypeFieldsData[0]?.lines.map((item) => {
          const lineEntries = Object.entries(item);
          lineEntries.map(([key, value], index) => {
            const valueEntries = Object.entries(value);
            valueEntries.map(([key1, value1], index) => {
              const value1Entries = Object.entries(value1);
              value1Entries.map(([key2, value2], index) => {
                setNetsuiteOptions((netsuiteValues) => [
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
  }, [recodTypeFieldsData]);

  useEffect(() => {
    console.log("customFilterFieldsData", customFilterFieldsData);
    if (customFilterFieldsData?.length) {
      setValue("netsuiteFields", {
        label: customFilterFieldsData[0].sourceFieldLabel,
        value: customFilterFieldsData[0].sourceFieldValue,
      });

      setValue("operator", {
        label: customFilterFieldsData[0].operator,
        value: customFilterFieldsData[0].operator,
      });

      customFilterFieldsData[0].condition === "AND"
        ? setAndConditionState(true)
        : setAndConditionState(false);
      customFilterFieldsData[0].condition === "OR"
        ? setOrConditionState(true)
        : setOrConditionState(false);

      setCheckedValue(customFilterFieldsData[0].fieldType);
      if (customFilterFieldsData[0].fieldType === "dropdownField") {
        // console.log(customFilterFieldsData[0].destinationFieldLabel, "and", customFilterFieldsData[0].destinationFieldValue)
        setValue("googleSheetFields", {
          label: customFilterFieldsData[0].destinationFieldLabel,
          value: customFilterFieldsData[0].destinationFieldValue,
        });
      } else {
        // console.log(customFilterFieldsData[0].destinationFieldValue)
        setValue(
          "googleSheetFields",
          customFilterFieldsData[0].destinationFieldValue
        );
      }
    }
  }, [customFilterFieldsData, setValue]);

  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const onClickModal = () => {
    toggle();
  };

  const toggleComponent = (value) => {
    setCheckedValue(value);
    setDropdownFieldValue(value === "dropdownField" ? true : false);
    setInputBoxFieldValue(value === "inputBoxField" ? true : false);
    toggle();
  };

  const onSubmit = (data) => {
    console.log(data);
    const fiterItem = {
      userId: userId,
      mappedRecordId: JSON.parse(mappedRecordId),
      integrationId: configurationData[0].integrationId,
      sourceFieldValue: data.netsuiteFields.value,
      sourceFieldLabel: data.netsuiteFields.label,
      destinationFieldValue: data.googleSheetFields.value
        ? data.googleSheetFields.value
        : data.googleSheetFields,
      destinationFieldLabel: data.googleSheetFields.label
        ? data.googleSheetFields.label
        : undefined,
      operator: data.operator.label,
      fieldType: checkedValue,
      condition: andConditionState ? "AND" : orConditionState ? "OR" : null,
    };

    console.log("filter data", fiterItem);
    // addCustomFilterFields.mutate(fiterItem, {
    //   onSuccess: (data) => {
    //     console.log(data);
    //   },
    //   onError: (error) => {
    //     console.log(error);
    //   },
    // });
    // history.back();
  };

  const [andConditionState, setAndConditionState] = useState(false);
  const [orConditionState, setOrConditionState] = useState(false);

  const handelAndCondition = (e) => {
    // console.log(e.target.innerText)
    setAndConditionState(!andConditionState);
    if (e.target.innerText === "AND") {
      setOrConditionState(false);
    }
  };
  const handelOrCondition = (e) => {
    setOrConditionState(!orConditionState);
    if (e.target.innerText === "OR") {
      setAndConditionState(false);
    }
  };
  console.log("andConditionState", andConditionState);
  console.log("orConditionState", orConditionState);

  const addConditionClass = andConditionState ? "active" : null;
  const orConditionClass = orConditionState ? "active" : null;

  return (
    <>
      <TkButton onClick={handelAndCondition} className={addConditionClass}>
        AND
      </TkButton>
      &nbsp;&nbsp;
      <TkButton onClick={handelOrCondition} className={orConditionClass}>
        OR
      </TkButton>
      
      <TkForm onSubmit={handleSubmit(onSubmit)}>
        <TkRow className="mt-1 mb-5">
          <TkCol lg={4}>
            <Controller
              name="netsuiteFields"
              control={control}
              render={({ field }) => (
                <TkSelect
                  {...field}
                  labelName="Netsuite fields"
                  id="netsuiteFields"
                  options={netsuiteOptions}
                  maxMenuHeight="100px"
                  requiredStarOnLabel={true}
                />
              )}
            />
            {errors.netsuiteFields?.message ? (
              <FormErrorText>{errors.netsuiteFields?.message}</FormErrorText>
            ) : null}
          </TkCol>

          <TkCol lg={4}>
            <Controller
              name="operator"
              control={control}
              render={({ field }) => (
                <TkSelect
                  {...field}
                  labelName="Operator"
                  id="operator"
                  options={operators}
                  maxMenuHeight="100px"
                  requiredStarOnLabel={true}
                />
              )}
            />
            {errors.operator?.message ? (
              <FormErrorText>{errors.operator?.message}</FormErrorText>
            ) : null}
          </TkCol>

          <TkCol lg={4}>
            <TkLabel>Google sheet fields</TkLabel>
            <div className="d-flex">
              {checkedValue === "dropdownField" ? (
                <>
                  <Controller
                    name="googleSheetFields"
                    control={control}
                    render={({ field }) => (
                      <TkSelect
                        {...field}
                        id="googleSheetFields"
                        maxMenuHeight="100px"
                        options={[
                          { label: "Name", value: "name" },
                          { label: "Email", value: "email" },
                        ]}
                      />
                    )}
                  />
                  {/* {errors.googleSheetFields?.message ? (
                    <FormErrorText>
                      {errors.googleSheetFields?.message}
                    </FormErrorText>
                  ) : null} */}
                </>
              ) : (
                <>
                  <TkInput
                    {...register("googleSheetFields")}
                    id="googleSheetFields"
                    type="text"
                    placeholder="Enter Google sheet field"
                  />
                  {/* {errors.googleSheetFields?.message ? (
                    <FormErrorText>
                      {errors.googleSheetFields?.message}
                    </FormErrorText>
                  ) : null} */}
                </>
              )}
              <i className="ri-settings-3-line fs-2" onClick={onClickModal} />
            </div>
          </TkCol>

          <TkCol lg={3}>
            <TkButton type="submit" className="btn-success my-5 me-3">
              Save
            </TkButton>
            {/* </TkCol>

        <TkCol lg={3}> */}
            <TkButton
              className="btn-success my-5"
              type="button"
              onClick={() => history.back()}
            >
              Cancel
            </TkButton>
          </TkCol>
        </TkRow>
      </TkForm>
      <TkModal isOpen={modal} centered={true}>
        <TkModalHeader toggle={toggle}></TkModalHeader>
        <TkModalBody className="modal-body">
          <TkRow>
            <TkCol lg={6}>
              <TkLabel></TkLabel>

              <TkRadioButton
                type="radio"
                name="fieldType"
                label="Field"
                value="dropdownField"
                className="mb-3"
                checked={dropdownFieldValue}
                onChange={() => toggleComponent("dropdownField")}
              >
                Field
              </TkRadioButton>

              <TkRadioButton
                type="radio"
                name="fieldType"
                label="Value"
                value="inputBoxField"
                className="mb-3"
                checked={inputBoxFieldValue}
                onChange={() => toggleComponent("inputBoxField")}
              >
                Value
              </TkRadioButton>
            </TkCol>
          </TkRow>
        </TkModalBody>
      </TkModal>
    </>
  );
};

export default Field;
