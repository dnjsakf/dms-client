'use client';

import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';

const HomePage = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Sales',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: '#4bc0c0'
      }
    ]
  };

  return (
    <div className="p-grid">
      <div className="p-col-12 p-md-6">
        <Card title="Sales Overview">
         <Chart type="line" data={data} />
        </Card>
      </div>
      <div className="p-col-12 p-md-6">
        <Card title="User Statistics">
          <p>Some user statistics here...</p>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
