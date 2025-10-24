import React, { useState, useEffect } from 'react'
import { useRealTimeData } from '../hooks/useRealTimeData'

export default function LocalStorageStats() {
  const { getLocalStorageStats, clearLocalData } = useRealTimeData()
  const [stats, setStats] = useState({})
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    if (showStats) {
      const updateStats = () => {
        setStats(getLocalStorageStats())
      }
      
      updateStats()
      const interval = setInterval(updateStats, 5000) // Atualizar a cada 5s
      
      return () => clearInterval(interval)
    }
  }, [showStats]) // Removido getLocalStorageStats das dependências

  const handleClearData = () => {
    if (window.confirm('Deseja limpar todos os dados salvos localmente?')) {
      clearLocalData()
      setStats({})
    }
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      zIndex: 9999
    }}>
      <button
        onClick={() => setShowStats(!showStats)}
        style={{
          background: '#374151',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          padding: '8px 12px',
          fontSize: '12px',
          cursor: 'pointer',
          marginBottom: showStats ? '8px' : '0'
        }}
      >
        {showStats ? '📊 Ocultar Stats' : '📊 LocalStorage'}
      </button>

      {showStats && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '11px',
          fontFamily: 'monospace',
          minWidth: '250px',
          maxHeight: '300px',
          overflow: 'auto'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '12px',
            borderBottom: '1px solid #444',
            paddingBottom: '8px'
          }}>
            <strong>💾 localStorage Stats</strong>
            <button
              onClick={handleClearData}
              style={{
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              🗑️ Limpar
            </button>
          </div>

          {Object.keys(stats).length === 0 ? (
            <div>Nenhum dado salvo</div>
          ) : (
            Object.entries(stats).map(([key, data]) => (
              <div key={key} style={{ marginBottom: '8px' }}>
                <div style={{ fontWeight: 'bold', color: '#60a5fa' }}>
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                </div>
                <div style={{ marginLeft: '8px', color: '#d1d5db' }}>
                  Items: {data.items || 0} | Size: {(data.size / 1024).toFixed(1)}KB
                </div>
              </div>
            ))
          )}

          <div style={{ 
            marginTop: '12px', 
            paddingTop: '8px', 
            borderTop: '1px solid #444',
            fontSize: '10px',
            color: '#9ca3af'
          }}>
            <div>Total: {Object.values(stats).reduce((acc, s) => acc + (s.size || 0), 0) / 1024 | 0}KB</div>
            <div>Atualizado: {new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      )}
    </div>
  )
}