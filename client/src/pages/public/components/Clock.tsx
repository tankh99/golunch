import React from 'react';
import {StyleSheet, css} from 'aphrodite';
import {getTime} from '../../../utils/tracking';

interface P {

}

interface S {
    time: Date
}

class Clock extends React.Component<P,S>{

    constructor(props: P){
        super(props);
        this.state = {
            time: new Date()
        }
    }

    componentDidMount(){
        setInterval(() => this.tick(), 1000);
    }

    tick = () => {
        getTime()
            .then((res: any) => {
                const time = new Date(res.data);
                // console.log(time)
                this.setState({
                    time: time
                })
            })
    }

    render(){
        const {time} = this.state;
        return(
            <div>
                {time.toLocaleTimeString()}
            </div>
        )
    }
}

const styles = StyleSheet.create({
    
})

export default Clock;