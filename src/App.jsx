import React, { useState, useEffect } from 'react';
import './App.css';

// Import Font Awesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faClock, faLeaf, faWater, faMoon } from '@fortawesome/free-solid-svg-icons';

const API_URL = 'http://api.aladhan.com/v1/timingsByCity';
const city = 'Dhaka';  // You can change this to any city
const country = 'Bangladesh'; // Set your country here

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  const [currentPrayer, setCurrentPrayer] = useState('');

  const [prayerTimes, setPrayerTimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [nextPrayer, setNextPrayer] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('');
  const audio = new Audio('./audio/alert.mp3');  // Audio alert file

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // updates every second
  
    return () => clearInterval(interval);
  }, []);

  const formatClockTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');

    let is12HourFormat = true
  
    if (is12HourFormat) {
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${hours}:${minutes}:${seconds} ${ampm}`;
    }
  
    return `${hours.toString().padStart(2, '0')}:${minutes}:${seconds}`;
  };
  
  

  const findCurrentPrayer = (times) => {
    const now = new Date();
    const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const prayerTimesList = prayerOrder.map((name) => ({
      name,
      time: new Date(`${now.toDateString()} ${times[name]}`)
    }));
  
    for (let i = prayerTimesList.length - 1; i >= 0; i--) {
      if (now >= prayerTimesList[i].time) {
        setCurrentPrayer(prayerTimesList[i].name);
        return;
      }
    }
  
    // If it's before Fajr, then the current prayer is Isha (from last night)
    setCurrentPrayer('Isha');
  };
  

  const convertTo12HourFormat = (time24) => {
    const [hourStr, minute] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;

    return `${hour.toString().padStart(2, 0)}:${minute.toString().padStart(2, 0)} ${ampm}`;
  };  

  // Fetch prayer times from API
  const getPrayerTimes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?city=${city}&country=${country}&method=2`);
      const data = await response.json();
      if (data.code === 200) {
        setPrayerTimes(data.data.timings);
        findNextPrayer(data.data.timings);
        findCurrentPrayer(data.data.timings);
      } else {
        console.error('Error fetching prayer times:', data);
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to find the next prayer and calculate time remaining
  const findNextPrayer = (times) => {
    const currentTime = new Date();
    const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    let nextPrayer = null;
    let nextPrayerTime = null;

    for (let i = 0; i < prayerNames.length; i++) {
      const prayerTime = new Date(`${currentTime.toDateString()} ${times[prayerNames[i]]}`);
      if (prayerTime > currentTime) {
        nextPrayer = prayerNames[i];
        nextPrayerTime = prayerTime;
        break;
      }
    }

    if (nextPrayer) {
      setNextPrayer(nextPrayer);
      startCountdown(nextPrayerTime);
    }
  };

  // Function to start countdown timer for the next prayer
  const startCountdown = (nextPrayerTime) => {
    const intervalId = setInterval(() => {
      const currentTime = new Date();
      const remainingTime = nextPrayerTime - currentTime;
      
      if (remainingTime <= 0) {
        clearInterval(intervalId); // Clear interval when the countdown reaches zero
        setTimeRemaining('Prayer time now');
        audio.play();  // Play the alert sound when countdown hits zero
      } else {
        const hours = Math.floor(remainingTime / 1000 / 60 / 60);
        const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
        const seconds = Math.floor((remainingTime / 1000) % 60);
        setTimeRemaining(`${hours}h ${minutes.toString().padStart(2, 0)}m ${seconds.toString().padStart(2, 0)}s`);
      }
    }, 1000);

    // Save the intervalId to clear it when the component unmounts
    return intervalId;
  };

  useEffect(() => {
    getPrayerTimes();

    // Refresh prayer times every minute
    const intervalId = setInterval(getPrayerTimes, 60000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Prayer icons and colors
  const prayerInfo = {
    Fajr: { icon: faSun, color: '#FF5722' },  // Orange for Fajr
    Dhuhr: { icon: faClock, color: '#4CAF50' },  // Green for Dhuhr
    Asr: { icon: faLeaf, color: '#FF9800' },  // Yellow-Orange for Asr
    Maghrib: { icon: faWater, color: '#2196F3' },  // Blue for Maghrib
    Isha: { icon: faMoon, color: '#9C27B0' }  // Purple for Isha
  };

  return (
    <div className="App">
          <div style={{ 
            fontSize: '24px', 
            textAlign: 'center', 
            margin: '1em 0', 
            fontFamily: 'monospace' 
          }}>
            🕒 {formatClockTime(currentTime)}
    </div>


      <h1>Prayer Times</h1>
      <hr/>
      <div id="times">
        {/* {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => (
          <p
            key={prayer}
            className={nextPrayer === prayer ? 'highlight' : ''}
            style={{ color: prayerInfo[prayer].color }}
          >
            <FontAwesomeIcon icon={prayerInfo[prayer].icon} /> <strong style={{marginRight: 30}}>{prayer}:</strong> {convertTo12HourFormat(prayerTimes[prayer])}
          </p>
        ))} */}

        {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => (
          <p
            key={prayer}
            className={
              currentPrayer === prayer
                ? 'highlight-current'
                : ''
            }
            style={{ color: prayerInfo[prayer].color }}
          >
            <FontAwesomeIcon icon={prayerInfo[prayer].icon} /> <strong style={{marginRight: 30}}>{prayer}:</strong> {convertTo12HourFormat(prayerTimes[prayer])}
          </p>
        ))}

      </div>
      <div>
        {nextPrayer && (
          <div>
            <h2>Next Prayer: {nextPrayer}</h2>
            <p>Time remaining: {timeRemaining}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;