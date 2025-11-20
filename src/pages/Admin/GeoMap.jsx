import { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import * as turf from '@turf/turf';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import './Maps.css';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import EmergencyButton from '../../components/EmergencyButton';
import ProfileDropdown from '../../components/ProfileDropdown';

import useAuth from '../../hooks/useAuth';

/* 🔑 MapTiler key ------------------------------------------------ */
maptilersdk.config.apiKey = 'zKdOhGfQaGxspXOXk97Z';

/* 🎨 Disease → colour map --------------------------------------- */
const diseaseColors = {
  'Dengue Fever':   '#e74c3c',
  'Malaria':        '#27ae60',
  'COVID-19, virus identified':  '#2980b9',
  'Cholera':        '#f1c40f',
  'Tuberculosis':   '#8e44ad',
  'Leptospirosis':  '#1abc9c',
  'Influenza':      '#f39c12',
  'Measles':        '#d35400',
  'Asthma':        '#76360bff',
};

/* 🗄️ Sample address data ---------------------------------------- */
const rawData = [
  { address: 'Kasipagan, Karangalan Village, Cainta, Rizal', street: 'Kasipagan',  disease: 'Dengue Fever' },
  { address: 'Karunungan, Karangalan Village, Cainta, Rizal',  street: 'Karunungan', disease: 'Malaria' },
  { address: 'Kalinisan, Karangalan Village, Cainta, Rizal',   street: 'Kalinisan',  disease: 'COVID-19' },
  { address: 'Katapangan, Karangalan Village, Cainta, Rizal',  street: 'Katapangan', disease: 'Cholera' },
  { address: 'Kagitingan, Karangalan Village, Cainta, Rizal',  street: 'Kagitingan', disease: 'Tuberculosis' },
  { address: 'Katatagan, Karangalan Village, Cainta, Rizal',   street: 'Katatagan',  disease: 'Leptospirosis' },
  { address: 'Karangalan, Karangalan Village, Cainta, Rizal',  street: 'Karangalan', disease: 'Influenza' },
  { address: 'Katapatan Street, Karangalan Village, Cainta, Rizal',   street: 'Katapatan',  disease: 'Measles' },

  { address: 'Kasipagan, Karangalan Village, Cainta, Rizal',   street: 'Kasipagan',  disease: 'Dengue Fever' },
  { address: 'Kahusayan, Karangalan Village, Cainta, Rizal',   street: 'Kahusayan',  disease: 'COVID-19' },
  { address: 'Kabutihan, Karangalan Village, Cainta, Rizal',   street: 'Kabutihan',  disease: 'Cholera' },
  { address: 'Katalinuhan, Karangalan Village, Cainta, Rizal', street: 'Katalinuhan',disease: 'Influenza' },
  { address: 'Kagandahan, Karangalan Village, Cainta, Rizal',   street: 'Kagandahan',  disease: 'Tuberculosis' },
  { address: 'Kaayusan, Karangalan Village, Cainta, Rizal',    street: 'Kaayusan',   disease: 'Leptospirosis' },
  { address: 'Kabayanihan, Karangalan Village, Cainta, Rizal', street: 'Kabayanihan',disease: 'Measles' },


  { address: 'Kagitingan Road, Karangalan Village, Cainta, Rizal', street: 'Kagitingan Road',  disease: 'Dengue Fever' },
  { address: 'K-3 Street, Karangalan Village, Cainta, Rizal', street: 'K-3', disease: 'Malaria' },
  { address: 'K-1, Karangalan Village, Cainta, Rizal', street: 'K-1', disease: 'COVID-19' },
  { address: 'K-27, Karangalan Village, Cainta, Rizal', street: 'K-27', disease: 'Cholera' },
  { address: 'Karunungan, Karangalan Village, Cainta, Rizal', street: 'Karunungan',  disease: 'Dengue Fever' },
  { address: 'K-68, Karangalan Village, Cainta, Rizal', street: 'K-68', disease: 'Measles' },


];

/* 🌐 Geocode helper --------------------------------------------- */
async function geocode(addr) {
  const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(addr)}.json?key=${maptilersdk.config.apiKey}`;
  const res = await fetch(url);
  const json = await res.json();
  return json.features?.[0]?.geometry?.coordinates ?? null;   // [lng,lat] | null
}

/* 🚀 React component -------------------------------------------- */
export default function Map() {
    const [dbData, setDbData] = useState([]);
  const containerRef = useRef(null);
  const mapRef       = useRef(null);

  const [pointData, setPointData] = useState(null);
  const [radarData, setRadarData] = useState(null);

  const [showFilter, setShowFilter] = useState(false);

  // Search/filter states
  const [search, setSearch] = useState('');
  const [diseaseFilter, setDiseaseFilter] = useState('');

  /*
  // Filtered raw data
  const filteredRawData = dbData.filter(item => {
    const matchesSearch = item.street.toLowerCase().includes(search.toLowerCase()) || item.address.toLowerCase().includes(search.toLowerCase());
    const matchesDisease = diseaseFilter ? item.disease === diseaseFilter : true;
    return matchesSearch && matchesDisease;
  });
*/

  /* 1️⃣ Geocode & prepare GeoJSON -------------------------------- */

    useEffect(() => {
        axios.get('http://localhost/api/geomap-locations.php').then(function(response){
            console.log("Geo Loc: ", response.data);
            setDbData(response.data);
        });
    }, []);

  useEffect(() => {
  if (!dbData || dbData.length === 0) return;

  const pointFeatures = dbData.map((entry) => ({
    
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [Number(entry.longitude), Number(entry.latitude)]
    },
    
    properties: {
      description: `<b>Street:</b> ${entry.Street}<br><b>Disease:</b> ${entry.DiagnosisName}`,
      disease: entry.DiagnosisName
    }
  }));

  setPointData({ type: 'FeatureCollection', features: pointFeatures });

  const RADAR_R_KM = 0.025;
  const radar = dbData.map((entry) =>
    turf.circle([entry.longitude, entry.latitude], RADAR_R_KM, {
      steps: 128,
      units: 'kilometers'
    })
  );

  setRadarData({ type: 'FeatureCollection', features: radar });
}, [dbData]);



  /* 2️⃣ Build the map when data ready ---------------------------- */
  useEffect(() => {
    console.log("Point data:", pointData);
    console.log("Radar data:", radarData);
    if (!pointData || !radarData || mapRef.current) return;

    mapRef.current = new maptilersdk.Map({
        container: containerRef.current,
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${maptilersdk.config.apiKey}`,
        center: [121.106651, 14.607532],
        zoom: 18,
        minZoom: 17, 
        maxZoom: 20
    });

    mapRef.current.on('load', () => {
      /* ------ Points FIRST (must exist for beforeId) ------------ */
      mapRef.current.addSource('points', { type: 'geojson', data: pointData });
      mapRef.current.addLayer({
        id: 'disease-points',
        type: 'circle',
        source: 'points',
        paint: {
          'circle-radius': 8,
          'circle-color': [
            'match',
            ['get', 'disease'],
            ...Object.entries(diseaseColors).flat(),
            '#cccccc'
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#000'
        }
      });

      /* ------ Radar layers BELOW the circles -------------------- */
      mapRef.current.addSource('radar', { type: 'geojson', data: radarData });

      mapRef.current.addLayer(
        { id: 'radar-fill', type: 'fill', source: 'radar',
          paint: { 'fill-color': '#1E90FF', 'fill-opacity': 0.15 } },
        'disease-points'           // insert just under the points
      );
      mapRef.current.addLayer(
        { id: 'radar-outline', type: 'line', source: 'radar',
          paint: {
            'line-color': '#1E90FF',
            'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.5, 18, 4],
            'line-dasharray': [2, 4],
            'line-opacity': 0.9
          } },
        'disease-points'
      );

      /* Pop‑up ---------------------------------------------------- */
      const popup = new maptilersdk.Popup({ closeButton: false });
      mapRef.current.on('click', 'disease-points', (e) => {
        const feature = e.features[0];
        const street = feature.properties.description.match(/Street:<\/b> ([^<]*)/)[1];
        const disease = feature.properties.disease;
        // Get count from streetDiseaseStats
        let count = 0;
        if (streetDiseaseStats[street] && streetDiseaseStats[street][disease]) {
          count = streetDiseaseStats[street][disease];
        }
        popup.setLngLat(e.lngLat).setHTML(
          `<b>Street:</b> ${street}<br><b>Disease:</b> ${disease}<br><b>Total Cases:</b> ${count}`
        ).addTo(mapRef.current);
      });
      mapRef.current.on('mouseenter', 'disease-points', () => {
        mapRef.current.getCanvas().style.cursor = 'pointer';
      });
      mapRef.current.on('mouseleave', 'disease-points', () => {
        mapRef.current.getCanvas().style.cursor = '';
      });

      /* Pulse animation ------------------------------------------ */
      let t = 0;
      const timer = setInterval(() => {
        t = (t + 1) % 100;
        mapRef.current.setPaintProperty('radar-outline', 'line-opacity',
          0.3 + 0.7 * Math.abs(50 - t) / 50);
      }, 60);
      mapRef.current.on('remove', () => clearInterval(timer));

      /* Optional: silence missing sprite warnings ---------------- */
      mapRef.current.on('styleimagemissing', (e) => {
        if (!mapRef.current.hasImage(e.id)) {
          const c = document.createElement('canvas');
          c.width = c.height = 1;
          mapRef.current.addImage(e.id, c, { pixelRatio: 1 });
        }
      });
    });
  }, [pointData, radarData]);

  // Legend JSX
const legendJSX = (
  <div className="legend-box" style={{ minWidth: 180, fontSize: 15, padding: '14px 18px', borderRadius: 12 }}>
    <h4 style={{ fontSize: 16, color: '#2980b9', marginBottom: 10 }}>Legend</h4>
    <div>
      {Object.entries(diseaseColors).map(([d, col]) => (
        <div key={d} className="legend-item" style={{ marginBottom: 7 }}>
          <span
            className="legend-color"
            style={{
              width: 16,
              height: 16,
              background: col,
              marginRight: 8,
              border: '2px solid #eee',
              boxShadow: '0 2px 6px rgba(44,62,80,0.10)'
            }}
          />
          <span style={{ fontSize: 15 }}>{d}</span>
        </div>
      ))}
    </div>
  </div>
);
// Settings and Notifications
  
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showManageAccount, setShowManageAccount] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
  
    const [showAddAdmin, setShowAddAdmin] = useState(false);

    const [generalDetails, setGeneralDetails] = useState({
      name: '',
      username: '',
      contact: '',
      password: ''
});

 // Admin Account Management
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [adminAccounts, setAdminAccounts] = useState([]);

    const { auth } = useAuth();
  
    const HandleAddAdmin = async () => {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
  
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('username', username);
      formData.append('password', password);
  
      try {
        const response = await fetch('http://localhost/OneCaintaRecord/insertAdminAccount.php', {
          method: 'POST',
          body: formData
        });
  
        if (response.ok) {
          const result = await response.text();
          console.log(result);
          // Optionally, update the adminAccounts state to reflect the new admin account
          setAdminAccounts([...adminAccounts, { fullName, username }]);
          // Clear the form fields
          setFullName('');
          setUsername('');
          setPassword('');
          setConfirmPassword('');
        } else {
          console.error('Failed to add admin');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
  // Handle input changes for account management
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGeneralDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value
    }));
  };

const handleSave = () => {
    // Save the updated details to local storage
    localStorage.setItem('accountDetails', JSON.stringify(generalDetails));
    alert('Account details saved successfully!');
    setShowManageAccount(false);
  };

  // Aggregate disease counts per street
const streetDiseaseStats = {};
dbData.forEach(({ Street, DiagnosisName }) => {
  if (!streetDiseaseStats[Street]) streetDiseaseStats[Street] = {};
  if (!streetDiseaseStats[Street][DiagnosisName]) streetDiseaseStats[Street][DiagnosisName] = 0;
  streetDiseaseStats[Street][DiagnosisName]++;
});

// Aggregate total cases per disease
const diseaseTotals = {};
dbData.forEach(({ DiagnosisName }) => {
  if (!diseaseTotals[DiagnosisName]) diseaseTotals[DiagnosisName] = 0;
  diseaseTotals[DiagnosisName]++;
});



  /* 4️⃣ Render --------------------------------------------------- */
  return (
    <div className='container'>
        <Sidebar />
     <div className='FileMaintenance-Content'>
      <div className="FileMaintenance-Header">
               <div className="FileMaintenance-HeaderTitle">
                 <h1>GeoMap</h1>
               </div>
     
               <div className="FileMaintenance-HeaderSetting">
                 <EmergencyButton />
                 <ProfileDropdown 
                    email={auth.userEmail || "Email"}
                    name= {auth.userFirstName + " " + auth.userLastName || "User"}
                 />
               </div>
             </div>

      {/* --- Disease Analytics Dashboard --- */}
      <div className="disease-analytics-dashboard"
       style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '10px', 
        margin: '32px 0 16px 0', 
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
        }}>
        {Object.entries(diseaseTotals).map(([disease, count]) => (
          <div
            key={disease}
            className="disease-card"
            style={{
              background: '#fff',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              padding: '18px 32px',
              minWidth: '180px',
              textAlign: 'center',
              borderTop: `6px solid ${diseaseColors[disease] || '#2323a7'}`,
              flex: '0 0 auto',
            }}
          >
            <div style={{ fontSize: '1.1rem', color: '#2323a7', fontWeight: 700, marginBottom: 8 }}>{disease}</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: diseaseColors[disease] || '#2323a7' }}>{count}</div>
          </div>
        ))}
      </div>

  <div className='container'>
          {showManageAccount && (
                       <div className="modal">
                       <div className="modal-content">
                           <h2>Manage Account</h2>
                           <button className="close" onClick={() => setShowManageAccount(false)}>
                               &times;
                           </button>
                           <div className="modal-section">
                               <h3>General Details</h3>
                               <form>
                                   <label>
                                       Complete Name:
                                       <input
                                           type="text"
                                           name="name"
                                           value={generalDetails.name}
                                           onChange={handleInputChange}
                                       />
                                   </label>
                                   <label>
                                       Username:
                                       <input
                                           type="text"
                                           name="username"
                                           value={generalDetails.username}
                                           onChange={handleInputChange}
                                       />
                                   </label>
                                   <label>
                                       Contact NO.:
                                       <input
                                           type="text"
                                           name="contact"
                                           value={generalDetails.contact}
                                           onChange={handleInputChange}
                                       />
                                   </label>
                                   <label>
                                       Password:
                                       <input
                                           type="password"
                                           name="password"
                                           value={generalDetails.password}
                                           onChange={handleInputChange}
                                       />
                                   </label>
                               </form>
                                <button className="cancel" onClick={() => setShowManageAccount(false)}>Cancel</button>
                               <button className="save" onClick={handleSave}>Save Changes</button>
                           </div>
                       </div>
                   </div>



      )}

      

      {showAddAdmin && (
        <div className="modal">
          <div className="modal-content">

            <h3>Add Admin Account</h3>
                <button className="close"
                  onClick={() => setShowAddAdmin(false)}
                >
                  &times;
                </button>
          <div className="modal-section">

            <input 
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)} 
            placeholder="Full Name"
             required 
            />

            <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <input 
                type="password" 
                placeholder="Confirm Password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 

             />
            <button onClick={HandleAddAdmin}>Add Admin</button>

            {/* Sample output para makita if nag sasave yung admin account
            <h3>Admin Accounts(Sample lang to check if nag aadd)</h3>
            <ul>
                {adminAccounts.map((account, index) => (
                    <li key={index}>{account.username}</li>
                ))}
            </ul> */}


              </div>

              </div>
            </div>
            )}  

      {showTerms && (
            <div className="modal">
              <div className="modal-content">
                <h2>Terms & Conditions</h2>
                <button className="close"
                  onClick={() => setShowTerms(false)}
                >
                  &times;
                </button>
                <div className="modal-section">
                  <p>
                    By using this system, you agree to our terms and conditions...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

      <div className="bhc-main-content">
        <div className="bhc-map-container">
          <div className="map-wrap">
            <div className="search-bar">
              <span>
                <input type="text" placeholder="Search" />
              </span>
              <i className="fas fa-filter" onClick={() => setShowFilter(true)}></i>
            </div>
            <div ref={containerRef} className="gmap" />
            
          </div>
        </div>
        <div className="bhc-sidebar">
          <div className="bhc-sidebar-title">STREET DISEASE CASES</div>
          <div className="bhc-sidebar-list">
            {Object.entries(streetDiseaseStats).map(([street, diseases]) => (
              <div className="bhc-sidebar-row" key={street}>
                <span style={{ fontWeight: 600 }}>{street}</span>
                <div style={{ display: "flex", flexDirection: "column", marginLeft: 8 }}>
                  {Object.entries(diseases).map(([disease, count]) => (
                    <span key={disease} style={{ color: diseaseColors[disease] || "#2323a7", fontSize: "0.95em" }}>
                      {disease}: <b>{count}</b>
                    </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>    

      {showFilter && (
  <div className="modal filter-modal">
    <div className="modal-content-maps">
      <h2 style={{ color: '#2323a7', textAlign: 'center', fontWeight: 700, fontSize: '2.5rem', marginBottom: 24 }}>FILTER</h2>
      <form className="filter-form">
        <div className="filter-row">
          <div className="filter-group">
            <label>Barangay</label>
            <select>
              <option value="">Select Barangay</option>
              <option value="Karangalan">Karangalan</option>
              <option value="Cainta">Cainta</option>
              <option value="San Mateo">San Mateo</option>
              <option value="San Rafael">San Rafael</option>
              <option value="San Antonio">San Antonio</option>
              <option value="San Isidro">San Isidro</option>
              <option value="San Juan">San Juan</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Street</label>
            <select>
              <option value="">Select Street</option>
              <option value="Kayumanggi">Kayumanggi</option>
              <option value="Karunungan">Karunungan</option>
              <option value="Kalinisan">Kalinisan</option>
              <option value="Katapangan">Katapangan</option>
              <option value="Kagitingan">Kagitingan</option>
              <option value="Katatagan">Katatagan</option>
              <option value="Karangalan">Karangalan</option>
              <option value="Katapatan">Katapatan</option>
              <option value="Kasipagan">Kasipagan</option>
              <option value="Kahusayan">Kahusayan</option>
              <option value="Kabutihan">Kabutihan</option>
              <option value="Katalinuhan">Katalinuhan</option>
              <option value="Kabanalan">Kabanalan</option>
              <option value="Kaayusan">Kaayusan</option>
              <option value="Kabayanihan">Kabayanihan</option>
              <option value="Kalayaan">Kalayaan</option>
            </select>
          </div>
        </div>
        <div className="filter-row">
          <div className="filter-group">
            <label>Age</label>
            <select>
              <option value="">Select Age</option>
              <option value="0-10">0-10</option>
              <option value="11-20">11-20</option>
              <option value="21-30">21-30</option>
              <option value="31-40">31-40</option>
              <option value="41-50">41-50</option>
              <option value="51-60">51-60</option>
              <option value="61-70">61-70</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Sex</label>
            <select>
              <option value="">Select Sex</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Year</label>
            <select>
              <option value="">Select Year</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Month</label>
            <select>
              <option value="">Select Month</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>
        </div>
        <div className="filter-actions">
          <button type="button" className="save" style={{ background: '#2323a7' }}>SAVE</button>
          <button type="button" className="cancel" style={{ background: '#f44336' }} onClick={() => setShowFilter(false)}>CANCEL</button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  </div>
  );
}