import React from 'react';

interface P {
    header: string,
    subheader?: string,
    children: any,
    [x: string]: any
}

interface S {

}

class ContentContainer extends React.Component<P,S>{
    render(){
        const {header, subheader, children, ...rest} = this.props;
        return(
            <div {...rest}>
                <div className="header-container">
                    <div className="section-header">{header}</div>
                    {subheader ? 
                        <div className="section-subheader">{subheader}</div>
                        : ""
                    }
                </div>
                
                <div className="content-container">
                    {children}
                </div>
            </div>
        )
    }
}

export default ContentContainer;