import Link from "next/link";

const categories = [
  {
    label: "All Restaurant",
    image: "/restaurant.png",
    href: "/restaurants",
  },
  {
    label: "Nearby",
    image: "/nearby.png",
    href: "#nearby",
  },
  {
    label: "Best Seller",
    image: "/bestseller.png",
    href: "#bestseller",
  },
  {
    label: "Lunch",
    image: "/lunch.png",
    href: "#lunch",
  },
];

export default function CategoryMenu() {
  return (
    <section className="w-full bg-white px-6 py-6">
      <div className="mx-auto grid max-w-4xl grid-cols-3 gap-12 sm:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.label}
            href={category.href}
            className="group flex w-20 flex-col items-center gap-4"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white shadow-[0_3px_15px_rgba(0,0,0,0.08)] transition group-hover:-translate-y-1 group-hover:shadow-md">
              <img
                src={category.image}
                alt={category.label}
                className="w-12 object-contain"
              />
            </div>

            <span className="text-center text-[10px] font-medium text-gray-700 sm:text-xs">
              {category.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
