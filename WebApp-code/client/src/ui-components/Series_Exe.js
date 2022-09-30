import { useEffect, useState } from "react";
import {
  Button,
  Spinner,
  Container,
  Col,
  Row,
  Modal,
  Image,
} from "react-bootstrap";
import {
  backIcon,
  videoIcon,
  infoIcon,
  playIcon,
  timerIcon,
  repetitions,
  restingTime,
  weight,
} from "./Icons";
import { Timer } from "./Timer";
import "../css/custom.css";
import trainingExeAPI from "../services/trainingExeAPI";
import toast, { Toaster } from "react-hot-toast";

function Series_Exe(props) {
  const [series, setSeries] = useState([]);
  const [actualSeriesNumber, setActualSeriesNumber] = useState(1);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const [showCModal, setShowCModal] = useState(false);
  const [showSModal, setShowSModal] = useState(false);

  const [isSeriesLoading, setIsSeriesLoading] = useState(true);
  const [isRestTimerOn, setIsRestTimerOn] = useState(false);
  const [isStartOn, setIsStartOn] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    // Scarico le serie
    let getSeries = trainingExeAPI.getSeriesByExerciseId(
      props.exercise.Exercise_Id
    );

    const loadSeries = () => {
      getSeries
        .then((t) => {
          let num = t
            .sort(function (a, b) {
              return a.Series_Number - b.Series_Number;
            })
            .find((e) => e.Series_Completed == 0);

          setActualSeriesNumber(num.Series_Number);
          setSeries(
            t.sort(function (a, b) {
              return a.Series_Number - b.Series_Number;
            })
          );
          setIsSeriesLoading(false);
        })
        .catch((e) => console.log(e));
    };

    loadSeries();
  }, [actualSeriesNumber]);

  const seriesCompleted = () => {
    let completed = 0;
    series.map((s) => {
      if (s.Series_Completed == 1) completed++;
    });

    return completed;
  };

  const handleCloseInfoModal = () => setShowInfoModal(false);
  const handleCloseSModal = () => setShowSModal(false);

  const handleShowInfoModal = () => setShowInfoModal(true);
  const handleCloseVideoModal = () => setShowVideoModal(false);
  const handleShowVideoModal = () => setShowVideoModal(true);
  const handleShowSModal = () => {
    setShowSModal(true);
    setTimeout(() => setShowSModal(false), 2500);
  };
  const handleCloseCModal = () => {
    setShowCModal(false);
    props.setSelectedExercise(!props.exercise);
  };
  const handleShowCModal = () => {
    // setShowCModal(true);
    props.setSelectedExercise(!props.exercise);
  };

  const handleStartRestTime = () => {
    setIsRestTimerOn(true);
    setSoundOn(false);
  };

  const handleEndRestTime = (value) => {
    //faccio partire il suono
    //spengo il timer
    setIsRestTimerOn(false);
    setIsStartOn(false);

    //se value è true il rest time è stato completato, quindi setto la serie
    //completata e incremento il numero di serie attuale

    if (value) {
      let tot_series = 0;

      series.map((s) => {
        if (s.Series_Number > tot_series) tot_series = s.Series_Number;
      });

      // update che la serie è Completed

      let upSeries = trainingExeAPI.updateCompletedSeries(
        props.exercise.Exercise_Id,
        actualSeriesNumber,
        1
      );

      const updateSeries = () => {
        upSeries.then((t) => {}).catch((e) => console.log(e));
      };

      updateSeries();

      // se non ho ancora completato le serie incremento e continuo
      if (actualSeriesNumber < tot_series)
        setActualSeriesNumber(actualSeriesNumber + 1);

      // se ho completato le serie segno l'esercizio come completed e torno al training

      if (actualSeriesNumber == tot_series) {
        let updateEx = trainingExeAPI.updateCompletedExercise(
          props.exercise.Exercise_Id,
          1
        );

        const updateExercise = () => {
          updateEx
            .then((t) => {
              handleShowCModal();
            })
            .catch((e) => console.log(e));
        };

        updateExercise();

        //        props.setSelectedExercise(!props.exercise);
      }
    }
  };

  return (
    <Container>
      <div>
        <Toaster />
      </div>

      {soundOn ? (
        <audio className='hidden' hidden controls autoPlay>
          <source src='start.mp3' />
        </audio>
      ) : null}

      {isRestTimerOn ? (
        <>
          <Timer
            className='justify-content-center mt-4'
            serie={series.filter((s) => s.Series_Number == actualSeriesNumber)}
            handleEndRestTime={handleEndRestTime}
          />
        </>
      ) : (
        <>
          {isSeriesLoading ? (
            <Row className='justify-content-center'>
              <Spinner animation='border' className='mt-4' variant='info' />
            </Row>
          ) : (
            <>
              {" "}
              <Col>
                <Row className=' mt-4'>
                  <Single_Serie_Exe
                    serie={series.filter(
                      (s) => s.Series_Number == actualSeriesNumber
                    )}
                    exercise={props.exercise}
                    completed={seriesCompleted}
                  />
                </Row>

                {/* Execution info e video */}
                <Row className='justify-content-center mt-10'>
                  <Button
                    className='mr-4 g7-button'
                    onClick={() => handleShowInfoModal()}>
                    {infoIcon} <b>Execution Info</b>{" "}
                  </Button>{" "}
                  <Button
                    className='mx-auto g7-button'
                    onClick={() => handleShowVideoModal()}>
                    {" "}
                    {videoIcon} &nbsp; <b>Video</b>
                  </Button>
                </Row>
                {isStartOn ? (
                  <>
                    {/* REST TIMER */}
                    <Row className='mt-special'>
                      <Button
                        className='timer-button ombra'
                        size='lg'
                        onClick={() => handleStartRestTime()}>
                        REST<br></br> TIMER <br></br>
                        {timerIcon}
                      </Button>
                    </Row>{" "}
                  </>
                ) : (
                  <Row className='mt-special'>
                    <Button
                      className='timer-button ombra'
                      size='lg'
                      onClick={() => {
                        handleShowSModal();
                        setIsStartOn(true);

                        setSoundOn(true);
                      }}>
                      START
                      {playIcon}
                    </Button>
                  </Row>
                )}
              </Col>
              {/* Back button*/}
              <Row className='bottomFixedCentered2'>
                <Button
                  size='lg'
                  className='backbutton g5-button'
                  type='back'
                  onClick={() => {
                    props.setSelectedExercise(!props.exercise);
                  }}>
                  {" "}
                  {backIcon}{" "}
                </Button>
              </Row>
              <Modal
                centered
                show={showInfoModal}
                onHide={handleCloseInfoModal}>
                <Modal.Header closeButton>
                  <Modal.Title>
                    {infoIcon} Execution Info of{" "}
                    {props.exercise.Exercise_Model_Name}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {props.exercise.Exercise_Model_Description}
                </Modal.Body>
              </Modal>
              <Modal show={showVideoModal} onHide={handleCloseVideoModal}>
                <Modal.Header closeButton>
                  <Modal.Title>
                    {videoIcon} {props.exercise.Exercise_Model_Name}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {" "}
                  <video width='320' height='240' controls autoplay>
                    {" "}
                    <source
                      src={props.exercise.Exercise_Model_VideoPath}
                      type='video/mp4'
                    />
                  </video>
                </Modal.Body>
              </Modal>
              <Modal centered show={showCModal} onHide={handleCloseCModal}>
                <Modal.Header closeButton>
                  <Modal.Title>
                    {props.exercise.Exercise_Model_Name} COMPLETED!
                  </Modal.Title>
                </Modal.Header>
              </Modal>
              <Modal centered show={showSModal} onHide={handleCloseSModal}>
                <Modal.Header>
                  <Modal.Header />
                  <Modal.Body>
                    {" "}
                    <h4 className='mt6'> Start to exercise! 💪🏻 </h4>
                    <Image
                      className='rounded'
                      src='workout.gif'
                      width={230}
                      height={230}
                    />
                  </Modal.Body>
                </Modal.Header>
              </Modal>
            </>
          )}{" "}
        </>
      )}
    </Container>
  );
}

function Single_Serie_Exe(props) {
  return (
    <>
      {props.serie[0] ? (
        <>
          <Row>
            <Col xs={9}>
              <h4>Current Series</h4>
            </Col>
            <Col xs={3}>
              <h4>
                <b>
                  {props.completed() + 1}/{props.exercise.Total_Series_Number}
                </b>
              </h4>
            </Col>
          </Row>
          <Row className='series-info-border ombra mx-auto'>
            <Col>
              <table>
                <tr>
                  <td className='pr-4'> {repetitions} Repetitions </td>{" "}
                  <td className='pr-4'>
                    <b>{props.serie[0].Series_Repetitions}</b>
                  </td>
                </tr>
                {props.serie[0].Series_Weights ? (
                  <tr>
                    {" "}
                    <td className='pr-4 pt-4'>{weight} Weight</td>{" "}
                    <td className='pr-4 pt-4'>
                      <b>{props.serie[0].Series_Weights} Kg</b>
                    </td>{" "}
                  </tr>
                ) : null}
                <tr>
                  <td className='pr-4 pt-4'> {restingTime} Resting Time</td>{" "}
                  <td className='pr-4 pt-4'>
                    <b>{props.serie[0].Series_RestingTime}''</b>
                  </td>
                </tr>
              </table>
            </Col>
          </Row>
        </>
      ) : null}{" "}
    </>
  );
}

export { Series_Exe };
