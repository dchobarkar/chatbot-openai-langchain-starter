export const getSessionId = () => {
  let id = localStorage.getItem("chat_session_id");

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("chat_session_id", id);
  }

  return id;
};
