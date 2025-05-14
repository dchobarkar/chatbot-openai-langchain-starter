const fetchMemoryDebug = async () => {
  const res = await fetch(`http://localhost:3001/debug?sessionId=${sessionId}`);
  const data = await res.json();
  console.log("🧠 Buffer:", data.buffer);
  console.log("🏷️ Entities:", data.entity);
};
