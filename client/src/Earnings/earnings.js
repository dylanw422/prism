import React, { useState, useEffect } from 'react'
import Prism from '../images/prism.png'
import Trending from '../images/trending.png'
import Search from '../images/search.png'
import Crypto from '../images/crypto.png'
import Earnings from '../images/earnings.png'
import IPOImage from '../images/ipo.png'
import './earnings.css'

function EarningsApp() {
    const [stockID, setStockID] = useState('')
    const [earnings, setEarnings] = useState([])
    const [allStocks, setAllStocks] = useState([])
    const [filteredStocks, setFilteredStocks] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [focused, setFocused] = useState(false)

    let today = new Date().toISOString().split('T')[0]
    let nextWeek = new Date()
    nextWeek.setDate(new Date().getDate() + 5);
    let nextWeekDate = nextWeek.toISOString().split('T')[0];

    function handleEnter(e) {
        if (e.key === 'Enter') {
            window.location.href=`/search/${stockID}`
        }
    }

    async function earningsFetch() {
        const finnhub = await fetch(`https://finnhub.io/api/v1/calendar/earnings?from=${today}&to=${nextWeekDate}&token=cg3l4g9r01qmn4dp9sggcg3l4g9r01qmn4dp9sh0`)
        const finnhubRes = await finnhub.json()
        setEarnings(finnhubRes.earningsCalendar.filter(item => item.hour !== '').reverse())
    }

    async function getAllStocks() {
        const finnhub = await fetch(`https://finnhub.io/api/v1/stock/symbol?exchange=US&currency=USD&token=cg3l4g9r01qmn4dp9sggcg3l4g9r01qmn4dp9sh0`)
        const finnhubRes = await finnhub.json()
        setAllStocks(finnhubRes)
    }

    useEffect(() => {
        console.log(earnings)
    }, [earnings])

    useEffect(() => {
        getAllStocks()
        earningsFetch()
    }, [])

    useEffect(() => {
        setFilteredStocks(allStocks.filter(item => item.displaySymbol.startsWith(stockID)))
        if (inputValue === '') {
            setFocused(false)
        }
    }, [stockID])

    return(
        <div id='earnings-page'>
            <div id='app-nav'>
                <div id='app-logo' onClick={() => window.location.href='/'}>
                    <h1>Prism</h1>
                    <img alt='' src={Prism}></img> 
                </div>
                <div id='app-search'>
                    <img alt='' src={Search}></img>
                    <input placeholder='aapl' value={inputValue} onClick={() => inputValue.length > 0 ? setFocused(true) : setFocused(false)} onBlur={() => setTimeout(() => {setFocused(false)}, 200)} onChange={(e) => {setFocused(true); setStockID(e.target.value.toUpperCase()); setInputValue(e.target.value); setFocused(true)}} onKeyDown={(e) => handleEnter(e)}></input>
                    { focused ?

                        <div id='suggestions'> 
                            {filteredStocks.map((stock) => {
                                return (
                                    <div key={filteredStocks.indexOf(stock)} className='searchSuggestions'>
                                        <div id='suggestion' onClick={() => {setInputValue(stock.displaySymbol.toLowerCase()); window.location.href=`search/${stock.displaySymbol}`}}>
                                            {stock.displaySymbol}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        : null
                    }
                </div>
                <div id='trending' onClick={() => window.location.href='/trending'}>
                    <img alt='' src={Trending}></img>
                    <h3>Trending</h3>
                </div>
                <div id='crypto' onClick={() => window.location.href='/crypto'}>
                    <img alt='' src={Crypto}></img>
                    <h3>Crypto</h3>
                </div>
                <div id='earnings' onClick={() => window.location.href='/earnings'}>
                    <img alt='' src={Earnings}></img>
                    <h3>Earnings</h3>
                </div>
                <div id='ipo' onClick={() => window.location.href='/ipo'}>
                    <img alt='' src={IPOImage}></img>
                    <h3>Upcoming IPOs</h3>
                </div>
            </div>
            <div id='earnings-right-side'>
                <div id='top'>
                    <h1>Earnings Calendar</h1>
                    <h3>Upcoming earnings calls</h3>
                </div>
                <div id='table-headers'>
                    <h4 id='er-date-header'>DATE</h4>
                    <h4 id='er-stock-header'>SYMBOL</h4>
                    <h4 id='er-hour-header'>BMO/AMC</h4>
                    <h4 id='er-estimate-header'>ESTIMATE</h4>
                    <h4 id='er-actual-header'>ACTUAL</h4>
                    <h4 id='er-surprise-header'>SURPISE</h4>
                </div>
                <div id='earnings-data'>
                    {earnings.map((earning) => {
                        let hour
                        if (earning.hour === 'amc') {
                            hour = 'After Market Close'
                        } else if (earning.hour == 'bmo') {
                            hour = 'Before Market Open'
                        } else {
                            hour = ''
                        }
                        let surprise = (earning.epsActual && earning.epsEstimate) ? (earning.epsActual - earning.epsEstimate).toFixed(2) : ''
                        return (
                            <div key={earnings.indexOf(earning)} className='earnings'>
                                <h3 id='er-date'>{earning.date}</h3>
                                <h3 id='er-symbol' onClick={() => window.location.href=`/search/${earning.symbol}`}>{earning.symbol}</h3>
                                <h3 id='er-hour'>{hour}</h3>
                                <h3 id='er-estimate'>{earning.epsEstimate}</h3>
                                <h3 id='er-actual'>{earning.epsActual}</h3>
                                <h3 id='er-surprise' style={{color: surprise > 0 ? 'rgb(139, 238, 139)' : 'rgb(253, 87, 87)'}}>{surprise}</h3>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default EarningsApp