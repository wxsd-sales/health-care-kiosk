import React, {Component, createRef} from 'react';
import Iframe from 'react-iframe';
import moment from 'moment';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { io } from "socket.io-client";
import queryString from 'querystring';
import { Button } from '@mui/material';
import { client_id, client_secret, auth_url, server_url, redirect_uri } from './constants';

import AuthCode from './AuthCode';
import "./index.css";
export default class PresenceDemo extends Component {
  constructor(props) {
    super(props);
    this.code = new URLSearchParams(window.location.search).get("code");
    this.urlState = new URLSearchParams(window.location.search).get("state");
    this.iframeRef = createRef();

    this.loginState = uuidv4();
    this.state = {
      displaySignOutButton: false,
      isWebexConnected: false,
      isTokenValid: !!this.code,
      displayAuthPrompt: false,
      token: localStorage.getItem('webex_token')
    };
  }

  async componentDidMount() {
    if(localStorage.getItem('webex_token')) {
      await this.validateToken();

    } else {
      const socket = io(server_url);
      socket.emit('register', this.loginState);

      socket.on('token', async (newToken) => {
        this.setState({isTokenValid: true});
        this.setState({token: newToken.access_token })
        this.storeToken(newToken);
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

  async handleSignOut() {
    const validDomains = ["http://localhost:8080", "https://presence.ngrok.io", "https://wxsd-sales.github.io"];
    
    window.addEventListener("message", (ev) => {
      if(validDomains.includes(ev.origin)) {
        if(ev.data.type === "sign-out") {
          localStorage.removeItem('webex_token');
          localStorage.removeItem('expiration_date');
          localStorage.removeItem('refresh_token');
        }

        this.props.openModal(false);
      }
    });

    this.iframeRef.current.contentWindow.postMessage({type: 'sign-out'}, "https://wxsd-sales.github.io/PresenceOnDevice");

  }
  
  render() {
    return <div className="presenceDemo">
        {this.state.isTokenValid ? 
          <div className="presenceContent">
            {this.state.displaySignOutButton && <Button color="error" onClick={async() => {await this.handleSignOut()}}>Sign Out</Button>}
            <iframe
              title="presence"
              src={`https://wxsd-sales.github.io/presence-on-device/?token=${this.state.token}&showModal=false&mode=polling`}
              // src={`https://webexpresence.ngrok.io?token=${this.state.token}&showModal=false&mode=polling`}
              width="100%"
              height="600px"
              id="id"
              ref={this.iframeRef}
              onLoad={()=>{this.setState({displaySignOutButton: true})}}
            /> 
          </div> : <AuthCode  loginState={this.loginState}/> }
      </div>
  }
}
