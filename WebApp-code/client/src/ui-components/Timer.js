import { useState, useRef, renderer, useEffect } from "react";

import { Button, Container, Row, Col } from "react-bootstrap";
import Countdown from "react-countdown";
import { playIcon, pauseIcon, backIcon, restartTimer } from "./Icons";

function Timer(props) {
  const [seconds, setSeconds] = useState(props.serie[0].Series_RestingTime);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  const [isRunning, setIsRunning] = useState(true);

  const clockRef = useRef();
  const handleStart = () => {
    setIsRunning(true);
    console.log(isRunning)
    clockRef.current.start();
  }
  const handlePause = () => {
    setIsRunning(false);
    console.log(isRunning)
    clockRef.current.pause();
  }
  const renderer = ({ hours, minutes, seconds, completed }) => {
    return <span class='timer-seconds'>{minutes * 60 + seconds}’’</span>;
  };

  useEffect(() => {
    const checkClockStatus = () => {
      if (clockRef.current) {
        if (clockRef.current.state.status === "COMPLETED") {
          setSoundOn(true);
          setIsCompleted(true);
        }
      }
    };

    setInterval(checkClockStatus, 1000);
  }, []);

  return (
    <>
      {soundOn ? (
        <audio class='hidden' hidden controls autoPlay>
          <source src='timer.mp3' />
        </audio>
      ) : null}
      <Row className='mx-auto'>
        <Col className='mx-auto'>
          <Row className='mt-4'>
            <Col className="pl0"><h4>Rest timer - series {props.serie[0].Series_Number}</h4>{" "}</Col>
            
          </Row>
          <Row className='mt-4'>
            
          </Row>
          <Row className='justify-content-center mt-4'>
            <Button className='countdown-button ombra mt-4 ' size='lg'>
              <Countdown
                date={Date.now() + seconds * 1000}
                renderer={renderer}
                ref={clockRef}
              />{" "}

              <Row className='justify-content-center'>
              <ButtonPlay handlePause={handlePause} handleStart={handleStart}></ButtonPlay>
              </Row>{" "}
              
            </Button>
          </Row>
          {isCompleted ? (
            <div class='bottomFixedCentered4 wid80'>
              <Button
                size='lg'
                className='g5-button wid80'
                onClick={() => {
                  props.handleEndRestTime(true);
                }}>
                {" "}
                <b>Continue</b>
              </Button>
            </div>
          ) : (
            <>
              <Row className='bottomFixedCentered2'>
                <Col>
                  <Button
                    size='lg'
                    className='backbutton g5-button'
                    type='back'
                    onClick={() => {
                      props.handleEndRestTime(false);
                    }}>
                    {" "}
                    {backIcon}{" "}
                  </Button>
                </Col>
                <Col xs={2}>
                  <Button
                    size='lg'
                    className='g5-button'
                    onClick={() => {
                      props.handleEndRestTime(true);
                    }}>
                    {" "}
                    <b>SKIP</b>{" "}
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Col>
      </Row>
    </>
  );
}

const ButtonPlay = (props) => {
  const [isRunning, setIsRunning] = useState(true);
  return (
    <>
      {isRunning ?
        <Button
          variant='contained'
          color='primary'
          type='submit'
          onClick={() => {
            setIsRunning(false);
            props.handlePause()}
          }>
          {restartTimer}
        </Button>
        :
        <Button
          variant='contained'
          color='primary'
          type='submit'
          onClick={() => {
            setIsRunning(true);
            props.handleStart()}
            }>
          {playIcon}{" "}
        </Button>
      }
    </>
  )

}

export { Timer };
