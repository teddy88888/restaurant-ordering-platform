"use client";

import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileCard from "@/components/profile/ProfileCard";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto flex w-full max-w-[1140px] gap-8 px-6 py-12">
        <ProfileSidebar />

        <section className="flex-1">
          <h1 className="mb-6 font-[var(--font-nunito)] text-[32px] font-extrabold leading-[42px] text-[#0A0D12]">
            Profile
          </h1>

          <ProfileCard />
        </section>
      </div>
    </main>
  );
}
