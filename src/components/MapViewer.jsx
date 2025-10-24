import React, { useState } from 'react'

export default function MapViewer({ latitude = 0, longitude = 0, accuracy = 0 }) {
  // Usar as coordenadas recebidas do GPS ou fallback para Belo Horizonte
  const locationData = {
    latitude: latitude || -19.9167,
    longitude: longitude || -43.9345,
    address: latitude && longitude ? "Localização GPS" : "Rua das Acácias, 120",
    neighborhood: latitude && longitude ? "Coordenadas recebidas" : "Centro"
  }

  const [mapError, setMapError] = useState(false)

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '22px',
      overflow: 'hidden',
      boxShadow: 'var(--card-shadow)',
      margin: '0 auto',
      position: 'relative'
    }}>
      {/* Cabeçalho do mapa */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
        padding: '12px 16px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h4 style={{
              margin: 0,
              fontSize: '0.9rem',
              color: 'var(--text-high)',
              fontWeight: '600'
            }}>
              🗺️ Localização no mapa
            </h4>
            <p style={{
              margin: '2px 0 0 0',
              fontSize: '0.7rem',
              color: 'var(--text-medium)'
            }}>
              {locationData.address}
              {accuracy > 0 && (
                <span style={{ marginLeft: '8px', color: '#6b7280' }}>
                  (±{accuracy.toFixed(1)}m)
                </span>
              )}
            </p>
          </div>
          <div style={{
            background: '#10b981',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '8px',
            fontSize: '0.65rem',
            fontWeight: '600'
          }}>
            ATIVO
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div style={{
        width: '100%',
        height: '200px',
        position: 'relative'
      }}>
        {!mapError ? (
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${locationData.longitude-0.01},${locationData.latitude-0.01},${locationData.longitude+0.01},${locationData.latitude+0.01}&layer=mapnik&marker=${locationData.latitude},${locationData.longitude}`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa da localização atual"
            onError={() => setMapError(true)}
          />
        ) : (
          // Fallback quando não consegue carregar o mapa
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0277bd',
            textAlign: 'center',
            padding: '20px'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📍</div>
            <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '4px' }}>
              Localização ativa
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
              Lat: {locationData.latitude.toFixed(4)}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
              Lng: {locationData.longitude.toFixed(4)}
            </div>
            <button
              onClick={() => {
                const url = `https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`
                window.open(url, '_blank')
              }}
              style={{
                background: '#0277bd',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.7rem',
                cursor: 'pointer',
                marginTop: '8px'
              }}
            >
              🗺️ Ver no Google Maps
            </button>
          </div>
        )}
      </div>

      {/* Rodapé com informações extras */}
      <div style={{
        padding: '10px 16px',
        background: '#fafafa',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-medium)' }}>
            📍 {locationData.neighborhood}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-medium)' }}>
            🎯 Precisão: 3m
          </span>
        </div>
        <button style={{
          background: 'transparent',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          padding: '4px 8px',
          fontSize: '0.65rem',
          color: 'var(--text-medium)',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.background = '#f3f4f6'
          e.target.style.color = 'var(--text-high)'
        }}
        onMouseOut={(e) => {
          e.target.style.background = 'transparent'
          e.target.style.color = 'var(--text-medium)'
        }}
        onClick={() => {
          const url = `https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`
          window.open(url, '_blank')
        }}>
          🔗 Abrir no Google Maps
        </button>
      </div>
    </div>
  )
}