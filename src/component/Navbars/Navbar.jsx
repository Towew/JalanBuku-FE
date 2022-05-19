import React, { useContext, useState } from "react";
import cssModule from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, Modal, Alert } from "react-bootstrap";
import wbLogo from "../../assets/WaysBookLogo.png";
import { UserContext } from "../../context/userContext";
import { API } from "../../config/api";

function NavbarDefault(props) {
  let navigate = useNavigate();

  const [state, dispatch] = useContext(UserContext);

  const [loginShow, setLoginShow] = useState(false);
  const [registerShow, setRegisterShow] = useState(false);
  const [message, setMessage] = useState(null);

  const [regForm, setRegForm] = useState({
    //Register Form
    name: "",
    email: "",
    password: "",
  });

  const [logForm, setLogForm] = useState({
    //Login Form
    email: "",
    password: "",
  });

  const handleChangeRegister = (e) => {
    setRegForm({
      ...regForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeLogin = (e) => {
    setLogForm({
      ...logForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleCloseLogin = () => {
    setMessage(null);
    setLoginShow(false);
  };

  const handleOpenLogin = () => {
    setMessage(null);
    setLoginShow(true);
  };

  const handleCloseRegister = () => {
    setMessage(null);
    setRegisterShow(false);
  };

  const handleOpenRegister = () => {
    setMessage(null);
    setRegisterShow(true);
  };

  const switchRegLog = () => {
    setMessage(null);
    setRegisterShow(false);
    setLoginShow(true);
  };

  const switchLogReg = () => {
    setMessage(null);
    setLoginShow(false);
    setRegisterShow(true);
  };

  const handleSubmitReg = async (e) => {
    try {
      e.preventDefault();

      // Configuration Content-type
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // Data body
      const body = JSON.stringify(regForm);

      // Insert data user to database
      const response = await API.post("/register", body, config);

      const alert = (
        <Alert variant="success" className="py-1">
          Register Success
        </Alert>
      );
      setMessage(alert);
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
          Register Failed
        </Alert>
      );
      setMessage(alert);
    }
  };

  const handleSubmitLog = async (e) => {
    try {
      e.preventDefault();

      // Configuration Content-type
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // Data body
      const body = JSON.stringify(logForm);

      // Insert data user to database
      const response = await API.post("/login", body, config);

      const alert = (
        <Alert variant="success" className="py-1">
          Login Success!
        </Alert>
      );
      setMessage(alert);

      let dataUser = response.data.data.user;

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: dataUser,
      });

      setLoginShow(false);

      navigate("/");
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
          Login Failed!
        </Alert>
      );
      setMessage(alert);
    }
  };

  return (
    <div>
      <Navbar
        expand="lg"
        style={{
          top: "20px",
        }}
      >
        <Container>
          <Navbar.Brand href="/">
            <img src={wbLogo} alt="" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            style={{ justifyContent: "flex-end" }}
            id="basic-navbar-nav"
          >
            <Nav>
              <Nav.Item className={cssModule.btnLogin}>
                <button onClick={handleOpenLogin}>Login</button>
              </Nav.Item>
              <Nav.Item className={cssModule.btnRegister}>
                <button onClick={handleOpenRegister}>Register</button>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal //Login Modal
        className={cssModule.modalLogin}
        show={loginShow}
        onHide={handleCloseLogin}
      >
        <Modal.Body>
          <h1>Login</h1>
          <form
            style={{
              marginBottom: "30px",
            }}
            onSubmit={handleSubmitLog}
          >
            <div className={cssModule.formGroup}>
              <input
                type="text"
                onChange={handleChangeLogin}
                name="email"
                placeholder="Email"
              />
            </div>
            <div className={cssModule.formGroup}>
              <input
                type="password"
                onChange={handleChangeLogin}
                name="password"
                placeholder="Password"
              />
            </div>
            <div className={cssModule.formGroup}>
              <button type="submit">Login</button>
            </div>
          </form>

          {message && message}

          <p>
            Don't have an account ? Klik{" "}
            <span onClick={switchLogReg}>Here</span>
          </p>
        </Modal.Body>
      </Modal>

      <Modal //Register Modal
        className={cssModule.modalRegister}
        show={registerShow}
        onHide={handleCloseRegister}
      >
        <Modal.Body>
          <h1>Register</h1>
          <form
            style={{
              marginBottom: "30px",
            }}
            onSubmit={handleSubmitReg}
          >
            <div className={cssModule.formGroup}>
              <input
                type="text"
                onChange={handleChangeRegister}
                name="name"
                placeholder="Name"
              />
            </div>
            <div className={cssModule.formGroup}>
              <input
                type="text"
                onChange={handleChangeRegister}
                name="email"
                placeholder="Email"
              />
            </div>
            <div className={cssModule.formGroup}>
              <input
                type="password"
                onChange={handleChangeRegister}
                name="password"
                placeholder="Password Min. 8"
              />
            </div>
            <div className={cssModule.formGroup}>
              <button type="submit">Register</button>
            </div>
          </form>

          {message && message}

          <p>
            Already have an account ? Klik{" "}
            <span onClick={switchRegLog}>Here</span>
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default NavbarDefault;
