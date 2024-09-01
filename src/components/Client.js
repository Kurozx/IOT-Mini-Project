// pages/client-page.js

import { useState, useEffect } from "react";

export default function ClientPage() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Logic to fetch data, manipulate DOM, etc. (client-side operations)
    document.title = `Clicked ${count} times`;
  }, [count]);

  const handleClick = () => {
    setCount((prevCount) => prevCount + 1);
  };

  return (
    <div>
      <h1>Client-Side Page</h1>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}
