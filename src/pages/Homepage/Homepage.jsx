import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Carousel, Modal, Alert } from "react-bootstrap";
import background from "../../assets/background.png";
import cssModule from "./Homepage.form.module.css";
import rupiahFormat from "rupiah-format";
import NavbarDefault from "../../component/Navbars/Navbar";
import NavbarAdmin from "../../component/Navbars/NavbarAdmin";
import NavbarUser from "../../component/Navbars/NavbarUser";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { API } from "../../config/api";

function Homepage() {
  document.title = `WaysBook`;

  let navigate = useNavigate();

  const [state, dispatch] = useContext(UserContext);

  const [alerts, setAlerts] = useState(false);

  let navbarConfig = "";
  if (!state.user.role) {
    navbarConfig = <NavbarDefault />;
  }
  if (state.user.role == "customer") {
    navbarConfig = <NavbarUser cartTg={alerts} />;
  }
  if (state.user.role == "admin") {
    navbarConfig = <NavbarAdmin />;
  }

  const [promoBooks, setPromoBooks] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    API.get("/books")
      .then((res) => {
        return setBooks(res.data.data.books);
      })
      .catch((error) => {
        console.log(error);
      });

    API.get("/promo-books")
      .then((res) => {
        return setPromoBooks(res.data.data.promoBooks);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  /* *************Ini Untuk Modal Login dan Register***************** */

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

  /* ***************** Akhir dari Modal Login dan Register ***************** */

  const setNavTitle = (par1) => {
    if (!state.user.role) {
      handleOpenLogin();
    } else if (state.user.role == "customer") {
      navigate(`/detail/${par1}`);
    } else if (state.user.role == "admin") {
      navigate(`/update-book/${par1}`);
    }
  };

  const setAddCart = (par1) => {
    if (!state.user.role) {
      handleOpenLogin();
    } else if (state.user.role == "customer") {
      // Configuration Content-type
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // Insert data user to database
      API.post(
        "/cart",
        {
          idProduct: par1,
        },
        config
      );

      setAlerts(true);
    } else if (state.user.role == "admin") {
      navigate(`/update-book/${par1}`);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "100%",
        width: "100%",
      }}
    >
      {navbarConfig}

      <Container>
        <Row style={{ marginBottom: "40px" }}>
          <Col className={cssModule.titleCont}>
            <p>With us, you can shop online & help</p>
            <p>save your high street at the same time</p>
          </Col>
        </Row>
        {promoBooks.length >= 1 ? (
          <Row>
            <Col>
              <Carousel variant="dark">
                {promoBooks.map((item, index) => (
                  <Carousel.Item key={index}>
                    <Row style={{ width: "75%", margin: "auto" }}>
                      <Col
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          className="d-block"
                          src={item.bookImg}
                          alt=""
                          style={{
                            width: "236.22px",
                            height: "345.09px",
                            borderRadius: "0px 10px 10px 0px",
                          }}
                        />
                      </Col>
                      <Col className={cssModule.promoProps}>
                        <h3 onClick={() => setNavTitle(item.id)}>
                          {item.title}
                        </h3>
                        <h6>By: {item.author}</h6>
                        <h5>
                          {rupiahFormat.convert(item.price)}{" "}
                          <span
                            style={{
                              color: "red",
                              marginLeft: "10px",
                              textDecorationLine: "line-through",
                            }}
                          >
                            {rupiahFormat.convert(
                              item.price + (item.price * 35) / 100
                            )}
                          </span>
                        </h5>
                        <button onClick={() => setAddCart(item.id)}>
                          <span>Add to Cart</span>
                        </button>
                        <p>{item.desc}</p>
                      </Col>
                    </Row>
                  </Carousel.Item>
                ))}
              </Carousel>
            </Col>
          </Row>
        ) : (
          <Row>
            <h1
              style={{
                textAlign: "center",
                marginTop: "89px",
                marginBottom: "89px",
              }}
            >
              No Promo Books Available Right Now
            </h1>
          </Row>
        )}
      </Container>
      <Container
        fluid
        style={{
          marginTop: "50px",
          height: "100%",
          width: "100%",
          backgroundColor: "#E5E5E5",
          paddingBottom: "30px",
        }}
      >
        <Row
          style={{
            width: "70%",
            margin: "30px auto 30px auto",
          }}
        >
          <Col
            style={{
              marginTop: "45px",
            }}
          >
            <h2
              style={{
                marginLeft: "5px",
              }}
            >
              List Book
            </h2>
          </Col>
        </Row>
        <Row
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "70%",
            margin: "0px auto 30px auto",
            paddingBottom: "40px",
          }}
        >
          {books.map((item, index) => (
            <Col
              sm={6}
              key={index}
              className={cssModule.listBook}
              style={{
                width: "200px",
                marginBottom: "20px",
                marginLeft: "5px",
                marginRight: "5px",
              }}
            >
              <img src={item.bookImg} alt="" />
              <h3 onClick={() => setNavTitle(item.id)}>{item.title}</h3>
              <h6>By: {item.author}</h6>
              <h5>{rupiahFormat.convert(item.price)}</h5>
            </Col>
          ))}
        </Row>
      </Container>
      <Modal
        style={{
          top: "250px",
        }}
        show={alerts}
        onHide={() => setAlerts(false)}
      >
        <Modal.Body
          style={{
            textAlign: "center",
            color: "#469F74",
            fontSize: "24px",
          }}
        >
          The product is successfully added to the cart
        </Modal.Body>
      </Modal>

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

export default Homepage;
