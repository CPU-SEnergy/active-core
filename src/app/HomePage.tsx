interface HomePageProps {
   email: string | undefined;
 }

 export default function HomePage({ email }: HomePageProps) {
   return (
     <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-xl mb-4">Super secure home page</h1>
       <p className="mb-8">
        Only <strong>{email}</strong> holds the magic key to this kingdom!
      </p>
    </main>
   );
 }