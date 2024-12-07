import React, { useEffect, useState } from 'react';
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import { Baseurl } from '../baseUrl';
import Loader from '../Loader.jsx';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import './coins.css';

const Coins = () => {
  const navigate = useNavigate();

  // State for managing loading status
  const [loading, setLoading] = useState(true);

  // State for storing fetched coins data
  const [coins, setCoins] = useState([]);

  // State for storing user input in the search bar
  const [search, setSearch] = useState('');

  // State for managing selected currency
  const [currency, setCurrency] = useState('usd');

  // State for toggling sorting order for price
  const [sortPriceAsc, setSortPriceAsc] = useState(false);

  // State for toggling sorting order for market cap
  const [sortMarketCapAsc, setSortMarketCapAsc] = useState(false);

  // Determine the currency symbol based on the selected currency
  const currencySymbol = currency === 'inr' ? '₹' : '$';

  // Fetch coins data from API whenever the selected currency changes
  useEffect(() => {
    const getCoinsData = async () => {
      try {
        const { data } = await axios.get(`${Baseurl}/coins/markets?vs_currency=${currency}`);
        setCoins(data);
        setLoading(false);
        setSortPriceAsc(false); // Reset sorting state
        setSortMarketCapAsc(false);
      } catch (error) {
        console.error("Error fetching coin data:", error);
        setLoading(false);
      }
    };

    getCoinsData();
  }, [currency]);

  // Function to sort coins by their current price
  const sortByPrice = () => {
    const sortedCoins = [...coins].sort((a, b) => 
      sortPriceAsc ? a.current_price - b.current_price : b.current_price - a.current_price
    );
    setCoins(sortedCoins);
    setSortPriceAsc(!sortPriceAsc); // Toggle sorting order for next click
  };

  // Function to sort coins by their market capitalization
  const sortByMarketCap = () => {
    const sortedCoins = [...coins].sort((a, b) =>
      sortMarketCapAsc ? a.market_cap - b.market_cap : b.market_cap - a.market_cap
    );
    setCoins(sortedCoins);
    setSortMarketCapAsc(!sortMarketCapAsc); // Toggle sorting order for next click
  };

  return (
    <>
      {loading ? (
        // Show loader while data is being fetched
        <Loader />
      ) : (
        <div className="coin-container">
          <Navbar />

          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search Your Coins"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="coins-title">All Cryptocurrencies</div>

          {/* Buttons for Currency Selection and Sorting */}
          <div className="btns">
            <button onClick={() => setCurrency('inr')}>INR</button>
            <button onClick={() => setCurrency('usd')}>USD</button>
            <button onClick={sortByPrice}>
              Sort by Price &nbsp;{sortPriceAsc ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </button>
            <button onClick={sortByMarketCap}>
              Filter by Market Cap &nbsp;{sortMarketCapAsc ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </button>
          </div>

          {/* Coin Table */}
          <div className="coin-table-container">
            <table className="coin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Current Price</th>
                  <th>Market Cap</th>
                  <th>Symbol</th>
                </tr>
              </thead>
              <tbody>
                {/* Filter coins by search input and map over filtered results */}
                {coins
                  .filter((coin) =>
                    coin.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((coin, index) => (
                    <tr
                      key={index}
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/coins/${coin.id}`)}
                    >
                      <td>{coin.name}</td>
                      <td>
                        {currencySymbol}
                        {coin.current_price.toFixed(2)}
                      </td>
                      <td>
                        {currencySymbol}
                        {coin.market_cap}
                      </td>
                      <td>
                        <img src={coin.image} alt={coin.name} height="50"  loading="lazy" />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default Coins;
