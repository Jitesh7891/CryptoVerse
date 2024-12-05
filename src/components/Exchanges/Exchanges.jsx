import React, { useEffect, useState } from 'react';
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import { Baseurl } from '../baseUrl';
import Loader from '../Loader.jsx'; 
import './exchanges.css';

const Exchanges = () => {
  const [loading, setLoading] = useState(true);
  const [exchanges, setExchanges] = useState([]);

  useEffect(() => {
    const getExchangesData = async () => {
      try {
        const { data } = await axios.get(`${Baseurl}/exchanges`);
        setExchanges(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getExchangesData();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className='ex-container'>
  <Navbar />
  <header className='ex-title'>Cryptocurrency Exchanges</header>
  <div className='ex-table-container'>
    <table className='ex-table'>
      <thead>
        <tr>
          <th>Trust Score <br/> Rank</th>
          <th>Name</th>
          <th>Trade <br/> Volume</th>
          <th>Symbol</th>
        </tr>
      </thead>
      <tbody>
        {exchanges.map((item, index) => (
          <tr key={index}>
            <td>{item.trust_score_rank}</td>
            <td>{item.name}</td>
            <td>${item.trade_volume_24h_btc.toFixed(0)}</td>
            <td>
              <img src={item.image} alt={item.name} height="50" />
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
