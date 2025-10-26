import React from 'react'
import configService from '../services/configService'

export default function SOSCard({ sosActive }) {
  const config = configService.getConfig();

  const handleEmergencyCall = () => {
    window.location.href = `tel:${config.emergencyPhone}`;
  };

  const handleCarrierCall = () => {
    if (config.carrier.phone) {
      window.location.href = `tel:${config.carrier.phone}`;
    } else {
      alert('Configure o telefone do portador nas Configurações');
    }
  };
  return (
    <div style={{
      background: sosActive ? 
        'linear-gradient(140deg, rgba(239, 68, 68, 0.1), rgba(185, 28, 28, 0.2))' :
        'linear-gradient(140deg, rgba(34, 197, 94, 0.1), rgba(21, 128, 61, 0.15))',
      border: sosActive ? 
        '2px solid rgba(239, 68, 68, 0.3)' : 
        '2px solid rgba(34, 197, 94, 0.2)',
      borderRadius: '22px',
      padding: '20px',
      textAlign: 'center',
      position: 'relative',
      margin: '0 auto',
      boxShadow: 'var(--card-shadow)'
    }}>
      
      {/* Status indicator */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        background: sosActive ? '#ef4444' : '#22c55e',
        animation: sosActive ? 'pulse 1s infinite' : 'none',
        boxShadow: `0 0 8px ${sosActive ? '#ef4444' : '#22c55e'}`
      }} />

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div style={{
        fontSize: '2.5rem',
        marginBottom: '12px'
      }}>
        {sosActive ? '🆘' : '🛡️'}
      </div>

      <h3 style={{
        margin: '0 0 8px 0',
        color: sosActive ? '#dc2626' : '#16a34a',
        fontSize: '1.1rem',
        fontWeight: '600'
      }}>
        {sosActive ? 'SOS ATIVADO' : 'Sistema de Emergência'}
      </h3>

      <p style={{
        margin: '0 0 16px 0',
        fontSize: '0.85rem',
        color: sosActive ? '#991b1b' : '#15803d',
        lineHeight: '1.4'
      }}>
        {sosActive ? 
          'Alerta de emergência em andamento. Verifique o status do usuário imediatamente.' :
          'Botão SOS pronto. O usuário pode acionar em caso de emergência.'
        }
      </p>

      {sosActive && (
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={handleEmergencyCall}
            style={{
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '8px 16px',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#b91c1c'}
            onMouseLeave={(e) => e.target.style.background = '#dc2626'}
          >
            🚨 Chamar Emergência
          </button>
          <button 
            onClick={handleCarrierCall}
            style={{
              background: config.carrier.phone ? '#059669' : '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '8px 16px',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: config.carrier.phone ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => config.carrier.phone && (e.target.style.background = '#047857')}
            onMouseLeave={(e) => config.carrier.phone && (e.target.style.background = '#059669')}
          >
            📞 Ligar para {config.carrier.name || 'Usuário'}
          </button>
        </div>
      )}

      {sosActive && (
        <div style={{
          marginTop: '12px',
          padding: '8px',
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '8px',
          fontSize: '0.7rem',
          color: '#991b1b'
        }}>
          ⚠️ Este é um alerta real. Tome as medidas necessárias.
        </div>
      )}
    </div>
  )
}