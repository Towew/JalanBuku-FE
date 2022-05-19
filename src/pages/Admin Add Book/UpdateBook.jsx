import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import cssModule from "./AddBook.module.css";
import background from "../../assets/background.png";
import bookWhite from "../../assets/bookWhite.png";
import NavbarAdmin from "../../component/Navbars/NavbarAdmin";
import { API } from "../../config/api";
import { useNavigate, useParams } from "react-router-dom";
import rupiahFormat from "rupiah-format";
import dateFormat from "dateformat";

function UpdateBook() {
  let navigate = useNavigate();

  const { id } = useParams();

  const [dtlBook, setDtlBook] = useState({});
  const [form, setForm] = useState({
    price: "",
  });
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Store data with FormData as object
    const formData = new FormData();

    formData.set("price", form.price);

    // Configuration
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
    };

    await API.patch(`/book/${id}`, formData, config)
      .then((res) => {
        navigate("/admin-transaction");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    API.get(`/book/${id}`)
      .then((res) => {
        setDtlBook(res.data.data.book);
        setPreview(res.data.data.book.bookImg);
        setForm({
          ...form,
          price: dtlBook.price,
        });
      })
      .catch((err) => console(err));
  }, [preview]);

  return (
    <div
      style={{
        backgroundColor: "#E5E5E5",
        backgroundImage: `url(${background})`,
        backgroundSize: "100%",
        height: "100%",
        paddingBottom: "70px",
        paddingTop: "10px",
      }}
    >
      <NavbarAdmin />
      <Container className={cssModule.addBookContainer}>
        <h1>Update Book Price</h1>
        <form onSubmit={handleSubmit}>
          <Row
            style={{
              alignItems: "center",
            }}
          >
            <Col style={{ marginTop: "15px", justifyContent: "center" }}>
              {preview && (
                <img
                  src={preview}
                  style={{
                    width: "300px",
                    height: "477px",
                    borderRadius: "0px 10px 10px 0px",
                    marginLeft: "150px",
                  }}
                />
              )}
            </Col>
            <Col style={{ marginTop: "15px" }} className={cssModule.dtlBook}>
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
          <Row>
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
            />
          </Row>
          <Row className={cssModule.btnSection}>
            <button type="submit">
              <span>Add Book</span>
              <img src={bookWhite} alt="" />
            </button>
          </Row>
        </form>
      </Container>
    </div>
  );
}

export default UpdateBook;
