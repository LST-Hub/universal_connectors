import TkContainer from "@/components/TkContainer";
import TkCheckBox from "@/globalComponents/TkCheckBox";
import TkLabel from "@/globalComponents/TkLabel";
import TkRadioButton from "@/globalComponents/TkRadioButton";
import TkRow, { TkCol } from "@/globalComponents/TkRow";
import React, { useEffect, useState } from "react";
import RealtimeEvent from "./RealtimeEvent";
import SingleEvent from "./SingleEvent";
import WeeklyEvent from "./WeeklyEvent";
import { useQueries } from "@tanstack/react-query";
import tkFetch from "@/utils/fetch";
import { API_BASE_URL } from "@/utils/Constants";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const Event = ({ eventId, syncData }) => {
  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(),
  });

  const [showComponent, setShowComponent] = useState("realtimeEvent");
  const [realtimeEvent, setRealtimeEvent] = useState(true);
  const [singleEvent, setSingleEvent] = useState(false);
  const [weeklyEvent, setWeeklyEvent] = useState(false);
  const [checkBoxValue, setCheckBoxValue] = useState(false);
  const [ids, setIds] = useState(null);

  const apiResults = useQueries({
    queries: [
      {
        queryKey: ["eventData", ids],
        queryFn: tkFetch.get(`${API_BASE_URL}/getScheduleEventById`, {
          params: ids,
        }),
        enabled: !!ids,
      },
    ],
  });

  const [scheduleEvent] = apiResults;

  const {
    isLoading: isScheduleEventLoading,
    isError: isScheduleEventError,
    error: scheduleEventError,
    data: scheduleEventData,
  } = scheduleEvent;

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (userId && eventId) {
      setIds({
        id: eventId,
        userId: userId,
      });
    }
  }, [eventId]);

  const toggleComponet = (value) => {
    setShowComponent(value);
    setRealtimeEvent(value === "realtimeEvent" ? true : false);
    setSingleEvent(value === "singleEvent" ? true : false);
    setWeeklyEvent(value === "weeklyEvent" ? true : false);
  };

  // code for edit event if eventId is present
  useEffect(() => {
    if (scheduleEventData) {
      // setCheckBoxValue(true)
      setShowComponent(
        scheduleEventData[0].eventType === "Realtime"
          ? "realtimeEvent"
          : scheduleEventData[0].eventType === "Single"
          ? "singleEvent"
          : "weeklyEvent"
      );

      setRealtimeEvent(
        scheduleEventData[0].eventType === "Realtime" ? true : false
      );
      setSingleEvent(
        scheduleEventData[0].eventType === "Single" ? true : false
      );
      setWeeklyEvent(
        scheduleEventData[0].eventType === "Weekly" ? true : false
      );
    }
  }, [scheduleEventData]);

  return (
    <>
      <TkRow className="mt-1 ms-1">
        <TkCol lg={4}>
          <TkCheckBox
            {...register("realtime")}
            type="checkbox"
            id="realtime"
            checked={checkBoxValue}
            onChange={() => setCheckBoxValue(!checkBoxValue)}
          />
          <TkLabel id="realtime" className="form-check-label mx-2 h5">
            Realtime
          </TkLabel>
        </TkCol>
      </TkRow>

      <TkContainer className="my-3">
        <TkRow>
          <TkCol lg={3} sm={3}>
            <TkRadioButton
              type="radio"
              name="event"
              label="Realtime Event"
              value="realtimeEvent"
              className="mb-3"
              checked={realtimeEvent}
              onChange={() => toggleComponet("realtimeEvent")}
              disabled={checkBoxValue || eventId ? true : false}
            >
              Realtime Event
            </TkRadioButton>

            <TkRadioButton
              type="radio"
              name="event"
              label="Single Event"
              value="singleEvent"
              checked={singleEvent}
              className="mb-3"
              onChange={() => toggleComponet("singleEvent")}
              disabled={checkBoxValue || eventId ? true : false}
            >
              Single Event
            </TkRadioButton>

            <TkRadioButton
              type="radio"
              name="event"
              label="Weekly Event"
              value="weeklyEvent"
              checked={weeklyEvent}
              className="mb-3"
              onChange={() => toggleComponet("weeklyEvent")}
              disabled={checkBoxValue || eventId ? true : false}
            >
              Weekly Event
            </TkRadioButton>
          </TkCol>

          <TkCol lg={9} sm={9}>
            {showComponent === "realtimeEvent" ? (
              <RealtimeEvent
                checkBoxValue={checkBoxValue}
                eventId={eventId}
                syncData={syncData}
                eventType="realtimeEvent"
              />
            ) : showComponent === "singleEvent" ? (
              <SingleEvent
                checkBoxValue={checkBoxValue}
                eventId={eventId}
                syncData={syncData}
                eventType="singleEvent"
              />
            ) : showComponent === "weeklyEvent" ? (
              <WeeklyEvent
                toggleComponet={toggleComponet}
                checkBoxValue={checkBoxValue}
                eventId={eventId}
                syncData={syncData}
                eventType="weeklyEvent"
              />
            ) : (
              <SingleEvent />
            )}
          </TkCol>
        </TkRow>
      </TkContainer>
    </>
  );
};

export default Event;
