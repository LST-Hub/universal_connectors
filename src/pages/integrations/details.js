import React, { useCallback, useState } from "react";
import TkPageHead from "@/globalComponents/TkPageHead";
import TkRow, { TkCol } from "@/globalComponents/TkRow";
import ModalButton from "@/components/integrations/integrationModal";
import TkContainer from "@/globalComponents/TkContainer";
import BreadCrumb from "@/utils/BreadCrumb";
import TkCard, { TkCardBody } from "@/globalComponents/TkCard";

const Details = () => {
  const [modal, setModal] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  }, [modal]);

  return (
    <>
      <TkPageHead>
        <title>{"Integrations"}</title>
      </TkPageHead>

      <div className="page-content">
        <BreadCrumb
          parentTitle="Integrations"
          parentLink="/integrations"
          pageTitle="Details"
          // buttonText={"Add Integration"}
          // onButtonClick={toggle}
        />

        <h4 className="mb-5">Integration Details</h4>
        <TkContainer>
          <TkCard className={"p-3"}>
            <TkCardBody>
            <TkRow>
            <TkCol lg={6} sm={6}>
              <ModalButton modal={modal} setModal={setModal} toggle={toggle}>
                Procced
              </ModalButton>
            </TkCol>
            <TkCol lg={6} sm={6}>
              <h5>
                NetSuite™ to Google Sheets™ Two Way Integration for Smooth,
                Effortless & Swift Data Sync.
              </h5>
              <p>
                So, you’re seeking to Data Sync from NetSuite™ to Google Sheets™
                or vice versa. Luckily, NSGS evolved an add-on that permits you
                to automate the system of going from NetSuite™ to Google Sheets™
                and vice versa. Even more, you could get began out unfastened
                with a restrained trial. Import NetSuite™ records right into
                Google Sheets™ and vice versa in real-time.
              </p>
            </TkCol>
          </TkRow>
            </TkCardBody>
          </TkCard>
        </TkContainer>
      </div>
    </>
  );
};

export default Details;

Details.options = {
  layout: true,
};
