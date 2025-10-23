import React from 'react'

export default function Header() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <header style={{ background: 'rgba(250, 242, 255, 0.9)', borderBottom: '1px solid rgba(94, 53, 177, 0.12)' }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 20px', maxWidth: '335px', margin: '0 auto' }}>
          <h1 style={{ margin: 0, fontSize: '1.14rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-high)' }}>
            AlzhCare
          </h1>
        </nav>
      </header>
      
      {/* Navegação rápida abaixo do header */}
      <div style={{
        background: 'rgba(250, 242, 255, 0.7)',
        borderBottom: '1px solid rgba(94, 53, 177, 0.08)',
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: '335px'
        }}>
          <button
            onClick={() => scrollToSection('vitals')}
            style={{
              background: 'rgba(94, 53, 177, 0.1)',
              border: '1px solid rgba(94, 53, 177, 0.2)',
              borderRadius: '16px',
              padding: '4px 10px',
              fontSize: '0.7rem',
              color: 'var(--text-medium)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(94, 53, 177, 0.15)'
              e.target.style.color = 'var(--text-high)'
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(94, 53, 177, 0.1)'
              e.target.style.color = 'var(--text-medium)'
            }}
          >
            🩺 Vitais
          </button>
          
          <button
            onClick={() => scrollToSection('location')}
            style={{
              background: 'rgba(94, 53, 177, 0.1)',
              border: '1px solid rgba(94, 53, 177, 0.2)',
              borderRadius: '16px',
              padding: '4px 10px',
              fontSize: '0.7rem',
              color: 'var(--text-medium)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(94, 53, 177, 0.15)'
              e.target.style.color = 'var(--text-high)'
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(94, 53, 177, 0.1)'
              e.target.style.color = 'var(--text-medium)'
            }}
          >
            📍 GPS
          </button>
          
          <button
            onClick={() => scrollToSection('daily-summary')}
            style={{
              background: 'rgba(94, 53, 177, 0.1)',
              border: '1px solid rgba(94, 53, 177, 0.2)',
              borderRadius: '16px',
              padding: '4px 10px',
              fontSize: '0.7rem',
              color: 'var(--text-medium)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(94, 53, 177, 0.15)'
              e.target.style.color = 'var(--text-high)'
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(94, 53, 177, 0.1)'
              e.target.style.color = 'var(--text-medium)'
            }}
          >
            📊 Resumo
          </button>
        </div>
      </div>
    </>
  )
}
