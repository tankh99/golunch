import React from 'react';
import {Header, Segment, Grid, Button} from 'semantic-ui-react'
import {StyleSheet, css} from 'aphrodite';

interface P {
    name: string,
    redeemedFrom?: string,
    description: string,
    distance: number,
    disabled: boolean,
    onClick: any,
    quantity?: number
}

export default (props:P) => {
    const {name, description, redeemedFrom, distance, onClick, disabled, quantity} = props;
    return(
        <div className={css(styles.wrapper)}>
            <div className={css(styles.infoWrapper)}>
                <div className={css(styles.distanceWrapper)}>
                    <div className={css(styles.distanceText)}>{distance}</div>
                    <div className={css(styles.kmText)}>KM</div>
                    
                </div>
                <div className={css(styles.textWrapper)}>
                    <Header as="h3">{name}</Header>
                    <div>{description}</div>
                </div>
            </div>
            <div className={css(styles.btnContainer)}>

                {quantity 
                ? 
                <Header as="h4">
                    Quantity: {quantity}
                </Header>
                : ""
                }
                <Button 
                    negative disabled={disabled} 
                    onClick={onClick} 
                    className={css(styles.btnRedeem)}>
                    Claim
                </Button>
                
                {redeemedFrom && 
                    <p className={css(styles.redeemedFromText)}> 
                        Restaurant: <strong>{redeemedFrom}</strong>
                    </p>
                }
            </div>

        </div>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        display: 'flex',
        padding: '10px',
        alignItems: 'center',
        justifyContent: 'space-between',
        // ':not(:last-child)': {
        //     paddingBottom: '10px',
        //     marginBottom: '10px',
        //     borderBottom: '1px solid var(--shape)',
        // },
        '@media(max-width:480px)': {
            display: 'block'
        }
    },
    infoWrapper: {
        display: 'flex'
    },
    distanceWrapper: {
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--shape)',
        padding: '10px 20px 10px 0'
    },
    btnContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        '@media(max-width:480px)': {
            justifyContent: 'flex-end'
        }
    },
    btnRedeem: {
        '@media(max-width:480px)': {
            // display: 'block',
            // float: 'right'
            // margin: '10px auto'
        }
    },
    textWrapper:{
        padding: '10px 20px'
    },
    distanceText: {
        fontSize: '25px',
        fontWeight: 'bold',
        marginBottom: '8px',
        textAlign:'center',
    },
    kmText: {
        textAlign:'center',
        fontSize: '16px'
    },
    redeemedFromText: {
        marginTop: '10px'
    }
})