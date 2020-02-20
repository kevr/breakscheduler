import React from 'react';
import PropTypes from 'prop-types';

const Input = (props) => {
  let className = "input-field";
  if(props.className) {
    className = className.concat(` ${props.className}`);
  }

  return (
    <div className={className}>
      <input
        id={props.id}
        className={props.valid ? "validate" : "invalid"}
        type={props.type}
        value={props.value}
        onChange={props.onChange}
      />
      <span className="helper-text" data-error={props.invalidText} />
      <label
        htmlFor={props.id}
        className={props.active ? "active" : ""}
      >
        {props.label}
      </label>
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool
  ]),
  onChange: PropTypes.func.isRequired,

  valid: PropTypes.bool,
  invalidText: PropTypes.string
};

Input.defaultProps = {
  valid: true,
  invalidText: "Error - This message should be modified to fit with this particular input in components/Input.js"
};

export const TextInput =
  (props) => <Input type="text" {...props} />;
export const PasswordInput =
  (props) => <Input type="password" {...props} />;
export const EmailInput =
  (props) => <Input type="email" {...props} />;

export const Checkbox = (props) => {
  return (
    <label className={props.className}>
      <input
        id={props.id}
        type={"checkbox"}
        defaultChecked={props.checked}
        onChange={props.onChange}
      />
      <span>{props.label}</span>
    </label>
  );
};

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired
};

Checkbox.defaultProps = {
  className: ""
};

Input.TextInput = TextInput;
Input.PasswordInput = PasswordInput;
Input.EmailInput = EmailInput;
Input.Checkbox = Checkbox;

export default Input;
