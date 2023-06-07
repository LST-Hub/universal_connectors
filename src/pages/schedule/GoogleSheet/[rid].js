import TkContainer from '@/components/TkContainer'
import Filter from '@/components/schedule/Filter'
import TkPageHead from '@/globalComponents/TkPageHead'
import BreadCrumb from '@/utils/BreadCrumb'
import { useRouter } from 'next/router'
import React from 'react'

const DestinationFilter = () => {
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
          <Filter  mappedRecordId={rId} />
        </TkContainer>
      </div>
    </>
  )
}

export default DestinationFilter

DestinationFilter.options = {
    layout: true,
    auth: true,
  };