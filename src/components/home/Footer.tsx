import Link from "next/link";

const exploreLinks = [
  "All Food",
  "Nearby",
  "Discount",
  "Best Seller",
  "Delivery",
  "Lunch",
];

const helpLinks = [
  "How to Order",
  "Payment Methods",
  "Track My Order",
  "FAQ",
  "Contact Us",
];

export default function Footer() {
  return (
    <footer className="bg-[#090d12] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <span className="text-xl h-6 w-6 text-red-500">
                <img src=" /redfoody.png" alt="redfoody" />
            </span>
            Foody
          </Link>

          <p className="mt-4 max-w-xs text-xs leading-6 text-gray-400">
            Enjoy homemade flavors & chef’s signature dishes, freshly prepared
            every day. Order online or visit our nearest branch.
          </p>

          

          <div className="mt-5">
            <p className="text-xs font-semibold text-white">
              Follow on Social Media
            </p>

            <div className="mt-3 flex w-28 gap-6">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 text-gray-300 transition hover:border-red-500 hover:text-red-500"
              >
                <img src=" /facebook.png" alt="fb" />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-gray-300 transition hover:border-red-500 hover:text-red-500"
              >
                <img src=" /ig.png" alt="ig" />
              </a>

              <a
                href="#"
                aria-label="linkedin"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 text-gray-300 transition hover:border-red-500 hover:text-red-500"
              >
                <img src=" /in.png" alt="linkedin" />
              </a>

              <a
                href="#"
                aria-label="TikTok"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 text-gray-300 transition hover:border-red-500 hover:text-red-500"
              >
                <img src=" /tik.png" alt="tiktok" />
              </a>
            </div>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h3 className="text-xs font-semibold">Explore</h3>

          <ul className="mt-4 space-y-3">
            {exploreLinks.map((link) => (
              <li key={link}>
                <Link
                  href="#"
                  className="text-xs text-gray-400 transition hover:text-white"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="text-xs font-semibold">Help</h3>

          <ul className="mt-4 space-y-3">
            {helpLinks.map((link) => (
              <li key={link}>
                <Link
                  href="#"
                  className="text-xs text-gray-400 transition hover:text-white"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 px-6 py-4 text-center">
        <p className="text-[10px] text-gray-500">
          © 2026 Foody. All rights reserved.
        </p>
      </div>
    </footer>
  );
}