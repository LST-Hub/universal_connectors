import React from "react";
import { FormGroup, Label, Input } from "reactstrap";
import TkInput from "./TkInput";

const TkRadioButton = ({ children, type, name,onClick, checked, className, ...rest }) => {
  return (
    <>
      <FormGroup check>
        <Label check>
          <TkInput type={type} name={name} onClick={onClick} checked={checked} className={className} {...rest}/> 
            {children}
        </Label>
      </FormGroup>
    </>
  );
};

export default TkRadioButton;
