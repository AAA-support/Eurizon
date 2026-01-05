      case 'admin': 
        return ( 
          <div className="page-content"> 
            <h2>Admin Panel</h2> 
            <div className="admin-tabs"> 
              <button className="tab-btn active" onClick={() => setAdminTab('users')}>User Management</button> 
              <button className="tab-btn" onClick={() => setAdminTab('portfolios')}>Portfolio Management</button> 
              <button className="tab-btn" onClick={() => setAdminTab('payments')}>Payment Details</button> 
            </div> 
            {adminTab === 'users' && ( 
              <div className="users-table"> 
                <h3>Registered Users</h3> 
                <div className="user-row header"> 
                  <span>Username</span> 
                  <span>Email</span> 
                  <span>Portfolio Value</span> 
                  <span>Status</span> 
                  <span>Actions</span> 
                </div> 
                <div className="user-row"> 
                  <span>john.doe</span> 
                  <span>john@example.com</span> 
                  <span>$1,250,000</span> 
                  <span className="green">Active</span> 
                  <span><button className="edit-btn">Edit</button></span> 
                </div> 
              </div> 
            )} 
            {adminTab === 'portfolios' && ( 
              <div className="portfolio-management"> 
                <h3>Edit User Portfolios</h3> 
                <div className="portfolio-editor"> 
                  <select className="user-select"> 
                    <option>Select User</option> 
                    <option>john.doe</option> 
                  </select> 
                  <div className="add-holding"> 
                    <input placeholder="Symbol" className="symbol-input" /> 
                    <input placeholder="Shares" type="number" className="shares-input" /> 
                    <button className="add-btn">Add Holding</button> 
                  </div> 
                </div> 
              </div> 
            )} 
            {adminTab === 'payments' && ( 
              <div className="payment-details"> 
                <h3>Payment Information Display</h3> 
                <div className="payment-form"> 
                  <input placeholder="Bank Name" className="payment-input" /> 
                  <input placeholder="Account Number" className="payment-input" /> 
                  <input placeholder="SWIFT Code" className="payment-input" /> 
                  <button className="save-btn">Save Payment Details</button> 
                </div> 
              </div> 
            )} 
          </div> 
        ); 
