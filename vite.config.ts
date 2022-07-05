import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import { resolve } from 'path';


export default defineConfig(() => {
  return {
    
    plugins: [
      qwikCity({
        pagesDir: resolve('src', 'pages'),
        layouts: {
          default: resolve('src', 'layouts', 'default', 'default.tsx'),
        },
      }),
      qwikVite(),
      
    ],
  };
});
