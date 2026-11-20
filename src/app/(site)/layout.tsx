import { MotionConfig } from "motion/react";
import { getCategories } from "@/lib/queries";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Preloader } from "@/components/motion/preloader";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const categories = (await getCategories()).map(({ name, slug, description, image }) => ({ name, slug, description, image }));
  return (
    <MotionConfig reducedMotion="user">
      <div className="paper-grain flex min-h-screen flex-col">
        <SmoothScroll />
        <Preloader />
        <Navbar categories={categories} />
        <main className="relative z-10 flex-1 overflow-x-clip rounded-b-[2.5rem] bg-paper pb-10">{children}</main>
        <Footer categories={categories} />
      </div>
    </MotionConfig>
  );
}
