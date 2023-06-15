import TkTableContainer from "@/globalComponents/TkTableContainer";
import Link from "next/link";
import React, { useEffect, useReducer, useState } from "react";
import { Tooltip } from "@nextui-org/react";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import tkFetch from "@/utils/fetch";
import { API_BASE_URL, minSearchLength, serachFields } from "@/utils/Constants";
import { formatDate, formatTime } from "@/utils/date";
import { TkToastError } from "@/globalComponents/TkToastContainer";
import TkLoader from "@/globalComponents/TkLoader";
import TkNoData from "@/globalComponents/TkNoData";
import DeleteModal from "@/utils/DeleteModal";
import ToggleButton from "@/utils/ToggleButton";
import TopBar from "../topBar";
import {
  isSearchonUI,
  searchAndFilterData,
  searchDebounce,
} from "@/utils/utilsFunctions";

let deleteFieldId = null;
const FieldMappingTable = () => {
  const [mappedRecordData, setMappedRecordData] = useState([]);
  const [userId, setUserId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [searchText, setSearchText] = useState("");

  const queryClient = useQueryClient();

  useEffect(() => {
    const id = sessionStorage.getItem("userId");
    setUserId(JSON.parse(id));
  }, []);

  const deleteMappedRecord = useMutation({
    mutationFn: tkFetch.deleteWithIdsInUrl(
      `${API_BASE_URL}/deleteMappedRecordByID`
    ),
  });

  const updateMappingState = useMutation({
    mutationFn: tkFetch.putWithIdInUrl(
      `${API_BASE_URL}/updateFieldMappingState`
    ),
  });

  const apiResult = useQueries({
    queries: [
      {
        queryKey: ["mappedFieldsDetails", userId],
        queryFn: tkFetch.get(
          `${API_BASE_URL}/getMappedFieldsDetails/${userId}`
        ),
        enabled: !!userId,
      },
    ],
  });

  const [mappedFields] = apiResult;
  const {
    data: mappedFieldsData,
    isLoading: mappedFieldsLoading,
    isError: mappedFieldsError,
    error: mappedFieldsErrorData,
  } = mappedFields;

  useEffect(() => {
    if (mappedFieldsData) {
      setMappedRecordData(mappedFieldsData[0]);
    }
  }, [mappedFieldsData]);

  const handleOnChange = (id, e) => {
    const fieldMappedData = {
      id: id,
      userId: userId,
      stateValue: e,
    };
    updateMappingState.mutate(fieldMappedData, {
      onSuccess: () => {
        queryClient.invalidateQueries("mappedFieldsDetails");
      },
      onError: () => {
        TkToastError("Error updating field mapping state");
      },
    });
  };

  const columnHead = [
    {
      Header: "Name",
      accessor: "mappedRecordName",
    },
    {
      Header: "Integration Name",
      accessor: "integrationName",
      Cell: (props) => {
        return <a>{props.row.original?.integration.integrationName}</a>;
      },
    },
    {
      Header: "Record Type",
      accessor: "recordTypeLabel",
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
      Header: "Modified Date",
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
      Header: "System One",
      accessor: "source",
      Cell: (props) => {
        return <a>{props.row.original?.integration.sourceName}</a>;
      },
    },
    {
      Header: "System Two",
      accessor: "destination",
      Cell: (props) => {
        return <a>{props.row.original?.integration.destinationName}</a>;
      },
    },
    {
      Header: "On/Off",
      accessor: "onOff",
      Cell: (props) => {
        return (
          <>
            <ToggleButton
              checked={props.row.original.status}
              handleChange={(e) => handleOnChange(props.row.original.id, e)}
            />
          </>
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
              className="ri-delete-bin-5-line px-2"
              onClick={() =>
                toggleDeleteModel(
                  props.row.original.id,
                  props.row.original.integrationId
                )
              }
            />
            <Link href={`/fieldMapping/${props.row.original.id}`}>
              <i className="ri-eye-fill" />
            </Link>
          </>
        );
      },
    },
  ];

  const toggleDeleteModel = (fieldId, integrationId) => {
    deleteFieldId = {
      id: fieldId,
      integrationId: integrationId,
    };
    setDeleteModal(true);
  };

  const onClickDelete = () => {
    deleteMappedRecord.mutate(deleteFieldId, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ["mappedFieldsDetails"],
        });
        queryClient.invalidateQueries({
          queryKey: ["integrations"],
        });
        setDeleteModal(false);
      },
      onError: (error) => {
        console.log("error", error);
        TkToastError("Error for delete record");
        setDeleteModal(false);
      },
    });
  };

  // const [filters, updateFilters] = useReducer(
  //   (state, newState) => ({ ...state, ...newState }),
  //   {
  //     [filterFields.dashboard.integrationName]: null,
  //   }
  // );
  const searchonUI = isSearchonUI(mappedRecordData);

  const updateSearchText = (e) => {
    if (e.target.value.length >= minSearchLength) {
      setSearchText(e.target.value);
    } else {
      setSearchText("");
    }
  };

  useEffect(() => {
    if (mappedRecordData.length > 0) {
      let doSearch = true;
      let doFilter = true;
      if (searchText === "") {
        doSearch = false;
      }

      if (!doSearch && !doFilter) {
        // setMappedRecordData(mappedFieldsData[0] || []);
        // return;
      }

      if (isSearchonUI(mappedRecordData)) {
        const newData = searchAndFilterData(
          mappedRecordData,
          searchText,
          serachFields.MappedRecordTable
          // filters
        );

        if (newData.length === 0) {
          // setMappedRecordData(mappedFieldsData[0] || []);
          setMappedRecordData([]);

          // return;
        } else {
          setMappedRecordData(newData);
        }
        // setMappedRecordData(newData);
      }
    }
  }, [mappedRecordData, searchText]);

  return (
    <>
      {mappedFieldsLoading ? (
        <TkLoader />
      ) : mappedRecordData.length > 0 ? (
        <>
          <TopBar
            onSearchChange={searchDebounce(updateSearchText, searchonUI)}
          />
          <DeleteModal
            show={deleteModal}
            onDeleteClick={onClickDelete}
            onCloseClick={() => setDeleteModal(false)}
            label="Are you sure you want to remove this record ?"
            image={true}
          />
          <TkTableContainer
            columns={columnHead}
            data={mappedRecordData || []}
            showPagination={true}
          />
        </>
      ) : (
        <TkNoData />
      )}
    </>
  );
};

export default FieldMappingTable;
