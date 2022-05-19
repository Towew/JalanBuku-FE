import React, { useContext, useEffect, useState } from "react";
import { Navbar, Container, Dropdown, Nav, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import wbLogo from "../../assets/WaysBookLogo.png";
import cssModule from "./NavbarAdmin.module.css";
import blackUser from "../../assets/userBlack.png";
import chatBlack from "../../assets/chatBlack.png";
import logRed from "../../assets/logoutRed.png";
import cartBlk from "../../assets/cartBlack.png";
import { UserContext } from "../../context/userContext";
import { API } from "../../config/api";

function NavbarUser(props) {
  let navigate = useNavigate();

  const [state, dispatch] = useContext(UserContext);

  const navHome = () => {
    if (props.hOff) {
      props.hOff();
    }
  };

  const navProf = () => {
    if (props.hOff) {
      props.hOff();
    }
    navigate("/profile");
  };

  const navComp = () => {
    if (props.hOff) {
      props.hOff();
    }
    navigate("/complain");
  };

  const navCart = () => {
    if (props.hOff) {
      props.hOff();
    }
    navigate("/cart");
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

  const [carts, setCarts] = useState([]);
  const [dtlProfile, setDtlProfile] = useState({});

  useEffect(() => {
    API.get("/carts")
      .then((res) => {
        setCarts(res.data.getCart);
      })
      .catch((err) => {
        console.log(err);
      });

    API.get("/profile")
      .then((res) => {
        setDtlProfile(res.data.data.profile);
      })
      .catch((err) => console.log.apply(err));
  }, [props.cartTg, props.avaTrg, props.delTg]);

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
              <Nav.Item onClick={navCart} className={cssModule.btnCart}>
                <div>
                  <img src={cartBlk} alt="" />
                  {carts.length > 0 && (
                    <Badge bg="danger" pill className={cssModule.cartBadge}>
                      {carts.length > 9 ? "+9" : carts.length}
                    </Badge>
                  )}
                </div>
              </Nav.Item>

              <Dropdown>
                <Dropdown.Toggle
                  as={CustomToggle}
                  id="dropdown-custom-components"
                >
                  <img
                    className={cssModule.avatarBulet}
                    src={dtlProfile.avatar ? dtlProfile.avatar : blackUser}
                    alt=""
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu as={CustomMenu} className={cssModule.dropItem}>
                  <Dropdown.Item onClick={navProf}>
                    <img src={blackUser} alt="" />
                    <span>Profile</span>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={navComp}>
                    <img src={chatBlack} alt="" />
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

export default NavbarUser;
