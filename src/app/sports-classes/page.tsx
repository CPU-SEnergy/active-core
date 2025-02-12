import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { classes } from "@/lib/mock_data/classes_data";

export default function SportsServices() {
  return (
    <div className="container mx-auto py-8 min-h-screen max-w-full bg-gray-100 pt-20">
      <h1 className="text-5xl font-bold mb-10 mt-5 text-black text-center">Sports Services</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
        {classes.map((cls, index) => (
          <Card
            key={index}
            className="relative bg-white shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg rounded-lg"
          >
            <CardContent className="p-0">
              <a href={`/sports-classes/${cls.sports_id}`} className="block">
                <div className="aspect-square relative rounded-t-lg overflow-hidden">
                  <img
                    src={cls.image}
                    alt={cls.title}
                    className="object-cover w-full h-full rounded-t-lg"
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
