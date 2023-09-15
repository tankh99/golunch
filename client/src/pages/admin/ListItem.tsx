import React from 'react';
import {connect} from 'react-redux';
import { Button, Modal, Icon } from 'semantic-ui-react';
import { deleteShop } from '../../constants/actionCreators';
import { Link } from 'react-router-dom';
import axios from 'axios'
import { API_ROOT, showNoty } from '../../constants/global';
import * as paths from '../../constants/paths';
import {StyleSheet, css} from 'aphrodite';

interface P {
    item: any,
    removeShop: any
}

interface S {
    modalID: number
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        removeShop: (id: number) => dispatch(deleteShop(id))
    }   
}

class ListItem extends React.Component<P,S> {

    constructor(props: P){
        super(props)
        this.state = {
            modalID: -1
        }
    }

    removeShop = (id: number) => {
        axios.get(`${API_ROOT}/shops/delete/${id}`)
            .then((res: any) => {
                this.props.removeShop(res.data);
                showNoty("error", "Deleted shop successfully");
            }).catch(err => {
                console.error(err);
            })
        this.close();
    }

    open = (modalID: number) => {
        this.setState({
            modalID
        })
    }

    close = () => {
        this.setState({
            modalID: -1
        })
    }

    render(){
        const {item, } = this.props
        const {modalID} = this.state
        return(
            <div className="sidebar-item-container">
                <Link className="sidebar-link" to={`${paths.EDIT_SHOP_PATH}/${item.id}`}>
                    {item.name}
                </Link>
                <div className="delete-btn" onClick={() => this.open(item.id)}>
                    <Icon circular inverted color="red" size="small" name="delete"/>
                </div>
                <Modal
                    open={modalID == item.id}
                    closeOnEscape={true}
                    closeOnDimmerClick={true}
                    onClose={this.close}>
                    <Modal.Header>Delete?</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure you want to delete {item.name}?</p>
                        <p className={css(styles.warningText)}>This action is permanent and cannot be undone</p>

                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.close}>
                            Cancel
                        </Button>
                        <Button negative onClick={() => this.removeShop(item.id)}>
                            Delete
                        </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}

const styles = StyleSheet.create({
    warningText: {
        color: 'red'
    }
})

export default connect(null, mapDispatchToProps)(ListItem)