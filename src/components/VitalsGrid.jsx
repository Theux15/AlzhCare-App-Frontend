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

export default function VitalsGrid({ vitals }) {
  return (
    <div className="grid">
      <SmallCard
        title="Frequência cardíaca"
        value={`${vitals.bpm} bpm`}
        sub="Referência personalizada: 60 - 100 bpm"
        chip="safe"
        icon="💓"
        trendIcon="↗"
        trendText="Variabilidade controlada"
      />
      <SmallCard
        title="Saturação de oxigênio"
        value={`${vitals.spo2}%`}
        sub="Zona alvo: acima de 94%"
        chip="safe"
        icon="🫁"
        trendIcon="→"
        trendText="Estável nas últimas leituras"
      />
      <SmallCard
        title="Temperatura ambiente"
        value={`${vitals.temp.toFixed(1)} °C`}
        sub="Faixa recomendada: 22.0 - 27.0 °C"
        chip="safe"
        icon="🌡️"
        trendIcon="↘"
        trendText="Ambiente estável"
      />
    </div>
  )
}
