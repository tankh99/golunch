import React from 'react';
import {StyleSheet, css} from 'aphrodite'

interface P {
    label: string,
    value: string
}

export default (props: P) => {
    const {label, value} = props;
    return(
        // <div className={css(styles.infoContainer)}>
        //     <div className={`${css(styles.label)}`}>
        //         {label}
        //     </div>
        //     <div className={css(styles.value)}>
        //         {value}
        //     </div>
        // </div>
        <tr>
            <td className={css(styles.label)}>{label}</td>
            <td className={css(styles.value)}>{value}</td>
        </tr>
    )
}

const styles = StyleSheet.create({
    infoContainer: {
        display: 'flex',
    },
    label: {
        textTransform: 'uppercase',
        color: 'var(--text-color)',
        padding: '10px',
        fontSize: '16px',
        borderRight: '1px solid var(--shape)',
        textAlign: 'right',
        // width: '120px'
    },
    value: {
        padding: '10px',
        fontSize: '18px'
    }
})