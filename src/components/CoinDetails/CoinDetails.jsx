import React from 'react'
import { useEffect, useState } from 'react'
import { Baseurl } from '../baseUrl'
import Loader from '../Loader'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi"
import { IoPulseOutline } from "react-icons/io5"
import './coinDetail.css'
import CoinChart from './CoinChart'
import Navbar from '../Navbar/Navbar'

const CoinDetails = () => {
  const [coin, setCoin] = useState([])
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const [currency, setCurrency] = useState('inr')
  const [descriptionSegments, setdescriptionSegments] = useState('')
  const currencySymbol = currency === 'inr' ? '₹' : '$'
  const profit = coin.market_data?.price_change_percentage_24h > 0
  useEffect(() => {
    const getCoin = async () => {
      try {
        const { data } = await axios.get(`${Baseurl}/coins/${id}`)
        setCoin(data)
        const descriptionSegments = data.description['en'].split('.');
        setdescriptionSegments(descriptionSegments)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    getCoin()
  }, [id])


  return (
    <>
      {
        loading ? <Loader /> : <>
        <Navbar/>
          <div className=' coin-detail'  >
            <div className='coin-info'>
              <div className='btn'>
                <button onClick={() => setCurrency('inr')} >inr</button>
                <button onClick={() => setCurrency('usd')}>usd</button>
              </div>
              <div className="time">
                Last Updated: {coin.last_updated.substring(0,19)}
              </div>
              <div className="coin-image">
                <img height={"150px"} src={coin.image.large} alt="" />
              </div>
              <div className="coin-name">
                Name: {coin.name}
              </div>
              <div className="coin-price">
                Current Price: {currencySymbol}  {coin.market_data.current_price[currency]}
              </div>
              <div className="coin-profit">
                Price Change % (Last 24 hrs): {profit ? <BiSolidUpArrow color='green' /> : <BiSolidDownArrow color='red' />}
                {coin.market_data.price_change_percentage_24h} %
              </div>
              <div className='market-rank'>
                <IoPulseOutline color='#9823db' />
                &nbsp;Market Cap Rank: #{coin.market_cap_rank}
              </div>
              <div className='coin-desc'>
                <p>
                  {descriptionSegments.length > 3 ? (descriptionSegments[0] + '.' + descriptionSegments[1] + '.'+descriptionSegments[2]+'.'):(
                  descriptionSegments[0]+'.'
                )} </p>
              </div>
            </div>
            <div>
            </div>
            <div>

            <CoinChart currency={currency} /> 
            </div>
          </div>
        </>
      }

    </>
  )
}

export default CoinDetails

