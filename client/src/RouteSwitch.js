import React from 'react'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import Home from './Home/Home.js'
import App from './App/App.js'
import Earnings from './Earnings/earnings.js'
import CryptoDash from './Crypto/crypto.js'
import IPO from './IPO/ipo.js'
import SearchApp from './Search/search.js'

const RouteSwitch = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/trending" element={<App />} />
                <Route path="/crypto" element={<CryptoDash />} />
                <Route path="/earnings" element={<Earnings />} />
                <Route path="/ipo" element={<IPO />} />
                <Route path="/search">
                    <Route path=":stockID" element={<SearchApp />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default RouteSwitch