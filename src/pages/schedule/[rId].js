import Field from "@/components/schedule/Field";
import TkContainer from "@/components/TkContainer";
import TkPageHead from "@/globalComponents/TkPageHead";
import BreadCrumb from "@/utils/BreadCrumb";
import { useRouter } from "next/router";
import React from "react";

const MapField = () => {
  const router = useRouter();
  const { rId } = router.query;

  return (
    <>
      <TkPageHead>
        <title>{"Field"}</title>
      </TkPageHead>

      <div className="page-content">
        <BreadCrumb
          parentTitle="Schedule"
          parentLink="/schedule"
          pageTitle="Map Fields"
        />

        <TkContainer>
          <Field mappedRecordId={rId} />
        </TkContainer>
      </div>
    </>
  );
};

export default MapField;

MapField.options = {
  layout: true,
  auth: true,
};
