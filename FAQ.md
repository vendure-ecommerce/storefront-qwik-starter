FAQ

Hosting on Server:

1). `npm run dev` will do the same as `npm run start`
    start attempts to open a browser, dev does not. 
    dev specifies the port to be used as 8080. You can change this in package.json
2). To expose your server to the outside network add --host 0.0.0.0
    ie: `vite --open --mode ssr --host 0.0.0.0`
3). Logging in expects you to have ssl (ie: https) enabled. 
    An easy (standard) solution is to run apache or nginx and direct https traffic to the specified port on your server.
4). You can use express, simply run the following `npm run qwik add express` this will give qwik an entry to the express approach, this way allowing you to self host on the same machine as vendure if you prefer.
    I am not necessarily suggesting this for speed, only perhaps to reduce cost/maintenance. Note: Express will be used for production, but during development vite is used anyway and can be run on a host until deployment. You should not use dev for production because it will seriously reduce the speed of the website.

Payment systems:

1). Vendure supports a number of plugins the front end supports out of the box: Braintree and Stripe, but not Mollie.

Visuals:

1). Warning messages or buttons may not be reactive:
  a). On login page it warns you need to connect to vendure. This is a static message! Even when you connect to your own vendure instance it will show this warning. Please edit your page.
  b). The favourite button is a placeholder on projects, please edit this or remove it.
  c). Comments are static please edit or remove this.
