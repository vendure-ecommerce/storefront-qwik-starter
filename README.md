# Qwik storefront-qwik-starter ⚡️

- File based routing and MDX support
- Vite.js tooling.
- Express.js server.
- Prettier code formatter.
- Tailwind CSS framework.

## Development Builds

### Server-side Rendering (SSR) and Client

Server-side rendered index.html, with client-side modules prefetched and loaded by the browser. This can be used to test out server-side rendered content during development, but will be slower than the client-only development builds.

```
npm run dev.ssr
```

## Production Builds

A production build should generate the client and server modules by running both client and server build commands.

```
npm run build
```

### Server Modules

Production build that creates the server-side render (SSR) module that is used by the server to render the HTML.

```
npm run build.ssr
```

## Express Server

This app has a minimal [Express server](https://expressjs.com/) implementation. After running a full build, you can preview the build using the command:

```
npm run serve
```

Then visit [http://localhost:8080/](http://localhost:8080/)

---

## Related

- [Qwik Docs](https://qwik.builder.io/)
- [Qwik Github](https://github.com/BuilderIO/qwik)
- [@QwikDev](https://twitter.com/QwikDev)
- [Discord](https://qwik.builder.io/chat)
- [Vite](https://vitejs.dev/)
- [Partytown](https://partytown.builder.io/)
- [Mitosis](https://github.com/BuilderIO/mitosis)
- [Builder.io](https://www.builder.io/)
