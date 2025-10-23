import React from 'react'

export default function Header() {
  return (
    <header style={{ background: 'rgba(250, 242, 255, 0.9)', borderBottom: '1px solid rgba(94, 53, 177, 0.12)' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 20px', maxWidth: '335px', margin: '0 auto' }}>
        <h1 style={{ margin: 0, fontSize: '1.14rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-high)' }}>
          AlzhCare
        </h1>
      </nav>
    </header>
  )
}
