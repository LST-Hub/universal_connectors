import React, { useState } from "react";
// import { Link } from 'react-router-dom';
import Link from "next/link";
import PropTypes from "prop-types";
import TkRow, { TkCol } from "@/globalComponents/TkRow";
import TkButton from "@/globalComponents/TkButton";
import TkInput from "@/globalComponents/TkInput";

const checkURl = (str) => {
  // simple type checking if given string is a  url of our site
  return str && str.length > 0 && str.startsWith("/");
};

const BreadCrumb = ({
  parentTitle,
  pageTitle,
  parentLink,
  buttonText,
  onButtonClick,
  syncButton,
  onSyncClick,
  searchbar,
  data,
}) => {
  // const [searchInput, setSearchInput] = useState("");
  // const handleChange = (e) => {
  //   e.preventDefault();
  //   setSearchInput(e.target.value);
  // };

  // if (searchInput.length > 0) {
  //   data.filter((d) => {
  //     // return d.integrationName.match(searchInput);
  //     const filterValue = d.integrationName.match(searchInput)
  //     console.log("filter", filterValue);
  //   });
  // }

  return (
    <>
      <TkRow>
        <TkCol xs={12}>
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            {/* <div className="page-title-right">
              <ol className="breadcrumb m-0">
                {checkURl(parentLink) && (
                  <li className="breadcrumb-item">
                    <Link href={parentLink}>
                      {parentTitle}
                    </Link>
                  </li>
                )}
                <li className="breadcrumb-item active">{pageTitle}</li>
              </ol>
            </div> */}
            <div className="row justify-content-between">
              {/* {searchbar ? (
                <div className="col">
                  <TkInput
                    type="search"
                    placeholder="Search here"
                    onChange={handleChange}
                    value={searchInput}
                  />
                </div>
              ) : null} */}
              {buttonText ? (
                <div className="col">
                  <div>
                    <TkButton
                      color="primary"
                      className="btn add-btn me-1"
                      onClick={onButtonClick}
                    >
                      <i className="ri-add-line align-bottom me-1"></i>
                      {buttonText}
                    </TkButton>
                  </div>
                </div>
              ) : null}
              {syncButton ? (
                <div className="col">
                  <div>
                    <TkButton
                      color="primary"
                      className="btn add-btn me-1"
                      onClick={onSyncClick}
                    >
                      <i className="ri-add-line align-bottom me-1"></i>
                      {syncButton}
                    </TkButton>
                  </div>
                </div>
              ) : null}
              <div className="page-title-right mt-1">
                <ol className="breadcrumb m-0">
                  {checkURl(parentLink) && (
                    <li className="breadcrumb-item">
                      <Link href={parentLink}>{parentTitle}</Link>
                    </li>
                  )}
                  <li className="breadcrumb-item active">{pageTitle}</li>
                </ol>
              </div>
            </div>
          </div>
        </TkCol>
      </TkRow>
    </>
  );
};

BreadCrumb.propTypes = {
  title: PropTypes.string,
  pageTitle: PropTypes.string,
  parentLink: PropTypes.string,
  buttonText: PropTypes.string,
  onButtonClick: PropTypes.func,
};

export default BreadCrumb;
