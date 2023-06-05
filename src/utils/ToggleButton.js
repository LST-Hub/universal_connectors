import React from 'react'
import ReactSwitch from 'react-switch'

const ToggleButton = ({
    checked,
    handleChange,
    ...other
}) => {
  return (
    <>
       <ReactSwitch
        checked={checked}
        onChange={handleChange}
        offColor="#D3D3D3"
        // dark green
        onColor="#008000"
        checkedIcon={false}
        uncheckedIcon={false}
        height={20}
        width={40}
        {...other}
        />
    </>
  )
}

export default ToggleButton
