import { useState, useEffect } from "react";

export default function RetryCountdown({ seconds, onDone }) {
  const [count, setCount] = useState(seconds);

  useEffect(() => {
    if (count <= 0) { onDone(); return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <div className="retry-banner">
      🌿 Please wait <strong>{count}s</strong> before sending again
    </div>
  );
}