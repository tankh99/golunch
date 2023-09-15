import React from 'react';
import { RouteComponentProps } from 'react-router-dom'
import { Button, Modal, Segment, Loader, Header } from 'semantic-ui-react';
import RewardContainer from '../../pages/shops/components/RewardContainer';
import ContentContainer from '../../components/ContentContainer';
import { getUserByID } from '../../constants/lookup/users';
import {getUserRewardsByUserID} from '../../constants/lookup/userRewards';
import { API_ROOT, showNoty } from '../../constants/global';
import axios from 'axios'
import { StyleSheet, css } from 'aphrodite';
import { getDistance } from '../../constants/lookup/distance';
import {motion} from 'framer-motion';
import _ from 'lodash';


interface PathParamProps {
    id: string
}

interface P extends RouteComponentProps<PathParamProps> {
    deleteUserRewards: any,
}

interface S {
    modalID: number,
    rewards: any,
    accumulatedDistance: number,
    loading: boolean
}

class Rewards extends React.Component<P, S> {

    constructor(props: P) {
        super(props);
        this.state = {
            rewards: "",
            modalID: -1,
            accumulatedDistance: 0,
            loading: false
        }
    }


    componentDidMount() {
        const { id } = this.props.match.params;
        this.setState({
            loading: true
        })

        getUserByID(parseInt(id))
        .then((res: any) => {
            const { accumulatedDistance, publicKey } = res.data

            this.setState({
                accumulatedDistance,
            })

            getUserRewardsByUserID(id)
            .then((res: any) => {
                let rewards = res.data
                // rewards = rewards.filter((r: any) => r.userID == id);
                let rewardsArray = this.splitArray(rewards);
                console.log(rewardsArray)
                // console.log(_.mapValues(groupedRewards);
                this.setState({
                    rewards: rewardsArray,
                    loading: false
                })
            })
        })
    }

    claimReward = (index: number, id: number) => {
        // this.setState({
        //     rewards: this.state.rewards.filter((r: any) => r.id != id)
        // })
        axios.get(`${API_ROOT}/userRewards/claimReward/${id}`)
            .then((res: any) => {
                const deletedID = res.data
                const {rewards} = this.state;
                let newRewards = []
                
                // properly remove the group out of the mainarray
                for(let rewardGroup of rewards){
                    let newRewardGroup = rewardGroup.filter((r: any) => r.id != deletedID)
                    if(newRewardGroup.length > 0){
                        newRewards.push(newRewardGroup)
                    }
                }
                
                this.setState({
                    rewards: newRewards,
                })
                
                showNoty("success", "Claimed reward successfully");
            }).catch(err => {
                console.error(err);
            })
        this.close();
    }

    splitArray = (array: any) => {
        let groupedRewards = _.groupBy(array, "rewardID")
        
        
        let rewardsArray: any = []
        groupedRewards = _.forEach(groupedRewards, (value: any, key: any) => {
            rewardsArray.push(value)
        })
        
        // bubble sort to sort the groups by distance
        let swapped;
        do {
            swapped = false
            for(let i = 0; i < rewardsArray.length - 1; i++) {
                let group = rewardsArray[i];
                let nextGroup = rewardsArray[i + 1];
                if(nextGroup && nextGroup.length > 0){
                    let distance = group[0].distance;
                    let nextDistance = nextGroup[0].distance;
                    
                    if(distance > nextDistance){
                        rewardsArray[i] = nextGroup;
                        rewardsArray[i + 1] = group;
                        swapped = true;
                    }
                }
            }
            
        } while (swapped);
        
        return rewardsArray
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
        const { rewards, modalID, loading, accumulatedDistance } = this.state;
        return (
            <div className="body-vertical-spacing">
            {loading
            ? 
            <Segment basic>
                <Loader active/>
            </Segment>
            :
                <motion.div
                    initial="hidden"
                    animate={loading ? "hidden" : "visible"}
                    variants={animations.rewardsList}>
                    <ContentContainer header="Your Rewards">
                        <h3 className={css(styles.userPoints)}> Your Distance: {accumulatedDistance}km</h3>
                        {rewards ? rewards.map((rewardGroup: any, index: number) => {
                            let quantity = rewardGroup ? rewardGroup.length : 0;
                            const {id, name, description, rewardID, shopName, distance} = rewardGroup[0];
                            return (
                                <motion.div 
                                key={index} 
                                variants={animations.reward}>
                                <RewardContainer
                                    name={name}
                                    disabled={false}
                                    onClick={() => this.open(rewardID)}
                                    redeemedFrom={shopName}
                                    description={description}
                                    quantity={quantity}
                                    distance={distance} />
                                {/* <Header as="h3">x{quantity}</Header> */}

                                <Modal
                                    open={modalID == rewardID}
                                    closeOnEscape={true}
                                    closeOnDimmerClick={true}
                                    onClose={this.close}>
                                    <Modal.Header>Confirm Redeem Voucher</Modal.Header>
                                    <Modal.Content>
                                        <p className={css(styles.confirmVoucher)}>You are redeeming voucher {name}</p>
                                        <p className={css(styles.confirmText)}>Please notify the waiter that you are gonna redeem this voucher to allow the waiter to key it into their system</p>
                                        <p className={css(styles.confirmWarning)}>Please Note</p>
                                        <p className={css(styles.confirmWarningText)}>You cannot undo this action and the voucher will be invalid if you do not show it to the waiter</p>
                                    </Modal.Content>
                                    <Modal.Actions>
                                        <Button onClick={this.close}>
                                            Cancel
                                    </Button>
                                        <Button negative onClick={() => this.claimReward(index, id)}>
                                            Confirm
                                    </Button>
                                    </Modal.Actions>
                                </Modal>
                                </motion.div>
                            )
                        }) : "No rewards"}
                    </ContentContainer>
                </motion.div>
            }
            </div>
        )
    }
}

const animations = {
    rewardsList: {
        hidden: {
            opacity: 0,
            scale: 0.5
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
    },
    reward: {

        hidden: {
            opacity: 0,
            y: 50
        },
        visible: {
            opacity: 1,
            y: 0
        }
    }
}

const styles = StyleSheet.create({
    confirmVoucher: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold"
    },
    confirmText: {
        textAlign: "center",
        marginTop: 15
    },
    userPoints: {
        textAlign: "center",
        marginTop: 15
    },
    confirmWarning: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 15,
        color: "#FF0000",
        fontWeight: "bold"
    },
    confirmWarningText: {
        textAlign: "center",
        color: "#FF0000",
    },
    testContainer: {
        background: 'blue'
    },
    reward: {
        background: 'red'
    }
})

export default Rewards;