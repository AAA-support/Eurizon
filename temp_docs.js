      case 'documents': 
        return ( 
          <div className="page-content"> 
            <h2>Documents Center</h2> 
            <div className="documents-grid"> 
              <div className="doc-category"> 
                <h3>Account Statements</h3> 
                <div className="doc-item"><span>Monthly Statement - Dec 2024</span><button>Download</button></div> 
                <div className="doc-item"><span>Yearly Summary - 2024</span><button>Download</button></div> 
              </div> 
              <div className="doc-category"> 
                <h3>Tax Documents</h3> 
                <div className="doc-item"><span>1099-DIV Form</span><button>Download</button></div> 
                <div className="doc-item"><span>Capital Gains Report</span><button>Download</button></div> 
              </div> 
            </div> 
          </div> 
        ); 
