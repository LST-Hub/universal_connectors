import FormErrorText from "@/globalComponents/ErrorText";
import TkButton from "@/globalComponents/TkButton";
import TkForm from "@/globalComponents/TkForm";
import TkInput from "@/globalComponents/TkInput";
import TkRow, { TkCol } from "@/globalComponents/TkRow";
import { TkToastError } from "@/globalComponents/TkToastContainer";
import useFullPageLoader from "@/globalComponents/useFullPageLoader";
import { API_BASE_URL } from "@/utils/Constants";
import tkFetch from "@/utils/fetch";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useMutation,
  useQueries,
  useQueryClient,
} from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const schema = Yup.object({
  integrationName: Yup.string().required("Integration name is required."),
}).required();

const GoogleSheetComponent = ({
  onClickHandler,
  toggle,
  integrationID,
  title,
  addedIntegrationsId,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const queryClient = useQueryClient();
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [integrationsData, setIntegrationsData] = useState();
  const [userID, setUserID] = useState();

  const addConfigurations = useMutation({
    mutationFn: tkFetch.post(`${API_BASE_URL}/addConfigurations`),
  });

  const updateConfiguration = useMutation({
    mutationFn: tkFetch.putWithIdInUrl(`${API_BASE_URL}/updateConfiguration`),
  });

  const apiResults = useQueries({
    queries: [
      {
        queryKey: ["configurationsData", integrationID],
        queryFn: tkFetch.get(
          `${API_BASE_URL}/getConfigurationById/${integrationID}`
        ),
        enabled: !!integrationID,
      },
      {
        queryKey: ["redirectUrl", userID],
        queryFn: tkFetch.get(`${API_BASE_URL}/getRedirectPage`),
        enabled: !!userID,
      },
      {
        queryKey: ["getcredentialDetailsById", userID],
        queryFn: tkFetch.get(
          `${API_BASE_URL}/getcredentialDetailsById/${userID}`
        ),
        enabled: !!userID,
      },
    ],
  });

  const [configurationsResult, restletRedirectUrl, credentialDetailsResult] =
    apiResults;
  const {
    data: configurationsData,
    isError: configError,
    isLoading: configLoading,
    error: configErrorData,
  } = configurationsResult;
  const {
    data: redirectUrl,
    isError: redirectError,
    isLoading: redirectLoading,
    error: redirectErrorData,
  } = restletRedirectUrl;
  const {
    data: credentialDetailsData,
    isError: credentialError,
    isLoading: credentialLoading,
    error: credentialErrorData,
  } = credentialDetailsResult;

  useEffect(() => {
    // queryClient.invalidateQueries({
    //   queryKey: ["getCustomFilterFieldsById", eventId],
    // });
    const Id = sessionStorage.getItem("userId");
    if (Id) {
      // TODO: use let
      setUserID(Id);
    }
  }, [queryClient]);

  useEffect(() => {
    if (configurationsData?.length) {
      configurationsData.map((item) => {
        if (item.systemName === title) {
          setIntegrationsData(item);
          setValue("integrationName", item.integration.integrationName);
        }
      });
    }
  }, [configurationsData, integrationID, setValue, title]);

  const onSubmit = (data) => {
    if (redirectUrl) {
      window.open(
        redirectUrl[0],
        "mywindow",
        "menubar=1,resizable=,width=550,height=550"
      );
    }
    showLoader();
    const userId = sessionStorage.getItem("userId");
    if (configurationsData?.length) {
      configurationsData.map((item) => {
        if (item.systemName === title) {
          const updatedData = {
            id: item.id,
            authenticationType: "xyz",
          };
          updateConfiguration.mutate(updatedData, {
            onSuccess: (data) => {
              hideLoader();
              queryClient.invalidateQueries({
                queryKey: ["configurationsData"],
              });
              onClickHandler();
            },
            onError: (error) => {
              console.log(error)
              hideLoader();
              toggle();
              TkToastError("Error: Record not updated");
            },
          });
        }
      });
    } else {
      const configurData = {
        userId: JSON.parse(userId),
        integrationId: addedIntegrationsId,
        systemName: title,
        authenticationType: "abc",
      };

      addConfigurations.mutate(configurData, {
        onSuccess: (data) => {
          hideLoader();
          queryClient.invalidateQueries({
            queryKey: ["configurationsData"],
          });
          onClickHandler();
        },
        onError: (error) => {
          console.log(error);
          hideLoader();
          toggle();
          TkToastError("Error: Record not added");
        },
      });
    }
  };

  return (
    <>
      <TkForm onSubmit={handleSubmit(onSubmit)} className="my-3">
        <TkRow className="g-3">
          <TkCol lg={12}>
            <TkInput
              {...register("integrationName")}
              id="integrationName"
              type="text"
              labelName="Integration Name"
              placeholder="Enter integration name"
              requiredStarOnLabel={true}
              invalid={errors.integrationName?.message ? true : false}
              disabled={integrationsData ? true : false}
            />
            {errors.integrationName?.message ? (
              <FormErrorText>{errors.integrationName?.message}</FormErrorText>
            ) : null}
          </TkCol>

          <TkCol lg={12}>
            <TkButton type="submit" className="btn-success float-end">
              {(credentialDetailsData?.length) ? "Reauthorize" : "Authorize"}
            </TkButton>
          </TkCol>
          {loader}
        </TkRow>
      </TkForm>
    </>
  );
};

export default GoogleSheetComponent;
