import React from 'react';
import {Input, Icon} from 'semantic-ui-react';
import {StyleSheet, css} from 'aphrodite';

interface P {
    onChange: any,
    value: any
}

const SearchBar= (props: P) =>{
    const {
        onChange,
        value
    } = props
    return(
        <Input 
            icon="search" 
            className={`full-width ${css(styles.searchBar)}`}
            placeholder="Search" 
            type="text" 
            name="search" 
            onChange={onChange} 
            value={value}/>
        
    )
    
}
const styles = StyleSheet.create({
    searchBar: {
        marginBottom: '15px'
    }
})


export default SearchBar;