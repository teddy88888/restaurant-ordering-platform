"use client";

import Image from "next/image";
import { Search } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[520px] overflow-hidden bg-[radial-gradient(circle_at_50%_35%,#70452d_0%,#24150f_42%,#080706_85%)]">
      {/* Background decoration */}
      {/* <div className="absolute inset-0">
        <div className="absolute left-1/2 top-24 h-72 w-[520px] -translate-x-1/2 rounded-full bg-orange-500/20 blur-3xl" />

        <div className="absolute bottom-[-100px] left-1/2 h-80 w-[700px] -translate-x-1/2 rounded-full bg-black/80 blur-2xl" />

        <div className="absolute left-[15%] top-[30%] h-24 w-24 rounded-full bg-red-700/20 blur-2xl" />

        <div className="absolute right-[15%] top-[28%] h-28 w-28 rounded-full bg-orange-500/20 blur-2xl" />
      </div> */}

      {/* Food illustration */}
      {/* <div className="absolute left-1/2 top-[115px] h-[230px] w-[430px] -translate-x-1/2 rounded-[50%] bg-gradient-to-b from-orange-300 via-orange-700 to-amber-950 opacity-90 shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
        <div className="absolute left-1/2 top-[-18px] h-24 w-[310px] -translate-x-1/2 rounded-[50%] bg-gradient-to-b from-amber-300 via-orange-500 to-orange-800 shadow-xl" />

        <div className="absolute left-1/2 top-[82px] h-8 w-[350px] -translate-x-1/2 rounded-full bg-yellow-400 shadow-lg" />

        <div className="absolute left-1/2 top-[105px] h-10 w-[365px] -translate-x-1/2 rounded-full bg-red-700" />

        <div className="absolute left-1/2 top-[130px] h-12 w-[370px] -translate-x-1/2 rounded-full bg-yellow-500" />

        <div className="absolute left-1/2 top-[155px] h-14 w-[350px] -translate-x-1/2 rounded-[50%] bg-green-600" />

        <div className="absolute left-1/2 top-[185px] h-12 w-[330px] -translate-x-1/2 rounded-b-[50%] bg-amber-700" />
      </div> */}

      <div className="absolute left-1/2 top-[0px] w-full -translate-x-1/2 overflow-hidden rounded-[0%] bg-gradient-to-b from-orange-300 via-orange-700 to-amber-950 opacity-90 shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
        <Image
          src="/restoran.png"
          alt="A stylized restaurant hero illustration featuring a warm, layered dish with golden, red, and green tones in a rounded bowl, set against a dark, moody background with a glowing, cozy dining atmosphere."
          width={830}
          height={430}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 mx-auto flex min-h-[520px] max-w-4xl w-400 flex-col items-center justify-center px-0 pt-20 text-center">
        <h1 className="max-w-2xl text-3xl font-semibold tracking-normal text-white drop-shadow-lg sm:text-5xl">
          Explore Culinary Experiences
        </h1>

        <p className="mt-3  text-sm w-300 text-white/90 sm:text-2xl">
          Search and refine your choice to discover the perfect restaurant.
        </p>

        <div className="mt-7 flex w-full max-w-md items-center rounded-full bg-white px-4 py-2 shadow-2xl">
          <Search className="mr-3 h-4 w-4 shrink-0 text-gray-400" />

          <input
            type="text"
            placeholder="Search restaurants, food and drink"
            className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
        </div>
      </div>
    </section>
  );
}
