import React, { useState, useEffect } from 'react';
import { Client } from 'paho-mqtt';
import './App.css'; // Import CSS for styling

function App() {
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('topic/test'); // Default topic
  const [client, setClient] = useState(null);

  useEffect(() => {
    const mqttClient = new Client('ws://192.168.2.81:1883/', 'clientId'); // Assuming WebSocket connection
    mqttClient.connect({
      onSuccess: () => {
        console.log('Connected to MQTT broker');
        setClient(mqttClient);
      },
      onFailure: (err) => {
        console.error('Failed to connect to MQTT broker:', err);
      }
    });

    return () => {
      if (client) {
        client.disconnect();
        console.log('Disconnected from MQTT broker');
      }
    };
  }, [client]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (client && content && topic) {
      client.send(topic, JSON.stringify({ content }));
      console.log('Message published successfully');
      setContent(''); // Clear input field after submission
    }
  };

  return (
    <div className="container">
      <h1>MQTT Publisher</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="topic">Topic:</label>
        <input
          type="text"
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic"
        />
        <label htmlFor="content">Content:</label>
        <input
          type="text"
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your content"
        />
        <button type="submit">Publish</button>
      </form>
    </div>
  );
}

export default App;
