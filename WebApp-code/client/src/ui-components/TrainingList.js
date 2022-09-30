import { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Training } from "./Training";
import { playIcon, editIcon, backIcon } from "./Icons";
import { useHistory } from "react-router-dom";
import trainingExeAPI from "../services/trainingExeAPI";
import { NotificationsProvider } from "./ToastNotification";
import "../css/custom.css";

function TrainingList(props) {
  const [selectedWorkOut, setSelectedWorkOut] = useState(null);
  const history = useHistory();

  const goToWorkout = async (t) => {
    //Nel componente workout scaricheremo tutti gli esercizi del workout id
    let updateCompletedTrainings = trainingExeAPI.updateCompletedTrainings(
      t.Training_Id,
      0
    );

    updateCompletedTrainings
      .then(() => {
        setSelectedWorkOut(t);
        props.setStatus("WorkingOut");
      })
      .catch((e) => console.log(e));
    props.setNavbarTitle(t.Training_Name);
  };

  return (
    <>
      <Container>
        {!selectedWorkOut || props.status !== "WorkingOut" ? (
          <Col className='block-example'>
            <Row className='justify-content-center mt-4'>
              <h4>Workout List</h4>{" "}
            </Row>
            {props.trainings.map((t) => (
              <>
                <Row key={t.Training_Id} className='mt-4'>
                  <Card className='im-trainingcard im-animate custom-button-bg ombra'>
                    <Row>
                      <Col onClick={() => goToWorkout(t)} xs={8}>
                        {" "}
                        <td>
                          {" "}
                          <b>{t.Training_Name}</b>
                        </td>
                      </Col>
                      <Col onClick={() => goToWorkout(t)} xs={2}>
                        <td> {playIcon} </td>
                      </Col>
                      <Col xs={2}>
                        {" "}
                        <td
                          onClick={() =>
                            history.push("/training-editor/" + t.Training_Id)
                          }>
                          {editIcon}
                        </td>
                      </Col>
                    </Row>
                  </Card>
                </Row>
              </>
            ))}
            <Row className='justify-content-center mt-50'>
              <h4></h4>
            </Row>
            <Row className='bottomFixedCenteredB  sfumato-button'>
              <Col></Col>
              <Col></Col>
              <Col>
                {" "}
                <Button
                  className='create-button g5-button'
                  onClick={() => {
                    props.setNavbarTitle("Workout Creator");
                    history.push("/training-creator");
                  }}>
                  {" "}
                  <h1> + </h1>
                </Button>
              </Col>
              <Col></Col>
              <Col></Col>
            </Row>
          </Col>
        ) : (
          <>
            <Training
              workOut={selectedWorkOut}
              setSelectedWorkOut={setSelectedWorkOut}
              setNavbarTitle={props.setNavbarTitle}
              setStatus={props.setStatus}
            />
          </>
        )}
      </Container>
    </>
  );
}

export { TrainingList };
