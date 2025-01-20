import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";



async function fetchclasses() {
  try {
    const res = await fetch("http://localhost:3000/api/classes", {
      next: { tags: ["classes"] },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch classes");
    }
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function SportsServices() {

  const classes: Class[] = await fetchclasses();
  console.log(classes, "classes");
  
  return (
    <div className="container mx-auto py-8 min-h-screen max-w-full bg-gray-100">
      <h1 className="text-7xl font-bold mb-5 mt-20 text-black text-center">Sports Services</h1>
      <h2 className="text-center mb-20 mt-3">
      Achieve your fitness goals with our gym and combat sports classes,
      <br />
      including boxing, MMA, and more!
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
        {classes.map((cls, index) => (
          <Card
            key={index}
            className="relative bg-white shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg rounded-lg"
          >
            <CardContent className="p-0">
              <a href={`/sports-classes/${cls.sports_id}`} className="block">
                <div className="aspect-square relative rounded-t-lg overflow-hidden">
                <Image
                    src={cls.image}
                    alt={cls.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{cls.title}</h2>
                  <p className="text-sm text-gray-600 mb-3">{cls.coach}</p>
                </div>
              </a>
              <div className="p-4">
                <a href={`/sports-classes/${cls.sports_id}`}>
                  <Button
                    size="sm"
                    className="bg-gray-800 hover:bg-gray-700 text-white w-full py-2"
                  >
                    Learn More
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
