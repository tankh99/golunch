import React from 'react';
import {Button, Modal } from 'semantic-ui-react';
import RewardContainer from './RewardContainer';
import ContentContainer from '../../../components/ContentContainer';
import { StyleSheet, css } from 'aphrodite';
import { verifyToken } from '../../../constants/lookup/auth';
import { getUserByID } from '../../../constants/lookup/users';
import { API_ROOT } from '../../../constants/global';
import axios from 'axios'
import { getDistance } from '../../../constants/lookup/distance';
import ResponseMsg from '../../../models/ResponseMsg';
import { RouteComponentProps, withRouter } from 'react-router';
import * as paths from '../../../constants/paths';
import {showNoty} from '../../../constants/global';
import {motion} from 'framer-motion';
import { redeemReward } from '../../../constants/lookup/userRewards';

interface P extends RouteComponentProps{
    rewards: any
}

interface S {
    accumulatedDistance: number,
    userID: number,
    publicKey: string,
    modalID: number,
    loading: boolean
}


class ShopRewards extends React.Component<P, S>{

    constructor(props: P) {
        super(props);
        this.state = {
            accumulatedDistance: 0,
            userID: 0,
            publicKey: "",
            modalID: -1,
            loading: false
        }
    }


    componentDidMount() {
        this.setState({
            loading: true
        })
        verifyToken()
            .then((res: ResponseMsg) => {
                const {success, payload} = res;
                if(success){
                    const { id } = payload
                    this.setState({
                        userID: id,
                    })
                    getUserByID(id)
                    .then((res: any) => {
                        console.log(res);
                        const {accumulatedDistance} = res.data;
                        this.setState({
                            accumulatedDistance,
                            loading: false,
                        })
                    })
                    
                } else {
                    // this.props.history.push(paths.LOGIN_PATH);
                }
            })
    }

    addUserRewards = (rewardID: number, distance: number) => {
        const {userID, publicKey} = this.state;
        redeemReward(rewardID, userID, distance)
        .then((res: any) => {
            this.setState({
                accumulatedDistance: res.data
            })
            showNoty("success", "Successfully redeemed reward!");
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


    render() {
        const { rewards } = this.props;
        const { modalID, accumulatedDistance, loading } = this.state;
        return (
            <ContentContainer header="Rewards">
                <p className={css(styles.userPoints)}> 
                    Your Distance:&nbsp;
                    <span className={css(styles.distanceText)}>{accumulatedDistance}KM</span>
                </p>
                {/* <Tab menu={{fluid: true, vertical: true, tabular: true}} panes={this.getPanes()}/> */}
                <div>
                {rewards ? rewards.map((reward: any, index: number) => {
                    const { name, description, distance } = reward;
                    const disabled = accumulatedDistance <= distance
                    return (
                        <motion.div 
                            className={css(styles.rewardContainer)}
                            key={index} variants={rewardItem}>
                            <RewardContainer
                                name={name}
                                disabled={disabled}
                                description={description}
                                onClick={() => this.open(reward.id)}
                                distance={distance} />

                            <Modal
                                open={modalID == reward.id}
                                closeOnEscape={true}
                                closeOnDimmerClick={true}
                                onClose={this.close}>
                                <Modal.Header>Redeeming Voucher</Modal.Header>
                                <Modal.Content>
                                    <p className={css(styles.confirmVoucher)}>You are redeeming the voucher: {reward.name}</p>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button onClick={this.close}>
                                        Cancel
                                </Button>
                                    <Button negative onClick={() => this.addUserRewards(reward.id, distance)}>
                                        Confirm
                                </Button>
                                </Modal.Actions>
                            </Modal>
                        </motion.div>
                    )
                }) : "No rewards"}
                </div>
            </ContentContainer>
        )
    }
}

const rewardsList = {
    hidden: {
        opacity: 0,
        scale: 0
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            delay: 0.2,
            when: 'beforeChildren',
            staggerChildren: 0.1
        }
    }
}

const rewardItem = {
    hidden: {
        opacity: 0,
        y: 20
    },
    visible: {
        opacity: 1,
        y: 0
    }
}

const styles = StyleSheet.create({
    rewardContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    userPoints: {
        textAlign: 'center',
        marginTop: 15,
        fontSize: '20px',
    },
    distanceText: {
        fontWeight: 'bold'
    },
    popUp: {
        borderRadius: 0,
        opacity: 0.7,
        padding: '2em',
    },
    confirmVoucher: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold"
    },
    confirmWarning: {
        textAlign: "center",
        marginTop: 10,
        fontSize: 15,
        color: "#FF0000",
        fontWeight: "bold"
    },
    confirmWarningText: {
        textAlign: "center",
        color: "#FF0000",
    }
})

export default withRouter(ShopRewards)