// Serviço de configurações do sistema
const CONFIG_KEY = 'alzhcare_config';

class ConfigService {
  constructor() {
    this.storageKey = CONFIG_KEY;
  }

  // Carregar configurações
  getConfig() {
    try {
      const config = localStorage.getItem(CONFIG_KEY);
      return config ? JSON.parse(config) : this.getDefaultConfig();
    } catch (error) {
      console.error('❌ Erro ao carregar configurações:', error);
      return this.getDefaultConfig();
    }
  }

  // Configurações padrão
  getDefaultConfig() {
    return {
      carrier: {
        name: '',
        phone: ''
      },
      emergencyPhone: '11989545799',
      importantLocations: [
        { id: 1, name: '', address: '', latitude: null, longitude: null },
        { id: 2, name: '', address: '', latitude: null, longitude: null },
        { id: 3, name: '', address: '', latitude: null, longitude: null }
      ],
      geofenceRadius: 500 // metros
    };
  }

  // Salvar configurações
  saveConfig(config) {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
      console.log('✅ Configurações salvas com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao salvar configurações:', error);
      return false;
    }
  }

  // Atualizar apenas o portador
  updateCarrier(name, phone) {
    const config = this.getConfig();
    config.carrier = { name, phone };
    return this.saveConfig(config);
  }

  // Atualizar localização importante
  updateImportantLocation(id, data) {
    const config = this.getConfig();
    const index = config.importantLocations.findIndex(loc => loc.id === id);
    if (index !== -1) {
      config.importantLocations[index] = { ...config.importantLocations[index], ...data };
      return this.saveConfig(config);
    }
    return false;
  }

  // Verificar se está em uma localização importante (geofencing)
  checkGeofence(currentLat, currentLon) {
    const config = this.getConfig();
    const radius = config.geofenceRadius;

    for (const location of config.importantLocations) {
      if (!location.latitude || !location.longitude || !location.name) continue;

      const distance = this.calculateDistance(
        currentLat, currentLon,
        location.latitude, location.longitude
      );

      if (distance <= radius) {
        return {
          isInGeofence: true,
          location: location.name,
          address: location.address,
          distance: Math.round(distance)
        };
      }
    }

    return { isInGeofence: false };
  }

  // Calcular distância usando fórmula de Haversine
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Raio da Terra em metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distância em metros
  }

  // Geocoding: converter endereço em coordenadas
  async geocodeAddress(address) {
    try {
      console.log('🔍 Tentando geocodificar:', address);
      
      // Método 1: Extrair e usar CEP com ViaCEP + Geocoding manual
      const cepMatch = address.match(/\d{5}-?\d{3}/);
      if (cepMatch) {
        const cep = cepMatch[0].replace('-', '');
        console.log('📮 CEP encontrado:', cep);
        
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await response.json();
          
          if (!data.erro) {
            console.log('✓ ViaCEP retornou:', data);
            
            // Tentar API de Geocoding gratuita: Photon (baseada em Nominatim mas sem CORS)
            try {
              await new Promise(resolve => setTimeout(resolve, 500));
              
              const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&limit=1`;
              console.log('🌍 Tentando Photon API...');
              
              const photonResponse = await fetch(photonUrl);
              const photonData = await photonResponse.json();
              
              if (photonData.features && photonData.features.length > 0) {
                const feature = photonData.features[0];
                const coords = feature.geometry.coordinates;
                console.log('✓ Photon encontrou:', feature);
                
                return {
                  success: true,
                  latitude: coords[1], // Photon retorna [lon, lat]
                  longitude: coords[0],
                  displayName: feature.properties.name || address
                };
              }
            } catch (photonError) {
              console.log('⚠️ Photon falhou:', photonError);
            }
            
            // Fallback: usar coordenadas aproximadas da cidade
            const cityCoords = this.getCityCoordinates(data.localidade, data.uf);
            if (cityCoords) {
              return {
                success: true,
                latitude: cityCoords.lat,
                longitude: cityCoords.lng,
                displayName: `${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}`,
                note: 'Coordenadas aproximadas baseadas na cidade (centro da cidade)'
              };
            }
          }
        } catch (error) {
          console.log('⚠️ Erro com ViaCEP:', error);
        }
      }
      
      // Método 2: Tentar Photon diretamente com o endereço fornecido
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&limit=1`;
        console.log('🌍 Tentando Photon API diretamente...');
        
        const photonResponse = await fetch(photonUrl);
        const photonData = await photonResponse.json();
        
        if (photonData.features && photonData.features.length > 0) {
          const feature = photonData.features[0];
          const coords = feature.geometry.coordinates;
          console.log('✓ Photon encontrou:', feature);
          
          return {
            success: true,
            latitude: coords[1], // Photon retorna [lon, lat]
            longitude: coords[0],
            displayName: feature.properties.name || address
          };
        }
      } catch (photonError) {
        console.log('⚠️ Photon falhou:', photonError);
      }
      
      // Método 3: Fallback para coordenadas baseadas em cidade conhecida
      const cityMatch = this.extractCity(address);
      if (cityMatch) {
        const coords = this.getCityCoordinates(cityMatch.city, cityMatch.state);
        if (coords) {
          return {
            success: true,
            latitude: coords.lat,
            longitude: coords.lng,
            displayName: address,
            note: 'Coordenadas aproximadas baseadas na cidade (centro da cidade)'
          };
        }
      }
      
      // Último fallback: retornar erro ao invés de coordenadas padrão
      console.warn('❌ Não foi possível geocodificar o endereço');
      return {
        success: false,
        error: 'Não foi possível encontrar as coordenadas. Tente incluir o CEP completo no formato: Rua, Número - Bairro, Cidade, Estado, CEP'
      };
      
    } catch (error) {
      console.error('❌ Erro ao geocodificar endereço:', error);
      return { 
        success: false, 
        error: 'Erro ao buscar coordenadas. Verifique sua conexão e tente novamente.' 
      };
    }
  }

  // Limpar todas as configurações do localStorage
  clearConfig() {
    try {
      localStorage.removeItem(this.storageKey);
      console.log('✓ Configurações limpas com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao limpar configurações:', error);
      return false;
    }
  }

  // Extrair cidade e estado do endereço
  extractCity(address) {
    const addressLower = address.toLowerCase();
    
    // Padrões comuns: "São Paulo - SP", "São Paulo/SP", "São Paulo, SP"
    const pattern = /([a-záàâãéèêíïóôõöúçñ\s]+)[\s\-,/]+([a-z]{2})/i;
    const match = address.match(pattern);
    
    if (match) {
      return {
        city: match[1].trim(),
        state: match[2].toUpperCase()
      };
    }
    
    // Tentar apenas o nome da cidade
    const cities = ['são paulo', 'rio de janeiro', 'belo horizonte', 'brasília', 'curitiba', 'salvador', 'fortaleza', 'recife', 'porto alegre'];
    for (const city of cities) {
      if (addressLower.includes(city)) {
        return { city: city, state: 'SP' }; // Estado padrão
      }
    }
    
    return null;
  }

  // Coordenadas aproximadas de cidades principais
  getCityCoordinates(city, state) {
    const cityLower = city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    const coordinates = {
      'sao paulo': { lat: -23.550520, lng: -46.633308 },
      'rio de janeiro': { lat: -22.906847, lng: -43.172896 },
      'belo horizonte': { lat: -19.916681, lng: -43.934493 },
      'brasilia': { lat: -15.826691, lng: -47.921822 },
      'curitiba': { lat: -25.428954, lng: -49.273251 },
      'salvador': { lat: -12.977749, lng: -38.501629 },
      'fortaleza': { lat: -3.731862, lng: -38.526670 },
      'recife': { lat: -8.047562, lng: -34.876966 },
      'porto alegre': { lat: -30.034647, lng: -51.217659 },
      'manaus': { lat: -3.119028, lng: -60.021731 },
      'belem': { lat: -1.455833, lng: -48.503887 },
      'goiania': { lat: -16.686882, lng: -49.264481 },
      'campinas': { lat: -22.905650, lng: -47.060494 },
      'guarulhos': { lat: -23.462493, lng: -46.533373 }
    };
    
    return coordinates[cityLower] || null;
  }
}

const configService = new ConfigService();
export default configService;
