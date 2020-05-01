<script>
  import { user } from "./user-store.js";
  import { store } from "./gun-store";
  import { format } from "timeago.js";
  import { onMount } from "svelte";

  let mouseY = 0;
  let newMessageY = 0;
  let scrollY = 0;
  let innerHeight = 0;
  let scrollHeight;
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
    $store = { msg: value, user: $user };
    value = "";
  }

  async function handleSidebarClick() {
    if (!showingMessages) {
      toggleShowingMessages();
    }
    newMessageY = mouseY + scrollY - 10;
    setTimeout(() => {
      newMessageInput.focus();
    }, 0);
  }

  async function toggleShowingMessages() {
    showingMessages = !showingMessages;
    if (showingMessages) {
      resetNewMessageY();
      setTimeout(() => {
        newMessageInput.focus();
      }, 0);
    }
  }

  // move message input to the bottom of the page
  function resetNewMessageY() {
    newMessageY = scrollY + innerHeight - 20 * 2 - 20 - 10;
  }

  onMount(async () => {
    scrollHeight = document.documentElement.scrollHeight;
    resetNewMessageY();
  });
</script>

<style>
  .user {
    text-align: right;
  }

  .chat-sidebar {
    position: absolute;
    background-color: black;
    width: 10px;
    z-index: 40;
    /* min-height: 100%; */
    /* overflow: auto; */
    /* left: 0px; */
  }

  .chat-messages {
    position: absolute;
    background-color: transparent;
    width: auto;
    padding-left: 10px;
  }

  .chat-message {
    background-color: #ffffffdd;
  }

  .chat-message-text {
    font-size: 12px;
  }

  .chat-message-info {
    font-size: 12px;
  }

  .new-message {
    position: absolute;
    padding-left: 10px;
  }

  .new-message input {
    background: #ffffffdd;
    font-size: 12px;
    padding: 5px;
    height: 20px;
  }

  .chat-toolbar {
    background-color: #ffffffdd;
    position: fixed;
    bottom: 0px;
    padding-bottom: 10px;
    z-index: 50;
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

<div>
  <div
    class="chat-sidebar"
    on:click={handleSidebarClick}
    on:mousemove={handleMousemove}
    style="height: {scrollHeight}px;" />
  <div class="chat-messages" hidden={!showingMessages}>
    {#each $store as val (val.msgId)}
      <div class="chat-message">
        <span class="chat-message-text">
          {val.msg}
          <button
            on:click|preventDefault={() => {
              const yes = confirm('Are you sure?');
              if (yes) store.delete(val.msgId);
            }}>
            delete
          </button>
        </span>
        <span class="chat-message-info">
          <span class="time">{format(val.time)}</span>
          <span class="user">{val.user.substr(0, 5)}</span>
        </span>
      </div>
    {/each}
  </div>
  <div
    class="new-message"
    style="top: {newMessageY}px;"
    hidden={!showingMessages}>
    <form method="get" autocomplete="off" on:submit|preventDefault>
      <div>
        <input
          class="input"
          type="text"
          name="null"
          maxLength="160"
          bind:this={newMessageInput}
          bind:value
          on:keydown={handleKeydown}
          placeholder="new message" />
        {#if value}
          <button on:click={handleSubmit}>send</button>
        {/if}
      </div>
    </form>
  </div>
  <div class="chat-toolbar">
    <button on:click={toggleShowingMessages}>
      {showingMessages ? '< hide' : '> chat'}
    </button>
  </div>
</div>
