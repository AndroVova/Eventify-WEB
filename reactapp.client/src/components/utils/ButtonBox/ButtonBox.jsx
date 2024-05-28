import styles from './button.box.module.css'
export const ButtonBox = ({text = "text", settings = {}}) => {
    return (
        <button className={styles.btn} {...settings}>{text}</button>
    )
}