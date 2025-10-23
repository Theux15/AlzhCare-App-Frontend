import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import VitalsGrid from './components/VitalsGrid'
import FallsCard from './components/FallsCard'
import MapCard from './components/MapCard'
import HistoryList from './components/HistoryList'
import DailySummary from './components/DailySummary'
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

        <section id="vitals">
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

        <section id="location">
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

        <section id="daily-summary">
          <div className="section-title" style={{ textAlign: 'center', flexDirection: 'column', alignItems: 'center' }}>
            <h3>Resumo do dia</h3>
            <small>Consolidação de eventos e localizações</small>
          </div>
          <DailySummary />
        </section>
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '26px 20px 120px',
        color: 'var(--text-low)',
        fontSize: '0.78rem'
      }}>
        <div style={{ marginBottom: '12px' }}>
          Desenvolvido para o TCC AlzhCare · Prototipagem digital v0.1 · Integração real via Bluetooth/Wi-Fi em desenvolvimento
        </div>
        <div style={{
          background: 'rgba(252, 165, 165, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '0.7rem',
          color: 'var(--text-medium)',
          maxWidth: '280px',
          margin: '0 auto'
        }}>
          ⚠️ <strong>Disclaimer:</strong> Este é um protótipo em desenvolvimento. As leituras dos sensores podem apresentar imprecisões e não devem ser usadas para diagnósticos médicos reais.
        </div>
      </footer>
    </div>
  )
}
