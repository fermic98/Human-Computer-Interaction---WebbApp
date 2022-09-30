
import { React, useState, useEffect } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  useParams,
} from "react-router-dom";
import MyNavbar from "./ui-components/MyNavbar";

import "bootstrap/dist/css/bootstrap.min.css";
import API from "./services/API";
import { LoginForm } from "./pages/Login";
import { HomePage } from "./pages/HomePage";
import { MyTrainingCreator } from "./ui-components/TrainingCreator";
import TrainingEditor from "./ui-components/TrainingEditor";

const App = () => {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [navbarTitle, setNavbarTitle] = useState("GymMe5");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    //per non perdere utente loggato se aggiorno pagina, da qui viene l'errore della GET 401(unhautorized)
    const checkAuth = async () => {
      const userInfo = API.getUserInfo();
      userInfo
        .then((u) => {
          setLoggedIn(true);
          console.log(u);
          setUser(u);
        })
        .catch((e) => console.log(e));
    };
    checkAuth().catch((err) => console.log(err));
  }, []);

  const doLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setUser(user);
      setStatus("Home");
    } catch (err) {
      toast.error(err);
      setMessage({ msg: err, type: "error" });
    }
  };

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(null);
    setMessage("");
    setNavbarTitle("GymMe5");
    setStatus(null);
  };

  const closeMessage = () => {
    setMessage("");
  };

  return (
    <div class='screen'>
      <Router>
        <MyNavbar
          navbarTitle={navbarTitle}
          doLogOut={doLogOut}
          loggedIn={loggedIn}
          closeMessage={closeMessage}
          setNavbarTitle={setNavbarTitle}
          status={status}
          setStatus={setStatus}
        />
        <div>
          <Toaster />
        </div>

        <Switch>
          <Route
            exact
            path='/login'
            render={() => (
              <Container fluid className='justify-content-center d-flex'>
                <Row className='vh-100vh mt-10'>
                  {loggedIn && user !== null ? (
                    <>
                      {" "}
                      <Redirect to='/' />{" "}
                    </>
                  ) : (
                    <LoginForm
                      closeMessage={closeMessage}
                      message={message}
                      login={doLogin}
                    />
                  )}
                </Row>
              </Container>
            )}
          />

          <Route
            exact
            path='/'
            render={() => (
              <>
                {loggedIn && user !== null ? (
                  <>
                    {" "}
                    <Container
                      fluid
                      className='justify-content-center d-flex w-100'>
                      <HomePage
                        user={user}
                        setNavbarTitle={setNavbarTitle}
                        status={status}
                        setStatus={setStatus}
                      />
                    </Container>
                  </>
                ) : (
                  <Redirect to='/login' />
                )}
              </>
            )}
          />

          <Route
            exact
            path={"/training-editor/:trainingId"}
            render={() => (
              <>
                {loggedIn && user !== null ? (
                  <>
                    {" "}
                    <Container
                      fluid
                      className='justify-content-center d-flex w-100'>
                      <TrainingEditor
                        user={user}
                        trainingId={useParams.trainingId}
                        setNavbarTitle={setNavbarTitle}
                        setStatus={setStatus}
                      />
                    </Container>
                  </>
                ) : (
                  <Redirect to='/login' />
                )}
              </>
            )}
          />

          <Route
            exact
            path='/training-creator'
            render={() => (
              <>
                {loggedIn && user !== null ? (
                  <>
                    {" "}
                    <Container
                      fluid
                      className='justify-content-center d-flex w-100'>
                      <MyTrainingCreator
                        setNavbarTitle={setNavbarTitle}
                        setStatus={setStatus}></MyTrainingCreator>
                    </Container>
                  </>
                ) : (
                  <Redirect to='/login' />
                )}
              </>
            )}
          />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
