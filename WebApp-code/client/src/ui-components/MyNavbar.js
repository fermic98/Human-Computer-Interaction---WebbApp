import {
  Button,
  Nav,
  Navbar,
  NavDropdown,
  Container,
  Row,
  Col,
  Modal,
  ModalBody,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { userIcon, homeIcon, plusIcon, logOutIcon, statIcon } from "./Icons";
import { useHistory } from "react-router-dom";
import { useState, useEffect, useRef, React } from "react";

import "../css/custom.css";

function MyNavbar(props) {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [showModalC, setShowModalC] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleCloseModalC = () => {
    setShowModalC(false);
  };

  const goHome = () => {
    props.setNavbarTitle("GymMe5");
    props.setStatus("Home");
    history.push("/");
  };

  const goCreate = () => {
    props.setNavbarTitle("Training Creator");

    history.push("/training-creator");
  };

  return (
    <>
      <Navbar
        variant='dark'
        collapseOnSelect
        expand='sm'
        className='nav-design'>
        <Nav.Item>
          <Navbar.Brand className='navbar-color'>
            {" "}
            <b>{props.navbarTitle}</b>
          </Navbar.Brand>{" "}
        </Nav.Item>
        {props.status !== null ? (
          <>
            <Navbar.Toggle
              aria-controls='responsive-navbar-nav'
              className='mb-2 no-border'
            />
            <Navbar.Collapse id='responsive-navbar-nav '>
              {props.loggedIn ? (
                <>
                  <Row className='mx-auto'>
                    <Nav.Item
                      className={
                        "text-white mx-auto " +
                        (props.status === "Home" ? "active-button" : null)
                      }
                      onClick={() => {
                        if (props.status !== "Home") setShowModal(true);
                        else goHome();
                      }}>
                      <Col>
                        {" "}
                        <Row> {homeIcon} </Row>{" "}
                        <Row className='small-font'> Home </Row>{" "}
                      </Col>{" "}
                    </Nav.Item>
                    <Nav.Item
                      className={
                        "text-white mx-auto " +
                        (props.status === "Creator" || props.status === "Editor"
                          ? "active-button"
                          : null)
                      }
                      onClick={() => {
                        if (
                          props.status !== "Editor" &&
                          props.status !== "Creator"
                        ) {
                          if (props.status === "WorkingOut") {
                            setShowModalC(true);
                          } else goCreate();
                        }
                      }}>
                      <Col>
                        {" "}
                        <Row> {plusIcon} </Row>{" "}
                        <Row className='small-font'> Create </Row>{" "}
                      </Col>{" "}
                    </Nav.Item>

                    <Nav.Item className='text-white mx-auto' onClick={() => {}}>
                      <Col>
                        {" "}
                        <Row> {statIcon} </Row>{" "}
                        <Row className='small-font'> History</Row>{" "}
                      </Col>{" "}
                    </Nav.Item>

                    <Nav.Item
                      className='text-white mx-auto'
                      onClick={() => {
                        props.closeMessage();
                        props.doLogOut();
                      }}>
                      <Col>
                        {" "}
                        <Row> {logOutIcon} </Row>{" "}
                        <Row className='small-font'> LogOut </Row>{" "}
                      </Col>{" "}
                    </Nav.Item>
                  </Row>
                </>
              ) : null}
            </Navbar.Collapse>
          </>
        ) : null}
      </Navbar>

      <Modal centered show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Do you really want to go Home? You'll lost your progress!
          </Modal.Title>
        </Modal.Header>
        <ModalBody>
          <Row className='justify-content-center'>
            <Button
              className='mx-auto g5-button'
              onClick={() => {
                goHome();
                handleCloseModal();
              }}>
              Go Home
            </Button>{" "}
            <Button
              className='mx-auto g5-button'
              onClick={() => handleCloseModal()}>
              Stay
            </Button>
          </Row>
        </ModalBody>
      </Modal>

      <Modal centered show={showModalC} onHide={handleCloseModalC}>
        <Modal.Header closeButton>
          <Modal.Title>
            Do you really want to go to the Training Creator? You'll lost your
            progress!
          </Modal.Title>
        </Modal.Header>
        <ModalBody>
          <Row className='justify-content-center'>
            <Button
              className='mx-auto g5-button'
              onClick={() => {
                goCreate();
                handleCloseModalC();
              }}>
              Yes
            </Button>{" "}
            <Button
              className='mx-auto g5-button'
              onClick={() => handleCloseModalC()}>
              No
            </Button>
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
}

export default MyNavbar;
