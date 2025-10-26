import { useState, useEffect, useRef } from 'react';
import apiService from '../services/apiService';
import localStorageService from '../services/localStorageService';

// Hook personalizado para gerenciar dados em tempo real
export const useRealTimeData = () => {
  const [data, setData] = useState({
    current: null,
    vitals: null,
    falls: null,
    sos: null,
    locations: null,
    dailySummary: null,
    quickHistory: null,
    lastUpdate: null,
    isOnline: false,
    error: null
  });

  const [loading, setLoading] = useState(true);
  const intervalRefs = useRef({});

  // Função para carregar dados do localStorage quando offline
  const loadFromLocalStorage = () => {
    const lastReading = localStorageService.getLastReading();
    const unresolved = localStorageService.getUnresolvedAlerts();
    const allFalls = localStorageService.getFallAlerts(); // Todas as quedas (resolvidas e não resolvidas)
    const todayStats = localStorageService.getTodayStats();

    setData(prev => ({
      ...prev,
      current: lastReading ? {
        esp32: lastReading.vitals,
        location: lastReading.location,
        timestamp: lastReading.timestamp
      } : null,
      vitalsAlerts: unresolved.vitals,
      fallAlerts: allFalls, // Usar todas as quedas, não apenas não resolvidas
      sosAlerts: unresolved.sos,
      dailySummary: todayStats || {
        date: new Date().toISOString().split('T')[0],
        fallsCount: allFalls.length, // Contar todas as quedas do dia
        vitalsAlertsCount: unresolved.vitals.length,
        locationsCount: 0,
        sosCount: unresolved.sos.length,
        vitalsAlerts: unresolved.vitals,
        locations: [],
        falls: allFalls, // Incluir todas as quedas no resumo
        sosEvents: unresolved.sos
      },
      isOnline: false,
      error: 'Usando dados salvos localmente - Sistema offline'
    }));
  };

  // Função para processar e salvar dados importantes
  const processAndSaveData = (currentData, vitalsAlerts, fallAlerts, sosAlerts) => {
    // Garantir que os alertas sejam arrays
    const vitalsArray = Array.isArray(vitalsAlerts) ? vitalsAlerts : [];
    const fallsArray = Array.isArray(fallAlerts) ? fallAlerts : [];
    const sosArray = Array.isArray(sosAlerts) ? sosAlerts : [];
    
    // Salvar última leitura se há dados
    if (currentData?.esp32) {
      localStorageService.saveLastReading({
        bpm: currentData.esp32.BPM,
        spo2: currentData.esp32.SpO2,
        temperature: currentData.esp32.temperature,
        location: currentData.location || null,
        status: vitalsArray.length > 0 || fallsArray.length > 0 ? 'alert' : 'normal'
      });
    }

    // Salvar novos alertas vitais
    vitalsArray.forEach(alert => {
      const existing = localStorageService.getVitalAlerts();
      if (!existing.find(a => a.timestamp === alert.timestamp && a.type === alert.type)) {
        localStorageService.saveVitalAlert(alert);
      }
    });

    // Para quedas, apenas salvar se realmente houver detecção ativa no momento
    if (currentData?.esp32?.fall || currentData?.fall_detection?.fall_detected) {
      const existingFalls = localStorageService.getFallAlerts();
      const lastFall = existingFalls[0];
      
      // Só criar nova queda se não há queda ativa recente (últimos 30 segundos)
      if (!lastFall || lastFall.resolved || 
          (Date.now() - new Date(lastFall.timestamp).getTime()) > 30000) {
        
        localStorageService.saveFallAlert({
          location: currentData.location || null,
          severity: 'high',
          sensors: currentData.esp32 || null
        });
        console.log('🚨 Nova queda salva no localStorage');
      }
    }

    // Salvar novos alertas SOS
    sosArray.forEach(alert => {
      const existing = localStorageService.getSOSAlerts();
      if (!existing.find(a => a.timestamp === alert.timestamp)) {
        localStorageService.saveSOSAlert(alert);
      }
    });
  };

  // Função para buscar dados atuais
  const fetchCurrentData = async () => {
    try {
      const response = await apiService.getCurrentData();
      
      if (response.success) {
        // Buscar alertas e salvar dados importantes
        const [vitalsResponse, fallsResponse, sosResponse] = await Promise.all([
          apiService.getVitalsAlerts().catch(() => ({ success: false, data: [] })),
          apiService.getFallsData().catch(() => ({ success: false, data: [] })),
          apiService.getSOSData().catch(() => ({ success: false, data: [] }))
        ]);

        const vitalsAlerts = Array.isArray(vitalsResponse?.data) ? vitalsResponse.data : 
                            (vitalsResponse?.success && Array.isArray(vitalsResponse.data)) ? vitalsResponse.data : [];
        
        // Processar dados de quedas - priorizar localStorage sobre backend
        const fallsData = fallsResponse?.success && fallsResponse?.data ? fallsResponse.data : {};
        const backendFalls = fallsData.history || [];
        const localFalls = localStorageService.getFallAlerts();
        
        // Usar quedas do localStorage como fonte principal
        const fallAlerts = localFalls.length > 0 ? localFalls : backendFalls;
        
        // Processar dados de SOS - o backend retorna { current_status, history, daily_stats }
        const sosData = sosResponse?.success && sosResponse?.data ? sosResponse.data : {};
        const sosAlerts = sosData.history || [];

        setData(prev => ({
          ...prev,
          current: response.data,
          vitalsAlerts,
          fallAlerts,
          sosAlerts,
          lastUpdate: new Date().toISOString(),
          error: null
        }));

        // Processar e salvar dados importantes
        processAndSaveData(response.data, vitalsAlerts, fallAlerts, sosAlerts);
      } else {
        console.log('❌ API retornou success: false');
      }
    } catch (error) {
      console.error('❌ Erro ao buscar dados:', error);
      setData(prev => ({
        ...prev,
        error: `Erro ao buscar dados atuais: ${error.message}`
      }));
    }
  };

  // Função para buscar histórico rápido
  const fetchQuickHistory = async () => {
    try {
      const response = await apiService.getQuickHistory();
      if (response.success) {
        setData(prev => ({
          ...prev,
          quickHistory: response.data
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar histórico rápido:', error);
    }
  };

  // Função para buscar resumo diário
  const fetchDailySummary = async () => {
    try {
      const response = await apiService.getDailySummary();
      if (response.success) {
        // Mapear dados do backend para o formato esperado pelo frontend
        const backendData = response.data;
        const mappedSummary = {
          date: backendData.date,
          fallsCount: backendData.falls?.total_falls || 0,
          vitalsAlertsCount: backendData.vitals?.total_abnormal_readings || 0,
          locationsCount: backendData.locations?.unique_locations || 0,
          sosCount: backendData.sos?.total_sos_activations || 0,
          vitalsAlerts: backendData.vitals?.abnormal_readings || [],
          locations: backendData.locations?.locations || [],
          falls: backendData.falls?.falls || [],
          sosEvents: backendData.sos?.events || []
        };

        setData(prev => ({
          ...prev,
          dailySummary: mappedSummary
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar resumo diário:', error);
    }
  };

  // Função para verificar status da API
  const checkAPIStatus = async () => {
    try {
      const isOnline = await apiService.checkAPIStatus();
      setData(prev => ({
        ...prev,
        isOnline
      }));
      return isOnline;
    } catch (error) {
      setData(prev => ({
        ...prev,
        isOnline: false
      }));
      return false;
    }
  };

  // Função para resolver SOS
  const resolveSOS = async (sosId = null) => {
    try {
      const response = await apiService.resolveSOS(sosId);
      if (response.success) {
        // Atualizar localStorage também
        if (sosId) {
          localStorageService.resolveAlert('sos', sosId);
        }
        // Atualizar dados após resolver
        await fetchCurrentData();
        return true;
      }
    } catch (error) {
      console.error('Erro ao resolver SOS:', error);
      // Se API falhar, tentar resolver localmente
      if (sosId) {
        return localStorageService.resolveAlert('sos', sosId);
      }
    }
    return false;
  };

  // Função para resolver queda (apenas local)
  const resolveFall = async (fallId) => {
    console.log('Resolvendo queda localmente:', fallId);
    try {
      // Resolver no localStorage primeiro
      const resolved = localStorageService.resolveAlert('fall', fallId);
      
      if (resolved) {
        console.log('✅ Queda resolvida no localStorage');
        
        // Atualizar dados do estado imediatamente
        setData(prev => {
          const updatedFallAlerts = prev.fallAlerts.map(alert => 
            String(alert.id) === String(fallId) ? 
              { ...alert, resolved: true, resolvedAt: new Date().toISOString() } : 
              alert
          );
          
          console.log('📊 Atualizando estado com quedas:', updatedFallAlerts);
          
          return {
            ...prev,
            fallAlerts: updatedFallAlerts
          };
        });
        
        return true;
      } else {
        console.log('❌ Queda não encontrada no localStorage');
        return false;
      }
    } catch (error) {
      console.error('❌ Erro ao resolver queda:', error);
      return false;
    }
  };

  // Setup dos intervalos de polling
  useEffect(() => {
    const setupPolling = async () => {
      // Carregar dados do localStorage primeiro
      loadFromLocalStorage();
      
      // Verificar se API está online
      const isOnline = await checkAPIStatus();
      
      if (isOnline) {
        // Buscar dados iniciais
        await Promise.all([
          fetchCurrentData(),
          fetchQuickHistory(),
          fetchDailySummary()
        ]);

        // Configurar intervalos diferentes para diferentes tipos de dados
        intervalRefs.current.currentData = setInterval(fetchCurrentData, 10000); // 10s - dados atuais
        intervalRefs.current.quickHistory = setInterval(fetchQuickHistory, 30000); // 30s - histórico
        intervalRefs.current.dailySummary = setInterval(fetchDailySummary, 60000); // 1min - resumo diário
        intervalRefs.current.apiStatus = setInterval(checkAPIStatus, 30000); // 30s - status da API
      } else {
        // Se API está offline, tentar reconectar a cada 10 segundos
        intervalRefs.current.reconnect = setInterval(async () => {
          const isOnline = await checkAPIStatus();
          if (isOnline) {
            // Limpar intervalo de reconexão
            if (intervalRefs.current.reconnect) {
              clearInterval(intervalRefs.current.reconnect);
            }
            // Reiniciar setup
            setupPolling();
          }
        }, 10000);
      }

      setLoading(false);
    };

    setupPolling();

    // Limpeza de dados antigos (executar uma vez por dia)
    const lastCleanup = localStorage.getItem('alzhcare_last_cleanup');
    const today = new Date().toISOString().split('T')[0];
    if (lastCleanup !== today) {
      localStorageService.cleanOldData();
      localStorage.setItem('alzhcare_last_cleanup', today);
    }

    // Cleanup function
    return () => {
      Object.values(intervalRefs.current).forEach(interval => {
        if (interval) clearInterval(interval);
      });
    };
  }, []);

  // Função para forçar atualização de todos os dados
  const refreshAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchCurrentData(),
        fetchQuickHistory(),
        fetchDailySummary()
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Função para obter estatísticas do localStorage
  const getLocalStorageStats = () => localStorageService.getStorageStats();
  
  // Função para limpar dados locais
  const clearLocalData = () => localStorageService.clearAll();

  return {
    // Dados principais
    currentData: data.current,
    history: data.quickHistory,
    dailySummary: data.dailySummary,
    sosAlerts: data.sosAlerts,
    fallAlerts: data.fallAlerts,
    vitalsAlerts: data.vitalsAlerts,
    isOnline: data.isOnline,
    lastUpdate: data.lastUpdate,
    error: data.error,
    loading,
    refreshAllData,
    resolveSOS,
    resolveFall,
    getLocalStorageStats,
    clearLocalData,
    // Utilitários
    formatLastUpdate: () => {
      if (!data.lastUpdate) return 'Nunca';
      
      const now = new Date();
      const lastUpdate = new Date(data.lastUpdate);
      const diffSeconds = Math.floor((now - lastUpdate) / 1000);
      
      if (diffSeconds < 30) return 'agora mesmo';
      if (diffSeconds < 60) return `há ${diffSeconds}s`;
      
      const diffMinutes = Math.floor(diffSeconds / 60);
      if (diffMinutes < 60) return `há ${diffMinutes}min`;
      
      const diffHours = Math.floor(diffMinutes / 60);
      return `há ${diffHours}h`;
    }
  };
};

// Hook simples para localStorage
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};