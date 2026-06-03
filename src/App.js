import React, { useState, useEffect } from 'react';
import { citiesData, statesData } from './citiesData';

function App() {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [view, setView] = useState('countries');
  const [showContact, setShowContact] = useState(false);

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
  
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
};

  const formatNumber = (num) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toString();
  };

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
    setView('cities');
  };

  const handleBack = () => {
    setView('countries');
    setSelectedCountry(null);
  };

  const getStatesForCountry = (countryCode) => {
    return statesData[countryCode] || [
      { name: 'لا توجد بيانات متاحة', population: 0 }
    ];
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'white', background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', minHeight: '100vh' }}>
        <h2>🌍 جاري تحميل البيانات...</h2>
        <p>Please wait...</p>
      </div>
    );
  }

  // عرض المحافظات والولايات
  if (view === 'cities' && selectedCountry) {
    const states = getStatesForCountry(selectedCountry.code);
    const totalStatePopulation = states.reduce((sum, s) => sum + (s.population || 0), 0);

    return (
      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', minHeight: '100vh', padding: '20px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
          <button
            onClick={handleBack}
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              backgroundColor: 'rgba(139, 92, 246, 0.2)',
              padding: '10px 20px',
              borderRadius: '50px',
              border: '1px solid rgba(139, 92, 246, 0.5)',
              color: '#c4b5fd',
              cursor: 'pointer',
              fontSize: '14px',
              backdropFilter: 'blur(10px)',
              zIndex: 20
            }}
          >
            ← رجوع
          </button>

          <h1 style={{ textAlign: 'center', fontSize: '28px', background: 'linear-gradient(135deg, #a855f7, #3b82f6, #ec4899)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', marginBottom: '10px', paddingTop: '20px' }}>
            {getFlagEmoji(selectedCountry.code)} {selectedCountry.name}
          </h1>
          <p style={{ textAlign: 'center', color: '#9ca3af', marginBottom: '20px', fontSize: '14px' }}>
            إجمالي السكان: {formatNumber(selectedCountry.population)} | عدد المحافظات: {states.length}
          </p>

          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '15px', padding: '15px', textAlign: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#a5b4fc', fontSize: '12px' }}>إجمالي سكان المحافظات المعروضة</h3>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>{totalStatePopulation.toLocaleString()}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
            {states.map((state, index) => (
              <div key={index} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: 'white', fontSize: '16px' }}>🏛️ {state.name}</div>
                    {state.capital && <div style={{ fontSize: '11px', color: '#9ca3af' }}>العاصمة: {state.capital}</div>}
                  </div>
                  {state.population > 0 && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', color: 'white' }}>{formatNumber(state.population)}</div>
                      <div style={{ fontSize: '9px', color: '#9ca3af' }}>نسمة</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // عرض الدول
  return (
    <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', minHeight: '100vh', padding: '15px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* بطاقة التواصل - تصميم احترافي */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.1))',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '15px 20px',
          marginBottom: '20px',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              👨‍💻
            </div>
            <div>
              <h3 style={{ color: 'white', fontSize: '18px', margin: 0 }}>ghaly attiy</h3>
              <p style={{ color: '#a5b4fc', fontSize: '12px', margin: '5px 0 0' }}>مطور الموقع</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <a href="https://wa.me/201234567890" target="_blank" rel="noopener noreferrer" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(37, 211, 102, 0.2)',
              padding: '8px 16px',
              borderRadius: '50px',
              textDecoration: 'none',
              color: '#4ade80',
              border: '1px solid rgba(37, 211, 102, 0.3)',
              transition: 'all 0.3s',
              fontSize: '14px'
            }}>
              <span>💬</span> WhatsApp
            </a>
            <a href="mailto:ghalyattiy@gmail.com" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(59, 130, 246, 0.2)',
              padding: '8px 16px',
              borderRadius: '50px',
              textDecoration: 'none',
              color: '#60a5fa',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              transition: 'all 0.3s',
              fontSize: '14px'
            }}>
              <span>📧</span> Gmail
            </a>
            <a href="https://github.com/ghaliattiamoussa" target="_blank" rel="noopener noreferrer" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '8px 16px',
              borderRadius: '50px',
              textDecoration: 'none',
              color: '#c4b5fd',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s',
              fontSize: '14px'
            }}>
              <span>🐙</span> GitHub
            </a>
          </div>
        </div>

        <h1 style={{ textAlign: 'center', fontSize: '36px', background: 'linear-gradient(135deg, #a855f7, #3b82f6, #ec4899)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', marginBottom: '8px' }}>
          🌍 Live Population
        </h1>
        <p style={{ textAlign: 'center', color: '#9ca3af', marginBottom: '15px', fontSize: '13px' }}>
          اضغط على أي دولة لرؤية محافظاتها وولاياتها
        </p>

        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '15px', textAlign: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#a5b4fc', fontSize: '12px' }}>سكان العالم الآن</h3>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'white' }}>{totalPopulation.toLocaleString()}</div>
          <div style={{ color: '#4ade80', fontSize: '11px', marginTop: '8px' }}>تحديث مباشر كل 5 ثوانٍ</div>
        </div>

        <input
          type="text"
          placeholder="🔍 ابحث عن دولة..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '15px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', marginBottom: '20px', fontSize: '14px', outline: 'none' }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {sortedCountries.map((country, index) => (
            <div 
              key={index} 
              onClick={() => handleCountryClick(country)}
              style={{ 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '12px', 
                padding: '12px', 
                border: '1px solid rgba(255,255,255,0.1)', 
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '28px' }}>{getFlagEmoji(country.code)}</span>
                  <div>
                    <div style={{ fontWeight: 'bold', color: 'white', fontSize: '15px' }}>{country.name}</div>
                    <div style={{ fontSize: '10px', color: '#9ca3af' }}>{country.code}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: 'white', fontSize: '14px' }}>{formatNumber(country.population)}</div>
                  <div style={{ fontSize: '9px', color: '#9ca3af' }}>نسمة</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedCountries.length === 0 && (
          <div style={{ textAlign: 'center', padding: '30px', color: '#9ca3af' }}>
            لا توجد دول تطابق "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
}

export default App;