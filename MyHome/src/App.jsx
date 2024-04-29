import React, { useState , useEffect } from 'react';
import Toggle from 'react-toggle';
import './App.css'; 
import bulbOn from './bulb-on.png';
import bulbOff from './bulb-off.png';
import 'react-toggle/style.css'; 
function App() {
  const [isBulbOn, setIsBulbOn] = useState(0);

  const getBulbStatus = async() => {
    const response = await fetch(
      'https://raspberry-mz-default-rtdb.firebaseio.com/status.json?auth=UhSBc3hxpo6leXPDZwHyaDiE5goosuj48eSNe31Y'
    )

    const bulbstatus = await response.json()
    const IntBulbStatus = bulbstatus.ISON
    setIsBulbOn(IntBulbStatus)
  }
  useEffect(()=>{
    getBulbStatus()
  },[])
  

  const handleToggle = async() => {
    // setIsBulbOn((isBulbOn==1)?0:1);
    const InvertedBulbStatus = (isBulbOn==0)?1:0
    const BulbStatus = {"ISON":InvertedBulbStatus} ;
    console.log(BulbStatus);
    
    const response = await fetch('https://raspberry-mz-default-rtdb.firebaseio.com/status.json?auth=UhSBc3hxpo6leXPDZwHyaDiE5goosuj48eSNe31Y',
  {
    method:"PUT",
    body:JSON.stringify(BulbStatus)
  }
  )
  getBulbStatus()
  };

  return (
    <div className="App">
      <h2>Home Automation System</h2>
      <div className="switch-container">
        <div className="" style={{
          height:'200px',
          display:'flex',
          justifyContent:'center',
          alignItems:'center'
        }}>
        <img className="bulb-icon" style={{
          height:"100%",
          width:"100%"
        }} src={(isBulbOn == 1) ? bulbOn : bulbOff} alt="Bulb" />
        </div>
      </div>
      <div className="switch">
      <Toggle
          checked={(isBulbOn == 1)?true:false}
          onChange={handleToggle}
        />
      </div>
      <p>{isBulbOn ? 'Bulb is ON' : 'Bulb is OFF'}</p>
    </div>
  );
}

export default App;
