import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import VitalsGrid from './components/VitalsGrid'
import FallsCard from './components/FallsCard'
import MapCard from './components/MapCard'
import HistoryList from './components/HistoryList'
import './index.css'
import { defaultSnapshot, historySeed, normalizePayload } from './utils/sensors'

export default function App() {
  const [lastUpdate] = useState('agora mesmo')
  const demoVitals = { bpm: 76, spo2: 97, temp: 25.4 }
  const demoHistory = [
    { time: '09:45', summary: 'BPM 78, SpO₂ 97%, TempAmb 25.2 °C', fall: false },
    { time: '09:15', summary: 'BPM 81, SpO₂ 96%, TempAmb 25.8 °C', fall: false },
    { time: '08:10', summary: 'BPM 75, SpO₂ 98%, TempAmb 24.9 °C', fall: false }
  ]

  // expose a minimal MQTT-like push hook (compatible with original)
  window.AlzhCareMQTT = {
    push: (payload) => {
      const normalized = normalizePayload(payload)
      // TODO: map normalized into state updates (future)
      console.log('AlzhCareMQTT.push', normalized)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--purple-100)', color: 'var(--text-high)', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }} className="app-main">
        <Hero lastUpdate={lastUpdate} />

        <section>
          <div className="section-title">
            <h3>Informações vitais</h3>
            <small>ID · ESP32-ALZHCARE-01</small>
          </div>
          <VitalsGrid vitals={demoVitals} />
        </section>

        <section>
          <div className="section-title">
            <h3>Detecção de quedas & movimento</h3>
            <small>MPU6050 adaptativo</small>
          </div>
          <div className="grid">
            <FallsCard />
          </div>
        </section>

        <section>
          <div className="section-title">
            <h3>Localização</h3>
            <small>GPS Neo6M · Precisão 3 m</small>
          </div>
          <MapCard />
        </section>

        <section>
          <div className="section-title">
            <h3>Histórico rápido</h3>
            <small>Últimas 6 leituras</small>
          </div>
          <HistoryList items={demoHistory} />
        </section>
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '26px 20px 120px',
        color: 'var(--text-low)',
        fontSize: '0.78rem'
      }}>
        Desenvolvido para o TCC AlzhCare · Prototipagem digital v0.1 · Integração real via Bluetooth/Wi-Fi em desenvolvimento
      </footer>
    </div>
  )
}
