import './Home.css';
import Prism from '../images/prism.png'
import Sun from '../images/sun.png'
import Spline from '@splinetool/react-spline'

function Home() {
  return (
    <div className="App">
      <div id='main'>
        <div id='header'>
          <div id='logo'>
            <h1>Prism</h1>
            <img alt='' src={Prism}></img> 
          </div>
          <div id='nav'>
            <img alt='' src={Sun}></img>
          </div>
        </div>
        <div id='body'>
          <div id='body-left'>
            <h1>Real-Time Stock Data</h1>
            <h3><span>Prism</span> provides fast and easy analytics for equities traders.<br></br>Gain the edge you need</h3>
            <div id='body-buttons'>
              <h1 id='learn-more'><a href='#about'>learn more</a></h1>
              <h1 id='enter-app' onClick={() => window.location.href='/trending'}>enter app →</h1>
            </div>
          </div>
        </div>
        <div id='arrow'>
          <div id='square-one'></div>
          <div id='square-two'></div>
        </div>
      </div>
      <div id='about'>
        <div id='about-left'>
          <h1>About</h1>
          <h3><span>Prism</span> is designed to empower traders with accurate, high-speed information to better understand the market and make better and more educated investment decisions. </h3>
          <div id='about-highlights'>
            <div id='supported'>
              <h1>5000+ Supported Equities</h1>
              <h3>Including OTC, Indexes, Crypto <br></br>and more...</h3>
            </div>
            <div id='analytics'>
              <h1>24/7 Analytics</h1>
              <h3>Do your research anytime, anywhere. <br></br>No restrictions</h3>
            </div>
          </div>
        </div>
        <div id='about-right'>
          <Spline id='spline-prism' scene='https://prod.spline.design/M2623ScF7gn2PsTI/scene.splinecode' />
        </div>
      </div>
      <footer>
        <h3>Dylan West © 2023 • Prism</h3>
      </footer>
    </div>
  );
}

export default Home;
