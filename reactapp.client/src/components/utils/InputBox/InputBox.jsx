import styles from "./input.box.module.css";

const InputBox = ({inputParam, labelText = '', name ='', labelParam, placeholder, type, value, onChange}) => {
    return (
        <div className={styles.inputBox}>
            <label {...labelParam}>{labelText}</label>
            <input placeholder={placeholder} type={type} name={name} {...inputParam} value={value} onChange={onChange}/>

        </div>
    )
}

export default InputBox