import './App.css'
import MultiplicationFactor from './components/MultiplicationFactor'
import { useEffect } from 'react';
import monday from 'monday-sdk-js';

const mondayClient = monday();

function App() {
  useEffect(() => {
    mondayClient.listen("context", (res: any) => {
      console.log("Monday context loaded", res.data);
    });
  }, []);

  return (
    <>
        <MultiplicationFactor />
    </>
  )
}

export default App
