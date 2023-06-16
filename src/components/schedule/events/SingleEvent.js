import TkButton from "@/globalComponents/TkButton";
import TkCheckBox from "@/globalComponents/TkCheckBox";
import TkDate from "@/globalComponents/TkDate";
import TkForm from "@/globalComponents/TkForm";
import TkLabel from "@/globalComponents/TkLabel";
import TkRow, { TkCol } from "@/globalComponents/TkRow";
import TkSelect from "@/globalComponents/TkSelect";
import { API_BASE_URL, timeOptions } from "@/utils/Constants";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import FormErrorText from "@/globalComponents/ErrorText";
import { useMutation, useQuery } from "@tanstack/react-query";
import tkFetch from "@/utils/fetch";
import { useRouter } from "next/router";
import DeleteModal from "@/utils/DeleteModal";

const schema = Yup.object({
  startDate: Yup.date().required("Start date is required"),

  startTime: Yup.object().required("Start time is required"),
}).required();

const SingleEvent = ({ checkBoxValue, eventId, syncData }) => {
  const userId = useRef(null);
  let scheduleEventData = useRef(null);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const router = useRouter();
  const [endDateCheckbox, setEndDateCheckbox] = useState(false);
  const [repeatEveryDay, setRepeatEveryDay] = useState(true);
  const [ids, setIds] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const addEvent = useMutation({
    mutationFn: tkFetch.post(`${API_BASE_URL}/addSingleEvent`),
  });

  const updateSingleEvent = useMutation({
    mutationFn: tkFetch.putWithIdInUrl(`${API_BASE_URL}/updateSingleEvent`),
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
      if (eventData[0]?.eventType === "Single") {
        setValue("startDate", eventData[0]?.startDate);
        setValue("endDate", eventData[0]?.endDate);

        setValue("startTime", {
          label: eventData[0]?.startTimeLabel,
          value: eventData[0]?.startTimeValue,
        });
        setRepeatEveryDay(eventData[0]?.repeatEveryDay);
        setEndDateCheckbox(eventData[0]?.noEndDate);
      }
    } else {
      setValue("startDate", new Date());
      setValue("endDate", new Date());
    }
  }, [eventData, setValue]);

  const handleOnChange = (dates) => {
    if (dates) {
      setEndDateCheckbox(false);
    } else {
      setEndDateCheckbox(true);
    }
  };

  const handleOnChangeCheckbox = (e) => {
    if (e.target.checked) {
      setEndDateCheckbox(true);
      setValue("endDate", null);
    } else {
      setEndDateCheckbox(false);
      setValue("endDate", new Date());
    }
  };

  const onSubmit = (data) => {
    if (data.endDate) {
      data.noEndDate = false;
      setEndDateCheckbox(false);
    } else {
      data.noEndDate = true;
      setEndDateCheckbox(true);
    }

    if (eventId) {
      console.log("update single event********");
      const eventData = {
        id: eventId,
        userId: JSON.parse(userId.current),
        integrationId: syncData.integrationId,
        mappedRecordId: syncData.mappedRecordId,
        eventType: "Single",
        startDate: data.startDate,
        startTimeLabel: data.startTime.label,
        startTimeValue: data.startTime.value,
        repeatEveryDay: data.repeatEveryDay,
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
        updateSingleEvent.mutate(eventData, {
          onSuccess: (data) => {},
          onError: (error) => {
            console.log(error);
          },
        });
        router.push("/schedule");
      }
    } else {
      console.log("add single event*********");

      const eventData = {
        userId: JSON.parse(userId.current),
        integrationId: syncData.integrationId,
        mappedRecordId: syncData.mappedRecordId,
        eventType: "Single",
        startDate: data.startDate,
        startTimeLabel: data.startTime.label,
        startTimeValue: data.startTime.value,
        repeatEveryDay: data.repeatEveryDay,
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

      // API call
      if (
        syncData.operationType === "add" &&
        syncData.source === "GoogleSheet"
      ) {
        toggleDeleteModel(eventData);
      } else {
        addEvent.mutate(eventData, {
          onSuccess: (data) => {},
          onError: (error) => {
            console.log(error);
          },
        });
        router.push("/schedule");
      }
    }

    // router.push("/schedule");
  };

  const onCancel = () => {
    history.back();
  };

  const onClickDelete = () => {
    console.log("scheduleEventData", scheduleEventData.current);

    if (scheduleEventData.current.id) {
      updateSingleEvent.mutate(scheduleEventData.current, {
        onSuccess: (data) => {},
        onError: (error) => {
          console.log(error);
        },
      });
    } else {
      addEvent.mutate(scheduleEventData.current, {
        onSuccess: (data) => {},
        onError: (error) => {
          console.log(error);
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
      <h4 className="text-center mb-4 fw-bold">Single Event</h4>

      <TkForm onSubmit={handleSubmit(onSubmit)}>
        <TkRow>
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

          <TkCol lg={6} sm={6}>
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

          <TkCol lg={6} sm={6}>
            <TkCheckBox
              {...register("repeatEveryDay")}
              className="form-check-input mb-3"
              type="checkbox"
              id="repeatEveryDay"
              checked={repeatEveryDay}
              onChange={(e) => {
                setRepeatEveryDay(e.target.checked);
              }}
            />
            <TkLabel className="form-check-label mx-2 mb-3" id="repeatEveryDay">
              Repeat Every Day
            </TkLabel>
          </TkCol>

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
                    dateFormat: "d M, Y",
                  }}
                />
              )}
            />

            <TkCheckBox
              {...register("noEndDate")}
              className="form-check-input"
              type="checkbox"
              id="noEndDate"
              checked={endDateCheckbox}
              // disabled={true}
              onChange={handleOnChangeCheckbox}
            />
            <TkLabel className="form-check-label mx-2" id="noEndDate">
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
        label="This will erase all all the data from Google Sheet and it will add new data from Netsuite. Are you sure you want to continue?"
        image={false}
      />
    </>
  );
};

export default SingleEvent;
