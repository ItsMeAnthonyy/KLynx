import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as maptilersdk from '@maptiler/sdk';
import * as turf from '@turf/turf';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import './Maps.css';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import EmergencyButton from '../../components/EmergencyButton';
import ProfileDropdown from '../../components/ProfileDropdown';
import {  calculateStreetSeverity, aggregateCaseData} from '../../utils/severityClassification';




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

/* 🎯 Disease Severity Configuration --------------------------------------- */
// Defines case count thresholds for severity levels per barangay/street
const diseaseSeverityThresholds = {
  'Dengue Fever': { low: 1, medium: 3, high: 5 },
  'COVID-19, virus identified': { low: 1, medium: 2, high: 4 },
  'Tuberculosis': { low: 1, medium: 2, high: 3 },
  'Cholera': { low: 1, medium: 2, high: 4 },
  'Malaria': { low: 1, medium: 3, high: 6 },
  'Leptospirosis': { low: 1, medium: 3, high: 5 },
  'Influenza': { low: 1, medium: 4, high: 7 },
  'Measles': { low: 1, medium: 3, high: 5 },
  'Asthma': { low: 1, medium: 4, high: 8 },
  // Default thresholds for unlisted diseases
  default: { low: 1, medium: 3, high: 6 }
};

/* 🎯 Get Disease Severity Level --------------------------------------- */
function getDiseaseSeverity(diseaseName, caseCount) {
  const thresholds = diseaseSeverityThresholds[diseaseName] || diseaseSeverityThresholds.default;
  
  if (caseCount === 0) return { level: 'none', color: '#9ca3af', label: 'None' };
  if (caseCount < thresholds.medium) return { level: 'low', color: '#10b981', label: 'Low' };
  if (caseCount < thresholds.high) return { level: 'medium', color: '#f59e0b', label: 'Medium' };
  return { level: 'high', color: '#dc2626', label: 'High' };
}

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



/* 🎯 Compact Summary Strip Component ---------------------- */
function CompactSummaryStrip({ diseaseTotals }) {
  const topDiseases = Object.entries(diseaseTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  return (
    <div style={{
      background: '#fff',
      padding: '12px 20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      flexWrap: 'wrap',
      margin: '0 0 16px 0'
    }}>
      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#666' }}>TOTAL CASES:</span>
      {topDiseases.map(([disease, count]) => {
        const shortName = disease.replace(', virus identified', '').replace('Dengue Fever', 'Dengue');
        return (
          <div key={disease} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.85rem', color: '#555', fontWeight: 500 }}>{shortName}:</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#07598D' }}>{count}</span>
          </div>
        );
      })}
    </div>
  );
}

CompactSummaryStrip.propTypes = {
  diseaseTotals: PropTypes.object.isRequired
};

/* 🎯 Floating Filter Controls Component -------------------- */
function FloatingFilterControls({ onFilterChange, activeFilter, searchTerm, onSearchChange, searchResults, onSearchResultClick }) {
  const [showResults, setShowResults] = useState(false);


  
  return (
    <div style={{
      position: 'absolute',
      top: '16px',
      left: '16px',
      right: '420px',
      zIndex: 1000,
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      pointerEvents: 'none'
    }}>
      {/* Search Bar with Results */}
      <div style={{ position: 'relative', pointerEvents: 'auto' }}>
        <input
          type="text"
          placeholder="Search street, disease, barangay..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          style={{
            padding: '8px 16px 8px 36px',
            borderRadius: '20px',
            border: '1px solid #ddd',
            background: '#fff',
            fontSize: '0.85rem',
            outline: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            width: '240px'
          }}
        />
        {/* Search Icon */}
        <svg
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '16px',
            height: '16px',
            pointerEvents: 'none'
          }}
          fill="none"
          stroke="#999"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        {/* Search Results Dropdown */}
        {showResults && searchTerm && searchResults.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '4px',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            maxHeight: '300px',
            overflowY: 'auto',
            width: '320px',
            zIndex: 2000
          }}>
            <div style={{
              padding: '8px 12px',
              borderBottom: '1px solid #eee',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
            </div>
            {searchResults.slice(0, 10).map((result, idx) => (
              <div
                key={idx}
                onClick={() => onSearchResultClick(result)}
                style={{
                  padding: '10px 12px',
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#07598D', marginBottom: '2px' }}>
                  {result.Street}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>
                  {result.DiagnosisName}
                </div>
              </div>
            ))}
            {searchResults.length > 10 && (
              <div style={{
                padding: '8px 12px',
                fontSize: '0.75rem',
                color: '#999',
                textAlign: 'center',
                fontStyle: 'italic'
              }}>
                +{searchResults.length - 10} more results
              </div>
            )}
          </div>
        )}
        {/* No Results Message */}
        {showResults && searchTerm && searchResults.length === 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '4px',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            padding: '16px',
            width: '320px',
            textAlign: 'center',
            fontSize: '0.85rem',
            color: '#999'
          }}>
            No results found for &quot;{searchTerm}&quot;
          </div>
        )}
      </div>

      {/* Filter Pills */}
      {['All', 'Critical', 'Warning', 'Monitored'].map((filter) => {
        const filterValue = filter.toLowerCase();
        const isActive = activeFilter === filterValue;
        return (
          <button
            key={filter}
            onClick={() => onFilterChange(filterValue)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: isActive ? '#07598D' : '#fff',
              color: isActive ? '#fff' : '#555',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
              pointerEvents: 'auto'
            }}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}

FloatingFilterControls.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  activeFilter: PropTypes.string.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  searchResults: PropTypes.array.isRequired,
  onSearchResultClick: PropTypes.func.isRequired
};

/* 🎯 Collapsible Street Cases Panel ----------------------- */
function StreetCasesPanel({ streetDiseaseStats, diseaseColors, isCollapsed, onToggle, onStreetClick }) {
  return (
    <div style={{
      position: 'absolute',
      top: '0',
      right: isCollapsed ? '-360px' : '0',
      width: '380px',
      height: '100%',
      background: '#fff',
      boxShadow: '-4px 0 16px rgba(0,0,0,0.1)',
      transition: 'right 0.3s ease',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        style={{
          position: 'absolute',
          left: '-40px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '40px',
          height: '80px',
          background: '#07598D',
          border: 'none',
          borderRadius: '8px 0 0 8px',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          boxShadow: '-2px 0 8px rgba(0,0,0,0.1)'
        }}
      >
        {isCollapsed ? '◀' : '▶'}
      </button>

      {/* Panel Header */}
      <div style={{
        padding: '20px',
        borderBottom: '2px solid #07598D',
        background: '#f8f9fa'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '1.1rem',
          fontWeight: 700,
          color: '#07598D'
        }}>
          Street Cases
        </h3>
        <p style={{
          margin: '4px 0 0 0',
          fontSize: '0.85rem',
          color: '#666'
        }}>
          {Object.keys(streetDiseaseStats).length} streets with cases
        </p>
      </div>

      {/* Scrollable List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px'
      }}>
        {Object.entries(streetDiseaseStats).map(([street, diseases]) => (
          <div
            key={street}
            onClick={() => onStreetClick(street)}
            style={{
              padding: '12px',
              marginBottom: '8px',
              background: '#f8f9fa',
              borderRadius: '8px',
              borderLeft: '4px solid #07598D',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e3f2fd';
              e.currentTarget.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f8f9fa';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <div style={{
              fontWeight: 600,
              color: '#07598D',
              marginBottom: '8px',
              fontSize: '0.95rem'
            }}>
              {street}
            </div>
            {Object.entries(diseases).map(([disease, count]) => {
              const severity = getDiseaseSeverity(disease, count);
              return (
              <div
                key={disease}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem',
                  color: '#555',
                  padding: '4px 0',
                  gap: '8px'
                }}
              >
                <span style={{ flex: 1 }}>{disease}</span>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: '8px',
                  background: severity.color,
                  color: '#fff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px'
                }}>
                  {severity.label}
                </span>
                <span style={{
                  fontWeight: 700,
                  color: diseaseColors[disease] || '#07598D',
                  minWidth: '24px',
                  textAlign: 'right'
                }}>
                  {count}
                </span>
              </div>
            );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

StreetCasesPanel.propTypes = {
  streetDiseaseStats: PropTypes.object.isRequired,
  diseaseColors: PropTypes.object.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onStreetClick: PropTypes.func.isRequired
};

/* 🎯 Map Legend Component - Model A + Model C Classification --------------------------------- */
function MapLegend() {
  const severityLevels = [
    { 
      label: 'High', 
      color: '#dc2626', 
      description: '16+ cases OR street with 8+ cases',
      icon: '⚠️'
    },
    { 
      label: 'Medium', 
      color: '#f59e0b', 
      description: '6-15 cases, 1-2 streets with 4-7',
      icon: '⚠️'
    },
    { 
      label: 'Low', 
      color: '#10b981', 
      description: '0-5 cases, no street >3 cases',
      icon: ''
    }
  ];

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '12px 16px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        fontSize: '0.75rem',
        fontWeight: 700,
        color: '#555',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        Severity
      </div>
      {severityLevels.map(({ label, color, description, icon }) => (
        <div 
          key={label} 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
            cursor: 'help',
            padding: '4px',
            borderRadius: '4px',
            transition: 'background 0.2s ease'
          }}
          title={description}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: color,
            border: '2px solid #fff',
            boxShadow: label === 'High' ? `0 0 8px ${color}` : '0 1px 3px rgba(0,0,0,0.2)'
          }} />
          <span style={{ fontSize: '0.8rem', color: '#555', fontWeight: label === 'High' ? 600 : 400 }}>
            {label}
          </span>
          <span style={{ fontSize: '0.7rem' }}>{icon}</span>
        </div>
      ))}
    </div>
  );
}

/* 🎯 View All Diseases Modal ------------------------------ */
function ViewAllDiseasesModal({ isOpen, onClose, diseaseTotals, diseaseColors }) {
  if (!isOpen) return null;

  // Get current date formatted as "Month Day, Year"
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  

  return (


  
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    }} onClick={onClose}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '900px',
        width: '90%',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '2px solid #07598D'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#07598D'
          }}>
            All Disease Cases
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#999',
              padding: '0',
              width: '32px',
              height: '32px'
            }}
          >
            ×
          </button>
        </div>

        <div style={{
          flex: 1,
          overflow: 'auto',
          marginRight: '-8px',
          paddingRight: '8px'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.9rem'
          }}>
            <thead>
              <tr style={{
                background: '#f8f9fa',
                borderBottom: '2px solid #07598D'
              }}>
                <th style={{
                  padding: '14px 20px',
                  textAlign: 'left',
                  fontWeight: 700,
                  color: '#07598D',
                  position: 'sticky',
                  top: 0,
                  background: '#f8f9fa',
                  zIndex: 1,
                  fontSize: '0.9rem'
                }}>
                  Disease Name
                </th>
                <th style={{
                  padding: '14px 20px',
                  textAlign: 'center',
                  fontWeight: 700,
                  color: '#07598D',
                  position: 'sticky',
                  top: 0,
                  background: '#f8f9fa',
                  zIndex: 1,
                  fontSize: '0.9rem'
                }}>
                  Total Cases
                </th>
                <th style={{
                  padding: '14px 20px',
                  textAlign: 'center',
                  fontWeight: 700,
                  color: '#07598D',
                  position: 'sticky',
                  top: 0,
                  background: '#f8f9fa',
                  zIndex: 1,
                  fontSize: '0.9rem'
                }}>
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(diseaseTotals)
                .sort(([, a], [, b]) => b - a)
                .map(([disease, count]) => (
                  <tr
                    key={disease}
                    style={{
                      borderBottom: '1px solid #e0e0e0',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f8f9fa';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <td style={{
                      padding: '14px 20px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{
                          width: '4px',
                          height: '28px',
                          background: diseaseColors[disease] || '#07598D',
                          borderRadius: '2px',
                          flexShrink: 0
                        }} />
                        <span style={{
                          color: '#333',
                          fontWeight: 500,
                          fontSize: '0.9rem'
                        }}>
                          {disease}
                        </span>
                      </div>
                    </td>
                    <td style={{
                      padding: '14px 20px',
                      textAlign: 'center',
                      fontWeight: 700,
                      color: '#07598D',
                      fontSize: '1rem'
                    }}>
                      {count}
                    </td>
                    <td style={{
                      padding: '14px 20px',
                      textAlign: 'center',
                      color: '#666',
                      fontSize: '0.85rem'
                    }}>
                      {lastUpdated}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

ViewAllDiseasesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  diseaseTotals: PropTypes.object.isRequired,
  diseaseColors: PropTypes.object.isRequired
};

/* 🚀 React component -------------------------------------------- */
export default function Map() {
    const [dbData, setDbData] = useState([]);
  const containerRef = useRef(null);
  const mapRef       = useRef(null);

  const [pointData, setPointData] = useState(null);
  const [radarData, setRadarData] = useState(null);

  const [showFilter, setShowFilter] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [showAllDiseasesModal, setShowAllDiseasesModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [barangaySeverityData, setBarangaySeverityData] = useState(null);


 


  // Handle filter change from dashboard
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // Handle search term change
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  // Handle search result selection (zoom to location)
  const handleSearchResultClick = (result) => {
    if (mapRef.current && result.longitude && result.latitude) {
      mapRef.current.easeTo({
        center: [Number(result.longitude), Number(result.latitude)],
        zoom: 19,
        duration: 800
      });
    }
  };

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

  /* Calculate barangay severity data when dbData changes */
  useEffect(() => {
    if (dbData && dbData.length > 0) {
      const severityData = aggregateCaseData(dbData);
      setBarangaySeverityData(severityData);
      console.log('Barangay Severity Data:', severityData);
    }
  }, [dbData]);

  useEffect(() => {
  if (!dbData || dbData.length === 0) return;

  // Define disease categories inside useEffect to avoid dependency issues
  const categories = {
    all: [],
    'active-cases': ['COVID-19, virus identified', 'Dengue Fever', 'Tuberculosis', 'Leptospirosis'],
    warning: ['Cholera', 'Influenza', 'Measles'],
    critical: ['COVID-19, virus identified', 'Tuberculosis', 'Cholera'],
    monitored: ['Malaria', 'Asthma', 'Influenza', 'Measles']
  };

  // Filter data based on active filter
  let filteredData = dbData;
  if (activeFilter !== 'all') {
    const allowedDiseases = categories[activeFilter] || [];
    filteredData = dbData.filter(entry => allowedDiseases.includes(entry.DiagnosisName));
  }

  // Apply search filter
  if (searchTerm.trim()) {
    const searchLower = searchTerm.toLowerCase();
    filteredData = filteredData.filter(entry => {
      return (
        entry.Street?.toLowerCase().includes(searchLower) ||
        entry.DiagnosisName?.toLowerCase().includes(searchLower) ||
        entry.Barangay?.toLowerCase().includes(searchLower) ||
        entry.Municipality?.toLowerCase().includes(searchLower)
      );
    });
  }

  // Calculate disease severity per street
  const streetDiseaseCounts = {};
  filteredData.forEach(entry => {
    const key = `${entry.Street}-${entry.DiagnosisName}`;
    streetDiseaseCounts[key] = (streetDiseaseCounts[key] || 0) + 1;
  });

  const pointFeatures = filteredData.map((entry) => {
    const key = `${entry.Street}-${entry.DiagnosisName}`;
    const caseCount = streetDiseaseCounts[key] || 1;
    const severity = getDiseaseSeverity(entry.DiagnosisName, caseCount);
    
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [Number(entry.longitude), Number(entry.latitude)]
      },
      properties: {
        description: `<b>Street:</b> ${entry.Street}<br><b>Disease:</b> ${entry.DiagnosisName}<br><b>Severity:</b> ${severity.label} (${caseCount} cases)`,
        disease: entry.DiagnosisName,
        street: entry.Street,
        severity: severity.level,
        severityColor: severity.color,
        caseCount: caseCount
      }
    };
  });

  setPointData({ type: 'FeatureCollection', features: pointFeatures });

  const RADAR_R_KM = 0.025;
  const radar = filteredData.map((entry) =>
    turf.circle([entry.longitude, entry.latitude], RADAR_R_KM, {
      steps: 128,
      units: 'kilometers'
    })
  );

  setRadarData({ type: 'FeatureCollection', features: radar });
}, [dbData, activeFilter, searchTerm]);

  /* Update search results when search term changes */
  useEffect(() => {
    if (!searchTerm.trim() || !dbData || dbData.length === 0) {
      setSearchResults([]);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const results = dbData.filter(entry => {
      return (
        entry.Street?.toLowerCase().includes(searchLower) ||
        entry.DiagnosisName?.toLowerCase().includes(searchLower) ||
        entry.Barangay?.toLowerCase().includes(searchLower) ||
        entry.Municipality?.toLowerCase().includes(searchLower)
      );
    });

    // Remove duplicates based on Street-Disease combination
    const uniqueResults = [];
    const seen = new Set();
    results.forEach(result => {
      const key = `${result.Street}-${result.DiagnosisName}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueResults.push(result);
      }
    });

    setSearchResults(uniqueResults);
  }, [searchTerm, dbData]);



  /* 2️⃣ Build the map when data ready ---------------------------- */
  useEffect(() => {
    console.log("Point data:", pointData);
    console.log("Radar data:", radarData);
    if (!pointData || !radarData) return;

    // If map already exists, just update the data sources
    if (mapRef.current) {
      const pointSource = mapRef.current.getSource('points');
      const radarSource = mapRef.current.getSource('radar');
      
      if (pointSource) {
        pointSource.setData(pointData);
      }
      if (radarSource) {
        radarSource.setData(radarData);
      }
      return;
    }

    // Create map for the first time
    mapRef.current = new maptilersdk.Map({
        container: containerRef.current,
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${maptilersdk.config.apiKey}`,
        center: [121.106651, 14.607532],
        zoom: 15,
        minZoom: 17, 
        maxZoom: 20
    });

    mapRef.current.on('load', () => {
      /* ------ Points with Clustering ------------ */
      mapRef.current.addSource('points', { 
        type: 'geojson', 
        data: pointData,
        cluster: true,
        clusterMaxZoom: 17,  // Must be less than map maxZoom (20)
        clusterRadius: 50
      });

      /* ------ Cluster circles  ------------ */
      mapRef.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'points',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#10b981',  // Low: 0-5 cases
            6, '#f59e0b',  // Medium: 6-15 cases
            16, '#dc2626'  // High: 16+ cases
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            15,   // Small for Low
            6, 20,   // Medium size
            16, 28   // Large for High with pulse effect
          ],
          'circle-stroke-width': [
            'step',
            ['get', 'point_count'],
            2,    // Normal stroke
            16, 3    // Thicker stroke for High severity
          ],
          'circle-stroke-color': '#fff',
          'circle-opacity': [
            'step',
            ['get', 'point_count'],
            0.85,   // Standard
            16, 0.95   // More opaque for High
          ]
        }
      });

      /* ------ Cluster count labels ------------ */
      mapRef.current.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'points',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        },
        paint: {
          'text-color': '#ffffff'
        }
      });

      /* ------ Individual points as small pins (colored by severity) ------------ */
      mapRef.current.addLayer({
        id: 'disease-points',
        type: 'circle',
        source: 'points',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 3,
            15, 5,
            20, 7
          ],
          'circle-color': [
            'match',
            ['get', 'severity'],
            'low', '#10b981',
            'medium', '#f59e0b',
            'high', '#dc2626',
            'none', '#9ca3af',
            '#3b82f6'  // default blue
          ],
          'circle-stroke-width': [
            'match',
            ['get', 'severity'],
            'high', 2.5,
            'medium', 2,
            1.5
          ],
          'circle-stroke-color': '#fff',
          'circle-opacity': 0.9
        }
      });

      /* ------ Radar layers BELOW the circles (subtle, zoom-dependent) -------------------- */
      mapRef.current.addSource('radar', { type: 'geojson', data: radarData });

      mapRef.current.addLayer(
        { id: 'radar-fill', type: 'fill', source: 'radar',
          paint: { 
            'fill-color': '#07598D', 
            'fill-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              10, 0,
              17, 0.03,
              20, 0.06
            ]
          } },
        'clusters'           // insert below clusters
      );
      mapRef.current.addLayer(
        { id: 'radar-outline', type: 'line', source: 'radar',
          paint: {
            'line-color': '#07598D',
            'line-width': [
              'interpolate',
              ['linear'],
              ['zoom'],
              10, 0,
              17, 0.5,
              20, 1
            ],
            'line-dasharray': [3, 3],
            'line-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              10, 0,
              17, 0.2,
              20, 0.4
            ]
          } },
        'clusters'
      );

      /* ------ Click handler for clusters to zoom in -------------------- */
      mapRef.current.on('click', 'clusters', (e) => {
        console.log('Cluster clicked!');
        
        const features = mapRef.current.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        
        console.log('Features found:', features);
        
        if (!features || features.length === 0) {
          console.log('No features found');
          return;
        }
        
        const clusterId = features[0].properties.cluster_id;
        const coordinates = features[0].geometry.coordinates.slice(); // Copy coordinates
        const pointCount = features[0].properties.point_count;
        
        console.log('Cluster ID:', clusterId);
        console.log('Coordinates:', coordinates);
        console.log('Point count:', pointCount);
        console.log('Current zoom:', mapRef.current.getZoom());
        
        // Get the source
        const source = mapRef.current.getSource('points');
        
        if (!source) {
          console.error('Source "points" not found');
          return;
        }
        
        if (!source.getClusterExpansionZoom) {
          console.error('Source does not support clustering');
          return;
        }
        
        // Simple approach: just zoom in by a fixed amount
        const currentZoom = mapRef.current.getZoom();
        const newZoom = Math.min(currentZoom + 2, 20);
        
        console.log('Zooming from', currentZoom, 'to', newZoom);
        
        mapRef.current.easeTo({
          center: coordinates,
          zoom: newZoom,
          duration: 500
        });
      });

      /* ------ Cursor pointer for clusters -------------------- */
      mapRef.current.on('mouseenter', 'clusters', () => {
        mapRef.current.getCanvas().style.cursor = 'pointer';
      });
      mapRef.current.on('mouseleave', 'clusters', () => {
        mapRef.current.getCanvas().style.cursor = '';
      });

      /* Pop‑up with severity information ---------------------------------------------------- */
      const popup = new maptilersdk.Popup({ closeButton: false });
      mapRef.current.on('click', 'disease-points', (e) => {
        const feature = e.features[0];
        const street = feature.properties.street || feature.properties.description?.match(/Street:<\/b> ([^<]*)/)?.[1] || 'Unknown';
        const disease = feature.properties.disease;
        
        const caseCount = feature.properties.caseCount || 1;
        
        // Get street total if available
        let streetTotal = caseCount;
        if (streetDiseaseStats[street]) {
          streetTotal = Object.values(streetDiseaseStats[street]).reduce((sum, count) => sum + count, 0);
        }
        
        // Calculate street severity
        const streetSeverity = calculateStreetSeverity(streetTotal);
        
        popup.setLngLat(e.lngLat).setHTML(
          `<div style="padding: 4px;">
            <b style="color: #07598D;">${street}</b><br>
            <span style="font-size: 0.85rem;"><b>Disease:</b> ${disease}</span><br>
            <span style="font-size: 0.85rem;"><b>Cases:</b> ${caseCount} (Street total: ${streetTotal})</span><br>
            <div style="margin-top: 6px; padding: 4px 8px; border-radius: 4px; background: ${streetSeverity.color}; color: white; font-size: 0.75rem; font-weight: 600; text-align: center; text-transform: uppercase;">
              ${streetSeverity.label} Severity
            </div>
            <div style="margin-top: 4px; font-size: 0.7rem; color: #666; font-style: italic;">
              ${streetSeverity.style.glow ? '⚠️ High priority area' : streetSeverity.level === 'medium' ? '⚠️ Monitor closely' : '✓ Low risk'}
            </div>
          </div>`
        ).addTo(mapRef.current);
      });
      mapRef.current.on('mouseenter', 'disease-points', () => {
        mapRef.current.getCanvas().style.cursor = 'pointer';
      });
      mapRef.current.on('mouseleave', 'disease-points', () => {
        mapRef.current.getCanvas().style.cursor = '';
      });

      /* Pulse animation for high severity clusters and radar ------------------------------------------ */
      let t = 0;
      const timer = setInterval(() => {
        t = (t + 1) % 100;
        const pulsePhase = Math.abs(50 - t) / 50; // 0 to 1 to 0
        
        // Pulse high severity clusters
        try {
          const radiusPulse = 28 + (pulsePhase * 4); // 28 to 32
          mapRef.current.setPaintProperty('clusters', 'circle-radius', [
            'step',
            ['get', 'point_count'],
            15,
            6, 20,
            16, radiusPulse  // Pulse effect for high severity
          ]);
        } catch (e) {
          // Ignore if layer not ready
        }
        
        // Radar opacity animation
        const currentZoom = mapRef.current.getZoom();
        if (currentZoom >= 17) {
          const baseOpacity = (currentZoom - 17) / 3 * 0.4;
          const pulseAmount = 0.1 * pulsePhase;
          const opacity = Math.min(baseOpacity + pulseAmount, 0.5);
          try {
            mapRef.current.setPaintProperty('radar-outline', 'line-opacity', opacity);
          } catch (e) {
            // Ignore if layer not ready
          }
        }
      }, 100);
      mapRef.current.on('remove', () => clearInterval(timer));

      /* Optional: silence missing sprite warnings ---------------- */
      mapRef.current.on('styleimagemissing', (e) => {
        if (!mapRef.current.hasImage(e.id)) {
          // Create a transparent 1x1 pixel fallback image
          const canvas = document.createElement('canvas');
          canvas.width = 1;
          canvas.height = 1;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, 1, 1);
          }
          try {
            mapRef.current.addImage(e.id, canvas, { pixelRatio: 1 });
          } catch (error) {
            // Silently handle any errors adding the image
            console.debug('Could not add fallback image:', e.id);
          }
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

  // Filter dbData based on active filter for stats
  const getFilteredDbData = () => {
    if (activeFilter === 'all') return dbData;
    
    const categories = {
      'active-cases': ['COVID-19, virus identified', 'Dengue Fever', 'Tuberculosis', 'Leptospirosis'],
      warning: ['Cholera', 'Influenza', 'Measles'],
      critical: ['COVID-19, virus identified', 'Tuberculosis', 'Cholera'],
      monitored: ['Malaria', 'Asthma', 'Influenza', 'Measles']
    };
    
    const allowedDiseases = categories[activeFilter] || [];
    return dbData.filter(entry => allowedDiseases.includes(entry.DiagnosisName));
  };

  const filteredDbData = getFilteredDbData();

  // Aggregate disease counts per street (using filtered data)
  const streetDiseaseStats = {};
  filteredDbData.forEach(({ Street, DiagnosisName }) => {
    if (!streetDiseaseStats[Street]) streetDiseaseStats[Street] = {};
    if (!streetDiseaseStats[Street][DiagnosisName]) streetDiseaseStats[Street][DiagnosisName] = 0;
    streetDiseaseStats[Street][DiagnosisName]++;
  });

  // Aggregate total cases per disease (using all data for dashboard)
  const diseaseTotals = {};
  dbData.forEach(({ DiagnosisName }) => {
    if (!diseaseTotals[DiagnosisName]) diseaseTotals[DiagnosisName] = 0;
    diseaseTotals[DiagnosisName]++;
  });



  // Handle street click to zoom to that street's location
  const handleStreetClick = (streetName) => {
    if (!mapRef.current || !dbData || dbData.length === 0) return;

    // Find all locations for this street
    const streetLocations = dbData.filter(entry => entry.Street === streetName);
    
    if (streetLocations.length === 0) return;

    // Calculate the center point of all locations on this street
    const avgLng = streetLocations.reduce((sum, loc) => sum + Number(loc.longitude), 0) / streetLocations.length;
    const avgLat = streetLocations.reduce((sum, loc) => sum + Number(loc.latitude), 0) / streetLocations.length;

    // Zoom to the street location
    mapRef.current.easeTo({
      center: [avgLng, avgLat],
      zoom: 19,
      duration: 800
    });

    console.log(`Zooming to ${streetName} at [${avgLng}, ${avgLat}]`);
  };

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

      {/* --- Compact Summary Strip --- */}
      <CompactSummaryStrip diseaseTotals={diseaseTotals} />

      {/* --- View All Diseases Button --- */}
      <div style={{ textAlign: 'right', marginBottom: '8px' }}>
        <button
          onClick={() => setShowAllDiseasesModal(true)}
          style={{
            padding: '6px 16px',
            background: 'none',
            border: '1px solid #07598D',
            borderRadius: '6px',
            color: '#07598D',
            fontSize: '0.85rem',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#07598D';
            e.target.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'none';
            e.target.style.color = '#07598D';
          }}
        >
          View All Diseases
        </button>
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

      {/* --- Full Width Map Container with Floating Controls and Side Panel --- */}
      <div style={{
        position: 'relative',
        height: 'calc(100vh - 200px)',
        minHeight: '600px',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
      }}>
        {/* Floating Filter Controls */}
        <FloatingFilterControls
          onFilterChange={handleFilterChange}
          activeFilter={activeFilter}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          searchResults={searchResults}
          onSearchResultClick={handleSearchResultClick}
        />

        {/* Barangay Severity Summary */}
        {barangaySeverityData && (
          <div style={{
            position: 'absolute',
            top: '70px',
            left: '20px',
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 999,
            backdropFilter: 'blur(4px)',
            maxWidth: '280px'
          }}>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#555',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Barangay Status
            </div>
            {Object.entries(barangaySeverityData.barangays).slice(0, 3).map(([name, data]) => (
              <div key={name} style={{
                marginBottom: '6px',
                padding: '6px',
                background: '#f8f9fa',
                borderRadius: '4px',
                borderLeft: `4px solid ${data.severity.color}`
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#333' }}>
                  {name}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#666', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                  <span>{data.totalCases} cases</span>
                  <span style={{
                    padding: '2px 6px',
                    borderRadius: '8px',
                    background: data.severity.color,
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: 600
                  }}>
                    {data.severity.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Map Legend */}
        <MapLegend />

        {/* Full Width Map */}
        <div ref={containerRef} style={{
          width: '100%',
          height: '100%',
          background: '#f0f0f0'
        }} className="gmap" />

        {/* Collapsible Street Cases Panel */}
        <StreetCasesPanel
          streetDiseaseStats={streetDiseaseStats}
          diseaseColors={diseaseColors}
          isCollapsed={isPanelCollapsed}
          onToggle={() => setIsPanelCollapsed(!isPanelCollapsed)}
          onStreetClick={handleStreetClick}
        />
      </div>

      {/* View All Diseases Modal */}
      <ViewAllDiseasesModal
        isOpen={showAllDiseasesModal}
        onClose={() => setShowAllDiseasesModal(false)}
        diseaseTotals={diseaseTotals}
        diseaseColors={diseaseColors}
      />    

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