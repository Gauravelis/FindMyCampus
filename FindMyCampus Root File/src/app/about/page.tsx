import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  GraduationCap,
  Target,
  Heart,
  Users,
  BarChart3,
  Filter,
  PhoneCall,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - FindMyCampus",
  description:
    "Discover the mission, vision, and powerful features behind FindMyCampus — empowering students to choose the right college.",
};

export default function AboutPage() {
  return (
    <main className="space-y-20">
      {/* hero section */}
      <section className="bg-gradient-to-r from-primary/20 to-primary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <GraduationCap className="mx-auto h-16 w-16 text-primary" />
          <h1 className="mt-4 text-5xl font-headline font-bold text-foreground">
            About FindMyCampus
          </h1>
          <p className="mt-2 max-w-2xl mx-auto text-lg text-muted-foreground">
            Guiding students toward the right education, brighter careers, and
            a confident future.
          </p>
        </div>
      </section>

      {/* content section */}
      <section className="container mx-auto px-4">
        <p className="text-lg text-muted-foreground mb-6">
          FindMyCampus is a student-focused digital platform designed to
          simplify one of the most important decisions in life — choosing the
          right college. We help students across India discover, compare, and
          connect with institutions that match their goals, interests, and
          aspirations.
        </p>
        <p className="text-lg text-muted-foreground mb-12">
          Our platform brings transparency, accuracy, and convenience into the
          education search process, ensuring every student has access to
          reliable information at the right time.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="p-8 rounded-xl border bg-card shadow-lg hover:shadow-2xl transition mt-6">
            <Target className="h-10 w-10 text-primary mb-4" />
            <h3 className="font-semibold text-xl text-foreground mb-3">
              Our Mission
            </h3>
            <p className="text-muted-foreground">
              To empower students with trusted insights, smart tools, and
              personalized guidance so they can make confident academic
              decisions.
            </p>
          </div>

          <div className="p-8 rounded-xl border bg-card shadow-lg hover:shadow-2xl transition mt-6">
            <Heart className="h-10 w-10 text-primary mb-4" />
            <h3 className="font-semibold text-xl text-foreground mb-3">
              Our Vision
            </h3>
            <p className="text-muted-foreground">
              To become India's most trusted student guidance platform,
              helping learners achieve their full potential.
            </p>
          </div>

          <div className="p-8 rounded-xl border bg-card shadow-lg hover:shadow-2xl transition mt-6">
            <Users className="h-10 w-10 text-primary mb-4" />
            <h3 className="font-semibold text-xl text-foreground mb-3">
              What We Offer
            </h3>
            <p className="text-muted-foreground">
              Detailed college profiles, transparent fee structures,
              comparison tools, personalized recommendations, and student
              support services.
            </p>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">
          Key Platform Features
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="p-8 rounded-xl border bg-card shadow-lg hover:shadow-2xl transition mt-6">
            <BarChart3 className="h-10 w-10 text-primary mb-4" />
            <h4 className="font-semibold text-xl text-foreground mb-2">
              Side-by-Side Comparison
            </h4>
            <p className="text-muted-foreground">
              Compare multiple colleges at once based on courses, fees,
              rankings, facilities, and placements.
            </p>
          </div>

          <div className="p-8 rounded-xl border bg-card shadow-lg hover:shadow-2xl transition mt-6">
            <Filter className="h-10 w-10 text-primary mb-4" />
            <h4 className="font-semibold text-xl text-foreground mb-2">
              Quick & Smart Filters
            </h4>
            <p className="text-muted-foreground">
              Find colleges easily using filters like location, stream,
              budget, accreditation, and exam scores.
            </p>
          </div>

          <div className="p-8 rounded-xl border bg-card shadow-lg hover:shadow-2xl transition mt-6">
            <PhoneCall className="h-10 w-10 text-primary mb-4" />
            <h4 className="font-semibold text-xl text-foreground mb-2">
              Student Support & Contact
            </h4>
            <p className="text-muted-foreground">
              Get direct assistance through our support system for guidance,
              queries, and admission-related help.
            </p>
          </div>
        </div>
      </section>

      {/* closing */}
      <section className="container mx-auto px-4 text-center">
        <p className="text-lg">
          At FindMyCampus, we are more than just a platform — we are your
          learning partner. From exploration to enrollment, we walk with you at
          every step of your academic journey.
        </p>
        <p className="mt-4 font-medium text-foreground">
          Your future deserves the right foundation. Let us help you build it.
          🚀
        </p>
      </section>
    </main>
  );
}
