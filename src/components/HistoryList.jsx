import React from 'react'

export default function HistoryList({ items }) {
  return (
    <div className="grid">
      {items.map((it, idx) => (
        <article className="card" key={idx}>
          <div className="card-header">
            <h4 className="card-title">{it.time}</h4>
            <span className={`chip ${it.fall ? 'alert' : 'safe'}`}>
              <span>{it.fall ? '🛌' : '💤'}</span>
              {it.fall ? 'Queda' : 'Estável'}
            </span>
          </div>
          <p className="metric-sub">{it.summary}</p>
        </article>
      ))}
    </div>
  )
}
