import React from 'react';
import { render } from 'react-dom';
import { useState, useEffect } from 'react';
import {FaPlay, FaPause} from 'react-icons/fa';
import {VscDebugRestart} from 'react-icons/vsc';
import {BsFillArrowUpSquareFill} from 'react-icons/bs';
import {BsFillArrowDownSquareFill} from 'react-icons/bs';

 
const App = () => {
  const [defaultTimeSession, setDefaultTimeSession] = useState(25);
  const [defaultTimeBreak, setDefaultTimeBreak] = useState(5);
  const [countDown, setCountDown] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [timeType, setTimeType] = useState("Session")

  const Restart = () => {
    setDefaultTimeSession(25);
    setDefaultTimeBreak(5);
    setIsRunning(false);
    setCountDown(1500);
    setTimeType("Session");
    clearTimeout(timeout);
    const audio = document.getElementById("beep");
    audio.pause()
    audio.currentTime = 0;
  }
// The Restart Function, sets all other states by default, such as setting the 
// break time to 5 and to session to 25. 
// Also if the clock is running, it sets it to false
// where it will stop running. 
// The countDown is set to an integer of 1500 and countDown will be considered 
// as seconds. 1500 seconds = 25 minutes.
// Sets the setTimeType (Title) to "Session".
// The global clearTimeout() method cancels a timeout previously 
// established by calling setTimeout().
// The function call audio, gets the document element of Id of "beep", any element that has
// an id="beep", it will get access to the audio element.
// The audio function will pause the audio and put the currentTime of the audio to 0
// which means the audio will start from the beginning.

  const playPause = () => {
    clearTimeout(timeout);
    setIsRunning(!isRunning);
  }
// The play/Pause function cancels the timeout function and sets the isRunning state
// to whatever it's not. So by default it's false, so by the exclamation mark expression
// inverts the boolean expression, which makes !false === true and vice-versa.

  const timeout = setTimeout(() => {
    console.log('timeout function')
    if(countDown && isRunning){
      setCountDown(countDown - 1)
    }
  }, 1000);

  const incrementBreak = () => {
    if(defaultTimeBreak < 60) {
      setDefaultTimeBreak(prev => prev + 1)
    }
  }

  const decrementBreak = () => {
    if(defaultTimeBreak > 1) {
      setDefaultTimeBreak(prev => prev -1)
    }
  }

  const decrementSession = () => {
    if(defaultTimeSession > 1) {
      setDefaultTimeSession(prev => prev -1)
      setCountDown(countDown - 60)
    }
    if(isRunning == true) {
      playPause();
      setCountDown(countDown - 60)
    }
  }

  const incrementSession = () => {
    if(defaultTimeSession < 60) {
      setDefaultTimeSession(prev => prev +1)
      setCountDown(countDown + 60)
    }
    if(isRunning == true) {
      playPause();
      setCountDown(countDown + 60)
    }
  }

  const resetTimer = () => {
    const audio = document.getElementById("beep");
    if(!countDown && timeType === "Session") {
      setCountDown(defaultTimeBreak * 60)
      setTimeType("Break")
      audio.play()
    }
    if(!countDown && timeType === "Break") {
      setCountDown(defaultTimeSession * 60)
      setTimeType("Session")
      audio.play()
    }
  }

  const title = timeType === "Session" ? "Session" : "Break";

  const clock = () => {
    if(isRunning) {
      // timeout
      resetTimer()
    } else {
      clearTimeout(timeout)
    }
  }

  useEffect(() => {
    clock()
  }, [isRunning, countDown, timeout])

  const timeFormat = () => {
    const minutes = Math.floor(countDown / 60);
    const seconds = countDown - minutes * 60;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  return (
    <>
    <div id="container">
      <div className="title">Session/Break Timer</div>
      <div className="length-wrap">
        <div className="break">
            <div id="break-label">Break Length</div>
            <div className="break-row">
              <div id="break-decrement" onClick={() => decrementBreak()}><BsFillArrowDownSquareFill/></div>
              <div id="break-length">{defaultTimeBreak}</div>
              <div id="break-increment" onClick={() => incrementBreak()}><BsFillArrowUpSquareFill/></div>
            </div>
        </div>
        <div className="session">
            <div id="session-label">Session Length</div>
            <div className="session-row">
              <div id="session-decrement" onClick={() => decrementSession()}><BsFillArrowDownSquareFill/></div>
              <div id="session-length">{defaultTimeSession}</div>
              <div id="session-increment" onClick={() => incrementSession()}><BsFillArrowUpSquareFill/></div>
            </div>
        </div>
      </div>
      <div className="time-type">
          <div id="timer-label">{title}</div>
          <div id="time-left">{timeFormat()}</div>
      </div>
      <div className="buttons">
        <div id="start_stop" onClick={playPause}>
          {isRunning ? <FaPause/> : <FaPlay/>}
        </div>
        <div id="reset" onClick={()=> Restart()}><VscDebugRestart/></div>
      </div>
      <audio
      id="beep" 
      preload="auto"
      src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
    />
    </div>
    </>
  )
}

render(<App/>, document.getElementById("root"));