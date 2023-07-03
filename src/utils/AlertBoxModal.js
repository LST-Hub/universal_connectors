import TkButton from '@/globalComponents/TkButton'
import TkModal, { TkModalBody } from '@/globalComponents/TkModal'
import React from 'react'

const AlertBoxModal = ({show, onCloseClick, loading, label}) => {
  return (
    <>
    <TkModal isOpen={show} toggle={onCloseClick} centered={true}>
        <TkModalBody className="py-3 px-5">
            <div className="mt-2 text-center">
                <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                    <h4>Alert</h4>
                    <p className="text-muted mx-2 mb-0">{label}</p>
                </div>
            </div>

            <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
                <TkButton
                type="button"
                className="btn w-sm btn-info"
                data-bs-dismiss="modal"
                onClick={onCloseClick}
                disabled={loading}
                >
                    Ok
                </TkButton>
            </div>
        </TkModalBody>
    </TkModal>
    </>
  )
}

export default AlertBoxModal
