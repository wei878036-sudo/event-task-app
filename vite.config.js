import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    
  ],
  server: {
    port: '8090',
    proxy: {
      '/api': {
        target: 'https://app.ticketmaster.com/discovery/v2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            // 移除 Content-Type，Ticketmaster 对 GET 请求的 mime type 校验严格
            proxyReq.removeHeader('content-type')
          })
        },
      },
    },
  }
})
