import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul>
              <li>
                <Link href="/apparels">Apparels</Link>
              </li>
              <li>
                <Link href="/services">Services</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul>
              <li>
                <Link href="/classes">Classes</Link>
              </li>
              <li>
                <Link href="/about">About Us</Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Subscribe to our website</h3>
            <p className="mb-4">For product announcements and exclusive insights</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Input your email"
                className="flex-grow px-4 py-2 rounded-l-full text-gray-900"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-r-full hover:bg-blue-700 transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; 2025 Sports and Fitness Center. All rights reserved.</p>
          <div className="mt-4">
            <Link href="/privacy" className="mr-4">
              Privacy
            </Link>
            <Link href="/terms" className="mr-4">
              Terms
            </Link>
            <Link href="/sitemap">Location</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

