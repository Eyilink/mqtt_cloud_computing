import React, { useEffect, useState } from 'react';
import './MqttInterface.css'
const mqtt = require('mqtt');

const MQTTInterface = () => {
    const [client, setClient] = useState<any>(null);
    const [connectStatus, setConnectStatus] = useState("");
    const [isSub,setIsSub] = useState<boolean>();
    const [payload, setPayload] = useState<any>();

    const mqttConnect = (host : any, mqttOption : any) => {
      setConnectStatus('Connecting');
      setClient(mqtt.connect(host, mqttOption));
    };

    const mqttSub = (subscription : any) => {
        if (client) {
          const { topic, qos } = subscription;
          client.subscribe(topic, { qos }, (error : any) => {
            if (error) {
              console.log('Subscribe to topics error', error);
              return;
            }
            setIsSub(true);
          });
        }
      };

      const mqttUnSub = (subscription : any) => {
        if (client) {
          const { topic } = subscription;
          client.unsubscribe(topic, (error : any) => {
            if (error) {
              console.log('Unsubscribe error', error);
              return;
            }
            setIsSub(false);
          });
        }
      };
      
      const mqttPublish = (context : any) => {
        if (client) {
          const { topic, qos, payload } = context;
          client.publish(topic, payload, { qos }, (error : any ) => {
            if (error) {
              console.log('Publish error: ', error);
            }
          });
        }
      };

      const mqttDisconnect = () => {
        if (client) {
          client.end(() => {
            setConnectStatus('Disconnected');
          });
        }
      };
      
      
      
    
    useEffect(() => {
      if (client) {
        console.log(client);
        client.on('connect', () => {
          setConnectStatus('Connected');
        });
        client.on('error', (err : any) => {
          console.error('Connection error: ', err);
          client.end();
        });
        client.on('reconnect', () => {
          setConnectStatus('Reconnecting');
        });
        client.on('message', (topic :any, message : any) => {
          const payload = { topic, message: message.toString() };
          setPayload(payload);
        });
      }
    }, [client]);
    

  return (
    <div className="mqtt-interface">
     

<div className="container">

  
  <div className="section connection">
    <h2>Connection</h2>
    <input type="text" id="host" placeholder="Host" />
    <input type="text" id="port" placeholder="Port" />
    <input type="text" id="client-id" placeholder="Client ID"/>
    <input type="text" id="username" placeholder="Username"/>
    <input type="password" id="password" placeholder="Password"/>
    <button id="connect">Connect</button>
    <button id="disconnect">Disconnect</button>
  </div>


  <div className="section subscriber">
    <h2>Subscriber</h2>
    <input type="text" id="sub-topic" placeholder="Topic" />
    <select id="sub-qos">
      <option value="0">QoS 0</option>
      <option value="1">QoS 1</option>
      <option value="2">QoS 2</option>
    </select>
    <button id="subscribe">Subscribe</button>
  </div>

  <div className="section publisher">
    <h2>Publisher</h2>
    <input type="text" id="pub-topic" placeholder="Topic"/>
    <select id="pub-qos">
      <option value="0">QoS 0</option>
      <option value="1">QoS 1</option>
      <option value="2">QoS 2</option>
    </select>
    <input type="text" id="payload" placeholder="Payload"/>
    <button id="publish">Publish</button>
  </div>

</div>


    </div>
  );
};

export default MQTTInterface;
