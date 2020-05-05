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
  // community peers:
  // https://github.com/amark/gun/wiki/volunteer.dht
  const gun = new Gun([
    // "http://localhost:8765/gun", // local development
    "https://side.land/gun",
    "https://www.raygun.live/gun",
    "https://phrassed.com/gun",
  ]);

  const prefix = "scroll.chat.0.0.1";
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

      // filter presences older than 1 min
      const now = new Date();
      state = state.filter(
        (v) => v.type === "msg" || (v.type === "pres" && now - v.time < 60 * 1000)
      );

      if (val.type === "pres") {
        // 1 presence per user
        const presenceIdx = state.findIndex((v) => v.type === "pres" && v.user === val.user);
        if (presenceIdx > -1) {
          const time = new Date().getTime();
          state[presenceIdx] = {
            msgId,
            msg: val.msg,
            time: time,
            user: val.user,
            yRel: val.yRel,
            type: "pres",
          };
          return state;
        }
      }

      if (val) {
        state.push({
          msgId,
          msg: val.msg,
          time: parseFloat(val.time),
          user: val.user,
          yRel: val.yRel,
          type: val.msg.length > 0 ? "msg" : "pres",
        });
      }

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
        time: time,
        type: "pres",
      };
      chats.get(msgId).put(val);
    },
    pushMessage: ({ msg, user, yRel }) => {
      if (yRel <= 0 || yRel >= 1) {
        return;
      }
      const time = new Date().getTime();
      const msgId = `${time}_${user}`;
      const val = {
        msg: msg,
        user: user,
        yRel: yRel,
        time: time,
        type: "msg",
      };
      console.log(val);
      chats.get(msgId).put(val);
    },
  };
}

export const gunStore = createStore();
export const msgStore = derived(gunStore, ($store) => $store.filter((v) => v.type === "msg"));
export const presenceStore = derived(gunStore, ($store) => $store.filter((v) => v.type === "pres"));
