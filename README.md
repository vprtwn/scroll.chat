# scroll.chat

https://scroll.chat

## Developing

scroll.chat is a Svelte web component + [GunDB](https://github.com/amark/gun)

To run a server peer locally, clone & run [scroll.chat.server](https://github.com/benzguo/scroll.chat) (and update `gun-store.js` to point to the local peer).

- `yarn build`: build to bundle.js
- `yarn dev`: build/watch/serve

- To clear the current user & get a new one: run `sessionStorage.clear()` in the browser console.
- To clear all data: run `localStorage.clear()` in all browsers & stop all servers
