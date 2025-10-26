import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import VitalsGrid from './components/VitalsGrid'
import FallsCard from './components/FallsCard'
import MapCard from './components/MapCard'
import MapViewer from './components/MapViewer'
import HistoryList from './components/HistoryList'
import DailySummary from './components/DailySummary'
import SOSAlert from './components/SOSAlert'
import SOSCard from './components/SOSCard'
import LocalStorageStats from './components/LocalStorageStats'
import ConfigPage from './components/ConfigPage'
import { useRealTimeData } from './hooks/useRealTimeData'
import './index.css'

export default function App() {
  const [showMap, setShowMap] = useState(false)
  const [currentPage, setCurrentPage] = useState('home') // 'home' ou 'config'
  
  const {
    currentData,
    history,
    dailySummary,
    sosAlerts,
    fallAlerts,
    vitalsAlerts,
    readingsHistory,
    isOnline,
    lastUpdate,
    resolveSOS,
    resolveFall,
    error
  } = useRealTimeData()

  // Show connection error if offline for too long
  const showConnectionError = !isOnline && error

  // Se estiver na página de configurações
  if (currentPage === 'config') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Header onNavigate={setCurrentPage} currentPage={currentPage} />
        <div className="max-w-7xl mx-auto px-4 pb-8" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px 32px' }}>
          <button
            onClick={() => setCurrentPage('home')}
            style={{
              marginTop: '20px',
              marginBottom: '20px',
              padding: '8px 16px',
              background: 'rgba(94, 53, 177, 0.1)',
              border: '1px solid rgba(94, 53, 177, 0.2)',
              borderRadius: '8px',
              color: 'var(--text-medium)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ← Voltar ao Dashboard
          </button>
          <ConfigPage />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* SOS Alert Banner */}
      <SOSAlert 
        isActive={sosAlerts?.length > 0 || currentData?.esp32?.sos || currentData?.sos?.active} 
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Header onNavigate={setCurrentPage} currentPage={currentPage} />
        
        {/* Connection Status */}
        {showConnectionError && (
          <div className="bg-red-500 text-white text-center py-2 px-4">
            <p className="text-sm">
              🔌 Conexão perdida - Tentando reconectar... 
              {lastUpdate && (
                <span className="ml-2 opacity-75">
                  Última atualização: {new Date(lastUpdate).toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
        )}
        
        <div className="max-w-7xl mx-auto px-4 pb-8" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px 32px' }}>
          <Hero />
          
          {/* Status Dashboard */}
          <section id="dashboard" style={{ marginBottom: '32px' }}>
            {/* Real-time Monitoring Section */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ marginBottom: '16px', color: '#374151', fontSize: '1.1rem' }}>
                Monitoramento em Tempo Real
              </h3>
              <VitalsGrid 
                sensorData={currentData} 
                vitalsAlerts={vitalsAlerts || []}
                isOnline={isOnline}
              />
            </div>

            {/* Map Location Section */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ marginBottom: '16px', color: '#374151', fontSize: '1.1rem' }}>
                Localização no Mapa
              </h3>
              <MapCard 
                sensorData={currentData}
                onToggleMap={() => setShowMap(!showMap)}
                showMap={showMap}
                isOnline={isOnline}
              />
              
              {/* Map Viewer - appears right below MapCard when activated */}
              {showMap && (
                <div style={{ marginTop: '16px' }}>
                  <MapViewer 
                    latitude={currentData?.location?.latitude || 0}
                    longitude={currentData?.location?.longitude || 0}
                    accuracy={currentData?.location?.accuracy}
                  />
                </div>
              )}
            </div>

            {/* Emergency System Section */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ marginBottom: '16px', color: '#374151', fontSize: '1.1rem' }}>
                Sistema de Emergência
              </h3>
              <SOSCard 
                sosActive={sosAlerts?.length > 0 || currentData?.esp32?.sos || currentData?.sos?.active}
              />
            </div>
          </section>
          
          {/* Falls Detection */}
          <section id="falls" style={{ marginBottom: '32px' }}>
            <FallsCard 
              sensorData={currentData}
              fallAlerts={fallAlerts || []}
              onResolveFall={resolveFall}
              isOnline={isOnline}
            />
          </section>
          
          {/* Daily Summary */}
          <section id="summary" style={{ marginBottom: '32px' }}>
            <DailySummary 
              summary={dailySummary}
              isOnline={isOnline}
            />
          </section>
          
          {/* History */}
          <section id="history" style={{ marginBottom: '32px' }}>
            <HistoryList 
              history={readingsHistory || []}
              isOnline={isOnline}
            />
          </section>
        </div>
      </div>
      
      {/* LocalStorage Stats - Apenas para desenvolvimento */}
      <LocalStorageStats />
    </>
  )
}
