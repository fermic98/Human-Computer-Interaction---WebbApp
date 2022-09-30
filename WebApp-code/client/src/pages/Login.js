import { useState } from "react";
import { Form, Button, Row, Col, Container, Alert } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";

function LoginForm(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };

    // SOME VALIDATION, ADD MORE!!!
    let valid = true;
    if (username === "" || password === "") {
      //nessun vincolo sulla password
      valid = false;
      toast.error("Insert email and password to access.");
    }

    if (valid) {
      setErrorMessage("");
      props.login(credentials);
    }
  };

  const closeErrorMessage = () => {
    setErrorMessage("");
  };

  return (
    <Container>
      <div>
        <Toaster />
      </div>
      <Form className='below  cont'>
        <Row>
          <Col sm={8} className='mx-auto'>
            <Row className=' mx-auto justify-content-center'>
              <h1 className='navbar-link'> gymMe5 </h1>
            </Row>
            <Row className=' mx-auto justify-content-center'>
              <h2 className='navbar-link'> Sign in </h2>
            </Row>
            <Form.Group controlId='username' className='mt-4'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='text'
                value={username}
                onChange={(ev) => {
                  setUsername(ev.target.value);
                }}
                required
              />
            </Form.Group>
          </Col>
          <Col sm={8} className='mx-auto'>
            <Form.Group controlId='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
              />
            </Form.Group>
            <Button
              variant='dark'
              type='submit'
              className='mainColor below g5-button border mx-auto btn-block'
              onClick={handleSubmit}>
              Submit
            </Button>
          </Col>
        </Row>
        <br />
      </Form>
    </Container>
  );
}

export { LoginForm };
