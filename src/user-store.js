import { writable } from "svelte/store";
import cuid from "cuid";

function createUser() {
  const initialUser = JSON.parse(sessionStorage.getItem("chat_user")) || cuid();

  const { subscribe, update, set } = writable(initialUser);

  subscribe((newUser) => {
    sessionStorage.setItem("chat_user", JSON.stringify(newUser));
  });

  return {
    subscribe,
    update,
    set,
  };
}

export const user = createUser();
