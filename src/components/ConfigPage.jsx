import { useState, useEffect } from 'react';
import configService from '../services/configService';

export default function ConfigPage() {
  const [config, setConfig] = useState(configService.getDefaultConfig());
  const [loading, setLoading] = useState({});
  const [success, setSuccess] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setConfig(configService.getConfig());
  }, []);

  const handleCarrierChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      carrier: { ...prev.carrier, [field]: value }
    }));
  };

  const handleLocationChange = (id, field, value) => {
    setConfig(prev => ({
      ...prev,
      importantLocations: prev.importantLocations.map(loc =>
        loc.id === id ? { ...loc, [field]: value } : loc
      )
    }));
  };

  const handleSaveCarrier = () => {
    if (!config.carrier.name || !config.carrier.phone) {
      setErrors({ carrier: 'Preencha todos os campos' });
      setTimeout(() => setErrors({}), 3000);
      return;
    }

    const success = configService.updateCarrier(config.carrier.name, config.carrier.phone);
    if (success) {
      setSuccess({ carrier: true });
      setTimeout(() => setSuccess({}), 3000);
    }
  };

  const handleGeocodeAndSave = async (id) => {
    const location = config.importantLocations.find(loc => loc.id === id);
    if (!location.address || !location.name) {
      setErrors({ [id]: 'Preencha nome e endereço' });
      setTimeout(() => setErrors({}), 3000);
      return;
    }

    setLoading({ [id]: true });

    const result = await configService.geocodeAddress(location.address);
    
    if (result.success) {
      const updated = {
        ...location,
        latitude: result.latitude,
        longitude: result.longitude
      };
      
      configService.updateImportantLocation(id, updated);
      setConfig(configService.getConfig());
      
      // Mostrar mensagem de sucesso, incluindo nota se houver
      if (result.note) {
        setSuccess({ [id]: `✓ Salvo! ${result.note}` });
      } else {
        setSuccess({ [id]: true });
      }
      setTimeout(() => setSuccess({}), 5000);
    } else {
      setErrors({ [id]: `Erro: ${result.error}` });
      setTimeout(() => setErrors({}), 5000);
    }

    setLoading({ [id]: false });
  };

  const handleClearConfig = () => {
    if (window.confirm('⚠️ Tem certeza que deseja limpar todas as configurações? Esta ação não pode ser desfeita.')) {
      const cleared = configService.clearConfig();
      if (cleared) {
        // Atualizar o estado com configurações padrão (vazias)
        const defaultConfig = configService.getDefaultConfig();
        setConfig(defaultConfig);
        
        // Limpar também os estados de loading, success e errors
        setLoading({});
        setSuccess({});
        setErrors({});
        
        alert('✓ Configurações limpas com sucesso!');
      } else {
        alert('❌ Erro ao limpar configurações');
      }
    }
  };

  return (
    <div style={{ 
      maxWidth: '100%',
      width: '100%',
      margin: '0',
      padding: '0'
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '24px', color: '#1f2937' }}>
        ⚙️ Configurações
      </h1>

      {/* Seção: Dados do Portador */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
          👤 Dados do Portador do Dispositivo
        </h2>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '6px' }}>
            Nome Completo
          </label>
          <input
            type="text"
            value={config.carrier.name}
            onChange={(e) => handleCarrierChange('name', e.target.value)}
            placeholder="Ex: João da Silva"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.875rem',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '6px' }}>
            Telefone (com DDD)
          </label>
          <input
            type="tel"
            value={config.carrier.phone}
            onChange={(e) => handleCarrierChange('phone', e.target.value)}
            placeholder="Ex: 11987654321"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.875rem',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        <button
          onClick={handleSaveCarrier}
          style={{
            padding: '10px 20px',
            backgroundColor: success.carrier ? '#10b981' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => !success.carrier && (e.target.style.backgroundColor = '#2563eb')}
          onMouseLeave={(e) => !success.carrier && (e.target.style.backgroundColor = '#3b82f6')}
        >
          {success.carrier ? '✓ Salvo!' : 'Salvar Dados'}
        </button>

        {errors.carrier && (
          <p style={{ marginTop: '8px', fontSize: '0.8rem', color: '#ef4444' }}>
            ⚠️ {errors.carrier}
          </p>
        )}
      </div>

      {/* Seção: Telefone de Emergência */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '2px solid #fecaca'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px', color: '#dc2626' }}>
          🚨 Telefone de Emergência
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '12px' }}>
          Número que será chamado ao acionar "Chamar Emergência"
        </p>
        <div style={{
          padding: '16px',
          backgroundColor: '#fef2f2',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '1.5rem' }}>📞</span>
          <div>
            <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#991b1b', margin: 0 }}>
              {config.emergencyPhone}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#7f1d1d', margin: '4px 0 0 0' }}>
              Configurado nas emergências
            </p>
          </div>
        </div>
      </div>

      {/* Seção: Localizações Importantes */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
          📍 Localizações Importantes (Geofencing)
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '20px' }}>
          Cadastre até 3 locais importantes. O sistema identificará quando o usuário estiver nestes locais.
        </p>

        {config.importantLocations.map((location, index) => (
          <div key={location.id} style={{
            padding: '20px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            marginBottom: '16px',
            border: location.latitude && location.longitude ? '2px solid #10b981' : '1px solid #e5e7eb'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
              Local #{index + 1}
              {location.latitude && location.longitude && (
                <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: '#10b981' }}>
                  ✓ Geocodificado
                </span>
              )}
            </h3>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '6px' }}>
                Nome do Local
              </label>
              <input
                type="text"
                value={location.name}
                onChange={(e) => handleLocationChange(location.id, 'name', e.target.value)}
                placeholder="Ex: Casa, Trabalho, Escola"
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '6px' }}>
                Endereço Completo
              </label>
              <input
                type="text"
                value={location.address}
                onChange={(e) => handleLocationChange(location.id, 'address', e.target.value)}
                placeholder="Ex: Av. Paulista, 1000 - São Paulo, SP"
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            {location.latitude && location.longitude && (
              <div style={{
                padding: '8px 12px',
                backgroundColor: '#ecfdf5',
                borderRadius: '6px',
                fontSize: '0.75rem',
                color: '#065f46',
                marginBottom: '12px'
              }}>
                📌 Coordenadas: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </div>
            )}

            <button
              onClick={() => handleGeocodeAndSave(location.id)}
              disabled={loading[location.id]}
              style={{
                padding: '10px 20px',
                backgroundColor: success[location.id] ? '#10b981' : loading[location.id] ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: loading[location.id] ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {loading[location.id] ? '⏳ Buscando...' : success[location.id] ? '✓ Salvo!' : '💾 Geocodificar e Salvar'}
            </button>

            {errors[location.id] && (
              <p style={{ marginTop: '8px', fontSize: '0.8rem', color: '#ef4444' }}>
                ⚠️ {errors[location.id]}
              </p>
            )}
          </div>
        ))}

        <div style={{
          padding: '12px',
          backgroundColor: '#eff6ff',
          borderRadius: '8px',
          fontSize: '0.8rem',
          color: '#1e40af',
          marginTop: '16px'
        }}>
          ℹ️ <strong>Geofencing:</strong> Quando o usuário estiver a menos de 100 metros de um local cadastrado, 
          o sistema identificará automaticamente e mostrará o nome do local em vez do endereço completo.
        </div>
      </div>

      {/* Seção: Limpar Configurações */}
      <div style={{
        background: '#fff1f2',
        borderRadius: '16px',
        padding: '24px',
        marginTop: '24px',
        border: '1px solid #fecdd3'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px', color: '#991b1b' }}>
          🗑️ Zona de Perigo
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#7f1d1d', marginBottom: '16px' }}>
          Limpar todas as configurações salvas (dados do portador e localizações cadastradas).
        </p>
        <button
          onClick={handleClearConfig}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
        >
          🗑️ Limpar Todas as Configurações
        </button>
      </div>
    </div>
  );
}
