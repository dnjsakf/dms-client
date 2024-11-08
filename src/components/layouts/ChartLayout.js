'use client';

import { useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { Sidebar } from 'primereact/sidebar';

const DashboardLayout = ({ children }) => {
  const [visible, setVisible] = useState(false);

  const items = [
    { label: 'Home', icon: 'pi pi-fw pi-home' },
    { label: 'Reports', icon: 'pi pi-fw pi-chart-line' },
    { label: 'Settings', icon: 'pi pi-fw pi-cog' }
  ];

  return (
    <div>
      <Menubar model={items} />
      <Sidebar visible={visible} onHide={() => setVisible(false)}>
        <h1>Sidebar Content</h1>
      </Sidebar>
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;

