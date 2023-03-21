import React, { useState, useEffect } from 'react'
import Prism from '../images/prism.png'
import Trending from '../images/trending.png'
import Search from '../images/search.png'
import Crypto from '../images/crypto.png'
import Earnings from '../images/earnings.png'
import IPO from '../images/ipo.png'
import Linking from '../images/linking.png'
import './crypto.css'

function CryptoDash() {
    const [cryptoData, setCryptoData] = useState([])
    const [stockID, setStockID] = useState('')
    const [allStocks, setAllStocks] = useState([])
    const [filteredStocks, setFilteredStocks] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [focused, setFocused] = useState(false)
    let cryptos = ['bitcoin', 'ethereum', 'dogecoin', 'cardano', 'solana', 'polkadot', 'litecoin', 'uniswap', 'chainlink', 'vechain']

    async function getAllStocks() {
        const finnhub = await fetch(`https://finnhub.io/api/v1/stock/symbol?exchange=US&currency=USD&token=cg3l4g9r01qmn4dp9sggcg3l4g9r01qmn4dp9sh0`)
        const finnhubRes = await finnhub.json()
        setAllStocks(finnhubRes)
    }

    async function fetchCrypto(crypto) {
        await fetch(('https://api.coingecko.com/api/v3/coins/' + crypto)).then(
            response => response.json()
        ).then(
            data => {
                setCryptoData(prevState => 
                    ([...prevState, {data}]))
            }
        )
    }

    useEffect(() => {
        getAllStocks()
        for (let i=0; i<cryptos.length; i++) {
            fetchCrypto(cryptos[i])
        }
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
        <div id='crypto-page'>
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
                    <img alt='' src={IPO}></img>
                    <h3>Upcoming IPOs</h3>
                </div>
            </div>
            <div id='right-side-crypto'>
                <div id='top'>
                    <h1>Crypto</h1>
                    <h3>Discover the world of crypto<img id='linking' alt='' src={Linking} onClick={() => window.open('https://coinmarketcap.com/')}></img></h3>
                </div>
                <div id='table-headers'>
                    <h4 id='cryptoNameHeader'>CRYPTOCURRENCY</h4>
                    <h4 id='cryptoSymbolHeader'>SYMBOL</h4>
                    <h4 id='marketcapHeader'>PRICE</h4>
                    <h4 id='currentpriceHeader'>MARKET CAP</h4>
                </div>
                <div id='crypto-data'>
                    {cryptoData.map((crypto) => {
                        return (
                            <div key={cryptoData.indexOf(crypto)} className='cryptos'>
                                <h3 id='cryptoName'>{crypto.data.name}<img alt='' src={crypto.data.image.small}></img></h3>
                                <h3 id='cryptoSymbol'>{crypto.data.symbol.toUpperCase()}</h3>
                                <h4 id='cryptoPrices'>${crypto.data.tickers[0].last.toLocaleString()}</h4>
                                <h4 id='cryptoMarketCap'>${crypto.data.market_data.market_cap.usd.toLocaleString()}</h4>
                            </div>   
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default CryptoDash