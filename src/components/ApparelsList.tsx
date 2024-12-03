"use client";

import { useEffect, useState } from "react";

interface Apparel {
  id: string,
  name: string,
  description: string,
  image: string,
  price: number
}

export default function ApparelsList() {
  const [apparels, setApparels] = useState<Apparel[]>([]);

  useEffect(() => {
    const fetchApparels = async () => {
      const response = await fetch("/api/apparels")
      const data = await response.json();
      setApparels(data);
    };

    fetchApparels();
  }, []);

  return (
    <div>
      <h1>Apparels</h1>
      {apparels.map((apparel) => (
        <div key={apparel.id}>
          <img src={apparel.image} alt={apparel.name} />
          <h2>{apparel.name}</h2>
          <p>{apparel.description}</p>
          <p>Price: Php {apparel.price}</p>
        </div>
      ))}
    </div>
  );
}