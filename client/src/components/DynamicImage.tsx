import React from 'react';
import {Image} from 'semantic-ui-react';


interface P {
    src: string,
    alt: string,
    [x: string]: any
}

const checkImageExists = (imageUrl: string) => {
    try{
        return require(`../${imageUrl}`)
    } catch(err){
        return null;
    }
}

export default (props: P) => {
    const {src, alt, ...rest} = props
    
    if(src && checkImageExists(src)){
        return (
            <Image {...rest} src={require(`../${src}`)} alt={alt}/>
        )
    } 
    else {
        return <Image {...rest} alt={alt}/>
    }
}