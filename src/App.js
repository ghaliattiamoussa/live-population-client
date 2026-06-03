import React, { useState, useEffect } from 'react';

function App() {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://live-population-server.vercel.app/api/population');
        const data = await response.json();
        setCountries(data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCountries = [...filteredCountries].sort((a, b) => b.population - a.population);

  const totalPopulation = sortedCountries.reduce((sum, c) => sum + c.population, 0);

  const getFlagEmoji = (countryCode) => {
  if (!countryCode) return '🏳️';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
};

  const formatNumber = (num) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toString();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'white', background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', minHeight: '100vh' }}>
        <h2>Loading live population data...</h2>
        <p>Please wait...</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', fontSize: '48px', background: 'linear-gradient(135deg, #a855f7, #3b82f6, #ec4899)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', marginBottom: '10px' }}>
          🌍 Live Population
        </h1>
        <p style={{ textAlign: 'center', color: '#9ca3af', marginBottom: '20px' }}>
          Real-time people alive right now in every country
        </p>

        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '20px', textAlign: 'center', marginBottom: '30px' }}>
          <h3 style={{ color: '#a5b4fc', fontSize: '14px' }}>World Population Now</h3>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'white' }}>{totalPopulation.toLocaleString()}</div>
          <div style={{ color: '#4ade80', fontSize: '14px', marginTop: '10px' }}>Live updates every 5 seconds</div>
        </div>

        <input
          type="text"
          placeholder="Search country by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '15px', borderRadius: '15px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', marginBottom: '30px', fontSize: '16px', outline: 'none' }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
          {sortedCountries.map((country, index) => (
            <div key={index} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '15px', padding: '15px', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '32px' }}>{getFlagEmoji(country.code)}</span>
                  <div>
                    <div style={{ fontWeight: 'bold', color: 'white' }}>{country.name}</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>{country.code}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: 'white' }}>{formatNumber(country.population)}</div>
                  <div style={{ fontSize: '10px', color: '#9ca3af' }}>people alive</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedCountries.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
            No countries found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
}

export default App;