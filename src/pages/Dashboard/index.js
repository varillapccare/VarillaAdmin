import axios from "axios";
import React, { useEffect, useState } from "react";
import * as S from "./styles";
import {
  Row,
  Col,
  Divider,
  Button,
  Modal,
  message,
  Input,
  DatePicker,
  Spin,
} from "antd";
import moment from "moment";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = (
  <>
    <br />
    <br />
    <br />
    <LoadingOutlined style={{ fontSize: 40 }} spin />
  </>
);

const Dashboard = (props) => {
  const [users, setUsers] = useState([]);
  const [createUserModal, toggleCreateUserModal] = useState(false);
  const [updateUserModal, toggleUpdateUserModal] = useState(false);

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumber2, setPhoneNumber2] = useState("");
  const [address, setAddress] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [validTill, setValidTill] = useState();
  const [validFrom, setValidFrom] = useState();
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardValidFrom, setCardValidFrom] = useState();
  const [cardValidTill, setCardValidTill] = useState();
  const [cardPin, setCardPin] = useState("");

  const [updateId, setUpdateId] = useState("");

  const [tfn, setTfn] = useState("");
  const [tfnId, setTfnId] = useState("");
  const [tfnModal, setTfnModal] = useState(false);

  const [downloaded, setDownloaded] = useState(0);
  const [online, setOnline] = useState(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (localStorage.getItem("varillaadmin") === "loggedin") {
      //do something
      axios
        .get("/users")
        .then((res) => {
          console.log(res.data);
          setLoading(false);
          setUsers(res.data);
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get("/phone")
        .then((res) => {
          setTfn(res.data[0].phone);
          setTfnId(res.data[0]._id);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });

      axios
        .get("/status")
        .then((res) => {
          setDownloaded(res.data[0].downloaded);
          setOnline(res.data[0].online);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      props.history.push("/");
    }
  }, [props.history]);

  const deleteUser = (userid) => {
    axios
      .delete("/users", { data: { userid: userid } })
      .then((res) => {
        const toRemove = res.data;

        const afterRemoval = users.filter((user) => {
          return user._id !== toRemove._id;
        });

        setUsers(afterRemoval);

        message.success("User deleted successfully !");
      })
      .catch((err) => {
        console.log(err);
        message.error("Cannot delete user !");
      });
  };

  const createUser = () => {
    axios
      .post("/users", {
        name,
        phoneNumber,
        phoneNumber2,
        address,
        validTill,
        validFrom,
        cards,
        zipcode,
      })
      .then((res) => {
        let afterAdding = users;
        afterAdding.push(res.data);
        setUsers(afterAdding);
        toggleCreateUserModal(false);
        message.success("User created successfully !");
      })
      .catch((err) => {
        console.log(err);
        message.error("User could not be created !");
      });
  };

  const updateUser = () => {
    axios
      .put("/users", {
        name: name,
        phoneNumber: phoneNumber,
        phoneNumber2: phoneNumber2,
        address: address,
        validTill: validTill,
        userid: updateId,
        validFrom: validFrom,
        cards: cards,
        zipcode: zipcode,
      })
      .then((res) => {
        const toRemove = res.data;

        const afterRemoval = users.filter((user) => {
          return user._id !== toRemove._id;
        });

        let afterAdding = afterRemoval;
        afterAdding.push(res.data);
        setUsers(afterAdding);
        toggleUpdateUserModal(false);
        setUpdateId("");
        setName("");
        setPhoneNumber("");
        setAddress("");
        setZipcode("");
        setValidTill("");
        setValidFrom("");
        setCards([]);
        setNewCard(false);
        message.success("Updated the user !");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateTFN = () => {
    axios
      .put("/phone", {
        phone: tfn,
        phoneid: tfnId,
      })
      .then((res) => {
        message.success("TFN updated !");
        setTfnModal(false);
      })
      .catch((err) => {
        message.error("Can't update !");
      });
  };

  const onValidFromChange = (date) => {
    setValidFrom(date?._d);
  };

  const onValidTillChange = (date) => {
    setValidTill(date?._d);
  };

  return (
    <>
      {/* create new user modal */}
      <Modal
        title="Create New User"
        centered
        footer={null}
        visible={createUserModal}
        onOk={() => toggleCreateUserModal(false)}
        onCancel={() => toggleCreateUserModal(false)}
      >
        <p>Enter following details</p>
        <br />

        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <br />
        <br />
        <Input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone Number"
        />
        <br />
        <br />
        <Input
          type="text"
          value={phoneNumber2}
          onChange={(e) => setPhoneNumber2(e.target.value)}
          placeholder="Phone Number 2"
        />
        <br />
        <br />
        <Input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
        />
        <br />
        <br />
        <Input
          type="text"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
          placeholder="Zip Code"
        />
        <br />
        <br />
        <DatePicker
          style={{ width: "100%" }}
          placeholder="Subscription Valid From"
          onChange={onValidFromChange}
        />
        <br />
        <br />
        <DatePicker
          style={{ width: "100%" }}
          placeholder="Subscription Valid Till"
          onChange={onValidTillChange}
        />
        <br />
        <br />
        <Button danger={newCard} onClick={() => setNewCard(!newCard)}>
          {newCard ? <span> - Remove </span> : <span>+ Add </span>} Card
        </Button>
        <br />
        <br />
        {newCard && (
          <div>
            <Divider>New Card Details</Divider>
            <Input
              type="number"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
            <br />
            <br />
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Card Valid From"
              onChange={(date) => setCardValidFrom(date._d)}
            />
            <br />
            <br />
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Card Valid Till"
              onChange={(date) => setCardValidTill(date._d)}
            />
            <br />
            <br />
            <Input
              type="number"
              placeholder="Card PIN"
              value={cardPin}
              onChange={(e) => setCardPin(e.target.value)}
            />

            <br />
            <br />
            <Button
              onClick={() => {
                const temp = cards;
                const nC = {
                  cardNumber,
                  cardValidFrom,
                  cardValidTill,
                  cardPin,
                };
                temp.push(nC);
                setCards(temp);
                setCardNumber("");
                setCardPin("");
              }}
            >
              Add To List
            </Button>
          </div>
        )}

        <br />
        {cards.length !== 0 && <h3>Card List</h3>}

        {cards.map((card, index) => {
          return (
            <div key={index}>
              <Divider />
              <h3 style={{ fontDecoration: "underline" }}>
                Card Detail {index + 1}
              </h3>
              <Row>
                <Col span={18}>Card Number : {card?.cardNumber}</Col>
                <Col span={6}>Card Pin : {card?.cardPin}</Col>
              </Row>
              <br />
              <Row>
                <Col span={12}>
                  Valid From : {moment(card.cardValidFrom).format("DD-MM-YYYY")}
                </Col>
                <Col span={12}>
                  Valid Till : {moment(card.cardValidTill).format("DD-MM-YYYY")}
                </Col>
              </Row>
              <br />
            </div>
          );
        })}

        <Button type="primary" onClick={createUser}>
          Create
        </Button>
      </Modal>

      {/* update user modal */}
      <Modal
        title="Update User"
        centered
        footer={null}
        visible={updateUserModal}
        onOk={() => {
          toggleUpdateUserModal(false);
          setUpdateId("");
          setName("");
          setPhoneNumber("");
          setPhoneNumber2("");
          setAddress("");
          setZipcode("");
          setValidTill();
          setValidFrom();
          setCards([]);
        }}
        onCancel={() => {
          toggleUpdateUserModal(false);
          setUpdateId("");
          setName("");
          setPhoneNumber("");
          setPhoneNumber2("");
          setAddress("");
          setZipcode("");
          setValidTill("");
          setValidFrom();
          setCards([]);
        }}
      >
        <p>Enter following details</p>
        <br />

        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <br />
        <br />
        <Input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone Number"
        />
        <br />
        <br />
        <Input
          type="text"
          value={phoneNumber2}
          onChange={(e) => setPhoneNumber2(e.target.value)}
          placeholder="Phone Number 2"
        />
        <br />
        <br />
        <Input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
        />
        <br />
        <br />
        <Input
          type="text"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
          placeholder="Zip Code"
        />
        <br />
        <br />
        <DatePicker
          style={{ width: "100%" }}
          placeholder="Subscription Valid From"
          onChange={(date) => setValidFrom(date._d)}
        />
        <br />
        <br />
        <DatePicker
          style={{ width: "100%" }}
          placeholder="Subscription Valid Till"
          onChange={(date) => setValidTill(date._d)}
        />
        <br />
        <br />
        <Button danger={newCard} onClick={() => setNewCard(!newCard)}>
          {newCard ? <span> - Remove </span> : <span>+ Add </span>} Card
        </Button>
        <br />
        <br />
        {newCard && (
          <div>
            <Divider>New Card Details</Divider>
            <Input
              type="number"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
            <br />
            <br />
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Card Valid From"
              onChange={(date) => setCardValidFrom(date._d)}
            />
            <br />
            <br />
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Card Valid Till"
              onChange={(date) => setCardValidTill(date._d)}
            />
            <br />
            <br />
            <Input
              type="number"
              placeholder="Card PIN"
              value={cardPin}
              onChange={(e) => setCardPin(e.target.value)}
            />

            <br />
            <br />
            <Button
              onClick={() => {
                const temp = cards;
                const nC = {
                  cardNumber,
                  cardValidFrom,
                  cardValidTill,
                  cardPin,
                };
                temp.push(nC);
                setCards(temp);
                setCardNumber("");
                setCardPin("");
              }}
            >
              Add To List
            </Button>
          </div>
        )}

        <br />
        {cards.length !== 0 && <h3>Card List</h3>}

        {cards.map((card, index) => {
          return (
            <div key={index}>
              <Divider />
              <Row justify="center">
                <Col span={12}>
                  <h3 style={{ fontDecoration: "underline" }}>
                    Card Detail {index + 1}
                  </h3>
                </Col>
                <Col span={12}>
                  <Button size="small" danger>
                    Delete Card {index + 1}
                  </Button>
                </Col>
              </Row>

              <Row>
                <Col span={18}>Card Number : {card?.cardNumber}</Col>
                <Col span={6}>Card Pin : {card?.cardPin}</Col>
              </Row>
              <br />
              <Row>
                <Col span={12}>
                  Valid From : {moment(card.cardValidFrom).format("DD-MM-YYYY")}
                </Col>
                <Col span={12}>
                  Valid Till : {moment(card.cardValidTill).format("DD-MM-YYYY")}
                </Col>
              </Row>
              <br />
            </div>
          );
        })}
        <Button onClick={updateUser}>Update</Button>
      </Modal>

      {/* phone modal */}
      <Modal
        title="Current TFN"
        centered
        footer={null}
        visible={tfnModal}
        onOk={() => setTfnModal(false)}
        onCancel={() => setTfnModal(false)}
      >
        <p>TFN details</p>
        <br />

        <Input
          type="text"
          value={tfn}
          onChange={(e) => setTfn(e.target.value)}
          placeholder="Current TFN"
        />
        <br />
        <br />
        <Button onClick={updateTFN}>Update</Button>
      </Modal>

      <S.Container>
        <h1>Dashboard</h1>

        <br />
        <br />

        <h3>CREATE NEW USER</h3>
        <Button
          onClick={() => toggleCreateUserModal(true)}
          style={{ marginRight: "10px" }}
        >
          Create user
        </Button>

        <Button
          style={{ marginRight: "10px" }}
          onClick={() => setTfnModal(true)}
        >
          View TFN
        </Button>

        <Button
          onClick={() => {
            localStorage.setItem("varillaadmin", null);
            props.history.push("/");
          }}
        >
          Logout
        </Button>
        <br />
        <br />

        <h4 style={{ fontWeight: "bolder", color: "green" }}>
          Total Premium Users : {users.length}
        </h4>

        <h4 style={{ fontWeight: "bolder", color: "green" }}>
          Total Downloads : {downloaded}
        </h4>

        <h4 style={{ fontWeight: "bolder", color: "green" }}>
          Total Online Users : {online}
        </h4>

        <h3>USER INFO</h3>
        <br />
        <div>
          <Row>
            <Col span={6}>
              <strong>Name</strong>
            </Col>
            <Col span={4}>
              <strong>Phone Number</strong>
            </Col>
            <Col span={4}>
              <strong>ActivationKey</strong>
            </Col>
            <Col span={4}>
              <strong>Valid Till</strong>
            </Col>
            <Col span={6}>
              <strong>Operations</strong>
            </Col>
          </Row>

          {loading ? (
            <Spin indicator={antIcon} />
          ) : (
            <>
              {users.length === 0 && (
                <>
                  <br />
                  <br />
                  <br />
                  <Row>
                    <Col span={6}>Empty</Col>
                    <Col span={4}>Empty</Col>
                    <Col span={4}>Empty</Col>
                    <Col span={4}>Empty</Col>
                    <Col span={6}>Empty</Col>
                  </Row>
                </>
              )}

              {users.length !== 0 &&
                users.map((user) => (
                  <div key={user._id}>
                    <Divider />
                    <Row>
                      <Col span={6}>{user.name}</Col>
                      <Col span={4}>{user.phoneNumber}</Col>
                      <Col span={4}>{user.activationKey}</Col>
                      <Col span={4}>
                        {moment(user.validTill).format("DD-MM-YYYY")}
                      </Col>
                      <Col span={6}>
                        <Button
                          style={{
                            marginRight: "5px",
                          }}
                          onClick={() => {
                            toggleUpdateUserModal(true);
                            setUpdateId(user._id);
                            setName(user.name);
                            setPhoneNumber(user.phoneNumber);
                            setPhoneNumber2(user.phoneNumber2);
                            setCards(user.cards);
                            setAddress(user.address);
                            setZipcode(user.zipcode);
                            setValidTill(user.validTill);
                          }}
                        >
                          Update
                        </Button>
                        <Button danger onClick={() => deleteUser(user._id)}>
                          Delete
                        </Button>
                      </Col>
                    </Row>
                  </div>
                ))}
            </>
          )}
        </div>
      </S.Container>
    </>
  );
};

export default Dashboard;
