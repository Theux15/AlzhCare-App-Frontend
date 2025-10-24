// Serviço para gerenciar histórico local com localStorage
class LocalStorageService {
  constructor() {
    this.keys = {
      vitalsAlerts: 'alzhcare_vitals_alerts',
      fallAlerts: 'alzhcare_fall_alerts', 
      sosAlerts: 'alzhcare_sos_alerts',
      lastReading: 'alzhcare_last_reading',
      dailyStats: 'alzhcare_daily_stats'
    };
    this.maxItems = 50; // Máximo de itens para manter no localStorage
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

      const alertIndex = alerts.findIndex(alert => alert.id === alertId);
      if (alertIndex !== -1) {
        alerts[alertIndex].resolved = true;
        alerts[alertIndex].resolvedAt = new Date().toISOString();
        localStorage.setItem(key, JSON.stringify(alerts));
        console.log(`✅ Alerta ${alertType} #${alertId} resolvido`);
        return true;
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
    } catch (error) {
      console.error('❌ Erro ao salvar última leitura:', error);
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