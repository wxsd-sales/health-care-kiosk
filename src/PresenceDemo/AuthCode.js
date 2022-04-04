import QRCode from 'qrcode.react';
import { Link } from '@mui/material';
import {login_url} from './constants';
import { Typography } from '@mui/material';

import "./AuthCode.css";

const AuthCode = ({loginState}) => {
  console.log(`${login_url}&state=${loginState}`);

  return <div className="authCode">
    <Typography variant="h5">Login With Your Phone!</Typography>
    <QRCode value={`${login_url}&state=${loginState}`} size={300}/>
  </div>
  
}

export default AuthCode;