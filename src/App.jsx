import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [time, setTime] = useState(1500);
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const [isBreak, setIsBreak] = useState(false);
  const intervalRef = useRef(null);

  const playAudio = () => {
    const audio = document.getElementById('beep');
    audio.currentTime = 0;
    audio.play();
    setTimeout(() => {
      audio.pause();
    }, 2000);
  }

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          if (isSession && prevTime <= 0) {
            playAudio();
            setIsSession(!isSession);
            setIsBreak(!isBreak);
            return breakLength * 60;
          }
          else if (isBreak && prevTime <= 0) {
            playAudio();
            setIsSession(!isSession);
            setIsBreak(!isBreak);
            return sessionLength * 60;
          }
          else {
            return prevTime - 1;
          }
        })
      }, 1000);
    }
    else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isSession, isBreak, isRunning])

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  }

  const incrementBreak = () => {
    !isRunning && breakLength < 60 ?
    setBreakLength(breakLength + 1) :
    null;
  }

  const decrementBreak = () => {
    !isRunning && breakLength > 1 ?
    setBreakLength(breakLength - 1) :
    null;
  }

  const incrementSession = () => {
    !isRunning && sessionLength < 60 ?
    (setSessionLength(sessionLength + 1), setTime(time + 60)) :
    null;
  }

  const decrementSession = () => {
    !isRunning && sessionLength > 1 ?
    (setSessionLength(sessionLength - 1), setTime(time - 60)) :
    null;
  }

  const handleReset = () => {
    const audio = document.getElementById('beep');
    audio.pause();
    audio.currentTime = 0;
    setTime(1500);
    setBreakLength(5);
    setSessionLength(25);
    setIsSession(true);
    setIsBreak(false);
    setIsRunning(false);
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  const changeString = () => {
    if (isSession) {
      return 'Session';
    }
    return 'Break';
  }

  const changeShadowColor = () => {
    if (time <= 60) {
      return 'circle-container intense-shadow';
    }
    else if (!isRunning && time > 60) {
      return 'circle-container protrude';
    }
    return 'circle-container animateColors'
  }

  const changeTextColor = () => {
    if (time <= 60) {
      return 'intense-timer';
    }
    return;
  }

  return (
    <>
      <div className='main-container'>
        <div className='title-container'>25 + 5 Clock</div>
        <div className={changeShadowColor()}>
          <div className='label-container'>
            <div className='break-container'>
              <div id='break-label'>Break</div>
              <div className='make-space'>
                <i id ='break-decrement' onClick={decrementBreak} className="fas fa-minus-circle"></i>
                <span id='break-length'>{breakLength}</span>
                <i id ='break-increment' onClick={incrementBreak} className="fas fa-plus-circle"></i>
              </div>
            </div>
            <div className='session-container'>
              <div id='session-label'>Session</div>
              <div className='make-space'>
                <i id='session-decrement' onClick={decrementSession} className="fas fa-minus-circle"></i>
                <span id='session-length'>{sessionLength}</span>
                <i id='session-increment' onClick={incrementSession} className="fas fa-plus-circle"></i>
              </div>
            </div>
          </div>
          <div className='timer-container'>
            <div className='clock-container'>
              <div id='timer-label'>{changeString()}</div>
              <div id='time-left' className={changeTextColor()}>{formatTime(time)}</div>
            </div>
            <div className='buttons-container'>
              <i id='start_stop' onClick={handleStartStop} className={!isRunning ? "fas fa-play" : "fas fa-pause"}></i>
              <i id='reset' onClick={handleReset} className="fas fa-redo"></i>
            </div>
          </div>
        </div>
        <audio id="beep" src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"></audio>
      </div>
    </>
  )
}

export default App
