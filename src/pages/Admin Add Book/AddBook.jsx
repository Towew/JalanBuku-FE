import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import cssModule from "./AddBook.module.css";
import background from "../../assets/background.png";
import attachIcon from "../../assets/attachGreyVector.png";
import checkboxIcon from "../../assets/check-tick-icon-14166.png";
import bookWhite from "../../assets/bookWhite.png";
import NavbarAdmin from "../../component/Navbars/NavbarAdmin";
import { API } from "../../config/api";
import { useNavigate } from "react-router-dom";

function AddBook() {
  let navigate = useNavigate();

  const [cekPdf, setCekPdf] = useState(false);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    title: "",
    year: "",
    author: "",
    pages: "",
    ISBN: "",
    price: "",
    desc: "",
    bookPdf: "",
    bookImg: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    // Create image url for preview
    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  const handleChangePdf = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    setCekPdf(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Store data with FormData as object
    const formData = new FormData();

    formData.append("bookPdf", form.bookPdf[0], form.bookPdf[0].name);
    formData.append("bookImg", form.bookImg[0], form.bookImg[0].name);
    formData.set("title", form.title);
    formData.set("year", form.year);
    formData.set("author", form.author);
    formData.set("pages", form.pages);
    formData.set("ISBN", form.ISBN);
    formData.set("price", form.price);
    formData.set("desc", form.desc);

    // Configuratio
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
    };

    await API.post("/book", formData, config)
      .then((res) => {
        navigate("/admin-transaction");
      })
      .catch((err) => console.log(err));
  };

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
        <h1>Add Book</h1>
        <form onSubmit={handleSubmit}>
          <Row>
            <input
              type="text"
              name="title"
              placeholder="Title"
              onChange={handleChange}
            />
          </Row>
          <Row>
            <input
              type="date"
              name="year"
              placeholder="Publication Date (Format: DD-MM-YYYY)"
              onChange={handleChange}
            />
          </Row>
          <Row>
            <input
              type="text"
              name="author"
              placeholder="Author Name"
              onChange={handleChange}
            />
          </Row>
          <Row>
            <input
              type="number"
              name="pages"
              placeholder="Pages"
              onChange={handleChange}
            />
          </Row>
          <Row>
            <input
              type="number"
              name="ISBN"
              placeholder="ISBN"
              onChange={handleChange}
            />
          </Row>
          <Row>
            <input
              type="number"
              name="price"
              placeholder="Price"
              onChange={handleChange}
            />
          </Row>
          <Row>
            <textarea
              name="desc"
              placeholder="About This Book"
              rows="5"
              onChange={handleChange}
            />
          </Row>
          <Row
            className={cssModule.uploadSection}
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Col>
              <label htmlFor="bookPdf">
                <div>
                  <span>Attach Book File</span>
                  <img src={attachIcon} alt="" />
                </div>
              </label>
              <input
                type="file"
                name="bookPdf"
                id="bookPdf"
                onChange={handleChangePdf}
                hidden
              />
            </Col>
            <Col>
              {cekPdf ? (
                <img src={checkboxIcon} alt="" />
              ) : (
                <p>No PDF Uploaded</p>
              )}
            </Col>
          </Row>
          <Row
            className={cssModule.uploadSection}
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Col>
              <label htmlFor="bookImg">
                <div>
                  <span>Attach Cover</span>
                  <img src={attachIcon} alt="" />
                </div>
              </label>
              <input
                type="file"
                name="bookImg"
                id="bookImg"
                onChange={handleChange}
                hidden
              />
            </Col>
            <Col>
              <img
                src={preview}
                style={{
                  maxWidth: "60px",
                  maxHeight: "60px",
                }}
                alt=""
              />
            </Col>
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

export default AddBook;
