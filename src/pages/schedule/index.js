import TkPageHead from "@/globalComponents/TkPageHead";
import BreadCrumb from "@/utils/BreadCrumb";
import React from "react";
import { useRouter } from "next/router";
import ScheduleTable from "@/components/schedule";

const Schedule = () => {
  const router = useRouter();
  const addSchedule = () => {
    router.push("/schedule/event");
  };
  return (
    <>
      <TkPageHead>
        <title>{"Schedule"}</title>
      </TkPageHead>

      <div className="page-content">
        <BreadCrumb
          pageTitle="Schedule"
          // syncButton="Run / Sync Now"
          buttonText={"Add Schedule"}
          onButtonClick={addSchedule}
        />

        <ScheduleTable />
      </div>
    </>
  );
};

export default Schedule;
Schedule.options = {
  layout: true,
  auth: true,
};
