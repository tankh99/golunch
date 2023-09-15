import React from 'react';
import {Message} from 'semantic-ui-react';

interface P {
    hide: boolean,
    negative: boolean,
    msgHeader: string,
    msgBody?: string
}

export default (props: P) => {
    const {hide, msgHeader, msgBody, negative} = props;
    return (
        <Message hidden={hide}
            className={`full-width`} 
            negative={negative ? negative : false}>
            <Message.Header>{msgHeader}</Message.Header>
            <p>{msgBody}</p>
        </Message>
    )
}