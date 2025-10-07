# Cart

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

---

## Push Notifications / Service Worker

This project includes a basic client-side Service Worker and Push helper to display notifications when order status changes.

What was added

- `src/app/services/push.service.ts` — registers the service worker, requests permission, optionally subscribes for server push, and shows immediate notifications.

- `public/sw.js` — service worker that handles `push` events, `notificationclick`, and `message` events to show notifications from the page.

Client-side usage

- The app registers the service worker on startup (see `src/app/app.ts`).

- Call `orderService.notifyStatusChange(orderId, newStatus)` to request permission and show an immediate in-browser notification for the current client.

Server-side push (optional)

1. Generate VAPID keys (on server) with a library like `web-push`.

2. Provide the VAPID public key to the client and call `pushService.subscribeToPush(vapidPublicKey)` to obtain a subscription object.

3. Send that subscription to your server and store it per-user.

4. When order status changes server-side, use a Web Push library to send a push payload to the stored subscription(s). Payload should be a JSON object such as `{ title, body, url }`.

Example Node server snippet

```js
const webpush = require('web-push');
webpush.setVapidDetails('mailto:you@domain.com', VAPID_PUBLIC, VAPID_PRIVATE);
webpush.sendNotification(
  subscription,
  JSON.stringify({ title: 'Order X updated', body: 'Status: shipped', url: '/orders/123' })
);
```

Testing locally

- For immediate client notifications use `orderService.notifyStatusChange('123', 'shipped')` from your UI.

- For server push tests, ensure your site is served over HTTPS (or localhost). Send push from server to the subscription stored and watch the service worker display it.

# Cart

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
