import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import cssModule from "./AdminTransaction.module.css";
import background from "../../assets/background.png";
import rupiahFormat from "rupiah-format";
import NavbarAdmin from "../../component/Navbars/NavbarAdmin";
import { API } from "../../config/api";

function AdminTransaction() {
  document.title = `WaysBook | Transactions`;

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    API.get("/transactions")
      .then((res) => setTransactions(res.data.trx))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#E5E5E5",
        backgroundImage: `url(${background})`,
        backgroundSize: "100%",
        height: `${transactions.length >= 4 ? "100%" : "100vh"}`,
        paddingBottom: "70px",
        paddingTop: "10px",
      }}
    >
      <NavbarAdmin />
      <Container className={cssModule.adminTrxContainer}>
        <h1>Incoming Transaction</h1>
        <Row>
          <Col>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Users</th>
                  <th>Product Purchased</th>
                  <th>Total Payment</th>
                  <th>Status Payment</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.nameBuyer}</td>
                    <td>{item.products}</td>
                    <td className={`text-color-${item.status}`}>
                      {rupiahFormat.convert(item.total)}
                    </td>
                    <td className={`text-color-${item.status}`}>
                      {item.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AdminTransaction;
