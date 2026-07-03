# Taxi IA con Expo y n8n

## Configuración local

1. Copia `.env.example` como `.env` y sustituye `YOUR_COMPUTER_IP` por la IP local de la computadora que ejecuta Docker.
2. Copia `app-mobile/.env.example` como `app-mobile/.env.local` y usa la misma IP.
3. Inicia n8n:

   ```powershell
   docker compose up -d
   ```

4. Si el volumen de n8n es nuevo, importa `workflow-viajes-n8n.json`, configura la credencial de Groq y publica el workflow.
5. Inicia la aplicación:

   ```powershell
   cd app-mobile
   npm install
   npm start
   ```

El webhook de producción esperado es `POST /webhook/solicitar-viaje`.

Las variables `EXPO_PUBLIC_*` son visibles dentro de la aplicación compilada; no guardes secretos en ellas.
