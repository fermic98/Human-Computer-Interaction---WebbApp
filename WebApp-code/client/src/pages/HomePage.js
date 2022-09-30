import { useState } from "react";
import { TrainingList } from "../ui-components/TrainingList";
import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import trainingExeAPI from "../services/trainingExeAPI";

function HomePage(props) {
  // con la useEffect prendiamo dal db tutti i trainings dell'utente props.user.id
  const [trainings, setTrainings] = useState([]);
  const [isTrainingsListLoading, setIsTrainingsListLoadings] = useState(true);

  useEffect(() => {
    props.setStatus("Home");

    // scarichiamo i trainings
    let getTrainings = trainingExeAPI.getTrainings();

    const loadTrainings = () => {
      getTrainings
        .then((t) => {
          setTrainings(t);
          setIsTrainingsListLoadings(false);
        })
        .catch((e) => console.log(e));
    };

    loadTrainings();
  }, []);

  return (
    <>
      {isTrainingsListLoading ? (
        <Spinner animation='border' variant='info' className='mt-2' />
      ) : (
        <TrainingList
          trainings={trainings}
          setNavbarTitle={props.setNavbarTitle}
          setStatus={props.setStatus}
          status={props.status}

        />
      )}
    </>
  );
}

export { HomePage };
