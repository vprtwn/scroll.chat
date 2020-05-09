# scroll.chat

https://scroll.chat

### Install:

```html
<script src="https://unpkg.com/scroll.chat@latest/bundle.js" /></script>
```

```
npm install scroll.chat
```

```
yarn add scroll.chat
```

### Embed:

```html
<!DOCTYPE html>
<html>
  <!-- ... -->
  <div style="position: absolute;">
    <!-- your page content -->
  </div>
  <scroll-chat />
</html>
```

### Customize:

```html
<scroll-chat theme="dark" chat="closed" />
```

## Developing

scroll.chat is a Svelte web component with [GunDB](https://github.com/amark/gun).

`/`: localhost:5000

- develop: `yarn dev`
- build: `yarn build`

`/site`: https://scroll.chat

- develop: `sirv site`
- deploy: `surge site scroll.chat`

`/public`: https://www.npmjs.com/package/scroll.chat

- deploy: `yarn publish`
