import React from 'react';
// import SocialLogin from 'react-social-login';
import {Button} from 'semantic-ui-react';

interface P {
    children: any,
    triggerLogin: any,
    rest: any
}

const SocialButton =  (props: P) => {
    const {
        children,
        triggerLogin,
        ...rest
    } = props
    return (
        <Button onClick={triggerLogin} {...rest}>
            {children}
        </Button>
    )
}

export default (SocialButton);