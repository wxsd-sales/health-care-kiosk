import {Component, createRef} from 'react';
import Iframe from 'react-iframe';
import ReactDOM from 'react-dom';
import axios from 'axios';
import queryString from 'querystring';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import { Button, Avatar, Typography } from '@mui/material';
import Konnect from './assests/Konnect.png';
import Kafe from './assests/Kafe.png';
import TV from './assests/TV.png';
import Clinician from './assests/Clinician.png';
import Modal from './Modal';
import KaleidaKonnect from './KaleidaKoonect';
import PresenceDemo from './PresenceDemo';
import kaleida from './assests/kaleida-home-page.png';
import KaleidaTV from './KaleidaTV';
import { client_id, client_secret, auth_url, server_url, redirect_uri } from './PresenceDemo/constants';


import './App.css';


function Buttons() {
  const [modalContent, setModalContent] = useState(null);
  const [showTV, setShowTV] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClose = () => {setOpen(false); setShowTV(false);};
  const kafeContent = <Iframe  src="https://orderlina.menu/marcelas" style="border:0px #FFFFFF none" name="Menu" frameborder="0" marginheight="0px" marginwidth="0px" height="600px" width="100%" allowfullscreen scrolling="auto"/>
  const tvContent = <KaleidaTV />
  const konnectContent = <KaleidaKonnect />

  return <>
      <div className='bottom'>
        <div className='buttons'>
          <div className="button">  
            <Button
              size="large"
              onClick={()=> {setModalContent(konnectContent); setOpen(true);}} 
              startIcon={<Avatar 
                sx={{ height: '7rem', width: '7rem' }}
                src={Konnect} />}
            />
            <Typography>Kaleida Konnect</Typography>
          </div>
          <div className="button">
            <Button
            size="large"
            onClick={()=>{setModalContent(kafeContent); setOpen(true);}} 
            startIcon={<Avatar 
              sx={{ height: '7rem', width: '7rem' }}
              src={Kafe} />}
            />
            <Typography>Kaleida Kafe</Typography>
          </div>
          <div className="button">
            <Button
              size="large"
              onClick={()=> {setModalContent(tvContent); setOpen(true); setShowTV(true)}} 
              startIcon={<Avatar 
                sx={{ height: '7rem', width: '7rem' }}
                src={TV} />}
            />
            <Typography>Kaleida TV</Typography>
          </div>
        </div>
        <Modal open={open} close={handleClose} width={showTV ? "40rem" : undefined}>
          {modalContent}
        </Modal>
      </div>
      <div className="clinicianButton">
        <Button
          onClick={() => {setModalContent(<PresenceDemo openModal={setOpen}/>); setOpen(true)}} 
          size="large"
          className="clinicianButton"
          startIcon={<Avatar 
            sx={{ height: '4rem', width: '4rem' }}
            src={Clinician} />}
        />
        <Typography variant="h7">Clinician Only</Typography>
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
        <img src={kaleida} alt="kaleida"/>
        <Buttons /> 
      </>
      }
      </div>
  }
}

export default App;
