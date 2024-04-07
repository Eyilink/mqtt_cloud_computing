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
type QoS = 0 | 1 | 2;


const MQTTInterface = () => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [connectStatus, setConnectStatus] = useState<string>("");
  const [isSub, setIsSub] = useState<boolean>();
  const [mqttOption, setMQTTOption] = useState<MQTTOptions>({
    protocol: 'ws',
    host: '10.110.84.212',
    clientId: `mqttjs_` + Math.random().toString(16).substr(2, 8),
    port: 9001,
    username: 'jeremie',
    password: 'jeremie'
  });
  const [receivedMessages, setReceivedMessages] = useState<Array<{ topic: string; message: string }>>([]);


  const updateMQTTOption = (key: keyof MQTTOptions, value: string | number) => {
    setMQTTOption(prev => ({ ...prev, [key]: value }));
  };

  const mqttConnect = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default form submission behavior if applicable
    const { host, port, protocol, ...options } = mqttOption;
    const options_c = {
      options,
      clean: true,
      reconnectPeriod: 1000, // ms
      connectTimeout: 30 * 1000, // ms
    }
    const connectUrl = `${protocol}://${host}:${port}/mqtt`;
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

  const mqttSub = (topic: string, qos: QoS) => {
    if (client) {
      client.subscribe(topic, { qos }, (error) => {
        if (error) {
          console.log('Subscribe to topics error', error);
          setIsSub(false);
          return;
        }
        setIsSub(true);
      });
    }
  };

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const topic = form.topic.value;
    const qos = parseInt(form.qos.value, 10) as QoS; // Ensure qos is treated as QoS type
    mqttSub(topic, qos);
  };

  const mqttPublish = (topic: string, qos: QoS, payload: string) => {
    if (client) {
      client.publish(topic, payload, { qos }, error => {
        if (error) {
          console.log('Publish error: ', error);
        } else {
          console.log('Publish successful');
        }
      });
    }
  };

  const handlePublish = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const topic = form.topic.value;
    const qos = parseInt(form.qos.value, 10) as QoS;
    const payload = form.payload.value;
    mqttPublish(topic, qos, payload);
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
        const newMessage = { topic, message: message.toString() };
        setReceivedMessages(prevMessages => [...prevMessages, newMessage]);
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
        <form onSubmit={handleSubscribe}>
          <input type="text" name="topic" placeholder="Topic" required />
          <select name="qos" required>
            <option value="0">QoS 0</option>
            <option value="1">QoS 1</option>
            <option value="2">QoS 2</option>
          </select>
          <button id="subscribe" type="submit">Subscribe</button>
        </form>
        {isSub !== null && <div>Subscription Status: {isSub ? "Subscribed" : "Failed to Subscribe"}</div>}
      </div>



      <div className="section publisher">
        <h2>Publisher</h2>
        <form onSubmit={handlePublish}>
          <input type="text" name="topic" placeholder="Topic" required />
          <select name="qos" required>
            <option value="0">QoS 0</option>
            <option value="1">QoS 1</option>
            <option value="2">QoS 2</option>
          </select>
          <input type="text" name="payload" placeholder="Payload" required />
          <button id="publish" type="submit">Publish</button>
        </form>
      </div>
      <div className="section received-messages">
        <h2>Received Messages</h2>
        <ul>
          {receivedMessages.map((msg, index) => (
            <li key={index}>
              <strong>Topic:</strong> {msg.topic}, <strong>Message:</strong> {msg.message}
            </li>
          ))}
        </ul>
      </div>


    </div>



  );
};

export default MQTTInterface;
