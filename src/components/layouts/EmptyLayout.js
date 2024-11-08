'use client';

import { Card } from 'primereact/card';

const EmptyLayout = ({ children }) => {
  return (
    <div className="login-layout">
      <div className="layout-topbar">
      </div>
      <div className="layout-sidebar">
      </div>
      <div className="layout-content-container">
        <div className="layout-content">
          <Card>
            { children }
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmptyLayout;
