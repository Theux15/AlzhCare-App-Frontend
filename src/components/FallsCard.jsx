import React from 'react'

export default function FallsCard() {
  return (
    <article className="card">
      <div className="card-header">
        <h4 className="card-title">Estado geral</h4>
        <span className="chip safe">
          <span>🧍‍♀️</span>
          Tudo sob controle
        </span>
      </div>
      <p className="metric-value">Sem quedas registradas</p>
      <p className="metric-sub">Monitoramento contínuo nas últimas 24 horas</p>
      <div className="trend">
        <span>🛡️</span>
        <span>Sistema ativo para alertas imediatos</span>
      </div>
    </article>
  )
}
