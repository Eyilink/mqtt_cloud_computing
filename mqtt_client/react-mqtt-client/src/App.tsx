import { useState } from 'react'
import './App.css'
import MQTTInterface from './component/MqttInterface'

function App() {
  const [count, setCount] = useState(0)

  return (
    
      <MQTTInterface />
    
  )
}

export default App
