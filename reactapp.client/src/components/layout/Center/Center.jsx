import {useCallback, useEffect, useRef, useState}  from "react";

import styles from './center.module.css'
import {useWindowSize} from "../../../hooks/useWindowSize";

const Center = ({children, isFullScreen = false, useFreeHeightSpace = false}) => {
    const [heightStyle, setHeightStyle] = useState({})

    const row = styles.row + " " + (isFullScreen ? styles.fullScreen : "")
    const {height} = useWindowSize()
    const containerRef = useRef(null)

    const resetHeight = useCallback(() => {
        if (useFreeHeightSpace !== true || isFullScreen) {
            setHeightStyle(s => s.height ? {} : s);
            return;
        }
        const containerSize = containerRef.current.getBoundingClientRect();
        const freeHeight = height - containerSize.y;
    
        if (freeHeight <= containerSize.height) {
            return;
        }
        setHeightStyle({
            height: `${(freeHeight / height) * 100}vh`
        });
    }, [useFreeHeightSpace, isFullScreen, height, containerRef]);

    useEffect(() => {
        if (containerRef.current != null) {
            resetHeight();
        }
    }, [containerRef, resetHeight]);


    return (
        <div ref={containerRef} className={row} style={heightStyle}>
            <div className={styles.column}>
                {children}
            </div>
        </div>
    )
}

export default Center