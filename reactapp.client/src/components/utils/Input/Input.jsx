import PropTypes from 'prop-types';
import React from 'react';

const Input = ({ label, id, type, className, placeholder, name, value, onChange }) => (
  <div>
    {label && <label htmlFor={id} className="form-label">{label}</label>}
    <input
      type={type}
      className= {className}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

Input.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onChange: PropTypes.func.isRequired
};

Input.defaultProps = {
  type: 'text'
};

export default Input;