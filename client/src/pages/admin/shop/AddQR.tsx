import React from 'react';
import { Header, MountNode, Modal, Button, Icon } from 'semantic-ui-react';
import QRCode from 'qrcode.react';
import { connect } from 'react-redux';
//import moment from 'moment';
import {StyleSheet, css} from 'aphrodite';
import * as paths from '../../../constants/paths';
import { getUserInfo } from '../../../constants/lookup/auth';
import ResponseMsg from '../../../models/ResponseMsg';
import jwt from 'jsonwebtoken';
import uuid from 'uuidv4';
import ReactToPrint from 'react-to-print';
import PrintComponents from 'react-print-components';

interface P {
  showMsg: any,
  postUrl: string,
  formikBag?: any,
  
}

interface S {
    value: any,
    size: number,
    fgColor: any,
    bgColor: any,
    level: string,
    renderAs: string,
    includeMargin: boolean,
    isOpen : boolean,
    modalID: number,
}


class AddQR extends React.Component<P,S>{

    public qrRef: any;

    constructor(props: P){
        super(props);
        this.state = {
          value: '',
          size: 300,
          fgColor: '#000000',
          bgColor: '#ffffff',
          level: 'M',
          renderAs: 'svg',
          includeMargin: false,
          isOpen : false,   
          modalID: -1,   
        }
    
      }
    componentDidMount(){
      this.qrRef = React.createRef();
    }


    handleClick = () => {
      this.setState({isOpen:true});
      // set the route for the qrcode here
      const secretKey = process.env.REACT_APP_JWT_KEY;
      if(secretKey){
        const now = new Date();
        const dateString = now.toString();
        const randomString = uuid.fromString(dateString);
        const accessToken = jwt.sign({token: randomString}, secretKey)

        let path = "?token=" +accessToken;
        this.setState({value: path});
        this.props.formikBag.setFieldValue("accessToken", accessToken);
      }
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

    removeShop=()=>{
      this.close();
    }

    render(){
      const {values} = this.props.formikBag;
      const {modalID} = this.state;
        return(   
          <div>
            <div>
              <Button primary type="button" onClick={this.handleClick}>Generate QR</Button>
              <Button name="delete" type="button" onClick={() => this.open(1)}>Full Screen</Button>
              <PrintComponents
                trigger={<Button type="button">Print</Button>}>
                  <QRCode     
                    value={values.accessToken ? values.accessToken : ""}
                    size={1000}
                    fgColor={this.state.fgColor}
                    bgColor={this.state.bgColor}
                    level={this.state.level}
                    renderAs={this.state.renderAs}/>
              </PrintComponents>

              </div>
              <Modal
                  open={modalID == 1}
                  closeOnEscape={true}
                  closeOnDimmerClick={true}
                  closeIcon={true}
                  dimmer='blurring'
                  className={css(styles.overlay)}
                  onClose={this.close}>
                  <Modal.Content className={css(styles.showqr)}>
                      {values.accessToken ? 
                          <QRCode     
                            value={values.accessToken ? values.accessToken : ""}
                            size={550}
                            fgColor={this.state.fgColor}
                            bgColor={this.state.bgColor}
                            level={this.state.level}
                            renderAs={this.state.renderAs}/>
                        : 
                          <h2>No QR Generated yet</h2>
                        }
                  </Modal.Content>       
              </Modal>

            {values.accessToken ? 
            
            <div className={css(styles.showqr)} ref={this.qrRef}>
              <QRCode     
                value={values.accessToken ? values.accessToken : ""}
                size={this.state.size}
                fgColor={this.state.fgColor}
                bgColor={this.state.bgColor}
                level={this.state.level}
                renderAs={this.state.renderAs}/>
            </div>
            : <div>
              <h2 className={css(styles.showqr)}>No QR Code Generated yet</h2>
              </div>
          }
            </div>
        )}
}

const styles = StyleSheet.create({
  showqr: {
    textAlign:'center',
    padding: '30px',
  },
  overlay:{
    width:'95%',
    height:'90%',
    textAlign:'center',
    margin: '0 auto',
  }

})
export default AddQR;


