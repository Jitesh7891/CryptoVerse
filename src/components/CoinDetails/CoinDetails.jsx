import React, { useEffect, useState } from 'react';
import { Baseurl } from '../baseUrl';
import Loader from '../Loader';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";
import { IoPulseOutline } from "react-icons/io5";
import CoinChart from './CoinChart';
import Navbar from '../Navbar/Navbar';
import './coinDetail.css';

const CoinDetails = () => {
  // State to store coin details
  const [coin, setCoin] = useState([]);

  // State to manage loading state
  const [loading, setLoading] = useState(true);

  // Extract `id` from route parameters
  const { id } = useParams();

  // State to store the selected currency
  const [currency, setCurrency] = useState('inr');

  // State to hold description segments of the coin
  const [descriptionSegments, setDescriptionSegments] = useState('');

  // Determine the symbol for the selected currency
  const currencySymbol = currency === 'inr' ? '₹' : '$';

  // Determine if the price change in the last 24 hours is a profit
  const profit = coin.market_data?.price_change_percentage_24h > 0;

  // Fetch coin details when component mounts or `id` changes
  useEffect(() => {
    const getCoin = async () => {
      try {
        // Fetch coin data from API
        const { data } = await axios.get(`${Baseurl}/coins/${id}`);
        setCoin(data);

        // Extract description and split it into segments
        const descriptionSegments = data.description['en'].split('.');
        setDescriptionSegments(descriptionSegments);

        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching coin details:", error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    getCoin();
  }, [id]);

  return (
    <>
      {loading ? (
        // Show loader while data is loading
        <Loader />
      ) : (
        <>
          <Navbar />
          <div className="coin-detail">
            {/* Coin information section */}
            <div className="coin-info">
              {/* Currency selection buttons */}
              <div className="btn">
                <button onClick={() => setCurrency('inr')}>INR</button>
                <button onClick={() => setCurrency('usd')}>USD</button>
              </div>

              {/* Last updated time */}
              <div className="time">
                Last Updated: {coin.last_updated.substring(0, 19)}
              </div>

              {/* Coin image */}
              <div className="coin-image">
                <img height={"150px"} src={coin.image.large} alt={coin.name}  loading="lazy" />
              </div>

              {/* Coin name */}
              <div className="coin-name">Name: {coin.name}</div>

              {/* Current price */}
              <div className="coin-price">
                Current Price: {currencySymbol} {coin.market_data.current_price[currency]}
              </div>

              {/* Price change percentage (last 24 hours) */}
              <div className="coin-profit">
                Price Change % (Last 24 hrs):{' '}
                {profit ? (
                  <BiSolidUpArrow color="green" />
                ) : (
                  <BiSolidDownArrow color="red" />
                )}
                {coin.market_data.price_change_percentage_24h} %
              </div>

              {/* Market capitalization rank */}
              <div className="market-rank">
                <IoPulseOutline color="#9823db" />
                &nbsp;Market Cap Rank: #{coin.market_cap_rank}
              </div>

              {/* Coin description */}
              <div className="coin-desc">
                <p>
                  {descriptionSegments.length > 3
                    ? `${descriptionSegments[0]}.${descriptionSegments[1]}.${descriptionSegments[2]}.`
                    : `${descriptionSegments[0]}.`}
                </p>
              </div>
            </div>

            {/* Coin chart section */}
            <div>
              <CoinChart currency={currency} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CoinDetails;
