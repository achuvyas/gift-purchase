import React, { useEffect, useState } from "react";
import "./App.css";

import "@fortawesome/fontawesome-free/css/all.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import apiService from "./services/apiService";

const merchants = ["Uber", "Swiggy", "Zomato", "Ola", "Burger King", "Trends"];

const App = () => {
  const [showInputSection, setShowInputSection] = useState(false);
  const [selectedMerchant, selectMerchant] = useState("");
  const [giftCardAmount, setGiftCardAmount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [cashbackExpected, setCashbackExpected] = useState(0);
  const [editId, setEditId] = useState("");

  const toggleInput = () => {
    setEditId("");
    selectMerchant("");
    setGiftCardAmount();
    setCashbackExpected(0);
    setShowInputSection(!showInputSection);
  };

  const handleSubmit = async () => {
    if (selectedMerchant == "") {
      alert("Select a Merchant to continue");
    } else if (!giftCardAmount) {
      alert("Amount should not be zero");
    } else {
      let order = {
        merchantName: selectedMerchant,
        discountPercent: 4,
        totalAmount: parseInt(giftCardAmount),
        cashbackExpected: Number((parseInt(giftCardAmount) * 0.04).toFixed(2)),
      };
      if (editId) {
        try {
          await apiService.patch(`/${editId}`, order);
        } catch (e) {
          alert(e);
        }
      } else {
        try {
          await apiService.post("", order);
        } catch (e) {
          alert(e);
        }
      }

      let updatedOrders = await apiService.get("");
      setOrders(updatedOrders);

      selectMerchant("");
      setGiftCardAmount(0);
      setCashbackExpected(0);

      setShowInputSection(!showInputSection);
    }
  };

  const handleInputChange = (event) => {
    const amount = event.target.value;
    setGiftCardAmount(amount);
    if (amount != 0) {
      setCashbackExpected(Number(parseFloat(amount) * 0.04).toFixed(2));
    }
  };

  const handleDelete = async (item) => {
    try {
      await apiService.delete(item._id);
      const response = await apiService.get("");
      setOrders(response);
    } catch (e) {
      console.log(e);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    selectMerchant(item.merchantName);
    setGiftCardAmount(item.totalAmount);
    setCashbackExpected(Number(parseFloat(item.totalAmount * 0.04)).toFixed(2));
    setShowInputSection(!showInputSection);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await apiService.get("");
        setOrders(response);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, []);

  return !showInputSection ? (
    <div className="container">
      <div className="home-header">
        Buy Gift Cards and Claim your Cashback
        <button className="submit-btn" onClick={toggleInput}>
          Submit{" "}
        </button>
      </div>

      {/* tables */}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Merchant</th>
              <th>Cashback Available</th>
              <th>Gift Card Amount</th>
              <th>Cashback Expected</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((val, key) => {
              return (
                <tr key={val._id}>
                  <td>{val.merchantName}</td>
                  <td>{val.discountPercent}</td>
                  <td>{val.totalAmount}</td>
                  <td>{val.cashbackExpected}</td>
                  <td>
                    <button onClick={() => handleEdit(val)}>Edit</button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(val)}>Delete</button>
                  </td>
                </tr>
              );
            })}
            <tr>
              <td>
                <strong>Total</strong>
              </td>
              <td></td>
              <td>
                {orders.reduce(
                  (total, val) =>
                    total + Number(parseFloat(val.totalAmount).toFixed(2)),
                  0
                )}
              </td>
              <td>
                {parseFloat(
                  orders.reduce(
                    (total, val) =>
                      total +
                      Number(parseFloat(val.cashbackExpected).toFixed(2)),
                    0
                  )
                ).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <div className="container">
      <div className="submit-header">
        <button
          style={{
            marginRight: 50,
          }}
          onClick={toggleInput}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            style={{ width: 30, height: 30 }}
          />
        </button>
        Add Merchant
      </div>

      <div className="selection-container">
        <div className="input-container">
          <label htmlFor="my-select">Select Merchant:</label>
          <select
            className="drop-box-ctn"
            id="select-merchant"
            value={selectedMerchant}
            onChange={(event) => {
              selectMerchant(event.target.value);
            }}
          >
            <option value="" disabled>
              Choose
            </option>
            {merchants.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="discount-container">
          <div className="discount-view"> 4% Cashback</div>
          <div className="discount-view">
            {cashbackExpected} <br /> Cashback Expected
          </div>
        </div>

        <div className="input-container">
          <label htmlFor="gift-amt">Gift Card Amount:</label>
          <input
            type="number"
            defaultValue={giftCardAmount}
            className="drop-box-ctn"
            onChange={handleInputChange}
          />
        </div>

        <button className="apply-btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default App;
