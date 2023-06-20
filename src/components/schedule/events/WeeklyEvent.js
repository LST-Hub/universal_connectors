import TkButton from "@/globalComponents/TkButton";
import TkCheckBox from "@/globalComponents/TkCheckBox";
import TkDate from "@/globalComponents/TkDate";
import TkForm from "@/globalComponents/TkForm";
import TkLabel from "@/globalComponents/TkLabel";
import TkRow, { TkCol } from "@/globalComponents/TkRow";
import TkSelect from "@/globalComponents/TkSelect";
import { API_BASE_URL, days, timeOptions } from "@/utils/Constants";
import { useForm, Controller } from "react-hook-form";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormErrorText from "@/globalComponents/ErrorText";
import { useMutation, useQuery } from "@tanstack/react-query";
import tkFetch from "@/utils/fetch";
import { useRouter } from "next/router";
import DeleteModal from "@/utils/DeleteModal";

const schema = Yup.object({
  startDate: Yup.date().required("Start date is required"),

  startTime: Yup.object().required("Start time is required"),

  days: Yup.object().required("Day is required"),
}).required();

const WeeklyEvent = ({ checkBoxValue, toggleComponet, eventId, syncData }) => {
  let userId = useRef(null);
  let scheduleEventData = useRef(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const router = useRouter();
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [ids, setIds] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const addEvent = useMutation({
    mutationFn: tkFetch.post(`${API_BASE_URL}/addWeeklyEvent`),
  });

  const updateWeeklyEvent = useMutation({
    mutationFn: tkFetch.putWithIdInUrl(`${API_BASE_URL}/updateWeeklyEvent`),
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
        userId: userId.current,
      });
    }
  }, [eventId]);

  useEffect(() => {
    if (eventData) {
      if (eventData[0]?.eventType === "Weekly") {
        setValue("startDate", eventData[0].startDate);
        setValue("startTime", {
          label: eventData[0].startTimeLabel,
          value: eventData[0].startTimeValue,
        });
        setValue("days", {
          label: eventData[0].day,
          value: eventData[0].day,
        });
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
      // data.endDate = null;
    }

    if (eventId) {
      console.log("update weekly event*******");
      const eventData = {
        id: eventId,
        userId: JSON.parse(userId.current),
        integrationId: syncData.integrationId,
        mappedRecordId: syncData.mappedRecordId,
        eventType: "Weekly",
        startDate: data.startDate,
        startTimeLabel: data.startTime.label,
        startTimeValue: data.startTime.value,
        day: data.days.label,
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

      // ***API call
      if (
        syncData.operationType === "add" &&
        syncData.source === "GoogleSheet"
      ) {
        toggleDeleteModel(eventData);
      } else {
        updateWeeklyEvent.mutate(eventData, {
          onSuccess: (res) => {},
          onError: (err) => {
            console.log("err", err);
          },
        });
        router.push("/schedule");
      }

      // updateWeeklyEvent.mutate(eventData, {
      //   onSuccess: (res) => {},
      //   onError: (err) => {
      //     console.log("err", err);
      //   },
      // });
    } else {
      console.log("add weekly event******");

      const eventData = {
        userId: JSON.parse(userId.current),
        integrationId: syncData.integrationId,
        mappedRecordId: syncData.mappedRecordId,
        eventType: "Weekly",
        startDate: data.startDate,
        startTimeLabel: data.startTime.label,
        startTimeValue: data.startTime.value,
        day: data.days.label,
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

      console.log("eventData", eventData)

      // API call
      if (
        syncData.operationType === "add" &&
        syncData.source === "GoogleSheet"
      ) {
        console.log("if")
        toggleDeleteModel(eventData);
      } else {
        addEvent.mutate(eventData, {
          onSuccess: (res) => {},
          onError: (err) => {
            console.log("err", err);
          },
        });
        router.push("/schedule");
      }

      // addEvent.mutate(eventData, {
      //   onSuccess: (res) => {},
      //   onError: (err) => {
      //     console.log("err", err);
      //   },
      // });
    }

    // router.push("/schedule");
  };

  const onCancel = () => {
    // toggleComponet("singleEvent");
    history.back();
  };

  const onClickDelete = () => {
    console.log("scheduleEventData", scheduleEventData.current);

    if (scheduleEventData.current.id) {
      updateWeeklyEvent.mutate(scheduleEventData.current, {
        onSuccess: (res) => {},
        onError: (err) => {
          console.log("err", err);
        },
      });
    } else {
      addEvent.mutate(scheduleEventData.current, {
        onSuccess: (res) => {},
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
      <h4 className="text-center mb-4 fw-bold">Weekly Event</h4>

      <TkForm className="mb-4" onSubmit={handleSubmit(onSubmit)}>
        <TkRow>
          <TkCol lg={5} sm={5} className="mb-2 fw-bold">
            Repeat Every 1 Week
          </TkCol>
        </TkRow>

        <TkRow>
          <TkCol lg={4} sm={4}>
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

          <TkCol lg={4} sm={4}>
            <Controller
              name="startTime"
              control={control}
              render={({ field }) => (
                <TkSelect
                  {...field}
                  labelName="Start Time"
                  id="startTime"
                  className="mb-3"
                  requiredStarOnLabel={true}
                  options={timeOptions}
                  maxMenuHeight="130px"
                />
              )}
            />
            {errors.startTime?.message ? (
              <FormErrorText>{errors.startTime?.message}</FormErrorText>
            ) : null}
          </TkCol>

          <TkCol lg={4} sm={4}>
            <Controller
              name="days"
              control={control}
              render={({ field }) => (
                <TkSelect
                  {...field}
                  labelName="Days"
                  id="days"
                  className="mb-3"
                  options={days}
                  maxMenuHeight="130px"
                  requiredStarOnLabel={true}
                />
              )}
            />
            {errors.days?.message ? (
              <FormErrorText>{errors.days?.message}</FormErrorText>
            ) : null}
          </TkCol>
        </TkRow>

        <TkRow>
          <TkCol lg={12} sm={12}>
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
              onChange={handleOnChangeCheckbox}
            />
            <TkLabel className="form-check-label mx-2 mb-3" id="noEndDate">
              No End Date
            </TkLabel>
          </TkCol>
        </TkRow>

        <TkRow className="justify-content-center mt-2">
          <TkCol lg={1} sm={2} className="">
            <TkButton
              type="submit"
              className="btn-success"
              disabled={checkBoxValue}
            >
              Save
            </TkButton>
          </TkCol>

          <TkCol lg={2} sm={4} className="">
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

export default WeeklyEvent;
