# Vendure Qwik Storefront Starter️

An e-commerce storefront for [Vendure](https://www.vendure.io) built with [Qwik](https://qwik.builder.io/) & [Qwik City](https://qwik.builder.io/qwikcity/overview).

👉 [qwik-storefront.vendure.io](https://qwik-storefront.vendure.io)

## Core Web Vitals

<br/>

![pagespeed.web.dev](docs/metrics.png)

<br/>

## To do

- Cart ✅
- Checkout flow ✅
- Search facet filters ✅
- Login ✅
- Account creation ✅
- Customer account management ✅
- SPA-mode navigation ✅
- Set up GraphQL code generation

**Contributions welcome!**

## Development

Development mode uses [Vite's development server](https://vitejs.dev/). During development, the `dev` command will server-side render (SSR) the output.

```shell
npm start # or `yarn start`
```

> Note: during dev mode, Vite may request a significant number of `.js` files. This does not represent a Qwik production build.

## Preview

The preview command will create a production build of the client modules, a production build of `src/entry.preview.tsx`, and run a local server. The preview server is only for convenience to locally preview a production build, and it should not be used as a production server.

```shell
npm run preview # or `yarn preview`
```

## Production

The production build will generate client and server modules by running both client and server build commands. Additionally, the build command will use Typescript to run a type check on the source code.

```shell
npm run build # or `yarn build`
```

---

## Related

- [Vendure Docs](https://vendure.io/docs)
- [Vendure Github](https://github.com/vendure-ecommerce/vendure)
- [Vendure Slack](https://join.slack.com/t/vendure-ecommerce/shared_invite/enQtNzA1NTcyMDY3NTg0LTMzZGQzNDczOWJiMTU2YjAyNWJlMzdmZGE3ZDY5Y2RjMGYxZWNlYTI4NmU4Y2Q1MDNlYzE4MzQ5ODcyYTdmMGU)
- [Qwik Docs](https://qwik.builder.io/)
- [Qwik Github](https://github.com/BuilderIO/qwik)
- [@QwikDev](https://twitter.com/QwikDev)
- [Qwik Discord](https://qwik.builder.io/chat)
