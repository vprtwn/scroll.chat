<script>
  import { user } from "./user-store.js";
  import { store } from "./gun-store";
  import Page from "./Page.svelte";
  import Nav from "./Nav.svelte";
  import Input from "./Input.svelte";

  let msgInput;
  let main;
  let form;
  let autoscroll;
</script>

<style>
  main {
    display: flex;
    height: 100%;
    flex-direction: column;
    background-color: white;
  }
  .scrollable {
    flex: 1 1 auto;
    margin: 0 0 0.5em 0;
    padding: 0.5em 1em;
    overflow-y: auto;
  }

  article {
    margin: 1em 0;
  }
  .meta {
    font-size: 10px;
    margin: 0.5em;
  }

  .user {
    text-align: right;
  }
</style>

<Page>
  <main>
    <main>
      <div class="scrollable" bind:this={main}>
        {#each $store as val (val.msgId)}
          <article>
            <div class="meta">
              <span class="time">
                {new Date(val.time).toLocaleString('en-US')}
              </span>
              <span class="user">{val.user}</span>
            </div>
            <div>
              {val.msg}
              <button
                on:click|preventDefault={() => {
                  const yes = confirm('Are you sure?');
                  if (yes) store.delete(val.msgId);
                }}>
                delete
              </button>
            </div>
          </article>
        {/each}
      </div>

      <form
        bind:this={form}
        method="get"
        autocomplete="off"
        on:submit|preventDefault>
        <Input
          on:submit={e => {
            if (!msgInput) return;
            $store = { msg: msgInput, user: $user };
            msgInput = '';
            main.scrollTo(0, main.scrollHeight);
          }}
          refocus={true}
          maxLines={3}
          bind:value={msgInput}
          name="msg"
          placeholder="Message"
          ariaLabel="Message" />
      </form>
    </main>
  </main>
</Page>
