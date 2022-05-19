import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Modal } from "react-bootstrap";
import cssModule from "../Detail Book/DetailBook.module.css";
import background from "../../assets/background.png";
import rupiahFormat from "rupiah-format";
import cartLogo from "../../assets/cart-vector-white.png";
import NavbarUser from "../../component/Navbars/NavbarUser";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../../config/api";
import dateFormat from "dateformat";
import { UserContext } from "../../context/userContext";

function DetailBook() {
  document.title = `WaysBook | Nama Buku`;

  let { id } = useParams();
  let navigate = useNavigate();
  const [isBuy, setIsBuy] = useState(false);
  const [alerts, setAlerts] = useState(false);
  const [dtlBook, setDtlBook] = useState({});

  const setAddCart = () => {
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
        idProduct: id,
      },
      config
    );

    setAlerts(true);
  };

  useEffect(() => {
    API.get(`/book/${id}`)
      .then((res) => {
        setDtlBook(res.data.data.book);
      })
      .catch((err) => {
        console.log(err);
      });

    API.get(`/purchased/${id}`)
      .then((res) => {
        if (res.data.purBook) {
          setIsBuy(true);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#E5E5E5",
        backgroundImage: `url(${background})`,
        backgroundSize: "100%",
        height: "100%",
        paddingBottom: "70px",
      }}
    >
      <NavbarUser cartTg={alerts} />
      <Container>
        <Row style={{ width: "80%", margin: "auto" }}>
          <Col style={{ marginTop: "50px" }}>
            <img
              src={dtlBook.bookImg}
              alt="Coverbook"
              style={{
                width: "300px",
                height: "477px",
                borderRadius: "0px 10px 10px 0px",
              }}
            />
          </Col>
          <Col style={{ marginTop: "50px" }} className={cssModule.dtlBook}>
            <h1>{dtlBook.title}</h1>
            <h6>By: {dtlBook.author}</h6>

            <div className={cssModule.dtlBookProps}>
              <h5>Publication Date</h5>
              <p>{dateFormat(dtlBook.year, "dd mmm yyyy")}</p>
            </div>

            <div className={cssModule.dtlBookProps}>
              <h5>Pages</h5>
              <p>{dtlBook.pages}</p>
            </div>

            <div className={cssModule.dtlBookProps}>
              <h5>ISBN</h5>
              <p>{dtlBook.ISBN}</p>
            </div>

            <div className={cssModule.dtlBookProps}>
              <h5>Price</h5>
              <p>{rupiahFormat.convert(dtlBook.price)}</p>
            </div>
          </Col>
        </Row>
        <Row style={{ width: "80%", margin: "auto" }}>
          <Col className={cssModule.bookDesc} style={{ marginTop: "30px" }}>
            <h2>About This Book</h2>
            <p>{dtlBook.desc}</p>
            <div className={cssModule.bookDescBtn}>
              {isBuy ? (
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <button onClick={() => setAddCart()}>
                    <span>Add Cart</span> <img alt="" src={cartLogo} />
                  </button>

                  <a
                    style={{
                      marginLeft: "30px",
                    }}
                    href={dtlBook.bookPdf}
                    target="_blank"
                  >
                    <span
                      style={{
                        margin: "auto",
                      }}
                    >
                      Download
                    </span>
                  </a>
                </div>
              ) : (
                <button onClick={() => setAddCart()}>
                  <span>Add Cart</span> <img alt="" src={cartLogo} />
                </button>
              )}
            </div>
          </Col>
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
    </div>
  );
}

export default DetailBook;
