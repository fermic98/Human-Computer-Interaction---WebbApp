import { useState } from "react";
import { useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Modal,
  Button,
  Spinner,
  ModalBody,
} from "react-bootstrap";
import "../css/custom.css";
import trainingExeAPI from "../services/trainingExeAPI";
import { Series_Exe } from "./Series_Exe";
import { backIcon, completedIcon, homeIcon } from "./Icons";

function Training(props) {
  const [exercises, setExercises] = useState([]);
  const [isExercisesListLoading, setIsExerciseListLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showCModal, setShowCModal] = useState(false);
  const [isTrainingCompleted, setIsTrainingCompleted] = useState(false);

  useEffect(() => {
    if (!selectedExercise) props.setNavbarTitle(props.workOut.Training_Name);
    // scarico gli es del training
    let getExs = trainingExeAPI.getExercisesByTrainingId(
      props.workOut.Training_Id
    );

    const loadExs = () => {
      getExs
        .then((t) => {
          setExercises(
            t.sort(function (a, b) {
              return a.Exercise_Number - b.Exercise_Number;
            })
          );
          setIsExerciseListLoading(false);
        })
        .catch((e) => console.log(e));
    };

    setInterval(loadExs(), 1000);
  }, [selectedExercise]);

  const exCompleted = () => {
    let completed = 0;
    exercises.map((e) => {
      if (e.Exercise_Completed == 1) completed++;
    });
    return (
      <>
        {completed}/{exercises.length}
      </>
    );
  };

  const handleCloseCModal = () => {
    setShowCModal(false);
  };
  const handleShowCModal = () => setShowCModal(true);

  const startExercise = (e) => {
    //setto l'esercizio in esecuzione (stato 2)

    let upEx = trainingExeAPI.updateCompletedExercise(e.Exercise_Id, 2);

    const updateExercise = () => {
      upEx
        .then((t) => {
          console.log(t);
        })
        .catch((e) => console.log(e));
    };

    updateExercise();

    setSelectedExercise(e);

    props.setNavbarTitle(e.Exercise_Model_Name);
  };

  const handleEndTraining = () => {
    let updateCompletedTrainings = trainingExeAPI.updateCompletedTrainings(
      props.workOut.Training_Id,
      1
    );

    updateCompletedTrainings.then(() => {}).catch((e) => console.log(e));
  };

  return (
    <>
      {selectedExercise ? (
        <Series_Exe
          exercise={selectedExercise}
          setSelectedExercise={setSelectedExercise}
        />
      ) : (
        <>
          {isExercisesListLoading ? (
            <Row className="justify-content-center">
              <Spinner animation='border' className='mt-4' variant='info' />
              </Row>
          ) : (
            <>
              <Container className='mt-4'>
                <Row>
                  <h4>Exercises</h4>
                </Row>
                <Row className='riquadro mt-4 ombra'>
                  {exercises.map((e) => (
                    <>
                      {" "}
                      <Col key={e.Exercise_Id} xs={6} className='mt6'>
                        <h5> {e.Exercise_Model_Name} </h5>{" "}
                      </Col>{" "}
                      <Col key={e.Exercise_Id} xs={1} className='mt6'></Col>
                      <Col key={e.Exercise_Id} xs={4} className='mt6'>
                        {" "}
                        {e.Exercise_Completed === 1 ? (
                          <span className="ml12">{completedIcon}</span>
                        ) : null}
                        {e.Exercise_Completed === 0 ? (
                          <>
                            <Button
                              className='g5-button'
                              onClick={() => {
                                startExercise(e);
                              }}>
                              {" "}
                              <b>Start</b>{" "}
                            </Button>
                          </>
                        ) : null}
                        {e.Exercise_Completed === 2 ? (
                          <>
                            <Button
                              className='g5-button'
                              onClick={() => {
                                startExercise(e);
                              }}>
                              {" "}
                              <b>Resume</b>{" "}
                            </Button>
                          </>
                        ) : null}
                      </Col>
                    </>
                  ))}
                </Row>
              </Container>
              <Row className='mt-4 bottomFixedCentered'>
                <Col xs={4}>
                  {exercises.filter(
                    (e) =>
                      e.Exercise_Completed == 0 || e.Exercise_Completed == 2
                  ) != false ? (
                    <Button
                      size='lg'
                      className='backButton g5-button'
                      type='back'
                      onClick={() => {
                        handleShowCModal();
                      }}>
                      {" "}
                      {backIcon}{" "}
                    </Button>
                  ) : (
                    <>
                      <div className='bottomFixedCentered2 pl-20'>
                        <Button
                          size='lg'
                          className='g5-button'
                          onClick={() => {
                            handleEndTraining();
                            setIsTrainingCompleted(true);
                          }}>
                          END
                        </Button>{" "}
                      </div>
                    </>
                  )}
                </Col>
                <Col xs={1}></Col>
                <Col xs={6}>
                  {" "}
                  <h4>
                    Completed &nbsp;
                    <b>{exCompleted()} </b>
                  </h4>
                </Col>
                <Col xs={1}></Col>
              </Row>

              <Modal centered show={showCModal} onHide={handleCloseCModal}>
                <Modal.Header closeButton>
                  <Modal.Title>
                    Do you really want to quit this training? You'll lost this
                    training session data!
                  </Modal.Title>
                </Modal.Header>
                <ModalBody>
                  <Row className='justify-content-center'>
                    <Button
                      className='mx-auto g5-button'
                      onClick={() => {
                        handleEndTraining();
                        props.setStatus("Home");

                        props.setSelectedWorkOut(false);
                        props.setNavbarTitle("GymMe5");
                      }}>
                      <b>Quit</b>
                    </Button>{" "}
                    <Button
                      className='mx-auto g5-button'
                      onClick={() => handleCloseCModal()}>
                      <b>Resume</b>
                    </Button>
                  </Row>
                </ModalBody>
              </Modal>

              <Modal
                centered
                show={isTrainingCompleted}
                onHide={() => setIsTrainingCompleted(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Workout completed 💪🏻</Modal.Title>
                </Modal.Header>
                <ModalBody>
                  <Row>
                    <Col>
                    <h6>Congratulation, you did a great job!</h6>
                    </Col>
                  </Row>
                  <Row className="mt6">
                    <Col><Button
                      size='lg'
                      className='g5-button'
                      onClick={() => {
                        props.setSelectedWorkOut(false);
                        props.setStatus("Home");

                        props.setNavbarTitle("GymMe5");
                      }}>
                      {homeIcon}
                    </Button>{" "}</Col>
                  </Row>
                </ModalBody>
              </Modal>
            </>
          )}{" "}
        </>
      )}
    </>
  );
}

export { Training };
