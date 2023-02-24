import React, { useState,useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";

import './index.css';
import reportWebVitals from './reportWebVitals';

const Main = (props) => {

  const [price,setPrice] = useState(0);
  let recievedData = null;
  let delay = 10000;
  const app_id = 1089;
  const connection = new WebSocket(
    `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
  );
  const api = new DerivAPIBasic({ connection });
  
  
  const ticks_request = {
    ticks: "R_50",
    subscribe: 1
  };
  
  const tickSubscriber = () => api.subscribe(ticks_request);
  
  const ticksResponse = async (res) => {
    recievedData = JSON.parse(res.data);
    // This example returns an object with a selected amount of past ticks.
  };


  const timedCheck = setInterval( ()=>{
  if(recievedData === null) {
    return;
  }
  if (recievedData.error !== undefined) {
    console.log("Error : ", recievedData.error.message);
    unsubscribeTicks();
    }
  // Allows you to monitor ticks.
  if (recievedData.msg_type === "tick") {
    console.log(recievedData.tick);
  }
  },delay)

  const subscribeTicks = async () => {
    connection.addEventListener("message", ticksResponse);
    await tickSubscriber();
  };
  
  const unsubscribeTicks = async () => {
    clearInterval(timedCheck);
    connection.removeEventListener("message", ticksResponse, false);
    await tickSubscriber().unsubscribe();
  };
  
  return (
    <div className="Main">
      <h1>
      </h1>
    <button 
    className="SubscribeBtn"
    onClick={subscribeTicks}>
      Subscribe
    </button>
    <button 
    className="UnsubscribeBtn"
    onClick={unsubscribeTicks}>
      Unsubscribe
    </button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Main>
  </Main>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
