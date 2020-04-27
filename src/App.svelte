<script>
  import { user } from "./user-store.js";
  import { store } from "./gun-store";

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
    if (refocus) textarea.focus();
  }
</script>

<style>
  .meta {
    font-size: 10px;
    /* margin: 0.5em; */
  }

  .user {
    text-align: right;
  }
</style>

<!--
By default custom elements are compiled with accessors: true, 
which means that any props are exposed as properties of the DOM element. 
To prevent this, add accessors={false} to svelte:options.
https://dev.to/silvio/how-to-create-a-web-components-in-svelte-2g4j
-->
<svelte:options tag={'scroll-chat'} />
<div>
  <div>
    {#each $store as val (val.msgId)}
      <div>
        <span class="meta">
          <span class="time">{new Date(val.time).toLocaleString('en-US')}</span>
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
