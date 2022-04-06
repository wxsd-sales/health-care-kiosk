import {Component, createRef} from 'react';
import Iframe from 'react-iframe';
import ReactDOM from 'react-dom';
import axios from 'axios';
import queryString from 'querystring';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import { Button, Avatar } from '@mui/material';
import Konnect from './assests/Konnect.png';
import Kafe from './assests/Kafe.png';
import TV from './assests/TV.png';
import Clinician from './assests/Clinician.png';
import Modal from './Modal';
import KaleidaKonnect from './KaleidaKoonect';
import PresenceDemo from './PresenceDemo';
import { client_id, client_secret, auth_url, server_url, redirect_uri } from './PresenceDemo/constants';


import './App.css';


function Buttons() {
  const [modalContent, setModalContent] = useState(null);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const kafeContent = <Iframe  src="https://orderlina.menu/marcelas" style="border:0px #FFFFFF none" name="Menu" frameborder="0" marginheight="0px" marginwidth="0px" height="600px" width="100%" allowfullscreen scrolling="auto"/>
  const tvContent = <Iframe width="100%" height="400px" src="https://www.youtube.com/embed/vRPmIFl52nM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
  const konnectContent = <KaleidaKonnect />

  return <>
      <div className='bottom'>
        <div className='buttons'>
          <Button
            size="large"
            onClick={()=> {setModalContent(konnectContent); setOpen(true);}} 
            startIcon={<Avatar 
              sx={{ height: '7rem', width: '7rem' }}
              src={Konnect} />}
          />
          <Button
          size="large"
          onClick={()=>{setModalContent(kafeContent); setOpen(true);}} 
          startIcon={<Avatar 
            sx={{ height: '7rem', width: '7rem' }}
            src={Kafe} />}
          />
          <Button
            size="large"
            onClick={()=> {setModalContent(tvContent); setOpen(true);}} 
            startIcon={<Avatar 
              sx={{ height: '7rem', width: '7rem' }}
              src={TV} />}
          />
        </div>
        <Modal open={open} close={handleClose} >
          {modalContent}
        </Modal>
      </div>
      <div className="clinicianButton">
        <Button
          onClick={() => {setModalContent(<PresenceDemo />); setOpen(true)}} 
          size="large"
          className="clinicianButton"
          startIcon={<Avatar 
            sx={{ height: '4rem', width: '4rem' }}
            src={Clinician} />}
        />
      </div>
  </>
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      displayAuthPrompt: false,
    }
  }

  async componentDidMount()  {
    const code = new URLSearchParams(window.location.search).get("code");
    const urlState = new URLSearchParams(window.location.search).get("state");

    if(code) {
      const {data} = await axios.post(auth_url, queryString.stringify({
        code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
        client_id: client_id,
        client_secret: client_secret
      }), 
      {
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      this.setState({displayAuthPrompt: true});
      const socket = io(server_url);
      data.state = urlState;
      socket.emit('token', data);
    }

  }

  render() {
    const authSuccessful = <div>
      <h4>Login Completed Successfully!</h4>
      <p>You may now close this tab!</p>
    </div>;

    return <div>
      {this.state.displayAuthPrompt ? authSuccessful :
      <>
        <iframe
          style={{
            height: '100%',
            position: 'absolute'
          }}
          src="https://www.kaleidahealth.org"
          width="100%"
          title="kaleida"
        ></iframe>
        <Buttons /> 
      </>
      }
      </div>
  }
}

export default App;