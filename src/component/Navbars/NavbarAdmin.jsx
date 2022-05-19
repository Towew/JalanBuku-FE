import React, { useContext, useState } from "react";
import { Navbar, Container, Dropdown, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import wbLogo from "../../assets/WaysBookLogo.png";
import cssModule from "./NavbarAdmin.module.css";
import avatarIcon from "../../assets/Untitled_design-removebg-preview.png";
import bookGrey from "../../assets/bookGrey.png";
import chatGrey from "../../assets/chatGrey.png";
import logRed from "../../assets/logoutRed.png";
import logTrx from "../../assets/3__35_-removebg-preview.png";
import { UserContext } from "../../context/userContext";

function NavbarAdmin(props) {
  let navigate = useNavigate();

  const [state, dispatch] = useContext(UserContext);

  const navHome = () => {
    if (props.hOff) {
      props.hOff();
    }
  };

  const navTrx = () => {
    if (props.hOff) {
      props.hOff();
    }
    navigate("/admin-transaction");
  };

  const navAdd = () => {
    if (props.hOff) {
      props.hOff();
    }
    navigate("/add-book");
  };

  const navComp = () => {
    if (props.hOff) {
      props.hOff();
    }
    navigate("/admin-complain");
  };

  const handleOuts = () => {
    if (props.hOff) {
      props.hOff();
    }
    dispatch({
      type: "LOGOUT",
    });
    navigate("/");
  };

  // The forwardRef is important!!
  // Dropdown needs access to the DOM node in order to position the Menu
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </a>
  ));

  // forwardRef again here!
  // Dropdown needs access to the DOM of the Menu to measure it
  const CustomMenu = React.forwardRef(
    ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
      const [value, setValue] = useState("");

      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <ul className="list-unstyled">
            {React.Children.toArray(children).filter(
              (child) =>
                !value || child.props.children.toLowerCase().startsWith(value)
            )}
          </ul>
        </div>
      );
    }
  );

  return (
    <div>
      <Navbar
        expand="lg"
        style={{
          top: "20px",
        }}
      >
        <Container>
          <Navbar.Brand onClick={() => navHome()} href="/">
            <img src={wbLogo} alt="" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            style={{ justifyContent: "flex-end" }}
            id="basic-navbar-nav"
          >
            <Nav className={cssModule.navRightSide}>
              <Nav.Item onClick={navTrx} className={cssModule.btnCart}>
                <img
                  src={logTrx}
                  style={{
                    width: "35px",
                    height: "35px",
                  }}
                  alt=""
                />
              </Nav.Item>

              <Dropdown>
                <Dropdown.Toggle
                  as={CustomToggle}
                  id="dropdown-custom-components"
                >
                  <img
                    className={cssModule.avatarBulet}
                    src={avatarIcon}
                    alt=""
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu as={CustomMenu} className={cssModule.dropItem}>
                  <Dropdown.Item onClick={navAdd}>
                    <img src={bookGrey} alt="" />
                    <span>Add Book</span>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={navComp}>
                    <img src={chatGrey} alt="" />
                    <span>Complain</span>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleOuts}>
                    <img src={logRed} alt="" />
                    <span>Logout</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavbarAdmin;
