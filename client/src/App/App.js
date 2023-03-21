import React, { useEffect, useState } from 'react'
import './App.css'
import Prism from '../images/prism.png'
import Trending from '../images/trending.png'
import Search from '../images/search.png'
import Crypto from '../images/crypto.png'
import Earnings from '../images/earnings.png'
import IPO from '../images/ipo.png'

function App() {
    //const FINNHUBAPIKEY = 'cg3l4g9r01qmn4dp9sggcg3l4g9r01qmn4dp9sh0'
    const [topTenTrending, setTopTenTrending] = useState([])
    const [stockID, setStockID] = useState('')
    const [allStocks, setAllStocks] = useState([])
    const [filteredStocks, setFilteredStocks] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [focused, setFocused] = useState(false)

    async function getAllStocks() {
        const finnhub = await fetch(`https://finnhub.io/api/v1/stock/symbol?exchange=US&currency=USD&token=cg3l4g9r01qmn4dp9sggcg3l4g9r01qmn4dp9sh0`)
        const finnhubRes = await finnhub.json()
        setAllStocks(finnhubRes)
    }

    useEffect(() => {
        getAllStocks()
        fetch("http://localhost:8888/api/apewisdom").then(
            response => response.json()
        ).then(
            data => {
                setTopTenTrending(data.splice(0,10))
            }
        )
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

    return(
        <div className='Dashboard'>
            <div id='app-nav'>
                <div id='app-logo' onClick={() => window.location.href='/'}>
                    <h1>Prism</h1>
                    <img alt='' src={Prism}></img> 
                </div>
                <div id='app-search'>
                    <img alt='' src={Search}></img>
                    <input placeholder='aapl' onClick={() => inputValue.length > 0 ? setFocused(true) : setFocused(false)} onBlur={() => setTimeout(() => {setFocused(false)}, 200)} value={inputValue} onChange={(e) => {setFocused(true); setStockID(e.target.value.toUpperCase()); setInputValue(e.target.value)}} onKeyDown={(e) => handleEnter(e)}></input>
                    {focused ?
                    <div id='suggestions'>
                        {filteredStocks.map((stock) => {
                            return(
                                <div key={filteredStocks.indexOf(stock)} className='searchSuggestions'>
                                    <div id='suggestion' onClick={() => {setInputValue(stock.displaySymbol.toLowerCase()); window.location.href=`search/${stock.displaySymbol}`}}>
                                        {stock.displaySymbol}
                                    </div>
                                </div>
                            )
                        })}
                    </div> :
                    null
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
                    <img alt='' src={IPO}></img>
                    <h3>Upcoming IPOs</h3>
                </div>
            </div>
            <div id='right-side'>
                <div id='top'>
                    <h1>Trending</h1>
                    <h3>Explore stocks trending on social media</h3>
                </div>
                <div id='table-headers'>
                    <h4 id='ticker-header'>TICKER</h4>
                    <h4 id='name-header'>NAME</h4>
                    <h4 id='mentions-header'>MENTIONS</h4>
                    <h4 id='mchange-header'>24H %</h4>
                    <h4 id='rank-header'>24H RANK</h4>
                    <h4 id='upvotes-header'>UPVOTES</h4>
                </div>
                <div id='trending-data'>
                    {topTenTrending.map((stock) => {
                        let percentChange = Math.round(((stock.mentions - stock.mentions_24h_ago)/stock.mentions_24h_ago)*100) + '%'
                        let rankChange = (stock.rank_24h_ago - stock.rank)
                        let disRankChange
                        if (rankChange > 0) {
                            disRankChange = '↑ ' + rankChange
                        } else if (rankChange < 0) {
                            disRankChange = '↓ ' + rankChange
                        } else {
                            disRankChange = '-'
                        }
                        return (
                            <div key={topTenTrending.indexOf(stock)} className='stocks'>
                                <h3 id='ticker' onClick={() => window.location.href=`/search/${stock.ticker}`}>{stock.ticker}</h3>
                                <h3 id='name'>{stock.name.replace(/&amp;/, '&')}</h3>
                                <h3 id='mentions'>{stock.mentions}</h3>
                                <h3 id='mchange'>{percentChange}</h3>
                                <h3 id='rchange' style={{color: rankChange > 0 ? 'rgb(139, 238, 139)' : rankChange < 0 ? 'rgb(253, 87, 87)' : 'white'}}>{disRankChange}</h3>
                                <h3 id='upvotes'>{stock.upvotes}</h3>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default App

