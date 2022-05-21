import React, { useEffect, useState } from "react";
import { Col, Container, Row, Modal } from "react-bootstrap";
import cssModule from "./Cart.module.css";
import background from "../../assets/background.png";
import rupiahFormat from "rupiah-format";
import trashIcon from "../../assets/trashVectorGrey.png";
import NavbarUser from "../../component/Navbars/NavbarUser";
import { API } from "../../config/api";
import { useNavigate } from "react-router-dom";

function Cart() {
  document.title = `WaysBook | Your Cart`;

  const navigate = useNavigate();

  const [carts, setCarts] = useState([]);
  const [alerts, setAlerts] = useState(false);
  const [trigger, setTrigger] = useState(false);

  function handleClose() {
    setAlerts(false);
  }

  useEffect(() => {
    API.get("/carts")
      .then((res) => {
        setCarts(res.data.getCart);
      })
      .catch((err) => console.log(err));
  }, [trigger, alerts]);

  useEffect(() => {
    //change this to the script source you want to load, for example this is snap.js sandbox env
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    //change this according to your client-key
    const myMidtransClientKey = "SB-Mid-client-roO-YplpbRVVfbyV";

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    // optional if you want to set script attribute
    // for example snap.js have data-client-key attribute
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  const navDtl = (par1) => {
    navigate(`/detail/${par1}`);
  };

  const handleDelete = async (par1) => {
    API.delete(`/cart/${par1}`)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    setTrigger(true);
  };

  const handleTrx = async () => {
    await API.post("/transaction")
      .then((res) => {
        /* console.log(res); */

        const token = res.data.payment.token;

        window.snap.pay(token, {
          onSuccess: function (result) {
            /* You may add your own implementation here */

            console.log(result);
            setAlerts(true);
            setTimeout(setAlerts, 3000);
          },
          onPending: function (result) {
            /* You may add your own implementation here */
            console.log(result);
            setAlerts(true);
            setTimeout(setAlerts, 3000);
          },
          onError: function (result) {
            /* You may add your own implementation here */
            console.log(result);
          },
          onClose: function () {
            /* You may add your own implementation here */
            alert("you closed the popup without finishing the payment");
          },
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div
      style={{
        backgroundColor: "#E5E5E5",
        backgroundImage: `url(${background})`,
        backgroundSize: "100%",
        height: `${carts.length >= 2 ? "100%" : "100vh"}`,
        paddingBottom: "70px",
      }}
    >
      <NavbarUser delTg={trigger} />
      <Container className={cssModule.cartMainContainer}>
        <h1>My Cart</h1>
        <h2>Review Your Order</h2>
        <Row>
          <Col xs={8} className={cssModule.cartLeftSide}>
            <hr />
            {carts.map((item, index) => (
              <Row
                key={index}
                style={{
                  margin: "45px 0px 45px 0px",
                }}
              >
                <Col xs={3}>
                  <img
                    style={{ borderRadius: "0px 10px 10px 0px" }}
                    src={item.book.bookImg}
                    alt=""
                  />
                </Col>
                <Col xs={8}>
                  <h3 onClick={() => navDtl(item.book.id)}>
                    {item.book.title}
                  </h3>
                  <h6>By: {item.book.author}</h6>
                  <h5>{rupiahFormat.convert(item.book.price)}</h5>
                </Col>
                <Col xs={1}>
                  <img
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(item.id)}
                    src={trashIcon}
                    alt=""
                  />
                </Col>
              </Row>
            ))}
            <hr />
          </Col>
          <Col xs={4} className={cssModule.cartRightSide}>
            <hr />
            <Row>
              <Col>
                <p>Subtotal</p>
              </Col>
              <Col
                style={{
                  textAlign: "right",
                }}
              >
                <p>
                  {rupiahFormat.convert(
                    carts
                      .map((item) => {
                        return item.total;
                      })
                      .reduce((a, b) => parseInt(a) + parseInt(b), parseInt(0))
                  )}
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>Qty</p>
              </Col>
              <Col
                style={{
                  textAlign: "right",
                }}
              >
                <p>
                  {carts
                    .map((item) => {
                      return item.qty;
                    })
                    .reduce((a, b) => parseInt(a) + parseInt(b), parseInt(0))}
                </p>
              </Col>
            </Row>
            <hr />
            <Row className={cssModule.cartRightSideTtl}>
              <Col>
                <p>Total</p>
              </Col>
              <Col
                style={{
                  textAlign: "right",
                }}
              >
                <p>
                  {rupiahFormat.convert(
                    carts
                      .map((item) => {
                        return item.total;
                      })
                      .reduce((a, b) => parseInt(a) + parseInt(b), parseInt(0))
                  )}
                </p>
              </Col>
            </Row>
            <button onClick={() => handleTrx()}>Pay</button>
          </Col>
        </Row>
      </Container>
      <Modal
        style={{
          top: "220px",
        }}
        show={alerts}
        onHide={handleClose}
      >
        <Modal.Body
          style={{
            textAlign: "center",
            color: "#469F74",
            fontSize: "24px",
          }}
        >
          Thank you for ordering in us, please wait 1 x 24 hours to verify you
          order
        </Modal.Body>
      </Modal>
      <Modal
        style={{
          top: "220px",
        }}
        show={trigger}
        onHide={() => setTrigger(false)}
      >
        <Modal.Body
          style={{
            textAlign: "center",
            color: "red",
            fontSize: "24px",
          }}
        >
          Delete Success
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Cart;
