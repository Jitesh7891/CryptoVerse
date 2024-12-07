import React, { useEffect, useState } from 'react';
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import Loader from "../Loader.jsx";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { Baseurl } from '../baseUrl';
import './exchanges.css';

const Exchanges = () => {
  // State variables
  const [loading, setLoading] = useState(true); // Loading indicator
  const [exchanges, setExchanges] = useState([]); // List of exchanges
  const [search, setSearch] = useState(''); // Search input state
  const [sortTrustRankAsc, setSortTrustRankAsc] = useState(true); // Toggle for trust rank sorting
  const [sortTradeVolumeAsc, setSortTradeVolumeAsc] = useState(true); // Toggle for trade volume sorting

  // Fetch exchanges data from the API
  useEffect(() => {
    const getExchangesData = async () => {
      try {
        const { data } = await axios.get(`${Baseurl}/exchanges`);
        setExchanges(data);
        setLoading(false);
        setSortTrustRankAsc(false); // Default to descending order
        setSortTradeVolumeAsc(false); // Default to descending order
      } catch (error) {
        console.error(error); // Log any errors
        setLoading(false);
      }
    };
    getExchangesData();
  }, []);

  // Function to sort exchanges by trust rank
  const sortByTrustRank = () => {
    const sortedExchanges = [...exchanges].sort((a, b) => {
      if (sortTrustRankAsc) {
        return a.trust_score_rank - b.trust_score_rank; // Ascending order
      } else {
        return b.trust_score_rank - a.trust_score_rank; // Descending order
      }
    });
    setExchanges(sortedExchanges);
    setSortTrustRankAsc(!sortTrustRankAsc); // Toggle sort order
  };

  // Function to sort exchanges by 24-hour trade volume
  const sortByTradeVolume = () => {
    const sortedExchanges = [...exchanges].sort((a, b) => {
      if (sortTradeVolumeAsc) {
        return a.trade_volume_24h_btc - b.trade_volume_24h_btc; // Ascending order
      } else {
        return b.trade_volume_24h_btc - a.trade_volume_24h_btc; // Descending order
      }
    });
    setExchanges(sortedExchanges);
    setSortTradeVolumeAsc(!sortTradeVolumeAsc); // Toggle sort order
  };

  return (
    <>
      {loading ? (
        // Display loader while data is being fetched
        <Loader />
      ) : (
        <div className="ex-container">
          {/* Navbar */}
          <Navbar />

          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search Exchanges"
              onChange={(e) => setSearch(e.target.value)} // Update search input
            />
          </div>

          {/* Title */}
          <div className="ex-title">All Cryptocurrency Exchanges</div>

          {/* Sorting Buttons */}
          <div className="ex-btns">
            <button onClick={sortByTrustRank}>
              Sort by Trust Rank &nbsp;
              {sortTrustRankAsc ? <IoIosArrowDown /> : <IoIosArrowUp />}
            </button>
            <button onClick={sortByTradeVolume}>
              Sort by Trade Volume &nbsp;
              {sortTradeVolumeAsc ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </button>
          </div>

          {/* Exchanges Table */}
          <div className="ex-table-container">
            <table className="ex-table">
              <thead>
                <tr>
                  <th>Trust Rank</th>
                  <th>Name</th>
                  <th>Trade Volume</th>
                  <th>Logo</th>
                </tr>
              </thead>
              <tbody>
                {exchanges
                  .filter((exchange) =>
                    exchange.name.toLowerCase().includes(search.toLowerCase()) // Filter exchanges by search input
                  )
                  .map((exchange, index) => (
                    <tr
                      key={index}
                      style={{ cursor: "pointer" }}
                      onClick={() => window.open(exchange.url, "_blank")} // Open exchange URL in a new tab
                    >
                      <td>{exchange.trust_score_rank}</td>
                      <td>{exchange.name}</td>
                      <td>{exchange.trade_volume_24h_btc.toFixed(2)} BTC</td>
                      <td>
                        <img src={exchange.image} alt={exchange.name} height="50"  loading="lazy" />
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

export default Exchanges;
