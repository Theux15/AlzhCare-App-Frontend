// Serviço para gerenciar histórico local com localStorage
class LocalStorageService {
  constructor() {
    this.keys = {
      vitalsAlerts: 'alzhcare_vitals_alerts',
      fallAlerts: 'alzhcare_fall_alerts', 
      sosAlerts: 'alzhcare_sos_alerts',
      lastReading: 'alzhcare_last_reading',
      dailyStats: 'alzhcare_daily_stats',
      readingsHistory: 'alzhcare_readings_history' // Novo: histórico de leituras
    };
    this.maxItems = 50; // Máximo de itens para manter no localStorage
    this.maxNormalReadings = 5; // Máximo de leituras normais no histórico
    this.maxAlertsPerType = 10; // Máximo de alertas por tipo (BPM, SpO2, Temperatura)
    this.alertGroupingWindow = 300000; // 5 minutos em ms - alertas do mesmo tipo dentro dessa janela são agrupados
    this.temperatureTolerance = 0.5; // ±0.5°C para considerar mesma temperatura no agrupamento
  }

  // Salvar alerta de sinais vitais anormais
  saveVitalAlert(alert) {
    try {
      const alerts = this.getVitalAlerts();
      alerts.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        type: alert.type,
        value: alert.value,
        normal_range: alert.normal_range,
        severity: alert.severity || 'medium',
        resolved: false
      });
      
      // Manter apenas os últimos itens
      const limited = alerts.slice(0, this.maxItems);
      localStorage.setItem(this.keys.vitalsAlerts, JSON.stringify(limited));
      
      console.log('💾 Alerta vital salvo no localStorage:', alert);
    } catch (error) {
      console.error('❌ Erro ao salvar alerta vital:', error);
    }
  }

  // Obter alertas de sinais vitais
  getVitalAlerts() {
    try {
      const stored = localStorage.getItem(this.keys.vitalsAlerts);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('❌ Erro ao ler alertas vitais:', error);
      return [];
    }
  }

  // Salvar alerta de queda
  saveFallAlert(alert) {
    try {
      const alerts = this.getFallAlerts();
      alerts.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        location: alert.location || null,
        severity: alert.severity || 'high',
        resolved: false,
        sensors: alert.sensors || null
      });
      
      const limited = alerts.slice(0, this.maxItems);
      localStorage.setItem(this.keys.fallAlerts, JSON.stringify(limited));
      
      console.log('💾 Alerta de queda salvo no localStorage:', alert);
    } catch (error) {
      console.error('❌ Erro ao salvar alerta de queda:', error);
    }
  }

  // Obter alertas de queda
  getFallAlerts() {
    try {
      const stored = localStorage.getItem(this.keys.fallAlerts);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('❌ Erro ao ler alertas de queda:', error);
      return [];
    }
  }

  // Salvar alerta SOS
  saveSOSAlert(alert) {
    try {
      const alerts = this.getSOSAlerts();
      alerts.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        location: alert.location || null,
        message: alert.message || 'Botão SOS acionado',
        resolved: false
      });
      
      const limited = alerts.slice(0, this.maxItems);
      localStorage.setItem(this.keys.sosAlerts, JSON.stringify(limited));
      
      console.log('💾 Alerta SOS salvo no localStorage:', alert);
    } catch (error) {
      console.error('❌ Erro ao salvar alerta SOS:', error);
    }
  }

  // Obter alertas SOS
  getSOSAlerts() {
    try {
      const stored = localStorage.getItem(this.keys.sosAlerts);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('❌ Erro ao ler alertas SOS:', error);
      return [];
    }
  }

  // Resolver alerta (marcar como resolvido)
  resolveAlert(alertType, alertId) {
    try {
      let alerts;
      let key;
      
      switch (alertType) {
        case 'vital':
          alerts = this.getVitalAlerts();
          key = this.keys.vitalsAlerts;
          break;
        case 'fall':
          alerts = this.getFallAlerts();
          key = this.keys.fallAlerts;
          break;
        case 'sos':
          alerts = this.getSOSAlerts();
          key = this.keys.sosAlerts;
          break;
        default:
          return false;
      }

      const alertIndex = alerts.findIndex(alert => String(alert.id) === String(alertId));
      if (alertIndex !== -1) {
        alerts[alertIndex].resolved = true;
        alerts[alertIndex].resolvedAt = new Date().toISOString();
        localStorage.setItem(key, JSON.stringify(alerts));
        console.log(`✅ Alerta ${alertType} #${alertId} resolvido no localStorage`);
        return true;
      } else {
        console.log(`❌ Alerta ${alertType} #${alertId} não encontrado. IDs disponíveis:`, alerts.map(a => a.id));
      }
      
      return false;
    } catch (error) {
      console.error('❌ Erro ao resolver alerta:', error);
      return false;
    }
  }

  // Salvar última leitura importante
  saveLastReading(reading) {
    try {
      const data = {
        timestamp: new Date().toISOString(),
        vitals: {
          bpm: reading.bpm,
          spo2: reading.spo2,
          temperature: reading.temperature
        },
        location: reading.location || null,
        status: reading.status || 'normal'
      };
      
      localStorage.setItem(this.keys.lastReading, JSON.stringify(data));
      
      // Também salvar no histórico de leituras
      this.saveReadingToHistory(data);
    } catch (error) {
      console.error('❌ Erro ao salvar última leitura:', error);
    }
  }

  // Salvar leitura no histórico (alertas agrupados e limitados, normais até 5)
  saveReadingToHistory(reading) {
    try {
      const history = this.getReadingsHistory();
      const isAlert = reading.status === 'alert';
      
      if (isAlert) {
        // Identificar tipo de alerta baseado nos valores
        const alertTypes = [];
        if (reading.vitals?.bpm && (reading.vitals.bpm < 60 || reading.vitals.bpm > 100)) {
          alertTypes.push('bpm');
        }
        if (reading.vitals?.spo2 && reading.vitals.spo2 < 95) {
          alertTypes.push('spo2');
        }
        if (reading.vitals?.temperature && (reading.vitals.temperature < 20 || reading.vitals.temperature > 30)) {
          alertTypes.push('temperature');
        }
        
        // Para cada tipo de alerta, verificar se pode agrupar com alertas recentes
        let shouldAddNew = true;
        const now = new Date(reading.timestamp).getTime();
        
        alertTypes.forEach(type => {
          // Buscar último alerta do mesmo tipo
          const lastAlertOfType = history.find(h => 
            h.status === 'alert' && 
            h.alertType === type && 
            !h.grouped
          );
          
          if (lastAlertOfType) {
            const lastTime = new Date(lastAlertOfType.lastOccurrence || lastAlertOfType.timestamp).getTime();
            const timeDiff = now - lastTime;
            
            // Verificar se está dentro da janela de agrupamento (5 min)
            if (timeDiff <= this.alertGroupingWindow) {
              // Para temperatura, verificar tolerância de ±0.5°C em relação à última ocorrência
              let canGroup = true;
              if (type === 'temperature') {
                const currentTemp = reading.vitals?.temperature || 0;
                // Usar temperatura da última ocorrência, não da primeira
                const lastTemp = lastAlertOfType.lastTemperature || lastAlertOfType.vitals?.temperature || 0;
                const tempDiff = Math.abs(currentTemp - lastTemp);
                canGroup = tempDiff <= this.temperatureTolerance;
                
                if (!canGroup) {
                  console.log(`🌡️ Temperatura fora da tolerância: ${lastTemp}°C → ${currentTemp}°C (Δ=${tempDiff.toFixed(1)}°C > ${this.temperatureTolerance}°C)`);
                }
              }
              
              if (canGroup) {
                lastAlertOfType.lastOccurrence = reading.timestamp;
                lastAlertOfType.occurrences = (lastAlertOfType.occurrences || 1) + 1;
                lastAlertOfType.duration = Math.floor((now - new Date(lastAlertOfType.timestamp).getTime()) / 1000); // duração total desde o primeiro alerta
                
                // Atualizar a temperatura da última ocorrência para próxima comparação
                if (type === 'temperature') {
                  lastAlertOfType.lastTemperature = reading.vitals?.temperature;
                }
                
                shouldAddNew = false;
                console.log(`🔄 Alerta de ${type} agrupado (${lastAlertOfType.occurrences} ocorrências, ${Math.floor(lastAlertOfType.duration / 60)}min)`);
              }
            }
          }
        });
        
        // Se não foi agrupado, adicionar novo alerta
        if (shouldAddNew) {
          history.unshift({
            ...reading,
            id: Date.now(),
            alertType: alertTypes[0] || 'general', // Tipo principal
            occurrences: 1,
            grouped: false
          });
          console.log(`🚨 Novo alerta de ${alertTypes.join(', ')} registrado`);
        }
        
        // Limitar alertas por tipo
        const limitedHistory = this.limitAlertsByType(history);
        localStorage.setItem(this.keys.readingsHistory, JSON.stringify(limitedHistory));
        
      } else {
        // Leituras normais - apenas adicionar e manter últimas 5
        history.unshift({
          ...reading,
          id: Date.now()
        });
        
        const alerts = history.filter(r => r.status === 'alert');
        const normals = history.filter(r => r.status === 'normal').slice(0, this.maxNormalReadings);
        const filteredHistory = [...alerts, ...normals];
        filteredHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        localStorage.setItem(this.keys.readingsHistory, JSON.stringify(filteredHistory));
      }
      
      const stats = this.getReadingsHistory();
      const alertCount = stats.filter(r => r.status === 'alert').length;
      const normalCount = stats.filter(r => r.status === 'normal').length;
      console.log(`📊 Histórico: ${alertCount} alertas + ${normalCount} normais`);
      
    } catch (error) {
      console.error('❌ Erro ao salvar no histórico:', error);
    }
  }
  
  // Limitar alertas por tipo (máximo 10 de cada)
  limitAlertsByType(history) {
    const alerts = history.filter(r => r.status === 'alert');
    const normals = history.filter(r => r.status === 'normal');
    
    // Agrupar alertas por tipo
    const bpmAlerts = alerts.filter(a => a.alertType === 'bpm').slice(0, this.maxAlertsPerType);
    const spo2Alerts = alerts.filter(a => a.alertType === 'spo2').slice(0, this.maxAlertsPerType);
    const tempAlerts = alerts.filter(a => a.alertType === 'temperature').slice(0, this.maxAlertsPerType);
    const otherAlerts = alerts.filter(a => !['bpm', 'spo2', 'temperature'].includes(a.alertType)).slice(0, this.maxAlertsPerType);
    
    const limitedAlerts = [...bpmAlerts, ...spo2Alerts, ...tempAlerts, ...otherAlerts];
    const combined = [...limitedAlerts, ...normals];
    combined.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return combined;
  }

  // Obter histórico de leituras
  getReadingsHistory() {
    try {
      const stored = localStorage.getItem(this.keys.readingsHistory);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('❌ Erro ao ler histórico:', error);
      return [];
    }
  }

  // Obter última leitura
  getLastReading() {
    try {
      const stored = localStorage.getItem(this.keys.lastReading);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('❌ Erro ao ler última leitura:', error);
      return null;
    }
  }

  // Salvar estatísticas diárias
  saveDailyStats(stats) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const dailyStats = this.getDailyStats();
      
      dailyStats[today] = {
        ...stats,
        updated: new Date().toISOString()
      };
      
      // Manter apenas últimos 30 dias
      const dates = Object.keys(dailyStats).sort();
      if (dates.length > 30) {
        const toRemove = dates.slice(0, dates.length - 30);
        toRemove.forEach(date => delete dailyStats[date]);
      }
      
      localStorage.setItem(this.keys.dailyStats, JSON.stringify(dailyStats));
    } catch (error) {
      console.error('❌ Erro ao salvar estatísticas diárias:', error);
    }
  }

  // Obter estatísticas diárias
  getDailyStats() {
    try {
      const stored = localStorage.getItem(this.keys.dailyStats);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('❌ Erro ao ler estatísticas diárias:', error);
      return {};
    }
  }

  // Obter estatísticas de hoje
  getTodayStats() {
    const today = new Date().toISOString().split('T')[0];
    const allStats = this.getDailyStats();
    return allStats[today] || null;
  }

  // Obter todos os alertas não resolvidos
  getUnresolvedAlerts() {
    return {
      vitals: this.getVitalAlerts().filter(alert => !alert.resolved),
      falls: this.getFallAlerts().filter(alert => !alert.resolved),
      sos: this.getSOSAlerts().filter(alert => !alert.resolved)
    };
  }

  // Limpar dados antigos (mais de 7 dias)
  cleanOldData() {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      ['vitalsAlerts', 'fallAlerts', 'sosAlerts'].forEach(alertType => {
        const key = this.keys[alertType];
        const alerts = JSON.parse(localStorage.getItem(key) || '[]');
        const filtered = alerts.filter(alert => 
          new Date(alert.timestamp) > sevenDaysAgo
        );
        localStorage.setItem(key, JSON.stringify(filtered));
      });
      
      // Limpar histórico de leituras antigas (alertas antigos)
      const history = this.getReadingsHistory();
      const alerts = history.filter(r => r.status === 'alert' && new Date(r.timestamp) > sevenDaysAgo);
      const normals = history.filter(r => r.status === 'normal').slice(0, this.maxNormalReadings);
      const cleanedHistory = [...alerts, ...normals];
      cleanedHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      localStorage.setItem(this.keys.readingsHistory, JSON.stringify(cleanedHistory));
      
      console.log('🧹 Dados antigos limpos do localStorage');
    } catch (error) {
      console.error('❌ Erro ao limpar dados antigos:', error);
    }
  }

  // Obter estatísticas de uso do localStorage
  getStorageStats() {
    try {
      const stats = {};
      Object.keys(this.keys).forEach(key => {
        const data = localStorage.getItem(this.keys[key]);
        stats[key] = {
          size: data ? data.length : 0,
          items: data ? JSON.parse(data).length || 0 : 0
        };
      });
      
      return stats;
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas de armazenamento:', error);
      return {};
    }
  }

  // Limpar todos os dados
  clearAll() {
    try {
      Object.values(this.keys).forEach(key => {
        localStorage.removeItem(key);
      });
      console.log('🗑️ Todos os dados do localStorage foram limpos');
    } catch (error) {
      console.error('❌ Erro ao limpar localStorage:', error);
    }
  }
}

// Exportar instância singleton
export default new LocalStorageService();