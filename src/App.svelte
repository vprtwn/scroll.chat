<script>
  import { user } from "./user-store.js";
  import { store } from "./gun-store";
  import { format } from "timeago.js";

  let windowHeight;
  let textarea;
  let value;

  function handleKeydown(e) {
    if (e.keyCode === 13) {
      if (!value) return;
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleSubmit() {
    if (!value) return;
    $store = { msg: value, user: $user };
    value = "";
  }
</script>

<style>
  .meta {
    font-size: 10px;
    background-color: transparent;
  }

  .user {
    text-align: right;
  }

  .chat-sidebar {
    position: absolute;
    background-color: black;
    width: 10px;
    min-height: 100%;
    /* overflow: auto; */
    /* left: 0px; */
  }

  .chat-container {
    position: absolute;
    background-color: transparent;
    width: auto;
    padding-left: 10px;
  }

  .chat-message-list {
    background-color: transparent;
  }

  .chat-message {
    background-color: white;
  }
</style>

<!--
By default custom elements are compiled with accessors: true, 
which means that any props are exposed as properties of the DOM element. 
To prevent this, add accessors={false} to svelte:options.
https://dev.to/silvio/how-to-create-a-web-components-in-svelte-2g4j
-->
<svelte:options tag={'scroll-chat'} />
<svelte:window bind:outerHeight={windowHeight} />
<div>
  <div class="chat-sidebar" style={`height: ${windowHeight}`} />
  <div class="chat-container">
    <div class="chat-message-list">
      {#each $store as val (val.msgId)}
        <div class="chat-message">
          <span class="meta">
            <span class="time">{format(val.time)}</span>
            <span class="user">{val.user.substr(0, 5)}</span>
          </span>
          <span class="meta">
            {val.msg}
            <button
              on:click|preventDefault={() => {
                const yes = confirm('Are you sure?');
                if (yes) store.delete(val.msgId);
              }}>
              delete
            </button>
          </span>
        </div>
      {/each}
    </div>

    <form method="get" autocomplete="off" on:submit|preventDefault>
      <div class="input-with-button">
        <textarea
          bind:this={textarea}
          class="input"
          type="text"
          name="null"
          maxLength="160"
          bind:value
          on:keydown={handleKeydown}
          placeholder="message" />
        {#if value}
          <input
            class="submit"
            type="submit"
            value="Send"
            on:click={handleSubmit} />
        {/if}
      </div>
    </form>
  </div>
</div>
