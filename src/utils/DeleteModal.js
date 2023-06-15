import PropTypes from "prop-types";
import React from "react";
import TkButton from "@/globalComponents/TkButton";
import TkModal, { TkModalBody } from "@/globalComponents/TkModal";

const DeleteModal = ({
  show,
  onDeleteClick,
  onCloseClick,
  loading,
  label,
  image,
}) => {
  return (
    <TkModal isOpen={show} toggle={onCloseClick} centered={true}>
      <TkModalBody className="py-3 px-5">
        <div className="mt-2 text-center">
          {image && (
            <svg
              className="delete-bin"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="100"
              height="100"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                fill="currentColor"
                d="M7 4V2h10v2h5v2h-2v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6H2V4h5zM6 6v14h12V6H6zm3 3h2v8H9V9zm4 0h2v8h-2V9z"
              />
            </svg>
          )}
          <style jsx>{`
            .delete-bin {
              color: #f06548;
            }
          `}</style>
          <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
            <h4>Are you sure ?</h4>
            <p className="text-muted mx-4 mb-0">{label}</p>
          </div>
        </div>
        <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
          <TkButton
            type="button"
            className="btn w-sm btn-light"
            data-bs-dismiss="modal"
            onClick={onCloseClick}
            disabled={loading}
          >
            Close
          </TkButton>
          <TkButton
            type="button"
            className="btn w-sm btn-danger "
            id="delete-record"
            onClick={onDeleteClick}
            loading={loading}
          >
            {image ? "Yes, Delete It!" : "Yes, Sure!"}
          </TkButton>
        </div>
      </TkModalBody>
    </TkModal>
  );
};

DeleteModal.propTypes = {
  onCloseClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  show: PropTypes.bool,
  loading: PropTypes.bool,
};

export default DeleteModal;
