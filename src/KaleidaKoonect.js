import { useEffect } from "react";
const {SmsClient, SmsMessage, ClientConfiguration} = require('connect-sdk-node');

const Konnect = () => {
  useEffect(() => {
    // const clientConfiguration = new ClientConfiguration("3cb3fe30-463c-11ec-b58d-063d0d6fdfb5", "https://api-sandbox.imiconnect.io");
    // const smsClient = new SmsClient(clientConfiguration);
    
    // const smsMessage = new SmsMessage().of_text("+12019401285", "+16504715214", "");
    
    // const request = smsClient.sendMessage(smsMessage);
    
    
    // request
    // .then(res => {
    //     console.log(res);
    // })
    // .catch(err => {
    //     console.error(err);
    // });
  },[]);

  return null;
};

export default Konnect;

        