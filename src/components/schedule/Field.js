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
import TkTableContainer from "@/globalComponents/TkTableContainer";
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
  // netsuiteFields: Yup.object().required("Field name is required."),
  // operator: Yup.object().required("Operator is required."),
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
      {
        queryKey: ["getFields", mappedRecordId],
        queryFn: tkFetch.get(`${API_BASE_URL}/getFields/${mappedRecordId}`),
        enabled: !!mappedRecordId,
      },
    ],
  });

  const [configuration, recodTypeFields, customFilterFields, getFields] =
    apiResults;

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
  const {
    data: fieldsData,
    isLoading: fieldsLoading,
    isError: fieldsError,
    error: fieldsErrorData,
  } = getFields;

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

  useEffect(() => {
    console.log("**customFilterFieldsData", customFilterFieldsData)
    if (customFilterFieldsData?.length > 0) {
      customFilterFieldsData.map((item, index) => {
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
          value: item.destinationFieldValue
        });
      });

      setRows(customFilterFieldsData);
      // return;
    } else {
      console.log("else")
      setValue(`netsuiteFields`, {
        label: null,
        value: null,
      });
      setValue(`operator`, {
        label: null,
        value: null,
      });
      setValue(`googleSheetFields`, {
        label: null,
        value: null
      });
      setRows([
        // {
        //   netsuiteFields: "",
        //   operator: "",
        //   googleSheetFields: "",
        // },
      ]);
    }
  }, [customFilterFieldsData, setValue]);

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
    history.back();
  };

  const onSubmit = (data) => {
    console.log("data", data);
    // const fiterItem = data.googleSheetFields.map((item, index) => {
    //   return {
    //     userId: userId,
    //     mappedRecordId: JSON.parse(mappedRecordId),
    //     integrationId: configurationData[0].integrationId,
    //     sourceFieldValue: data.netsuiteFields[index].value,
    //     sourceFieldLabel: data.netsuiteFields[index].label,
    //     destinationFieldValue: item.value,
    //     destinationFieldLabel: item.label,
    //     operator: data.operator[index].label,
    //   };
    // });
    // console.log("fiterItem", fiterItem);

    const fiterItem = {
      userId: userId,
      mappedRecordId: JSON.parse(mappedRecordId),
      integrationId: configurationData[0].integrationId,
      sourceFieldValue: data.netsuiteFields[0].value,
      sourceFieldLabel: data.netsuiteFields[0].label,
      destinationFieldValue: data.googleSheetFields[0].value,
      destinationFieldLabel: data.googleSheetFields[0].label,
      operator: data.operator[0].label,
    }

    addCustomFilterFields.mutate(fiterItem, {
      onSuccess: (data) => {
        console.log(data);
      },
      onError: (error) => {
        console.log(error);
      },
    });
    history.back();
  };

  return (
    <>
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
      {/* <TkForm onSubmit={handleSubmit(onSubmit)}>
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
                </>
              ) : (
                <>
                  <TkInput
                    {...register("googleSheetFields")}
                    id="googleSheetFields"
                    type="text"
                    placeholder="Enter Google sheet field"
                  />
                </>
              )}
              <i className="ri-settings-3-line fs-2" onClick={onClickModal} />
            </div>
          </TkCol>

          <TkCol lg={3}>
            <TkButton type="submit" className="btn-success my-5 me-3">
              Save
            </TkButton>

            <TkButton
              className="btn-success my-5"
              type="button"
              onClick={() => history.back()}
            >
              Cancel
            </TkButton>
          </TkCol>
        </TkRow>
      </TkForm> */}
    </>
  );
};

export default Field;
