import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import cssModule from "./AdminComplain.module.css";
import avatarIcon from "../../assets/userBlack.png";
import background from "../../assets/background.png";
import sendIcon from "../../assets/sendIconBlack.png";
import NavbarAdmin from "../../component/Navbars/NavbarAdmin";
import { UserContext } from "../../context/userContext";
import { io } from "socket.io-client";
import logOn from "../../assets/Ellipse_4.png";

let socket;

function AdminComplain() {
  document.title = "WaysBook | Complain Page";

  const [state] = useContext(UserContext);
  const [contact, setContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [online, setOnline] = useState(false);
  const [form, setForm] = useState({
    chatM: "",
  });

  useEffect(() => {
    socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:5000/", {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socket.on("new message", () => {
      socket.emit("load messages", contact?.id);
    });

    loadContact();
    console.log(contacts);
    loadMessages();

    socket.on("connect_error", (err) => {
      console.error(err.message);
    });

    if (!messages[messages.length - 1]?.message) {
      setOnline(false);
    } else if (messages[messages.length - 1]?.idSender == contact?.id) {
      setOnline(true);
    }

    return () => {
      socket.disconnect();
    };
  }, [messages]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const loadContact = () => {
    socket.emit("load customer contact");

    socket.on("customer contact", (data) => {
      let dataContacts = data.map((item) => ({
        ...item,
        message: "Click here to start message",
      }));
      setContacts(dataContacts);
    });
  };

  const onClickContact = (data) => {
    console.log(data);
    setContact(data);
    socket.emit("load messages", data.id);
  };

  const loadMessages = () => {
    socket.on("messages", (data) => {
      console.log(data);
      if (data.length > 0) {
        const dataMessages = data.map((item) => ({
          idSender: item.sender.id,
          message: item.message,
          idRecipient: item.recipient.id,
        }));
        console.log(dataMessages);
        setMessages(dataMessages);
      } else {
        setMessages([]);
      }
    });
  };

  const onSendMessage = (e) => {
    if (e.key === "Enter") {
      const data = {
        idRecipient: contact.id,
        message: e.target.value,
      };
      if (data.message) {
        socket.emit("send message", data);
        form.chatM = "";
      }
    }
  };

  const handleSubmit = () => {
    const data = {
      idRecipient: contact.id,
      message: form.chatM,
    };

    if (data.message) {
      socket.emit("send message", data);
      form.chatM = "";
    }
  };

  const handleOffline = () => {
    const data = {
      idSender: null,
      idRecipient: null,
      message: null,
    };

    socket.emit("send message offline", data);

    setOnline(false);
  };

  return (
    <div
      style={{
        backgroundColor: "#E5E5E5",
        backgroundImage: `url(${background})`,
        backgroundSize: "100%",
        height: `${contact ? "100%" : "100vh"}`,
        paddingBottom: "70px",
      }}
    >
      <NavbarAdmin hOff={handleOffline} />
      <Container className={cssModule.AdminComplain}>
        <h1>Customer Complain</h1>
        <Row>
          <Col className={cssModule.contactContainer} sm={3}>
            {contacts.map((item, index) => (
              <Row
                style={{
                  alignItems: "center",
                  borderBottom: "1px solid #A7A5A5",
                  width: "90%",
                  margin: "15px auto 15px auto",
                  paddingBottom: "10px",
                  cursor: "pointer",
                }}
                onClick={() => onClickContact(item)}
                key={index}
              >
                <Col sm={2}>
                  <img
                    src={item.profile.avatar ? item.profile.avatar : avatarIcon}
                    alt=""
                  />
                </Col>
                <Col sm={10}>
                  <p>{item.name}</p>
                </Col>
              </Row>
            ))}
          </Col>
          {contact ? (
            <Col sm={8} className={cssModule.chatBox}>
              <Row sm={2} className={cssModule.chatBoxHeader}>
                <Col sm={1}>
                  <img
                    src={
                      contact.profile.avatar
                        ? contact.profile.avatar
                        : avatarIcon
                    }
                    alt=""
                  />
                </Col>
                <Col sm={11}>
                  <p>{contact.name}</p>
                  {online && (
                    <p // Tandain ini onlennnnnnnnnnnnn
                      style={{
                        fontSize: "11px",
                      }}
                    >
                      <img
                        style={{
                          width: "10px",
                          height: "10px",
                        }}
                        src={logOn}
                        alt=""
                      />{" "}
                      Online
                    </p>
                  )}
                </Col>
              </Row>
              <Row sm={10} className={cssModule.chatBoxBody}>
                <div
                  id="chat-messages"
                  style={{ height: "60vh" }}
                  className="overflow-auto px-3 py-2"
                >
                  {messages.map((item, index) => (
                    <div key={index}>
                      <div
                        className={`d-flex py-1 ${
                          item.idSender === state.user.id
                            ? "justify-content-end"
                            : "justify-content-start"
                        }`}
                      >
                        <div
                          className={
                            item.idSender === state.user.id
                              ? cssModule.chatMe
                              : cssModule.chatOther
                          }
                        >
                          {item.message}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Row
                  style={{
                    height: "10%",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  className={cssModule.chatSend}
                >
                  <Col sm={11}>
                    <input
                      type="text"
                      name="chatM"
                      onChange={handleChange}
                      value={form.chatM}
                      onKeyPress={onSendMessage}
                      placeholder="Write your message here ..."
                    />
                  </Col>
                  <Col
                    style={{
                      padding: "0px",
                    }}
                    sm={1}
                  >
                    <button onClick={handleSubmit}>
                      <img src={sendIcon} alt="" />
                    </button>
                  </Col>
                </Row>
              </Row>
            </Col>
          ) : (
            <Col>
              <h1>Click customer to start message</h1>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default AdminComplain;
