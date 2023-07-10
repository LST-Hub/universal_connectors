import TkTableContainer from "@/globalComponents/TkTableContainer";
import { useQueries } from "@tanstack/react-query";
import tkFetch from "@/utils/fetch";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/utils/Constants";
import { Tooltip } from "@nextui-org/react";
import { formatDate, formatTime } from "@/utils/date";
import TkNoData from "@/globalComponents/TkNoData";
import TkLoader from "@/globalComponents/TkLoader";

const LogTable = () => {
  const [userId, setUserId] = useState(null);
  const [rows, setRows] = useState([]);

  const apiResults = useQueries({
    queries: [
      {
        queryKey: ["logs", userId],
        queryFn: tkFetch.get(`${API_BASE_URL}/getLogs/${userId}`),
        enabled: !!userId,
      }
    ]
  })
  
  const [logs] = apiResults
  const { data: logsData, isLoading, error } = logs;

  useEffect(() => {
    const id = sessionStorage.getItem("userId");
    if(id){
      setUserId(JSON.parse(id))
    }
  },[])

  useEffect(() => {
    if(logsData){
      setRows(logsData)
    }
  },[logsData])

  const data = [
    {
      id: 1,
      integrationName: "NSGS",
      recordType: "Contact",
      syncDate: "10 Aug, 2021",
      syncTime: "10:34 AM",
      lastSyncDate: "12 Oct, 2021",
      lastSyncTime: "11:00 PM",
      status: "Error",
      message: "Error for updating the records",
      action: "",
      details: "Contact records not updated successfully for NSGS",
    },
    {
      id: 2,
      integrationName: "NSGS",
      recordType: "Vendor",
      syncDate: "09 Nov, 2022",
      syncTime: "12:47 AM",
      lastSyncDate: "12 Aug, 2023",
      lastSyncTime: "11:39 PM",
      status: "Success",
      message: "50 records updated successfully out of 50",
      action: "",
      details: "All NSGS Vendor records updated successfully",
    },
  ];

  const logsHead = [
    {
      Header: "Integration Name",
      accessor: "integrationName",
      Cell: (props) => {
        return <a>{props.row.original?.integration.integrationName}</a>;
      },
    },
    {
      Header: "Record Type",
      accessor: "recordType",
      Cell: (props) => {
        return <a>{props.row.original?.mappedRecord.recordTypeLabel}</a>;
      },
    },
    {
      Header: "Sync Date",
      accessor: "creationDate",
      Cell: (props) => {
        const date = formatDate(props.row.original?.creationDate);
        const time = formatTime(props.row.original?.creationDate);
        return (
          <Tooltip
            color="invert"
            content={`${date} ${time}`}
            placement="bottom"
          >
            <div>{date}</div>
          </Tooltip>
        );
      },
    },
    {
      Header: "Last Sync Date",
      accessor: "modificationDate",
      Cell: (props) => {
        const date = formatDate(props.row.original?.modificationDate);
        const time = formatTime(props.row.original?.modificationDate);
        return (
          <Tooltip
            color="invert"
            content={`${date} ${time}`}
            placement="bottom"
          >
            <div>{date}</div>
          </Tooltip>
        );
      },
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Message",
      accessor: "logMessage",
      // Cell: (props) => {
      //   return (
      //     <Tooltip
      //       color="invert"
      //       content={`${props.value}: ${props.row.original?.details}`}
      //       placement="bottom"
      //     >
      //       <span>{props.value}</span>
      //     </Tooltip>
      //   );
      // },
    },
    // {
    //   Header: "Action",
    //   accessor: "action",
    //   Cell: () => {
    //     return (
    //       <>
    //         {/* <Link href=""> */}
    //         <i className="ri-eye-fill" />
    //         {/* </Link> */}
    //       </>
    //     );
    //   },
    // },
  ];

  return (
    <>
    {isLoading ? (
      <TkLoader />
    ) : logsData?.length > 0 ? (
<TkTableContainer columns={logsHead} data={rows} showPagination={true} />
    ) : (
      <TkNoData />
    )
    }
       {/* {data.length ? (
         <TkTableContainer columns={logsHead} data={rows} showPagination={true} />
       ) : (
         "No data found"
       )} */}
    </>
  );
};

export default LogTable;
