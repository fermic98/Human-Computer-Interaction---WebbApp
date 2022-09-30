import { useParams } from "react-router-dom";
import "../css/custom.css";
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  Modal,
  Form,
  ListGroup,
  ModalBody,
  Spinner,
  DropdownButton,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import trainingCreationAPI from "../services/trainingCreationAPI";
import trainingExecutionAPI from "../services/trainingExeAPI";
import InputSpinner from "react-bootstrap-input-spinner";
import {
  deleteIcon3,
  deleteIcon,
  editIcon,
  backIcon,
  listIcon,
  warningIcon,
  series,
  repetitions,
  weight,
  restingTime,
} from "./Icons";
import { useState, useEffect, useRef, React } from "react";
import "../css/custom.css";
import "../App.css";
import { useHistory } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function TrainingEditor(props) {
  const { trainingId } = useParams();

  //indice per il movimento all'interno delle interfacce
  const [position, setPosition] = useState(0);

  //esercizi mostrati durante la selezione esercizio
  const [exercisesShown, setExercisesShown] = useState([]);

  //Array di esercizi disponibili (da popolare con una Api dentro UseEffect)
  const [availableExercises, setAvailableExercises] = useState([]);

  //Nome fornito per l'allenamento da creare
  const [trainingName, setTrainingName] = useState("Enter training name");

  //Array per raccogliere tutte le informazioni inerenti gli esercizi dell'allenamento ed ogni loro serie
  const [exerciseList, setExerciseList] = useState([]);

  //Array per conservare le informazioni sugli esercizi da eliminare
  const [oldExerciseList, setOldExerciseList] = useState([]);

  //Esercizio selezionato dall'utente durante la creazione dell'esercizio
  const [selectedExercise, setSelectedExercise] = useState("");

  //Cambio proprietà del form dopo la selzione di un esercizio
  const [validated, setValidated] = useState("");

  //Numero di serie selezionate dall'utente
  const [seriesNumber, setSeriesNumber] = useState(1);

  //numero, all'interno del workout, dell'esercizio che voglio editare (serve solo in caso di editing)
  const [exerciseNumber, setExerciseNumber] = useState(0);

  //Select ExerciseInfo
  const [exerciseInfo, setExerciseInfo] = useState(
    "Select an exercise to see the info"
  );

  const [isTrainingLoading, setIsTrainingLoading] = useState(true);

  //state to know when the user is edit and not creating an exercise
  const [isEditing, setIsEditing] = useState(false);

  const [isAdding, setIsAdding] = useState(false);

  //Error message
  const [errorMessage, setErrorMessage] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [goingForward, setGoingForward] = useState(false);

  const [goingBackward, setGoingBackward] = useState(false);

  const [showModalD, setShowModalD] = useState(false);

  const handleCloseModalD = () => {
    setShowModalD(false);
  };

  const history = useHistory();

  //Funzione per scorrere di 1 in avanti l'indice di movimento
  const goNext = (event) => {
    event.preventDefault();

    if (position === 0) {
      if (!trainingName || trainingName === "Enter training name") {
        toast.error("You must insert the training name!");

        return;
      } else props.setNavbarTitle(trainingName);
    }
    if (position > 1) {
      if (
        availableExercises.filter((e) => e.exerciseName === selectedExercise)
          .length === 0
      ) {
        toast.error("You must insert a valid exercise!");

        return;
      }
    }
    if (position === 2) {
      setPosition(1);
    } else {
      setPosition((old_position) => old_position + 1);
    }

    setGoingForward(true);
    setGoingBackward(false);
  };

  const goBack = (event) => {
    event.preventDefault();
    if (position === 0) {
      setShowModal(true);
    } else {
      setPosition((old_position) => old_position - 1);
    }
    setGoingForward(false);
    setGoingBackward(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const closeErrorMessage = () => {
    setErrorMessage("");
  };

  //Funzioni per gestire il funzionamento della search bar
  const onInputChange = (event) => {
    var array = availableExercises.filter((option) =>
      option.exerciseName
        .toLowerCase()
        .includes(event.target.value.toLowerCase())
    );
    var arrayOfNames = [];
    array.forEach((element) => {
      arrayOfNames.push(element.exerciseName);
    });
    if (event.target.value === "") {
      setExerciseInfo("Select an exercise to see the info");
    }
    setValidated(false);
    setSelectedExercise(event.target.valueS);
    setExercisesShown(arrayOfNames);
  };

  const onClickChange = (value) => {
    var array = availableExercises.filter((option) =>
      option.exerciseName.includes(value)
    );
    var arrayOfNames = [];
    array.forEach((element) => {
      arrayOfNames.push(element.exerciseName);
    });
    setValidated(true);
    setSelectedExercise(value);
    setExerciseInfo(array[0].description);
  };

  //funzioni per aggiornare la variabile di stato selezionando l'input spinner
  const handleCodePlus = () => {
    setSeriesNumber((old_value) => old_value + 1);
    //setErrorCode(false);
  };

  const handleCodeMinus = () => {
    setSeriesNumber((old_value) => old_value - 1);
    if (seriesNumber === 0) {
      //setErrorCode(true);
    }
  };

  //Funzione per la creazione del workout
  const updateTraining = async (event) => {
    event.preventDefault();
    trainingCreationAPI.deleteExerciseAndSeries(oldExerciseList).then(() => {
      trainingCreationAPI
        .createExercisesAndSeries(trainingId, exerciseList)
        .then()
        .catch((err) => {
          /* setErrorLoading('Error during the loading of the products') */
          console.error(err);
        });

      trainingCreationAPI.renameWorkout(trainingName, trainingId);
      toast.success("Workout successfully edited!");
      props.setNavbarTitle("GymMe5");
      history.push("/");
    });
  };

  const deleteT = async () => {
    trainingCreationAPI.deleteTraining(trainingId).then(() => {
      toast.success("Workout successfully deleted!");
      props.setStatus("Home");
      props.setNavbarTitle("GymMe5");
      history.push("/");
    });
  };

  //UseEffect per popolare il menu di selezione esercizio con tutti gil esercizi disponibili
  useEffect(() => {
    props.setStatus("Editor");
    trainingCreationAPI
      .getModelExercies()
      .then((exercises) => setAvailableExercises(exercises));

    trainingExecutionAPI
      .getExercisesByTrainingId(trainingId)
      .then((training) => {
        training.sort(function (a, b) {
          return a.Exercise_Number - b.Exercise_Number;
        });
        setExerciseList([]);
        training.forEach((exercise) => {
          trainingExecutionAPI
            .getSeriesByExerciseId(exercise.Exercise_Id)
            .then((series) => {
              var tmpExe = {
                exerciseId: exercise.Exercise_Id,
                exerciseNumber: exercise.Exercise_Number,
                exerciseName: exercise.Exercise_Model_Name,
                seriesNumber: exercise.Total_Series_Number,
              };
              tmpExe.series = [];
              /* tmpExe.series = series; */
              series.forEach((serie) => {
                tmpExe.series.push({
                  seriesId: serie.Series_Number,
                  repetitions: serie.Series_Repetitions,
                  weight: serie.Series_Weights,
                  restingTime: serie.Series_RestingTime,
                });
              });
              setExerciseList((old) => [...old, tmpExe]);
              setOldExerciseList((old) => [...old, tmpExe]);
            });
        });
        setIsTrainingLoading(false);
        setTrainingName(training[0].Training_Name);
        props.setNavbarTitle(training[0].Training_Name);
      });
  }, []);

  useEffect(() => {
    setValidated(false);
  }, [position]);

  return (
    <>
      {" "}
      <Col>
        <div>
          <Toaster />
        </div>
        <Modal centered show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              Do you really want to quit the Training Creator? You'll lost this
              training!
            </Modal.Title>
          </Modal.Header>
          <ModalBody>
            <Row className='justify-content-center'>
              <Button
                className='mx-auto g5-button'
                onClick={() => {
                  props.setNavbarTitle("GymMe5");
                  history.push("/");
                }}>
                Quit
              </Button>{" "}
              <Button
                className='mx-auto g5-button'
                onClick={() => handleCloseModal()}>
                Resume
              </Button>
            </Row>
          </ModalBody>
        </Modal>

        {position === 0 ? (
          <Container>
            {" "}
            {isTrainingLoading ? (
              <Row className='justify-content-center'>
                <Spinner animation='border' className='mt-4' variant='info' />
              </Row>
            ) : (
              <Form>
                <Form.Group>
                  <Button
                    className='g6-button mt6 btn-lg'
                    onClick={() => setShowModalD(true)}>
                    {deleteIcon3} <b>Delete workout</b>
                  </Button>
                </Form.Group>
                <Form.Group
                  className='mb-3 mtbasic5'
                  controlId='formBasicEmail'>
                  <Form.Label>
                    <h4>Edit workout name </h4>
                  </Form.Label>
                  <Form.Control
                    onChange={(ev) => setTrainingName(ev.target.value)}
                    type='text'
                    value={trainingName}
                  />
                </Form.Group>

                <Row className='bottomFixedCentered'>
                  <Col xs={4}>
                    <Button
                      size='lg'
                      className='backButton g5-button'
                      type='back'
                      onClick={(event) => goBack(event)}>
                      {backIcon}
                    </Button>
                  </Col>
                  <Col xs={8}>
                    <Button
                      disabled={trainingName === ""}
                      className='confirmButton g5-button'
                      size='lg'
                      onClick={(event) => goNext(event)}>
                      <b>NEXT</b>
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Container>
        ) : null}

        {position === 1 ? (
          <MySeriesCreator
            updateTraining={updateTraining}
            setExercisesShown={setExercisesShown}
            seriesNumber={seriesNumber}
            setSeriesNumber={setSeriesNumber}
            setExerciseInfo={setExerciseInfo}
            setPosition={setPosition}
            exerciseName={selectedExercise}
            setSelectedExercise={setSelectedExercise}
            setExerciseList={setExerciseList}
            availableExercises={availableExercises}
            exerciseNumber={exerciseNumber}
            setExerciseNumber={setExerciseNumber}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            isAdding={isAdding}
            setIsAdding={setIsAdding}
            trainingId={trainingId}
            goingBackward={goingBackward}
            goingForward={goingForward}
            exerciseList={exerciseList}></MySeriesCreator>
        ) : null}

        {position === 2 ? (
          <Container className='mtbasic'>
            <Row>
              <Col>
                <h4>
                  <b>Select your Exercise</b>
                </h4>

                <SearchbarDropdown
                  validated={validated}
                  exercisesShown={exercisesShown}
                  onInputChange={onInputChange}
                  onClickChange={onClickChange}
                  selectedExercise={selectedExercise}
                  position={position}
                />
              </Col>
            </Row>

            <Row className='mtbasic2'>
              <Col>
                <DropdownButton
                  variant='tertiary'
                  title='Exercise Info'
                  id='dropdown-menu-align-responsive-2'>
                  <Card style={{ border: 0 }}>
                    <Card.Body>{exerciseInfo}</Card.Body>
                  </Card>
                </DropdownButton>
              </Col>
            </Row>

            <Row className='mtbasic1'>
              <Col>
                <div class='mbbasic'> {series} Number of series </div>

                <InputSpinner
                  type={"int"}
                  precision={1}
                  max={100}
                  min={1}
                  step={1}
                  value={seriesNumber}
                  editable={false}
                  onIncrease={() => handleCodePlus()}
                  onDecrease={() => handleCodeMinus()}
                  variant={"secondary"}
                />
              </Col>
            </Row>

            <Row className='bottomFixedCentered'>
              <Col xs={4}>
                <Button
                  size='lg'
                  className='backButton g5-button'
                  type='back'
                  onClick={(event) => goBack(event)}>
                  {backIcon}
                </Button>
              </Col>
              <Col xs={8}>
                <Button
                  className='confirmButton g5-button'
                  size='lg'
                  onClick={(event) => goNext(event)}>
                  <b>CONFIRM</b>
                </Button>
              </Col>
            </Row>
          </Container>
        ) : null}

        <Modal centered show={showModalD} onHide={handleCloseModalD}>
          <Modal.Header closeButton>
            <Modal.Title>
              Do you really want to delete this Training?
            </Modal.Title>
          </Modal.Header>
          <ModalBody>
            <Row className='justify-content-center'>
              <Button
                className='mx-auto g5-button'
                onClick={() => {
                  deleteT();
                  handleCloseModalD();
                }}>
                Delete
              </Button>{" "}
              <Button
                className='mx-auto g5-button'
                onClick={() => handleCloseModalD()}>
                Don't delete
              </Button>
            </Row>
          </ModalBody>
        </Modal>
      </Col>
    </>
  );
}

const SearchbarDropdown = (props) => {
  const ulRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.addEventListener("click", (event) => {
      event.stopPropagation();
      ulRef.current.style.display = "flex";
      props.onInputChange(event);
    });
    ulRef.current.addEventListener("click", (event) => {
      ulRef.current.style.display = "none";
    });
  }, [props]);

  useEffect(() => {
    ulRef.current.style.display = "none";
  }, [props.position]);

  return (
    <div className='search-bar-dropdown'>
      <Form validated={props.validated}>
        <Form.Control
          size='lg'
          type='text'
          className='form-control'
          placeholder='type here...'
          value={props.selectedExercise}
          ref={inputRef}
          onChange={props.onInputChange}></Form.Control>
      </Form>

      <ul id='results' className='list-group' ref={ulRef}>
        {props.exercisesShown.map((option, index) => {
          return (
            <Button
              type='button'
              key={"button" + index}
              onClick={() => props.onClickChange(option)}
              className='list-group-item list-group-item-action positionRelative'>
              {option}
            </Button>
          );
        })}
      </ul>
    </div>
  );
};

function MySeriesCreator(props) {
  const [seriesPosition, setSeriesPosition] = useState(props.isEditing ? 1 : 0);
  const [series, setSeries] = useState([]);
  const [weightShown, setWeigthShown] = useState("");

  const goNext = () => {
    if (seriesPosition === props.seriesNumber + 1) {
      if (props.isEditing === true && props.isAdding === false) {
        var tmpExerciseList = props.exerciseList;

        tmpExerciseList.forEach((exe) => {
          if (exe.exerciseNumber === props.exerciseNumber) {
            exe.exerciseNumber = props.exerciseNumber;
            exe.exerciseName = props.exerciseName;
            exe.seriesNumber = props.seriesNumber;
            exe.series = series;
          }
        });

        props.setExerciseList(tmpExerciseList);
        props.setIsEditing(false);
      } else {
        props.setExerciseList([
          ...props.exerciseList,
          {
            exerciseNumber:
              props.exerciseList.length === 0
                ? 1
                : props.exerciseList.length + 1,
            exerciseName: props.exerciseName,
            seriesNumber: props.seriesNumber,
            series: series,
          },
        ]);
        props.setIsEditing(false);
        props.setIsAdding(false);
        props.setExerciseNumber(props.exerciseList.length + 1);
      }
      setSeriesPosition(0);
    } else if (seriesPosition === 0) {
      props.setIsEditing(true);
      props.setIsAdding(true);
      props.setPosition(2);
      props.setSelectedExercise("");
      props.setSeriesNumber(1);
      props.setExercisesShown([]);
      props.setExerciseInfo("Select an exercise to see the info");
      setSeriesPosition((old_position) => old_position + 1);
    } else if (seriesPosition !== props.seriesNumber) {
      series[seriesPosition].weight !== 0
        ? setWeigthShown(series[seriesPosition].weight)
        : setWeigthShown("");
      setSeriesPosition((old_position) => old_position + 1);
    } else {
      setSeriesPosition((old_position) => old_position + 1);
    }
  };

  const goBack = () => {
    /* if (seriesPosition === props.seriesNumber + 2) {
      var newArray = props.exerciseList;
      newArray.pop();
      props.setExerciseList(newArray);
      setSeriesPosition((old_position) => old_position - 1);
    } else  */
    if (seriesPosition === 1) {
      props.setPosition(2);
    } else {
      setSeriesPosition((old_position) => old_position - 1);
      setWeigthShown(series[seriesPosition - 2].weight);
    }
  };

  const editExercise = (name, number) => {
    var exerciseToModify = props.availableExercises.filter(
      (exercise) => exercise.exerciseName === name
    );
    props.setExerciseInfo(exerciseToModify[0].description);

    props.setExerciseNumber(number);
    props.setIsEditing(true);
    props.setPosition(2);
    props.setSelectedExercise(name);
    props.setSeriesNumber(1);
  };

  const deleteExercise = (number) => {
    var exerciseToModify = props.exerciseList.filter(
      (exercise) => exercise.exerciseNumber !== number
    );
    exerciseToModify.forEach((exe) => {
      if (exe.exerciseNumber > number) {
        exe.exerciseNumber = exe.exerciseNumber - 1;
      }
    });
    props.setExerciseList(exerciseToModify);
  };

  const modifySeries = (value, field, seriesId) => {
    var newSeries = [...series];
    switch (field) {
      case "repetitions":
        newSeries[seriesId - 1].repetitions = value;
        break;
      case "restingTime":
        newSeries[seriesId - 1].restingTime = value;
        break;
      case "weight":
        value === ""
          ? (newSeries[seriesId - 1].weight = 0)
          : (newSeries[seriesId - 1].weight = value);
        setWeigthShown(value);
        break;
      default:
        break;
    }
    setSeries(newSeries);
  };

  useEffect(() => {
    if (props.goingBackward === true) {
      setSeriesPosition(0);
    }
    var temporary_series = [];

    for (var i = 1; i < props.seriesNumber + 1; i++) {
      temporary_series.push({
        seriesId: i,
        repetitions: 1,
        weight: 0,
        restingTime: 0,
      });
    }
    setSeries(temporary_series);
  }, []);

  return (
    <>
      {seriesPosition === 0 ? (
        <>
          <Row className='mtbasic2'>
            <Col xs={6}>
              <h4 className='mt6'>Exercise list</h4>
            </Col>
            <Col xs={6}>
              <Button
                className='mtbasic2 mlbasic g5-button'
                onClick={(event) => goNext(event)}>
                <b>Add exercise</b>
              </Button>
            </Col>
          </Row>

          <ExerciseList
            exerciseNumber={props.exerciseNumber}
            exercises={props.exerciseList}
            editExercise={editExercise}
            deleteExercise={deleteExercise}
          />

          {props.exerciseList.length === 0 ? (
            <Row>
              <Col xs={2}></Col>
              <Card className='mtbasic align-items-center d-flex justify-content-center'>
                <Row className='mtbasic2'>{warningIcon}</Row>
                <Row className='mtbasic3'>
                  <Col></Col>
                  <Col xs={8}>
                    Add at least one exercise to your training...
                  </Col>
                  <Col> </Col>
                </Row>
                <Row className='mtbasic2'></Row>
              </Card>
            </Row>
          ) : null}
        </>
      ) : null}

      {series.map((el) =>
        seriesPosition === el.seriesId ? (
          <>
            <div class='stepper-wrapper'>
              {series.map((el, index) =>
                el.seriesId < seriesPosition ? (
                  <div
                    key={"step" + index}
                    class='stepper-item completed mtbasic2'>
                    <div class='step-counter'> {el.seriesId} </div>
                    <div class='step-name'></div>
                  </div>
                ) : seriesPosition === el.seriesId ? (
                  <div
                    key={"step" + index}
                    class='stepper-item completed active mtbasic2'>
                    <div class='step-counter'> {el.seriesId} </div>
                    <div class='step-name'></div>
                  </div>
                ) : el.seriesId > seriesPosition ? (
                  <div key={"step" + index} class='stepper-item mtbasic2'>
                    <div class='step-counter'> {el.seriesId} </div>
                    <div class='step-name'></div>
                  </div>
                ) : null
              )}
            </div>
            <Row key={el.seriesId}>
              <Col>
                <h4 class='mtbasic2'>Series number {el.seriesId}</h4>
                <Row className='mtbasic2'>
                  <Col>
                    <div class='mbbasic'>
                      {repetitions} Number of repetitions
                    </div>
                    <InputSpinner
                      type={"int"}
                      precision={1}
                      max={100}
                      min={1}
                      step={1}
                      value={series[el.seriesId - 1].repetitions}
                      editable={false}
                      onIncrease={() =>
                        modifySeries(
                          series[el.seriesId - 1].repetitions + 1,
                          "repetitions",
                          el.seriesId
                        )
                      }
                      onDecrease={() =>
                        modifySeries(
                          series[el.seriesId - 1].repetitions - 1,
                          "repetitions",
                          el.seriesId
                        )
                      }
                      variant={"secondary"}
                    />
                  </Col>
                </Row>

                <Row className='mtbasic2'>
                  <Col>
                    <div class='mbbasic'>{weight} Weight (kg)</div>
                    <Form.Control
                      type='number'
                      placeholder='0'
                      value={weightShown}
                      onChange={(ev) =>
                        modifySeries(ev.target.value, "weight", el.seriesId)
                      }
                    />
                  </Col>
                </Row>

                <Row className='mtbasic2'>
                  <Col>
                    <div class='mbbasic'>
                      {restingTime} Resting time (seconds)
                    </div>
                    <InputSpinner
                      type={"int"}
                      precision={1}
                      max={1000}
                      min={0}
                      step={15}
                      value={series[el.seriesId - 1].restingTime}
                      editable={false}
                      onIncrease={() =>
                        modifySeries(
                          series[el.seriesId - 1].restingTime + 15,
                          "restingTime",
                          el.seriesId
                        )
                      }
                      onDecrease={() =>
                        modifySeries(
                          series[el.seriesId - 1].restingTime - 15,
                          "restingTime",
                          el.seriesId
                        )
                      }
                      variant={"secondary"}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        ) : null
      )}

      {seriesPosition === props.seriesNumber + 1 ? (
        <Row className='mtbasic'>
          <Col>
            <SeriesResume series={series} exerciseName={props.exerciseName} />
          </Col>
        </Row>
      ) : null}

      <Row className='bottomFixedCentered'>
        {seriesPosition !== 0 ? (
          <Col xs={4}>
            <Button
              size='lg'
              className='backButton g5-button'
              type='back'
              onClick={(event) => goBack(event)}>
              {backIcon}
            </Button>
          </Col>
        ) : null}

        {seriesPosition === 0 ? (
          <>
            <Col>
              <div style={{ width: "90%" }}>
                <button
                  type='button'
                  disabled={props.exerciseList.length === 0}
                  class={
                    props.exerciseList.length !== 0
                      ? "btn-lg btn-block btn-default bottomFixedLeft g5-button"
                      : "btn-lg btn-block btn-default bottomFixedLeft g5-button-disabled"
                  }
                  style={{ color: "white" }}
                  onClick={(event) => props.updateTraining(event)}>
                  <b>UPDATE WORKOUT</b>
                </button>
              </div>
            </Col>
          </>
        ) : (
          <Col xs={8}>
            <Button
              className='confirmButton g5-button'
              size='lg'
              onClick={(event) => goNext(event)}>
              <b>CONFIRM</b>
            </Button>
          </Col>
        )}
      </Row>
    </>
  );
}

function SeriesResume(props) {
  const [seriesIndex, setSeriesIndex] = useState(0);

  const decreaseIndex = () => {
    setSeriesIndex((old) => old - 1);
  };

  const increaseIndex = () => {
    setSeriesIndex((old) => old + 1);
  };
  return (
    <>
      <h4>Exercise recap</h4>
      <ListGroup className='mtbasic2 ombra'>
        <ListGroup.Item>
          <h5>{props.exerciseName}</h5>
        </ListGroup.Item>
        <ListGroup.Item>
          <Container>
            <Row>
              <Col className='pl0' xs={1}>
                {" "}
                {series}
              </Col>
              <Col xs={2} className='pl5'>
                Series
              </Col>
              <Col></Col>
              <Col xs={5} className='provamargin2'>
                <button
                  disabled={seriesIndex === 0}
                  className='round'
                  size='sm'
                  onClick={decreaseIndex}>
                  {" "}
                  {"<"}
                </button>{" "}
                <b>{props.series[seriesIndex].seriesId} </b>
                <button
                  disabled={seriesIndex === props.series.length - 1}
                  className='round'
                  size='sm'
                  onClick={increaseIndex}>
                  {">"}
                </button>{" "}
              </Col>
            </Row>
          </Container>
        </ListGroup.Item>
        <ListGroup.Item>
          {repetitions} <span className='pl5'>Repetitions</span>
          <b className='value-position'>
            {props.series[seriesIndex].repetitions}
          </b>
        </ListGroup.Item>
        <ListGroup.Item>
          {weight} <span className='pl5'>Weights</span>
          <b className='value-position'>
            {props.series[seriesIndex].weight} kg
          </b>
        </ListGroup.Item>
        <ListGroup.Item>
          {restingTime} <span className='pl5'> Resting time </span>{" "}
          <b className='value-position'>
            {props.series[seriesIndex].restingTime}''
          </b>
        </ListGroup.Item>
      </ListGroup>
    </>
  );
}

function ExerciseList(props) {
  const [exerciseHighlight, setExerciseHighlight] = useState(true);
  const [showModalDelete, setShowModalDelete] = useState(false);

  const handleCloseModalDelete = () => {
    setShowModalDelete(false);
  };

  useEffect(() => {
    setInterval(() => {
      setExerciseHighlight(false);
    }, 750);
  }, []);

  return (
    <>
      {props.exercises.map((exercise, index) => (
        <>
          <Container>
            <Row key={"exercise_creation" + index}>
              {exerciseHighlight &&
              exercise.exerciseNumber === props.exerciseNumber ? (
                <Card
                  style={{ background: "rgba(157, 178, 253)" }}
                  className='im-trainingcard highlightedCard im-animate mt5 ombra'>
                  <Row>
                    <Col xs={9}>
                      {" "}
                      <td>{exercise.exerciseName}</td>
                    </Col>
                    <Col xs={1}>
                      <td
                        onClick={() =>
                          props.editExercise(
                            exercise.exerciseName,
                            exercise.exerciseNumber
                          )
                        }>
                        {" "}
                        {editIcon}{" "}
                      </td>
                    </Col>
                    <Col xs={1}>
                      {" "}
                      <td
                        onClick={() =>
                          props.deleteExercise(exercise.exerciseNumber)
                        }>
                        {deleteIcon3}
                      </td>
                    </Col>
                  </Row>
                </Card>
              ) : (
                <Card className='im-trainingcard im-animate mt5 ombra'>
                  <Row>
                    <Col xs={9}>
                      {" "}
                      <td>{exercise.exerciseName}</td>
                    </Col>
                    <Col xs={1}>
                      <td
                        onClick={() =>
                          props.editExercise(
                            exercise.exerciseName,
                            exercise.exerciseNumber
                          )
                        }>
                        {" "}
                        {editIcon}{" "}
                      </td>
                    </Col>
                    <Col xs={1}>
                      {" "}
                      <td onClick={() => setShowModalDelete(true)}>
                        {deleteIcon3}
                      </td>
                    </Col>
                  </Row>
                </Card>
              )}
            </Row>

            <Modal
              centered
              show={showModalDelete}
              onHide={handleCloseModalDelete}>
              <Modal.Header closeButton>
                <Modal.Title>
                  Do you really want to delete this exercise?
                </Modal.Title>
              </Modal.Header>
              <ModalBody>
                <Row className='justify-content-center'>
                  <Button
                    className='mx-auto g5-button'
                    onClick={() => {
                      props.deleteExercise(exercise.exerciseNumber);
                      handleCloseModalDelete();
                    }}>
                    Delete
                  </Button>{" "}
                  <Button
                    className='mx-auto g5-button'
                    onClick={() => handleCloseModalDelete()}>
                    Don't delete
                  </Button>
                </Row>
              </ModalBody>
            </Modal>
          </Container>
        </>
      ))}
    </>
  );
}

export default TrainingEditor;
