import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { classes } from "@/lib/mock_data/classes_data";

export default function SportsServices() {
  return (
    <div className="container mx-auto py-8 min-h-screen max-w-full">
      <h1 className="text-5xl font-bold mb-10 mt-5 ml-5">Sports Services</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4 px-20">
        {classes.map((classes, index) => (
          <Card
            key={index}
            className="relative bg-white shadow-sm hover:shadow-md transition-shadow duration-300 max-w-[600px] w-full mx-auto rounded-lg"
          >
            <CardContent className="p-0">
              <a
                href={`/sports-classes/${classes.sports_id}`}
                className="block"
              >
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <img
                    src={classes.image}
                    alt={classes.title}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-base font-semibold">{classes.title}</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:text-red-500 p-0"
                    ></Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{classes.coach}</p>
                </div>
              </a>
              <a href={`/sports-classes/${classes.sports_id}`}>
                <Button
                  size="sm"
                  className="bg-gray-500 hover:bg-gray-700 text-white w-full text-sm py-2"
                >
                  Learn More
                </Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
