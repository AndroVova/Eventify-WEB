import React from 'react';
import Select from 'react-select';
import styles from './CustomSelect.module.css';

const CustomSelect = ({ id, options, value, onChange, isClearable = true, isFilter=false }) => {
  return (
    <Select
      id={id}
      classNamePrefix="select"
      className={isFilter ? styles.select__control__filters : styles.select__control }
      options={options}
      value={value}
      onChange={onChange}
      isClearable={isClearable}
    />
  );
};

export default CustomSelect;
