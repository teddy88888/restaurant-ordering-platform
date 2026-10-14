import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Star, ArrowLeft, UtensilsCrossed } from "lucide-react";
import { getRestaurantDetail } from "@/lib/restaurantApi";
import Navbar from "@/components/home/Navbar";
import RestaurantMenuSection, {
  ShareButton,
} from "@/components/restaurant/RestaurantMenuSection";

type Props = {
  params: Promise<{
    id: string;
  }>;
};
import Footer from "@/components/home/Footer";

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

export default async function RestaurantDetailPage({ params }: Props) {
  const { id } = await params;
  const restaurantId = Number(id);

  if (!Number.isInteger(restaurantId) || restaurantId <= 0) {
    notFound();
  }

  let restaurant;

  try {
    const response = await getRestaurantDetail(restaurantId);
    restaurant = response.data;
  } catch {
    notFound();
  }

  if (!restaurant) {
    notFound();
  }

  const gallery = [
    restaurant.images?.[0] || restaurant.logo,
    restaurant.images?.[1] || restaurant.images?.[0] || restaurant.logo,
    restaurant.images?.[2] || restaurant.images?.[0] || restaurant.logo,
    restaurant.images?.[3] || restaurant.images?.[1] || restaurant.logo,
  ];

  const rating = restaurant.averageRating ?? restaurant.star;

  return (
    <>
      <Navbar variant="inner" />

      <main className="min-h-screen bg-white text-[#181818]">
        <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-28 sm:px-8 lg:px-[clamp(32px,8.33vw,120px)]">
          <Link
            href="/restaurants"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#666666] transition hover:text-[#C12116]"
          >
            <ArrowLeft size={18} />
            Back to restaurants
          </Link>

          {/* Restaurant gallery */}
          <section
            aria-label="Restaurant gallery"
            className="grid gap-4 md:h-[470px] md:grid-cols-[1.23fr_1fr] md:gap-5"
          >
            <div className="h-[280px] overflow-hidden rounded-2xl bg-[#F7F7F7] md:h-full">
              <img
                src={gallery[0]}
                alt={`${restaurant.name} main photo`}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-1 md:grid-rows-[1fr_148px] md:gap-5">
              <div className="col-span-2 h-[190px] overflow-hidden rounded-2xl bg-[#F7F7F7] md:col-span-1 md:h-auto">
                <img
                  src={gallery[1]}
                  alt={`${restaurant.name} interior`}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 md:gap-5">
                <div className="h-[120px] overflow-hidden rounded-2xl bg-[#F7F7F7] md:h-full">
                  <img
                    src={gallery[2]}
                    alt={`${restaurant.name} photo 3`}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="h-[120px] overflow-hidden rounded-2xl bg-[#F7F7F7] md:h-full">
                  <img
                    src={gallery[3]}
                    alt={`${restaurant.name} photo 4`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Restaurant information */}
          <section className="flex flex-col gap-5 border-b border-[#EEEEEE] py-8 md:flex-row md:items-center md:gap-6 md:py-10">
            <div className="flex h-[100px] w-[100px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#EEEEEE] bg-white p-2 md:h-[120px] md:w-[120px]">
              <img
                src={restaurant.logo}
                alt={`${restaurant.name} logo`}
                className="h-full w-full rounded-full object-contain"
              />
            </div>

            <div className="min-w-0 flex-1">
              <span className="mb-2 inline-block rounded-full bg-[#FFF0EF] px-3 py-1 text-xs font-semibold capitalize text-[#C12116]">
                {restaurant.category}
              </span>

              <h1 className="font-[var(--font-nunito)] text-3xl font-extrabold sm:text-[32px]">
                {restaurant.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-[#555555] sm:text-base">
                <span className="inline-flex items-center gap-2">
                  <Star size={19} className="fill-[#FFAB0D] text-[#FFAB0D]" />
                  <strong className="text-[#181818]">
                    {Number(rating).toFixed(1)}
                  </strong>
                  <span>({restaurant.totalReviews} reviews)</span>
                </span>

                <span className="inline-flex items-center gap-2">
                  <MapPin size={19} className="text-[#C12116]" />
                  {restaurant.place}
                </span>

                <span className="inline-flex items-center gap-2">
                  <UtensilsCrossed size={18} />
                  {restaurant.distance} km away
                </span>
              </div>
            </div>

            <div className="shrink-0">
              <ShareButton restaurantName={restaurant.name} />
            </div>
          </section>

          {/* Menu */}
          <RestaurantMenuSection
            restaurantId={restaurant.id}
            restaurantName={restaurant.name}
            menus={restaurant.menus}
          />

          {/* Reviews */}
          <section className="py-12 sm:py-16">
            <div className="mb-8">
              <h2 className="font-[var(--font-nunito)] text-3xl font-extrabold sm:text-4xl">
                Reviews
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      size={20}
                      className={
                        index < Math.round(Number(rating))
                          ? "fill-[#FFAB0D] text-[#FFAB0D]"
                          : "text-[#D5D7DA]"
                      }
                    />
                  ))}
                </div>

                <span className="font-[var(--font-nunito)] text-xl font-extrabold">
                  {Number(rating).toFixed(1)}
                </span>

                <span className="text-xl font-extrabold text-[#777777]">
                  ({restaurant.totalReviews} ulasan)
                </span>
              </div>
            </div>

            {restaurant.reviews.length === 0 ? (
              <div className="rounded-2xl bg-[#FAFAFA] p-10 text-center text-[#777777]">
                No reviews yet.
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {restaurant.reviews.map((review) => (
                  <article
                    key={review.id}
                    className="rounded-2xl bg-white p-5 shadow-[0px_0px_20px_rgba(203,202,202,0.25)] sm:p-6"
                  >
                    <div className="flex items-center gap-4">
                      {review.user.avatar ? (
                        <img
                          src={review.user.avatar}
                          alt={review.user.name}
                          className="h-14 w-14 shrink-0 rounded-full bg-[#F5F5F5] object-cover sm:h-16 sm:w-16"
                        />
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#FFECEC] text-xl font-bold text-[#C12116] sm:h-16 sm:w-16">
                          {review.user.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h3 className="font-[var(--font-nunito)] text-lg font-extrabold">
                          {review.user.name}
                        </h3>

                        <p className="mt-1 text-sm text-[#777777]">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div
                      className="mt-4 flex gap-1"
                      aria-label={`${review.star} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star
                          key={index}
                          size={18}
                          className={
                            index < review.star
                              ? "fill-[#FFAB0D] text-[#FFAB0D]"
                              : "text-[#D5D7DA]"
                          }
                        />
                      ))}
                    </div>

                    <p className="mt-3 leading-[30px] text-[#555555]">
                      {review.comment}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
