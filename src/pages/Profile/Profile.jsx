import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import cssModule from "./Profile.module.css";
import background from "../../assets/background.png";
import emailLogo from "../../assets/emailVectorGrey.png";
import mapsLogo from "../../assets/mapsGrey.png";
import gendLogo from "../../assets/genderGrey.png";
import phoneLogo from "../../assets/phoneGrey.png";
import reactLogo from "../../assets/logo512.png";
import NavbarUser from "../../component/Navbars/NavbarUser";
import blackUser from "../../assets/userBlack.png";
import { API } from "../../config/api";
import { UserContext } from "../../context/userContext";

function Profile() {
  document.title = `WaysBook | Profile's`;

  let navigate = useNavigate();

  const [state, dispatch] = useContext(UserContext);

  const [modalShow, setModalShow] = useState(false);
  const [dtlBook, setDtlBook] = useState([]);
  const [preview, setPreview] = useState(null); //For image preview
  const [dtlProfile, setDtlProfile] = useState({});
  const [form, setForm] = useState({
    gender: "",
    phone: "",
    address: "",
    avatar: "",
  });

  // Handle change data on form
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

  function handleOpen() {
    setModalShow(true);
  }

  function handleClose() {
    setModalShow(false);
    navigate("/profile");
  }

  useEffect(() => {
    API.get("/profile")
      .then((res) => {
        setDtlProfile(res.data.data.profile);
        setPreview(res.data.data.profile.avatar);
        setForm({
          ...form,
          gender: dtlProfile.gender,
          phone: dtlProfile.phone,
          address: dtlProfile.address,
        });
      })
      .catch((err) => console.log(err));

    API.get("/purchased-books")
      .then((res) => {
        setDtlBook(res.data.purBook);
      })
      .catch((err) => console.log(err));
  }, [modalShow]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Store data with FormData as object
    const formData = new FormData();

    if (form.avatar) {
      formData.set("avatar", form.avatar[0], form.avatar[0]?.name);
    }
    formData.set("address", form.address);
    formData.set("gender", form.gender);
    formData.set("phone", form.phone);

    // Configuration
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
    };

    // Insert product data
    await API.patch("/profile", formData, config);

    setModalShow(false);
  };

  const navDtl = (par1) => {
    navigate(`/detail/${par1}`);
  };

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
      <NavbarUser avaTrg={modalShow} />
      <Container
        className={cssModule.profileCont}
        fluid
        style={{ width: "70%", margin: "auto" }}
      >
        <Row>
          <Col style={{ marginTop: "70px" }}>
            <h2>{state.user.name}</h2>
            <Container
              style={{
                width: "100%",
                height: "85%",
                backgroundColor: "#FFD9D9",
                borderRadius: "8px",
                padding: "45px",
              }}
            >
              <Row>
                <Col>
                  <div className={cssModule.profileDtl}>
                    <div>
                      <img src={emailLogo} alt="" />
                    </div>
                    <div>
                      <h4>{state.user.email}</h4>
                      <h6>Email</h6>
                    </div>
                  </div>
                  <div className={cssModule.profileDtl}>
                    <div>
                      <img src={gendLogo} alt="" />
                    </div>
                    <div>
                      <h4>{dtlProfile.gender ? dtlProfile.gender : "-"}</h4>
                      <h6>Gender</h6>
                    </div>
                  </div>
                  <div className={cssModule.profileDtl}>
                    <div>
                      <img src={phoneLogo} alt="" />
                    </div>
                    <div>
                      <h4>{dtlProfile.phone ? dtlProfile.phone : "-"}</h4>
                      <h6>Phone</h6>
                    </div>
                  </div>
                  <div className={cssModule.profileDtl}>
                    <div>
                      <img src={mapsLogo} alt="" />
                    </div>
                    <div>
                      <h4>{dtlProfile.address ? dtlProfile.address : "-"}</h4>
                      <h6>Address</h6>
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className={cssModule.rightSide}>
                    <img
                      src={dtlProfile.avatar ? dtlProfile.avatar : blackUser}
                      alt=""
                    />
                    <button onClick={handleOpen}>Edit Profile</button>
                  </div>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
        <Row>
          <Col
            style={{
              marginTop: "60px",
            }}
          >
            <h2
              style={{
                marginLeft: "5px",
              }}
            >
              My Books
            </h2>
          </Col>
        </Row>

        <Row className={cssModule.myBooks}>
          {dtlBook.map((item, index) => (
            <Col
              sm={6}
              key={index}
              style={{
                marginTop: "30px",
                width: "230px",
                marginLeft: "5px",
                marginRight: "5px",
              }}
            >
              <img
                src={item.book.bookImg}
                style={{ borderRadius: "0px 10px 10px 0px" }}
                alt=""
              />
              <h3 onClick={() => navDtl(item.id)}>{item.book.title}</h3>
              <h6>By: {item.book.author}</h6>
              <a href={item.book.bookPdf} target="_blank">
                Download
              </a>
            </Col>
          ))}
        </Row>
      </Container>

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        style={{
          position: "absolute",
          top: "100px",
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className={cssModule.editForm} onSubmit={handleSubmit}>
            <div className={cssModule.formGroup}>
              <label htmlFor="gender">Gender</label>
              <select id="gender" name="gender" onChange={handleChange}>
                <option value="volvo" disabled>
                  -- Select Your Gender --
                </option>
                <option
                  selected={dtlProfile.gender == "Male" ? true : false}
                  value="Male"
                >
                  Male
                </option>
                <option
                  selected={dtlProfile.gender == "Female" ? true : false}
                  value="Female"
                >
                  Female
                </option>
                <option
                  selected={dtlProfile.gender == "Other" ? true : false}
                  value="Other"
                >
                  Other
                </option>
              </select>
            </div>
            <div className={cssModule.formGroup}>
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                name="phone"
                id="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Format : 0812-8888-8888"
              />
            </div>
            <div className={cssModule.formGroup}>
              <label htmlFor="address">Address</label>
              <input
                type="text"
                value={form.address}
                onChange={handleChange}
                name="address"
                id="address"
              />
            </div>
            <div className={cssModule.formGroup}>
              <label htmlFor="avatar">
                <div className={cssModule.formGroupImage}>
                  <span>Avatar/Profile Picture</span>
                  <div className={cssModule.uploadImage}>
                    <h5>Upload File</h5>
                    {preview && <img src={preview} alt="" />}
                  </div>
                </div>
              </label>
              <input
                type="file"
                name="avatar"
                id="avatar"
                onChange={handleChange}
                hidden
              />
            </div>
            <div className={cssModule.btnSubmit}>
              <button type="submit">Submit</button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Profile;
