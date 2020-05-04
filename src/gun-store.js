import { writable, derived } from "svelte/store";
import Gun from "gun/gun";

function removeByMsgId(array, msgId) {
  for (let i in array) {
    if (array[i].msgId == msgId) {
      array.splice(i, 1);
      break;
    }
  }
}

function createStore() {
  // https://github.com/amark/gun/wiki/volunteer.dht
  const gun = new Gun([
    // "http://localhost:8765/gun", // local development
    "https://side.land/gun",
    "https://www.raygun.live/gun",
    "https://phrassed.com/gun",
  ]);

  const prefix = "scroll.chat.v1";
  const nodeName = `${prefix}^${window.location.href}`;
  const { subscribe, update } = writable([]);
  const chats = gun.get(nodeName);

  chats.map().on((val, msgId) => {
    update((state) => {
      // delete
      if (!val) {
        removeByMsgId(state, msgId);
        return state;
      }

      const presenceIdx = state.findIndex((m) => m.time === 0 && m.user === val.user);
      if (val.time === 0 && presenceIdx > -1) {
        state[presenceIdx] = {
          msgId,
          msg: val.msg,
          time: 0,
          user: val.user,
          yRel: val.yRel,
        };
        return state;
      }

      if (val)
        state.push({
          msgId,
          msg: val.msg,
          time: parseFloat(val.time),
          user: val.user,
          yRel: val.yRel,
        });

      // no more than 200 messages
      if (state.length > 200) state.shift();

      return state;
    });
  });

  return {
    subscribe,
    deletePresence: (user) => {
      const msgId = `${0}_${user}`;
      chats.get(msgId).put(null);
    },
    setPresence: ({ user, yRel }) => {
      if (yRel <= 0 || yRel >= 1) {
        return;
      }
      const time = new Date().getTime();
      const msgId = `${time}_${user}`;
      let val = {
        msg: "",
        user: user,
        yRel: yRel,
        time: 0,
      };
      chats.get(msgId).put(val);
    },
    pushMessage: ({ msg, user, yRel }) => {
      if (yRel <= 0 || yRel >= 1) {
        return;
      }
      const time = new Date().getTime();
      const msgId = `${time}_${user}`;
      chats.get(msgId).put({
        msg,
        user,
        time,
        yRel,
      });
    },
  };
}

export const gunStore = createStore();
export const msgStore = derived(gunStore, ($store) =>
  $store.filter((v) => parseFloat(v.time) !== 0)
);
export const presenceStore = derived(gunStore, ($store) =>
  $store.filter((v) => parseFloat(v.time) === 0)
);
