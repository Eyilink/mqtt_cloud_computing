import React, { useEffect, useState } from 'react';
import './MqttInterface.css';
import mqtt, { MqttClient } from 'mqtt';

interface MQTTOptions {
  host: string;
  clientId: string;
  port: number;
  username: string;
  password: string;
  protocol: string;
}

const MQTTInterface = () => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [connectStatus, setConnectStatus] = useState<string>("");
  const [mqttOption, setMQTTOption] = useState<MQTTOptions>({
    protocol: 'mqtt',
    host: 'localhost',
    clientId: `mqttjs_` + Math.random().toString(16).substr(2, 8),
    port: 9001,
    username: 'jeremie',
    password: 'jeremie'
  });

  const updateMQTTOption = (key: keyof MQTTOptions, value: string | number) => {
    setMQTTOption(prev => ({ ...prev, [key]: value }));
  };

  const mqttConnect = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default form submission behavior if applicable
    const { host, port, protocol, ...options  } = mqttOption;
    const options_c = {
      options,
      clean: true,
      reconnectPeriod: 1000, // ms
      connectTimeout: 30 * 1000, // ms
    }
    const connectUrl = `${protocol}://${host}:${port}`;
    setConnectStatus('Connecting');
    console.log(options);
    setClient(mqtt.connect(connectUrl, options_c));
  };

  const mqttDisconnect = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (client) {
      client.end(() => {
        setConnectStatus('Disconnected');
      });
    }
  };

  useEffect(() => {
    if (client) {
      client.on('connect', () => {
        setConnectStatus('Connected');
      });
      client.on('error', (err) => {
        console.error('Connection error: ', err);
        client.end();
      });
      client.on('reconnect', () => {
        setConnectStatus('Reconnecting');
      });
      client.on('message', (topic, message) => {
        console.log(`Message received on topic ${topic}: ${message.toString()}`);
      });
    }
  }, [client]);

  return (
    <div className="container">
      <div className="section connection">
        <h2>Connection</h2>
        <div>Status: {connectStatus}</div>
        <input type="text" id="host" placeholder="Host" value={mqttOption.host} onChange={e => updateMQTTOption('host', e.target.value)} />
        <input type="text" id="port" placeholder="Port" value={mqttOption.port.toString()} onChange={e => updateMQTTOption('port', parseInt(e.target.value, 10))} />
        <input type="text" id="client-id" placeholder="Client ID" value={mqttOption.clientId} onChange={e => updateMQTTOption('clientId', e.target.value)} />
        <input type="text" id="username" placeholder="Username" value={mqttOption.username} onChange={e => updateMQTTOption('username', e.target.value)} />
        <input type="password" id="password" placeholder="Password" value={mqttOption.password} onChange={e => updateMQTTOption('password', e.target.value)} />
        <button onClick={mqttConnect} id="connect">Connect</button>
        <button onClick={mqttDisconnect} id="disconnect">Disconnect</button>
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
        <input type="text" id="pub-topic" placeholder="Topic" />
        <select id="pub-qos">
          <option value="0">QoS 0</option>
          <option value="1">QoS 1</option>
          <option value="2">QoS 2</option>
        </select>
        <input type="text" id="payload" placeholder="Payload" />
        <button id="publish">Publish</button>
      </div> 

    </div>



  );
};

export default MQTTInterface;
