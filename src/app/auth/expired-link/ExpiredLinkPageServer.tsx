import Image from "next/image";
import ExpiredLinkPageClient from "./ExpiredLinkPageClient";

export default function ExpiredLinkPageServer() {
  return (
    <div className="bg-white p-6 sm:p-10 rounded-lg shadow-xl max-w-sm sm:max-w-md w-full text-center">
      <Image
        src="/pictures/expired-link.png"
        alt="Expired link illustration"
        width={128}
        height={128}
        className="mx-auto mb-6"
        priority
      />
      <h1 className="text-3xl font-bold text-black mb-4">
        Oops! Your Link Expired 🕒
      </h1>
      <p className="text-gray-800 text-lg mb-6">
        Don&apos;t let a small hiccup hold you back from reaching your fitness goals.
        Let&apos;s get you back on track!
      </p>
      <ExpiredLinkPageClient />
    </div>
  );
}