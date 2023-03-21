import React, { useState, useEffect } from 'react'
import Prism from '../images/prism.png'
import Trending from '../images/trending.png'
import Search from '../images/search.png'
import Crypto from '../images/crypto.png'
import Earnings from '../images/earnings.png'
import IPOImage from '../images/ipo.png'
import './ipo.css'


function IPO() {
    const [ipoCalendar, setIpoCalendar] = useState([{}])
    const [stockID, setStockID] = useState('')
    const [allStocks, setAllStocks] = useState([])
    const [filteredStocks, setFilteredStocks] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [focused, setFocused] = useState(false)

    let today = new Date().toISOString().split('T')[0]
    let nextWeek = new Date()
    nextWeek.setDate(new Date().getDate() + 30);
    let nextWeekDate = nextWeek.toISOString().split('T')[0];

    useEffect(() => {
        fetch(`https://finnhub.io/api/v1/calendar/ipo?from=${today}&to=${nextWeekDate}&token=cg3l4g9r01qmn4dp9sggcg3l4g9r01qmn4dp9sh0`).then(
            response => response.json()
        ).then(
            data => {
                setIpoCalendar(data.ipoCalendar.reverse())
            }
        )
    }, [])

    async function getAllStocks() {
        const finnhub = await fetch(`https://finnhub.io/api/v1/stock/symbol?exchange=US&currency=USD&token=cg3l4g9r01qmn4dp9sggcg3l4g9r01qmn4dp9sh0`)
        const finnhubRes = await finnhub.json()
        setAllStocks(finnhubRes)
    }

    useEffect(() => {
        getAllStocks()
    }, [])

    useEffect(() => {
        setFilteredStocks(allStocks.filter(item => item.displaySymbol.startsWith(stockID)))
        if (inputValue === '') {
            setFocused(false)
        }
    }, [stockID])

    function handleEnter(e) {
        if (e.key === 'Enter') {
            window.location.href=`/search/${stockID}`
        }
    }

    return (
        <div id='ipo-app'>
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
            <div id='right-side-ipos'>
                <div id='top'>
                    <h1>Upcoming IPOs</h1>
                    <h3>Find new and upcoming initial public offerings</h3>
                </div>
                <div id='table-headers'>
                    <h3 id='dateheader'>DATE</h3>
                    <h3 id='exchangeheader'>EXCHANGE</h3>
                    <h3 id='companyheader'>COMPANY</h3>
                    <h3 id='symbolheader'>SYMBOL</h3>
                    <h3 id='openingheader'>OPENING PRICE</h3>
                    <h3 id='sharesheader'>SHARES</h3>
                    <h3 id='sharesvalueheader'>SHARES VALUE</h3>
                </div>
                <div id='ipo-data'>
                    {ipoCalendar.map((ipo) => {
                        return (
                            <div key={ipoCalendar.indexOf(ipo)} className='ipos'>
                                <h3 id='ipoDate'>{ipo.date}</h3>
                                <h3 id='ipoExch'>{ipo.exchange}</h3>
                                <h3 id='ipoCompany'>{ipo.name}</h3>
                                <h3 id='ipoSymbol'>{ipo.symbol}</h3>
                                <h3 id='openingPrice'>${ipo.price}</h3>
                                <h3 id='shares'>{Number(ipo.numberOfShares).toLocaleString()}</h3>
                                <h3 id='sharesValue'>${Number(ipo.totalSharesValue).toLocaleString()}</h3>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default IPO