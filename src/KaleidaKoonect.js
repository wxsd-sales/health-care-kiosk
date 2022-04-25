import { useEffect, useState } from "react";
import {Spinner} from '@momentum-ui/react';
import {Button} from '@mui/material';
import MuiPhoneNumber from "material-ui-phone-number";
import { Typography } from '@mui/material';
import axios from 'axios';
import { findPhoneNumbersInText, isValidPhoneNumber } from 'libphonenumber-js'
import { redirect_uri } from "./PresenceDemo/constants";

import './KaleidaKonnect.css';
import { padding } from "@mui/system";

const Konnect = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [displayJoinView, setDisplayJoinView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const sip = localStorage.getItem("bridge_sip");

  const sendMessage = async (meetingLink) => {
    try {
      const body = JSON.stringify({
        "number": `${findPhoneNumbersInText(phoneNumber)[0].number.number}`,
        "message": `Someone has invited you to join the meeting: ${meetingLink}`
      });
  
      const config = {
        method: 'post',
        url: 'https://hooks-us.imiconnect.io/events/JAMIQW66NE',
        headers: { 
          'Content-Type': 'application/json'
        },
        data: body
      };
  
      const {data} = await axios(config);
    } catch (e) {
      console.log(e);
    }
  }

  const generateMeetingLink = async () => {
    try {
      const config = {
        method: 'post',
        url: 'https://wxsd.wbx.ninja/wxsd-guest-demo/create_url',
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          "sip_target": sip,
          "header_toggle": "false",
          "sms_button": "false",
          "expire_hours": 8,
          "self_view": "true",
          "offset": "420",
          "auto_dial": true
        })
      };

      const {data:{urls: {Guest}}} = await axios(config);

      return Guest[0];
    } catch(error) {
      console.log(error);
    }
  };

  const invite = async () => {
    setIsLoading(true);
    const meetingLink =  await generateMeetingLink();
    await sendMessage(meetingLink);
    setIsLoading(false);
    setDisplayJoinView(true);
  }

  const handlePhoneNumberOnChange = (value) => {
    if(isValidPhoneNumber(value)) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }

    setPhoneNumber(value);
  };


  const joinTheBridge = () => {
    window.location.href = `sip:${sip}`;
  };

  const SMSView =  <div className="SMSView">
    <Typography> Enter your family member’s mobile number to start a video chat with them.</Typography>
    <MuiPhoneNumber
      disableDropdown="true"  
      name="phone"
      label="Phone Number"
      data-cy="user-phone"
      defaultCountry={"us"}
      value={phoneNumber}
      onChange={(value) => { handlePhoneNumberOnChange(value)}}
    />
      <Button
        disabled={isButtonDisabled}
        onClick={async (e) => await invite()}
        variant="outlined"
      >Invite!
      </Button>
    </div>;
  const joinView = <div className="SMSView">
     <Typography variant="h6">SMS Has Been Sent Successfully!</Typography>
    <Button
      onClick={(e) => {joinTheBridge()}}
      style={{
        backgroundColor: "#24ab31",
        color: "white",
        alignSelf: "center",
        padding: "0.5rem 1rem"
      }}
    >Join The Meeting!</Button>
  </div>
  const view = isLoading ? <Spinner /> : displayJoinView ? joinView : SMSView;

  return <div className="konnectModal">
    {view}
  </div>;
};

export default Konnect;

        