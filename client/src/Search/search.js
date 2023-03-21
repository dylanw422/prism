import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import Prism from '../images/prism.png'
import Trending from '../images/trending.png'
import Search from '../images/search.png'
import Crypto from '../images/crypto.png'
import Earnings from '../images/earnings.png'
import IPOImage from '../images/ipo.png'
import Linking from '../images/linking.png'
import Chart from 'react-apexcharts'
import './search.css'

function SearchApp() {
    const [finnhubJSON, setFinnhubJSON] = useState([])
    const [price, setPrice] = useState([])
    const [earnings, setEarnings] = useState([{actual: 0, estimate: 0}])
    const [stockNews, setStockNews] = useState([])
    const [chartData, setChartData] = useState()
    const [config, setConfig] = useState({
        options: {
            chart: {
                type: 'candlestick'
            },
        },
        series: [{
            data: []
        }],
        title: {
            text: ''
        },
        noData: {
            text: 'Loading...'
        }
    })
    let organizedChartData = []

    //query param
    let { stockID } = useParams()

    //for news data
    const todaysDate = new Date().toISOString().split('T')[0]
    let prevDate = new Date()
    prevDate.setDate(new Date().getDate() - 3)
    let prevDateFormat = prevDate.toISOString().split('T')[0]

    //get relative time elapsed for News
    function timeSince(timeStamp) {
        let now = new Date(),
            secondsPast = ((now.getTime()/1000) - timeStamp);
        if (secondsPast < 60) {
            return parseInt(secondsPast) + 's ago';
        }
        if (secondsPast < 3600) {
            return parseInt(secondsPast / 60) + 'm ago';
        }
        if (secondsPast <= 86400) {
            return parseInt(secondsPast / 3600) + 'h ago';
        }
        if (secondsPast <= 2952000) {
            return parseInt(secondsPast / 86400) + 'd ago'
        }
    }

    //for chart data
    const currentTime = Math.floor(Date.now()/1000)
    const marketOpen = Math.floor(Number(new Date(todaysDate + ' 8:30:00'))/1000)

    async function companyProfile(stock) {
        const finnhub = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${stock}&token=cg3l4g9r01qmn4dp9sggcg3l4g9r01qmn4dp9sh0`)
        const finnhubRes = await finnhub.json()
        setFinnhubJSON(finnhubRes)
    }

    async function stockPrice(stock) {
        const finnhub = await fetch(`https://finnhub.io/api/v1/quote?symbol=${stock}&token=cg3l4g9r01qmn4dp9sggcg3l4g9r01qmn4dp9sh0`)
        const finnhubRes = await finnhub.json()
        setPrice(finnhubRes)
    }

    async function earningsFetch(stock) {
        const finnhub = await fetch(`https://finnhub.io/api/v1/stock/earnings?symbol=${stock}&token=cg3l4g9r01qmn4dp9sggcg3l4g9r01qmn4dp9sh0`)
        const finnhubRes = await finnhub.json()
        setEarnings(finnhubRes)
    }

    async function newsFetch(stock) {
        const finnhub = await fetch(`https://finnhub.io/api/v1/company-news?symbol=${stock}&from=${prevDateFormat}&to=${todaysDate}&token=cg3l4g9r01qmn4dp9sggcg3l4g9r01qmn4dp9sh0`)
        const finnhubRes = await finnhub.json()
        setStockNews(finnhubRes)
    }

    async function getChartData(stock) {
        const finnhub = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${stock.toUpperCase()}&resolution=5&from=${marketOpen}&to=${currentTime}&token=cg3l4g9r01qmn4dp9sggcg3l4g9r01qmn4dp9sh0`)
        const finnhubRes = await finnhub.json()
        for (let i=0; i<finnhubRes.c.length; i++) {
            //organizedChartData.push([finnhubRes.t[i]*1000, finnhubRes.o[i].toFixed(2), finnhubRes.h[i].toFixed(2), finnhubRes.l[i].toFixed(2), finnhubRes.c[i].toFixed(2)])
            organizedChartData.push({x: new Date(finnhubRes.t[i]*1000).toLocaleTimeString().slice(0, -6), y: [finnhubRes.o[i], finnhubRes.h[i], finnhubRes.l[i], finnhubRes.c[i]]})
        }
        setChartData(organizedChartData)
    }

    useEffect(() => {
        companyProfile(stockID)
        stockPrice(stockID)
        earningsFetch(stockID)
        newsFetch(stockID)
        getChartData(stockID)
    }, [])

    useEffect(() => {
        
        setConfig({
            options: {
                title: {
                    text: stockID.toUpperCase() + ' • 5m'
                },
                chart: { 
                    type: 'candlestick',
                    toolbar: {
                        show: true,
                        tools: {
                            download: true,
                            selection: true,
                            zoom: true,
                            zoomin: true,
                            zoomout: true,
                            pan: true,
                            reset: true
                        }
                    }
                },
                plotOptions: {
                    candlestick: {
                        wick: {
                            useFillColor: false
                        }
                    }
                },
                theme: {
                    mode: 'dark'
                },
                yaxis: {
                    decimalsInFloat: 2
                },
                xaxis: {
                    tickAmount: 15,
                    labels: {
                        rotate: -70
                    }
                },
            },
            series: [
                {
                    name: 'series-1',
                    data: chartData
                }
            ],
            title: stockID,
        })
    }, [chartData])

    function handleEnter(e) {
        if (e.key === 'Enter') {
            window.location.href=`/search/${stockID}`
        }
    }

    return (
        <div id='search-app'>
            <div id='app-nav'>
                <div id='app-logo' onClick={() => window.location.href='/'}>
                    <h1>Prism</h1>
                    <img alt='' src={Prism}></img> 
                </div>
                <div id='app-search' onChange={(e) => stockID = e.target.value} onKeyDown={(e) => handleEnter(e)}>
                    <img alt='' src={Search}></img>
                    <input placeholder='aapl'></input>
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
            <div id='search-right-side'>
                <div id='top'>
                    <h1>{stockID.toUpperCase()}</h1>
                    <h3>{finnhubJSON.name}<img id='linking' alt='' src={Linking} onClick={() => window.open(`${finnhubJSON.weburl}`)}></img></h3>
                </div>
                <div id='stockdata'>
                    <div id='currentprice'>
                        <h2>Price</h2>
                        <h3>${price.c}</h3>
                    </div>
                    <div id='marketcap'>
                        <h2>Market Capitalization</h2>
                        <h3>${Math.round(finnhubJSON.marketCapitalization*1000000).toLocaleString()}</h3>
                    </div>
                    <div id='prevearnings'>
                        <h2>Prev. Earnings</h2>
                        <h3>Estimate: {earnings[0]?.estimate} | Actual: {earnings[0]?.actual}</h3>
                    </div>
                </div>
                <div id='stockdatalower'>
                    <div id='news'>
                        <h1>News ({stockNews.length})</h1>
                        <div>
                        {stockNews.map((article) => {
                            return (
                                <div key={stockNews.indexOf(article)} className='article'>
                                    <h3 onClick={() => window.open(`${article.url}`)}>{article.headline} <span>{timeSince(article.datetime)}</span></h3>
                                </div>
                            )
                        })}
                        </div>
                    </div>
                    <div id='chart'>
                        <Chart options={config.options} series={config.series} type='candlestick' width='800' height='500' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchApp