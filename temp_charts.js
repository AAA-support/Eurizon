      case 'charts': 
        return ( 
          <div className="page-content"> 
            <h2>Interactive Charts</h2> 
            <div className="chart-container"> 
              <div className="chart-header"> 
                <select className="chart-select"> 
                  <option>AAPL - Apple Inc.</option> 
                  <option>MSFT - Microsoft</option> 
                  <option>GOOGL - Alphabet</option> 
                </select> 
                <div className="chart-controls"> 
                  <button className="timeframe-btn active">1D</button> 
                  <button className="timeframe-btn">1W</button> 
                  <button className="timeframe-btn">1M</button> 
                  <button className="timeframe-btn">1Y</button> 
                </div> 
              </div> 
              <div className="demo-chart"> 
                <div className="chart-line"></div> 
                <div className="chart-info"> 
                  <span>Current: $175.43</span> 
                  <span className="green">+2.1% (+$3.62)</span> 
                </div> 
              </div> 
            </div> 
          </div> 
        ); 
