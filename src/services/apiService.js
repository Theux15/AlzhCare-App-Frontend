// Configuração da API
const API_BASE_URL = 'http://localhost:3000/api';

// Classe para gerenciar as chamadas da API
class ApiService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 30000; // 30 segundos
  }

  // Método genérico para fazer requests com cache
  async makeRequest(endpoint, useCache = true) {
    const cacheKey = endpoint;
    const now = Date.now();

    // Verificar cache se habilitado
    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (now - cached.timestamp < this.cacheExpiry) {
        return cached.data;
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Salvar no cache se habilitado
      if (useCache) {
        this.cache.set(cacheKey, {
          data: data,
          timestamp: now
        });
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error.message);
      throw error;
    }
  }

  // POST request para ações
  async makePostRequest(endpoint, body = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API POST Error (${endpoint}):`, error.message);
      throw error;
    }
  }

  // === ENDPOINTS ESPECÍFICOS ===

  // Dados atuais consolidados
  async getCurrentData() {
    return this.makeRequest('/current');
  }

  // Dados de quedas
  async getFallsData() {
    return this.makeRequest('/falls');
  }

  // Resolver queda
  async resolveFall(fallId) {
    return this.makePostRequest(`/falls/${fallId}/resolve`);
  }

  // Dados SOS
  async getSOSData() {
    return this.makeRequest('/sos');
  }

  // Resolver SOS
  async resolveSOS(sosId = null) {
    return this.makePostRequest('/sos/resolve', { sosId });
  }

  // Alertas de sinais vitais
  async getVitalsAlerts() {
    return this.makeRequest('/vitals-alerts');
  }

  // Dados de localizações
  async getLocationsData() {
    return this.makeRequest('/locations');
  }

  // Resumo diário
  async getDailySummary(date = null) {
    const endpoint = date ? `/daily-summary?date=${date}` : '/daily-summary';
    return this.makeRequest(endpoint);
  }

  // Histórico rápido
  async getQuickHistory() {
    return this.makeRequest('/quick-history', false); // Sem cache para histórico
  }

  // Limpar cache manualmente
  clearCache() {
    this.cache.clear();
  }

  // Verificar se API está online
  async checkAPIStatus() {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Exportar instância singleton
export default new ApiService();