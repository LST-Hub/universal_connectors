import FormErrorText from "@/globalComponents/ErrorText";
import TkButton from "@/globalComponents/TkButton";
import TkCheckBox from "@/globalComponents/TkCheckBox";
import TkDate from "@/globalComponents/TkDate";
import TkForm from "@/globalComponents/TkForm";
import TkLabel from "@/globalComponents/TkLabel";
import TkRow, { TkCol } from "@/globalComponents/TkRow";
import { API_BASE_URL } from "@/utils/Constants";
import DeleteModal from "@/utils/DeleteModal";
import { formatDate } from "@/utils/date";
import tkFetch from "@/utils/fetch";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";

const schema = Yup.object({
  startDate: Yup.date().nullable().required("Start date is required"),
}).required();

const RealtimeEvent = ({ checkBoxValue, eventId, syncData }) => {
  let userId = useRef(null);
  let scheduleEventData = useRef(null);
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

  const {
    data: eventData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["eventData", ids],
    queryFn: tkFetch.get(`${API_BASE_URL}/getScheduleEventById`, {
      params: ids,
    }),
    enabled: !!ids,
  });

  useEffect(() => {
    userId.current = sessionStorage.getItem("userId");
    if (userId.current && eventId) {
      setIds({
        id: eventId,
        userId: JSON.parse(userId.current),
      });
    }
  }, [eventId]);

  useEffect(() => {
    if (eventData) {
      if (eventData[0]?.eventType === "Realtime") {
        setValue("startDate", eventData[0].startDate);
        setValue("endDate", eventData[0].endDate);
        setCheckboxValue(eventData[0].noEndDate);
      }
    } else {
      setValue("startDate", new Date());
      setValue("endDate", new Date());
    }
  }, [eventData, setValue]);

  const handleOnChange = (dates) => {
    if (dates) {
      setCheckboxValue(false);
    } else {
      setCheckboxValue(true);
    }
  };

  const handleOnChangeCheckbox = (e) => {
    if (e.target.checked) {
      setCheckboxValue(true);
      setValue("endDate", null);
    } else {
      setCheckboxValue(false);
      setValue("endDate", new Date());
    }
  };

  const onSubmit = (data) => {
    if (data.endDate) {
      data.noEndDate = false;
      setCheckboxValue(false);
    } else {
      data.noEndDate = true;
      setCheckboxValue(true);
    }
    if (eventId) {
      console.log("update realtime Event**********");
      const realtimeEventData = {
        id: eventId,
        userId: JSON.parse(userId.current),
        integrationId: syncData.integrationId,
        mappedRecordId: syncData.mappedRecordId,
        eventType: "Realtime",
        startDate: data.startDate,
        endDate: data.endDate,
        noEndDate: data.noEndDate,
        performType: syncData.perform,
        operationType: syncData.operationType,
        source: syncData.source,
        range: syncData.range,
      };

      if (syncData.savedSearchLabel) {
        realtimeEventData.savedSearchLabel = syncData.savedSearchLabel;
        realtimeEventData.savedSearchValue = syncData.savedSearchValue;
      }

      // ***API call
      if (
        syncData.operationType === "add" &&
        syncData.source === "GoogleSheet"
      ) {
        toggleDeleteModel(realtimeEventData);
      } else {
        updateRealTimeEvent.mutate(realtimeEventData, {
          onSuccess: (res) => {
            console.log("updateRealTimeEvent res", res);
          },
          onError: (err) => {
            console.log("err", err);
          },
        });
        router.push("/schedule");
      }

      // ***
      // if (syncData.operationType === "add" && syncData.source === "GoogleSheet") {
      //   if (confirm("Do you want to delete?")) {
      //     syncDataMutation.mutate(realtimeEventData, {
      //       onSuccess: (res) => {},
      //       onError: (err) => {
      //         console.log("err", err);
      //       }
      //     });
      //   }
      // } else {
      //   // console.log("*********************other", syncData.operationType)
      //   syncDataMutation.mutate(realtimeEventData, {
      //     onSuccess: (res) => {},
      //     onError: (err) => {
      //       console.log("err", err);
      //     }
      //   });
      // }
    } else {
      console.log("add realtime Event**********");
      const eventData = {
        userId: JSON.parse(userId.current),
        integrationId: syncData.integrationId,
        mappedRecordId: syncData.mappedRecordId,
        eventType: "Realtime",
        startDate: data.startDate,
        endDate: data.endDate,
        noEndDate: data.noEndDate,
        performType: syncData.perform,
        operationType: syncData.operationType,
        source: syncData.source,
        range: syncData.range,
      };

      if (syncData.savedSearchLabel) {
        eventData.savedSearchLabel = syncData.savedSearchLabel;
        eventData.savedSearchValue = syncData.savedSearchValue;
      }

      console.log("eventData", eventData);

      // API call
      if (
        syncData.operationType === "add" &&
        syncData.source === "GoogleSheet"
      ) {
        toggleDeleteModel(eventData);
      } else {
        addEvent.mutate(eventData, {
          onSuccess: (res) => {
            console.log("realtime event data", res);
          },
          onError: (err) => {
            console.log("err", err);
          },
        });
        router.push("/schedule");
      }

      // ***
      // addEvent.mutate(eventData, {
      //   onSuccess: (res) => {
      //     console.log("realtime event data", res)
      //     syncDataMutation.mutate({ ...eventData, id: res[0].id }, {
      //       onSuccess: (res) => {},
      //       onError: (err) => {
      //         console.log("err", err);
      //       }
      //     })
      //   },
      //   onError: (err) => {
      //     console.log("err", err);
      //   },
      // });
    }
    // router.push("/schedule");
  };
  const onCancel = () => {
    history.back();
  };

  const onClickDelete = () => {
    console.log("scheduleEventData", scheduleEventData.current);

    if (scheduleEventData.current.id) {
      updateRealTimeEvent.mutate(scheduleEventData.current, {
        onSuccess: (res) => {
          console.log("updateRealTimeEvent res", res);
        },
        onError: (err) => {
          console.log("err", err);
        },
      });
    } else {
      addEvent.mutate(scheduleEventData.current, {
        onSuccess: (res) => {
          console.log("realtime event data", res);
        },
        onError: (err) => {
          console.log("err", err);
        },
      });
    }
    setDeleteModal(false);
    router.push("/schedule");
  };

  const toggleDeleteModel = (eventData) => {
    scheduleEventData.current = eventData;
    setDeleteModal(true);
  };

  return (
    <>
      <h4 className="text-center mb-4 fw-bold"> Realtime Event </h4>

      <TkForm className="mb-4" onSubmit={handleSubmit(onSubmit)}>
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
                    // minDate: "today",
                    // altInput: true,
                    // altFormat: "d M, Y",
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
                    // minDate: "today",
                    // altInput: true,
                    // altFormat: "d M, Y",
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
              // disabled={checkboxValue ? false : true}
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

      <DeleteModal
        show={deleteModal}
        onDeleteClick={onClickDelete}
        onCloseClick={() => setDeleteModal(false)}
        label="This will erase all the data from Google Sheet and it will add new data from Netsuite. Are you sure you want to continue?"
        image={false}
      />
    </>
  );
};

export default RealtimeEvent;
