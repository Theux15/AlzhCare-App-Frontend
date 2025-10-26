import React from 'react'

function SmallCard({ title, value, sub, chip, icon, trendIcon, trendText }) {
  return (
    <article className="card">
      <div className="card-header">
        <h4 className="card-title">{title}</h4>
        <span className={`chip ${chip}`}>
          <span>{icon}</span>
          {chip === 'safe' ? 'Normal' : chip === 'alert' ? 'Alerta' : 'Atenção'}
        </span>
      </div>
      <p className="metric-value">{value}</p>
      <p className="metric-sub">{sub}</p>
      <div className="trend">
        <span>{trendIcon}</span>
        <span>{trendText}</span>
      </div>
    </article>
  )
}

export default function VitalsGrid({ sensorData, vitalsAlerts = [], isOnline = true }) {
  // Valores padrão se não houver dados
  const defaultVitals = {
    bpm: 0,
    spo2: 0,
    temp: 0
  };

  // Extrair dados dos sensores - usar dados do vitals que são mais atualizados
  const vitals = sensorData?.vitals ? {
    bpm: sensorData.vitals.bpm || 0,
    spo2: sensorData.vitals.spo2 || 0,
    temp: sensorData.vitals.temperature || 0
  } : sensorData?.esp32 ? {
    bpm: sensorData.esp32.bpm || 0,
    spo2: sensorData.esp32.spo2 || 0,
    temp: sensorData.esp32.temperature || 0
  } : defaultVitals;

  // Determinar status com base nos valores dos sinais vitais
  const getBPMStatus = () => {
    if (!isOnline) return { chip: 'warning', text: 'Offline' };
    if (vitals.bpm === 0) return { chip: 'warning', text: 'Sem dados' };
    // Verificar se está fora dos limites normais (60-100 bpm)
    if (vitals.bpm < 60 || vitals.bpm > 100) return { chip: 'alert', text: 'Anormal' };
    return { chip: 'safe', text: 'Normal' };
  };

  const getSpO2Status = () => {
    if (!isOnline) return { chip: 'warning', text: 'Offline' };
    if (vitals.spo2 === 0) return { chip: 'warning', text: 'Sem dados' };
    // Verificar se está abaixo de 95%
    if (vitals.spo2 < 95) return { chip: 'alert', text: 'Baixo' };
    return { chip: 'safe', text: 'Normal' };
  };

  const getTempStatus = () => {
    if (!isOnline) return { chip: 'warning', text: 'Offline' };
    if (vitals.temp === 0) return { chip: 'warning', text: 'Sem dados' };
    // Verificar se está fora da faixa recomendada (20-30°C)
    if (vitals.temp < 20 || vitals.temp > 30) return { chip: 'alert', text: 'Anormal' };
    return { chip: 'safe', text: 'Normal' };
  };

  const bpmStatus = getBPMStatus();
  const spo2Status = getSpO2Status();
  const tempStatus = getTempStatus();

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      <SmallCard
        title="Frequência cardíaca"
        value={vitals.bpm > 0 ? `${vitals.bpm} bpm` : '--'}
        sub="Referência personalizada: 60 - 100 bpm"
        chip={bpmStatus.chip}
        icon="💓"
        trendIcon={vitals.bpm > 0 ? "↗" : "--"}
        trendText={vitals.bpm > 0 ? "Monitorando" : "Aguardando dados"}
      />
      <SmallCard
        title="Saturação de oxigênio"
        value={vitals.spo2 > 0 ? `${vitals.spo2}%` : '--'}
        sub="Zona alvo: acima de 95%"
        chip={spo2Status.chip}
        icon="🫁"
        trendIcon={vitals.spo2 > 0 ? "→" : "--"}
        trendText={vitals.spo2 > 0 ? "Monitorando" : "Aguardando dados"}
      />
      <SmallCard
        title="Temperatura ambiente"
        value={vitals.temp > 0 ? `${vitals.temp.toFixed(1)} °C` : '--'}
        sub="Faixa recomendada: 20.0 - 30.0 °C"
        chip={tempStatus.chip}
        icon="🌡️"
        trendIcon={vitals.temp > 0 ? "↘" : "--"}
        trendText={vitals.temp > 0 ? "Monitorando" : "Aguardando dados"}
      />
    </div>
  )
}
