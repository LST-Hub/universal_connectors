import TkLoader from "@/globalComponents/TkLoader";
import TkNoData from "@/globalComponents/TkNoData";
import TkTableContainer from "@/globalComponents/TkTableContainer";
import { API_BASE_URL } from "@/utils/Constants";
import { formatDate, formatTime } from "@/utils/date";
import tkFetch from "@/utils/fetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Tooltip } from "@nextui-org/react";
import DeleteModal from "@/utils/DeleteModal";

const ScheduleTable = () => {
let deleteEventId = useRef(null);

const queryClient = useQueryClient();

  const [userId, setUserId] = useState(null);
  const [data, setData] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);


  const { data: scheduleData, isLoading } = useQuery({
    queryKey: ["schedule", userId],
    queryFn: tkFetch.get(`${API_BASE_URL}/getSchedules/${userId}`),
    enabled: !!userId,
  });

  const deleteScheduleEvent = useMutation({
    mutationFn: tkFetch.deleteWithIdsInUrl(
      `${API_BASE_URL}/deleteScheduleEvent`
    ),
  });

  useEffect(() => {
    const id = sessionStorage.getItem("userId");
    if (id) {
      setUserId(JSON.parse(id));
    }
  }, []);
  
  useEffect(() => {
    if (scheduleData?.length > 0) {
      setData(scheduleData);
    }
  }, [scheduleData]);

  const selectedRowsId = useCallback((rows) => {
    const ids = data.map((row) => row.id);
  }, [data]);

  const toggleDeleteModel = (eventId, integrationId) => {
    // console.log("eventId", eventId)
    deleteEventId.current = {
      id: eventId,
      integrationId: integrationId,
    }
    setDeleteModal(true);
  }

  const onClickDelete = () => {
    deleteScheduleEvent.mutate(deleteEventId.current, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ["schedule", userId],
        });
        queryClient.invalidateQueries({
          queryKey: ["integrations"],
        });
        setDeleteModal(false);
      }, onError: () => {
        setDeleteModal(false);
      }
    })
  };

  const scheduleHead = [
    {
      Header: "Integration",
      accessor: "integrationName",
      Cell: (props) => {
        return <>{props.row.original.integration.integrationName}</>;
      },
    },
    {
      Header: "Event",
      accessor: "eventType",
    },
    {
      Header: "Creation Date",
      accessor: "creationDate",
      Cell: (props) => {
        const date = formatDate(props.row.original?.creationDate);
        const time = formatTime(props.row.original?.creationDate);
        return (
          <>
            <Tooltip
              color="invert"
              content={`${date} ${time}`}
              placement="bottom"
            >
              <div>{date}</div>
            </Tooltip>
          </>
        );
      },
    },
    {
      Header: "Modidied Date",
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
      Header: "Action",
      accessor: "action",
      Cell: (props) => {
        return (
          <>
            <i
              className="ri-delete-bin-5-line"
              onClick={() => {
                toggleDeleteModel(
                  props.row.original?.id,
                  props.row.original?.integrationId
                );
              }}
            />

            <Link href={`/schedule/event/${props.row.original?.id}`}>
              <i className="ri-edit-2-fill mx-2" />
            </Link>
            {/* <Link href="/schedule/event">
              <i className="ri-eye-fill" />
            </Link> */}
          </>
        );
      },
    },
  ];

  return (
    <>
      {isLoading ? (
        <TkLoader />
      ) : scheduleData?.length > 0 ? (
        <>
        <DeleteModal
            show={deleteModal}
            onDeleteClick={onClickDelete}
            onCloseClick={() => setDeleteModal(false)}
          />
        <TkTableContainer
          columns={scheduleHead}
          data={data}
          rowSelection={true}
          onRowSelection={selectedRowsId}
          showPagination={true}
        />
        </>
      ) : (
        <TkNoData />
      )}
    </>
  );
};

export default ScheduleTable;
