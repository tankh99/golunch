import React from 'react';
import {StyleSheet, css} from 'aphrodite'

interface P {
    header: string,
    children: any,
    [x: string]: any,
}

interface S{

}

class HeroInfo extends React.Component<P,S>{
    render(){
        const {children, header, ...rest} = this.props;
        return(
            <div {...rest} className="hero-info">
                <p className="caps-header">{header}</p>
                <div className="hero-content">
                    {children}
                </div>
            </div>
        )
    }
}

const styles = StyleSheet.create({

})

export default HeroInfo;