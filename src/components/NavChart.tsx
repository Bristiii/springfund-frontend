import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface NavData {
  date: string;
  nav: string;
}

interface NavChartProps {
  data: NavData[];
}

const NavChart: React.FC<NavChartProps> = ({ data }) => {
  const formattedData = data.map(item => ({
    date: item.date,
    nav: parseFloat(item.nav),
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={formattedData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="date" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" domain={['dataMin', 'dataMax']}/>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1F2937', 
            borderColor: '#374151',
            color: '#F9FAFB'
          }} 
        />
        <Legend wrapperStyle={{ color: '#F9FAFB' }}/>
        <Line type="monotone" dataKey="nav" stroke="#3B82F6" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default NavChart;
