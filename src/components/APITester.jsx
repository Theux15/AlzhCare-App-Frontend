import { useEffect } from 'react'
import apiService from '../services/apiService'

export default function APITester() {
  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('🧪 Testando conexão com API...')
        
        const current = await apiService.getCurrentData()
        console.log('✅ Dados atuais:', current)
        
        const summary = await apiService.getDailySummary()
        console.log('✅ Resumo diário:', summary)
        
      } catch (error) {
        console.error('❌ Erro ao testar API:', error)
      }
    }
    
    testAPI()
  }, [])

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#000',
      color: '#fff',
      padding: '8px',
      borderRadius: '4px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      API Tester - Ver Console
    </div>
  )
}