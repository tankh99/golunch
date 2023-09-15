import React from 'react';
import {Image, Header, Grid, Segment} from 'semantic-ui-react'
import {StyleSheet, css} from 'aphrodite';

interface P {
    imageUrl: any,
    name: string,
    description?: string,
    price: any
}

export default (props: P) => {
    let {imageUrl, name, description, price} = props;
    price = price.toFixed(2);
    return(

        <div className={css(styles.wrapper)}>
            <Image className={css(styles.image)} src={require(`../../../${imageUrl}`)} alt={name}/>
            <div className={css(styles.infoWrapper)}>
                <div className={css(styles.textWrapper)}>
                <Header as="h3">{name}</Header>
                <p>{description}</p>
                </div>
                <div className={css(styles.priceText)}>
                    {price}€
                </div>
            </div>
        </div>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        display: 'flex',
        ':not(:last-child)': {
            paddingBottom: '15px',
            marginBottom: '15px',
            borderBottom: '1px solid var(--shape)',
        },
        '@media(max-width:480px)': {
            display: 'block',
        }
    },
    infoWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        flex: 1
    },
    textWrapper: {
        // width: '100%'
    },
    priceContainer: {
        width: '100%',
        // textAlign: 'right',
        justifyContent: 'flex-end'

    },
    priceText: {
        color: 'var(--primary)',
        fontWeight: 'bold',
        fontSize: 'var(--header-fs)',
        // alignSelf: 'flex-end',
    },
    image: {
        borderRadius: '10px',
        maxWidth: '300px',
        maxHeight: '200px',
        objectFit: 'cover',
        display: 'flex',
        marginRight: '15px',
        justifyContent: 'center',
        '@media(max-width:480px)': {
            margin: '0 auto',
            marginBottom: '15px'
        }
        // marginRight: '25px'
    }
})