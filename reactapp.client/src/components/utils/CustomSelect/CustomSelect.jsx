import React from 'react';
import Select from 'react-select';
import styles from './CustomSelect.module.css';

const CustomSelect = ({ id, options, value, onChange, isClearable = true }) => {
  return (
    <Select
      id={id}
      classNamePrefix="select"
      className={styles.select}
      options={options}
      value={value}
      onChange={onChange}
      isClearable={isClearable}
    />
  );
};

export default CustomSelect;
