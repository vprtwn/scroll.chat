# scroll.chat

🚧 WORK IN PROGRESS 🚧

<img src="https://raw.githubusercontent.com/benzguo/scroll.chat/master/public/screenshot_2020-05-01.png">

## Developing

To run a server peer locally, clone & run [scroll.chat.server](https://github.com/benzguo/scroll.chat) (and update `gun-store.js` to point to the local peer).

- `yarn build`: build to bundle.js
- `yarn dev`: build/watch/serve

- To clear the current user & get a new one: run `sessionStorage.clear()` in the browser console.
- To clear all data: run `localStorage.clear()` in all browsers & stop all servers

To regenerate `custom-elements.json`:

1. Install [web-component-analyzer](https://github.com/runem/web-component-analyzer), then
2. `wca analyze public/build/bundle.js --outFile custom-elements.json`

## Acknowledgements

- https://github.com/vnglst/svelte-gundb-chat
- https://dev.to/silvio/how-to-create-a-web-components-in-svelte-2g4j
