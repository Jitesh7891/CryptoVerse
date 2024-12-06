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
  
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');
  const [currency, setCurrency] = useState('usd');
  const [sortPriceAsc, setSortPriceAsc] = useState(false); // For price sorting
  const [sortMarketCapAsc, setSortMarketCapAsc] = useState(false); // For market cap sorting
  const currencySymbol = currency === 'inr' ? '₹' : '$';

  useEffect(() => {
    const getCoinsData = async () => {
      try {
        const { data } = await axios.get(`${Baseurl}/coins/markets?vs_currency=${currency}`);
        setCoins(data);
        setLoading(false);
        setSortPriceAsc(false);
        setSortMarketCapAsc(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getCoinsData();
  }, [currency]);

  // Function to sort coins by price
  const sortByPrice = () => {
    const sortedCoins = [...coins].sort((a, b) => {
      if (sortPriceAsc) {
        return a.current_price - b.current_price; // Ascending order
      } else {
        return b.current_price - a.current_price; // Descending order
      }
    });
    setCoins(sortedCoins);
    setSortPriceAsc(!sortPriceAsc); // Toggle sort order for next click
  };

  // Function to sort coins by market cap
  const sortByMarketCap = () => {
    const sortedCoins = [...coins].sort((a, b) => {
      if (sortMarketCapAsc) {
        return a.market_cap - b.market_cap; // Ascending order
      } else {
        return b.market_cap - a.market_cap; // Descending order
      }
    });
    setCoins(sortedCoins);
    setSortMarketCapAsc(!sortMarketCapAsc); // Toggle sort order for next click
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className='coin-container'>
          <Navbar />
          
          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder='Search Your Coins '
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className='coins-title'>All coins</div>
          <div className='btns'>
            <button onClick={() => setCurrency('inr')}>inr</button>
            <button onClick={() => setCurrency('usd')}>usd</button>
            <button onClick={sortByPrice}>
              Filter by Price &nbsp;
              {sortPriceAsc ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </button>
            <button onClick={sortByMarketCap}>
              Filter by Market Cap &nbsp;
              {sortMarketCapAsc ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </button>
          </div>

          {/* Coin Table */}
          <div className='coin-table-container'>
            <table className='coin-table'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Current Price</th>
                  <th>Market Cap</th>
                  <th>Symbol</th>
                </tr>
              </thead>
              <tbody>
                {coins
                  .filter((coin) =>
                    coin.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((coin, index) => (
                    <tr key={index} style={{cursor:"pointer"}} onClick={() => navigate(`/coins/${coin.id}`)}  >
                      <td>{coin.name}</td>
                      <td>{currencySymbol}{coin.current_price.toFixed(2)}</td>
                      <td>{currencySymbol}{coin.market_cap}</td>
                      <td>
                        <img src={coin.image} alt={coin.name} height="50" />
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
