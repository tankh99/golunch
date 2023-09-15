import React from 'react';
import {Image, Placeholder} from 'semantic-ui-react';

interface P {
    file?: any,
    className?: string
}

interface S {
    loading?: boolean,
    thumb?: any
}

export default class Thumb extends React.Component<P,S> {

    constructor(props: P){
        super(props);
        this.state = {
            loading: false,
            thumb: null,
        }
        
    }

    componentWillReceiveProps(props: P){
        
        if(props.file){
            if(typeof props.file === "string"){ // means we have a imageurl
                try{
                    var img = require(`../../${props.file}`)
                    this.setState({
                        loading:false,
                        thumb: img
                    })
                } catch { // image does not exist
                    this.setState({
                        loading: false,
                        thumb: null
                    })
                }
            } else {
                this.setState({
                    loading:true
                }, () => {
                    let reader = new FileReader();
                    reader.onloadend = () => {
                        this.setState({
                            loading:false, 
                            thumb: reader.result
                        })
                    }
                    reader.readAsDataURL(props.file)
                })
            }
        }
    }

    render(){
        const {file, className} = this.props;
        const {thumb, loading} = this.state;
        if(file){
            return(
                <img className={`img-thumbnail ${className ? className : ""}`}
                    src={thumb}/>
            )
        } 
        else if (loading) {
            //  return <p className="loading-block">Loading...</p>;
            return (
                <Placeholder>
                    <Placeholder.Image square/>
                </Placeholder>
            )
        }
        else {
            return null;
        }
    }
}