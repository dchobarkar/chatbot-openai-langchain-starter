const FetchMemoryDebug = async (sessionId: string) => {
  try {
    const res = await fetch(
      `http://localhost:3001/debug?sessionId=${sessionId}`
    );

    if (!res.ok) {
      throw new Error(
        `Failed to fetch debug memory: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();

    console.group(`🧠 Debug Info for Session: ${sessionId}`);
    console.log("🧠 Buffer:", data.buffer);
    console.log("🏷️ Entities:", data.entity);
    console.groupEnd();

    return data;
  } catch (err) {
    console.error("❌ Memory debug failed:", err);
  }
};

export default FetchMemoryDebug;
