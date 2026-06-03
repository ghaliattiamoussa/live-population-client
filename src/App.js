import React, { useState, useEffect } from 'react';

function App() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://live-population-server.vercel.app/api/populations')
      .then(res => res.json())
      .then(data => {
        console.log('Data received:', data);
        setCountries(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ padding: 50, textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Live Population</h1>
      <p>Total countries: {countries.length}</p>
      <ul>
        {countries.map(c => (
          <li key={c.code}>{c.name}: {c.population.toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;