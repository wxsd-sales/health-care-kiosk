import React, {Component} from 'react';
import Iframe from 'react-iframe';
import moment from 'moment';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { io } from "socket.io-client";
import queryString from 'querystring';
import { client_id, client_secret, auth_url, server_url, redirect_uri } from './constants';

import AuthCode from './AuthCode';


export default class PresenceDemo extends Component {
  constructor(props) {
    super(props);
    this.code = new URLSearchParams(window.location.search).get("code");
    this.urlState = new URLSearchParams(window.location.search).get("state");

    this.loginState = uuidv4();
    this.state = {
      isWebexConnected: false,
      isTokenValid: !!this.code,
      displayAuthPrompt: false,
    };
  }

  async componentDidMount() {
    if(localStorage.getItem('webex_token')) {
      await this.validateToken();

    } else {
      const socket = io(server_url);
      socket.emit('register', this.loginState);

      socket.on('token', async (token) => {
        this.setState({isTokenValid: true});
        this.storeToken(token);
      });
    }
  }
  

  storeToken({expires_in, access_token, refresh_token}) {
    const startDate = moment.utc();
    const expirationDate = startDate.add(Number(expires_in), 'seconds');
    
    localStorage.setItem('webex_token', access_token);
    localStorage.setItem('expiration_date', expirationDate.format());
    localStorage.setItem('refresh_token', refresh_token);
  }

  async requestForFreshToken() {
    const refresh_token = localStorage.getItem('refresh_token');

    try {
      const {data} = await axios.post(auth_url, queryString.stringify({
        grant_type: "refresh_token",
        client_id: client_id,
        client_secret: client_secret,
        refresh_token
      }), 
      {
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
      
      this.storeToken(data);
    } catch (error) {
      console.log(error);
    }

  };

  async validateToken() {
    if((moment(localStorage.getItem('expiration_date')).diff(moment.utc()) < 0)) {
      await this.requestForFreshToken();
    } else {
      this.setState({isTokenValid: true});
    }
  }


  render() {
  return <>
      {this.state.isTokenValid ? <Iframe
          url={`https://presence.ngrok.io/?token=${localStorage.getItem('webex_token')}&showModal=false&mode=polling`}
          width="100%"
          height="600px"
          id="id"
        /> : <AuthCode  loginState={this.loginState}/> }
    </>

  }
}
