# 🚀 Deploy do Frontend na Vercel - Checklist

## ✅ Preparação Completa - Status

### Arquivos Criados/Atualizados:
- ✅ `package.json` - Adicionado engines (Node >= 18)
- ✅ `apiService.js` - Configurado para usar variável de ambiente
- ✅ `.env.production` - URL do backend em produção
- ✅ `.env.development` - URL do backend local
- ✅ `vercel.json` - Configuração da Vercel

### Mudanças no Código:

#### 1. **apiService.js**
- ✅ Usa `VITE_API_URL` da variável de ambiente
- ✅ Fallback para localhost em desenvolvimento
- ✅ Console log para debug

#### 2. **package.json**
- ✅ Nome atualizado: alzhcare-frontend
- ✅ Engines especificados (Node >= 18, npm >= 9)

#### 3. **.env.production**
- ✅ `VITE_API_URL=https://alzhcare-backend.onrender.com`

#### 4. **vercel.json**
- ✅ Configuração de build e rewrites para SPA

---

## 📋 Próximos Passos - Deploy na Vercel

### 1️⃣ **Testar Localmente Primeiro**

```bash
cd c:\Users\Matheus\Documents\GitHub\AlzhCare-App-Frontend

# Testar em modo desenvolvimento (localhost:3000)
npm run dev

# Testar build de produção
npm run build
npm run preview
```

Abra o navegador e verifique se está funcionando!

### 2️⃣ **Commit e Push**

```bash
git add .
git commit -m "chore: prepare frontend for Vercel deployment"
git push origin main
```

### 3️⃣ **Deploy na Vercel**

#### **Opção A: Via Dashboard (Recomendado)**

1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Clique em **"Add New..."** → **"Project"**
4. Selecione o repositório **AlzhCare-App-Frontend**
5. Vercel detecta Vite automaticamente ✨
6. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (deixe vazio)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

7. **Environment Variables**: Adicione:
   ```
   VITE_API_URL = https://alzhcare-backend.onrender.com
   ```
   - Marque: ✅ Production ✅ Preview ✅ Development

8. Clique em **"Deploy"**
9. Aguarde 2-3 minutos ⏳

#### **Opção B: Via CLI**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Seguir prompts interativos
```

---

## 🔧 Configuração do Backend (CORS)

Após o deploy, você receberá uma URL da Vercel tipo:
```
https://alzhcare-xxxxx.vercel.app
```

**IMPORTANTE**: Adicione essa URL nas variáveis do Render:

1. Vá no Render → seu Web Service
2. Aba **"Environment"**
3. Adicione:
   ```
   FRONTEND_URL = https://alzhcare-xxxxx.vercel.app
   ```
4. Salve (vai fazer redeploy automático)

---

## 🧪 Testar a Aplicação

Após deploy completo:

### 1. **Frontend na Vercel**
```
https://alzhcare-xxxxx.vercel.app
```

### 2. **Backend no Render**
```
https://alzhcare-backend.onrender.com/health
```

### 3. **Checklist de Funcionalidades**

Abra o console do navegador (F12) e verifique:

- ✅ Console mostra: `🔗 API Base URL: https://alzhcare-backend.onrender.com/api`
- ✅ Página carrega sem erros CORS
- ✅ Dados aparecem nos cards (vitais, localização, etc)
- ✅ Configurações podem ser salvas
- ✅ Botões de navegação funcionam
- ✅ Geofencing funciona

---

## 🐛 Troubleshooting

### Build Falhou na Vercel
- Verifique logs no dashboard da Vercel
- Confirme que `package.json` tem engines corretos
- Rode `npm run build` localmente para testar

### CORS Error no Browser
- Verifique se `FRONTEND_URL` está configurado no Render
- Confirme que o backend fez redeploy após adicionar `FRONTEND_URL`
- Teste o endpoint `/health` do backend

### Variável de Ambiente Não Funciona
- Variáveis Vite devem começar com `VITE_`
- Após adicionar variável, faça redeploy na Vercel
- Verifique no console: `console.log(import.meta.env.VITE_API_URL)`

### Backend "Acordando" (Cold Start)
- Primeira requisição após 15min de inatividade demora ~30-60s
- Isso é normal no plano Free do Render
- Solução: usar UptimeRobot para ping a cada 10min

---

## 📊 URLs Finais

Após deploy, você terá:

```
Frontend (Vercel):  https://alzhcare-xxxxx.vercel.app
Backend (Render):   https://alzhcare-backend.onrender.com
Health Check:       https://alzhcare-backend.onrender.com/health
API Base:           https://alzhcare-backend.onrender.com/api
```

---

## 🎉 Deploy Completo!

Seu sistema AlzhCare agora está online e acessível de qualquer lugar!

### Próximos Passos Opcionais:

1. **Domínio Customizado**
   - Vercel: Settings → Domains → Add Domain
   - Render: Settings → Custom Domains

2. **Analytics**
   - Vercel tem analytics integrado (aba Analytics)

3. **Monitoramento**
   - UptimeRobot para manter backend ativo
   - Sentry para error tracking

4. **ESP32**
   - Atualizar código do ESP32 com a URL do Render

---

## ✅ Checklist Final

- [ ] Frontend testado localmente
- [ ] Build de produção funcionando
- [ ] Código commitado e pushed para GitHub
- [ ] Conta criada na Vercel
- [ ] Projeto importado e configurado
- [ ] Variável `VITE_API_URL` adicionada
- [ ] Deploy completo (status verde)
- [ ] URL do frontend anotada
- [ ] `FRONTEND_URL` adicionada no Render
- [ ] Aplicação testada e funcionando
- [ ] CORS OK (sem erros no console)

---

**🎊 PARABÉNS! Seu projeto está no ar!** 🚀
