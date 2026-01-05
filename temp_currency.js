      case 'currency': 
        return ( 
          <div className="page-content"> 
            <h2>Currency Converter</h2> 
            <div className="converter-container"> 
              <div className="converter-form"> 
                <div className="currency-input"> 
                  <input type="number" placeholder="1000" className="amount-input" /> 
                  <select className="currency-select"> 
                    <option>USD - US Dollar</option> 
                    <option>EUR - Euro</option> 
                    <option>GBP - British Pound</option> 
                  </select> 
                </div> 
                <div className="converter-arrow">=</div> 
                <div className="currency-input"> 
                  <input type="number" placeholder="850" className="amount-input" readonly /> 
                  <select className="currency-select"> 
                    <option>EUR - Euro</option> 
                    <option>USD - US Dollar</option> 
                    <option>GBP - British Pound</option> 
                  </select> 
                </div> 
              </div> 
              <div className="exchange-rates"> 
                <h3>Live Exchange Rates</h3> 
                <div className="rate-item"><span>USD/EUR</span><span>0.85</span></div> 
                <div className="rate-item"><span>USD/GBP</span><span>0.73</span></div> 
                <div className="rate-item"><span>EUR/GBP</span><span>0.86</span></div> 
              </div> 
            </div> 
          </div> 
        ); 
