<script>
  import { user } from "./user-store.js";
  import { gunStore, msgStore, presenceStore } from "./gun-store";
  import { format } from "timeago.js";
  import { onMount } from "svelte";

  let mouseY = 0;
  let scrollY = 0;
  let lastTickScrollY = 0;
  let isScrolling = false;
  let innerHeight = 0;
  let scrollHeight = 1;
  // area of screen to display chats (ratio of screen height)
  let chatScrollArea = 0.6;
  let value;
  let showingMessages = true;
  let newMessageInput;

  function handleKeydown(e) {
    // enter
    if (e.keyCode === 13) {
      if (!value) return;
      e.preventDefault();
      handleSubmit();
    }
    // esc
    else if (e.keyCode === 27) {
      if (showingMessages) {
        e.preventDefault();
        showingMessages = false;
      }
    }
  }

  function handleMousemove(event) {
    mouseY = event.clientY;
  }

  function handleSubmit() {
    if (!value) return;
    $gunStore = {
      msg: value,
      user: $user,
      time: new Date().getTime(),
      yRel: getYRel()
    };
    value = "";
  }

  async function handleSidebarClick() {
    toggleShowingMessages();
  }

  async function toggleShowingMessages() {
    showingMessages = !showingMessages;
    if (showingMessages) {
      setTimeout(() => {
        newMessageInput.focus();
      }, 0);
    } else {
      gunStore.deletePresence($user);
    }
  }

  function getYRel() {
    return (scrollY + innerHeight - 100) / scrollHeight;
  }

  function getY(val) {
    let yRel = val.yRel;
    return yRel * scrollHeight;
  }

  function toHSL(str) {
    if (!str) return;
    const opts = {
      hue: [60, 360],
      sat: [75, 100],
      lum: [70, 71]
    };
    function range(hash, min, max) {
      const diff = max - min;
      const x = ((hash % diff) + diff) % diff;
      return x + min;
    }
    let hash = 0;
    if (str === 0) return hash;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
    }
    let h = range(hash, opts.hue[0], opts.hue[1]);
    let s = range(hash, opts.sat[0], opts.sat[1]);
    let l = range(hash, opts.lum[0], opts.lum[1]);
    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  onMount(async () => {
    scrollHeight = document.documentElement.scrollHeight;
    const interval = setInterval(() => {
      let newIsScrolling = lastTickScrollY !== scrollY;
      if (isScrolling !== newIsScrolling) {
        isScrolling = newIsScrolling;
        if (!isScrolling) {
          const yRel = getYRel();
          if (yRel <= 1 && yRel > 0) {
            let val = {
              msg: "",
              user: $user,
              yRel: yRel,
              time: 0
            };
            // send presence
            $gunStore = val;
          }
        }
      }
      lastTickScrollY = scrollY;
    }, 200);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState !== "visible") {
        gunStore.deletePresence($user);
      }
    });
  });
</script>

<style>
  .chat-sidebar {
    position: absolute;
    /* background-color: black; */
    background-color: #000000aa;
    width: 10px;
    z-index: 40;
  }

  .chat-messages {
    position: absolute;
    background-color: transparent;
    width: auto;
    padding-left: 10px;
  }

  .chat-message-container {
    position: absolute;
    width: calc(100vw - 10px);
  }

  .chat-message {
    color: white;
    font-size: 15px;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    background-color: #000000aa;
  }

  .chat-presences {
    position: absolute;
    background-color: transparent;
    width: auto;
    padding-left: 0px;
  }

  .chat-presence {
    position: absolute;
    width: 8px;
    height: 8px;
    z-index: 60;
    border: solid;
    border-width: 1px;
    border-color: #ffffffaa;
  }

  .new-message {
    position: fixed;
    bottom: 0px;
    padding-bottom: 35px;
    padding-left: 10px;
  }

  .new-message input {
    background: #ffffff;
    font-size: 15px;
    padding: 10px;
    height: 20px;
    width: 300px;
    border: solid;
    border-width: 2px;
  }

  .chat-toolbar {
    background-color: #000000aa;
    position: fixed;
    margin-left: 10px;
    bottom: 0px;
    z-index: 50;
  }

  .toggle-chat-button {
    background: none;
    border: none;
    padding: 0.2rem;
    padding-right: 1rem;
    padding-bottom: 1rem;
    color: white;
    font-size: 15px;
  }

  .send-button {
    background: #000000;
    border: none;
    padding: 0.5rem;
    color: white;
    font-size: 15px;
  }
</style>

<!--
By default custom elements are compiled with accessors: true, 
which means that any props are exposed as properties of the DOM element. 
To prevent this, add accessors={false} to svelte:options.
https://dev.to/silvio/how-to-create-a-web-components-in-svelte-2g4j
-->
<svelte:options tag={'scroll-chat'} />

<svelte:window bind:scrollY bind:innerHeight />

<div on:mousemove={handleMousemove}>
  <div
    class="chat-sidebar"
    on:click={handleSidebarClick}
    style="height: {scrollHeight}px;" />
  <div class="chat-messages" hidden={!showingMessages}>
    {#each $msgStore as val (val.msgId)}
      <div class="chat-message-container" style="top: {getY(val)}px;">
        <span
          class="chat-message"
          style="filter: drop-shadow(4px 4px 4px {toHSL(val.user)})"
          hidden={(innerHeight - (getY(val) - scrollY)) / innerHeight >= 0.6}>
          {val.msg}
        </span>
      </div>
    {/each}
  </div>
  <div class="chat-presences" hidden={!showingMessages}>
    {#each $presenceStore as p (p.msgId)}
      <div
        class="chat-presence"
        style="top: {getY(p)}px; background-color: {toHSL(p.user)};" />
    {/each}
  </div>
  <div class="new-message" hidden={!showingMessages}>
    <form method="get" autocomplete="off" on:submit|preventDefault>
      <div>
        <input
          style="filter: drop-shadow(4px 4px 4px {toHSL($user)})"
          class="input"
          type="text"
          name="null"
          maxLength="160"
          bind:this={newMessageInput}
          bind:value
          on:keydown={handleKeydown}
          placeholder="new message" />
        {#if value}
          <button class="send-button" on:click={handleSubmit}>send</button>
        {/if}
      </div>
    </form>
  </div>
  <div class="chat-toolbar">
    <button class="toggle-chat-button" on:click={toggleShowingMessages}>
      {showingMessages ? '< hide' : '> chat'}
    </button>
  </div>
</div>
