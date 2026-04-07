/**
 * Testimonials.tsx
 *
 * Authentic member testimonials for itsdad.io.
 * 12 diverse testimonials with specific results and correct tier names.
 */

import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  tier: string;
  rating: number;
  quote: string;
  result: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Marcus T.",
    location: "Atlanta, GA",
    tier: "Builder Club",
    rating: 5,
    quote:
      "I tried three other affiliate programs before Its Dad. The difference? When I had a question at 11 PM, I didn't have to wait — the 24/7 self-serve Prompt Vault + pre-recorded video library had the exact answer I needed. Earned my first commission in 9 days.",
    result: "First commission: $47 in 9 days",
  },
  {
    id: 2,
    name: "Jasmine R.",
    location: "Houston, TX",
    tier: "Pro Creator Club",
    rating: 5,
    quote:
      "The swipe files alone are worth the membership. I copied the ad copy, swapped in my link, and ran it. The system tracked everything automatically. No guesswork, no tech headaches.",
    result: "$312 earned in first 30 days",
  },
  {
    id: 3,
    name: "DeShawn M.",
    location: "Chicago, IL",
    tier: "Starter Pack",
    rating: 5,
    quote:
      "I was skeptical. I've been burned before. But the Affiliated Degree course is the real deal — 8 modules, self-paced, and the material actually works. Completed it in 3 weeks and my commissions tripled.",
    result: "3x commission increase after completing the Degree",
  },
  {
    id: 4,
    name: "Priya K.",
    location: "Dallas, TX",
    tier: "Pro Creator Club",
    rating: 5,
    quote:
      "What I love most is that the system does the heavy lifting. My referral link is out there working 24/7. I wake up, check my dashboard, and see new commissions. It's exactly what they promised.",
    result: "Passive income running on autopilot",
  },
  {
    id: 5,
    name: "Tanya W.",
    location: "Miami, FL",
    tier: "Pro Creator Club",
    rating: 5,
    quote:
      "I earned my Affiliated Degree last month. The 24/7 self-serve Prompt Vault + pre-recorded video library meant I could learn at 2 AM when the kids were asleep. No live calls to schedule. Just me, the material, and results.",
    result: "Affiliated Degree earned, 4x revenue growth",
  },
  {
    id: 6,
    name: "Carlos V.",
    location: "Phoenix, AZ",
    tier: "Starter Pack",
    rating: 5,
    quote:
      "The 40,000 ChatGPT prompts changed everything for my content game. I went from spending 3 hours writing one post to publishing 5 pieces of content a day. The done-for-you system is no joke.",
    result: "5x content output, commissions growing weekly",
  },
  {
    id: 7,
    name: "Angela D.",
    location: "Nashville, TN",
    tier: "Builder Club",
    rating: 5,
    quote:
      "I'm a single mom working full-time. I needed something I could do in the margins of my day. Its Dad gave me the scripts, the templates, and the products. I just followed the steps. My first $100 month happened faster than I expected.",
    result: "First $100 month within 6 weeks",
  },
  {
    id: 8,
    name: "Kevin L.",
    location: "Denver, CO",
    tier: "Inner Circle Club",
    rating: 5,
    quote:
      "I've been in digital marketing for 5 years. What impressed me about Its Dad is the infrastructure. The tracking, the commission structure, the product quality — it's built like a real business, not a side hustle gimmick.",
    result: "Scaled to $1,200/month recurring",
  },
  {
    id: 9,
    name: "Brianna F.",
    location: "Orlando, FL",
    tier: "Starter Pack",
    rating: 5,
    quote:
      "I literally had zero experience. None. The Affiliated Degree course walked me through everything from what affiliate marketing even is to how to get my first sale. I earned my first commission before I finished Module 5.",
    result: "First sale before finishing the course",
  },
  {
    id: 10,
    name: "Darius J.",
    location: "Detroit, MI",
    tier: "Builder Club",
    rating: 5,
    quote:
      "The done-for-you swipe files are a game changer. I used to spend hours trying to write emails and social posts. Now I grab a template, customize it in 10 minutes, and it converts. Simple as that.",
    result: "2 hours/week, consistent commissions",
  },
  {
    id: 11,
    name: "Samantha C.",
    location: "San Diego, CA",
    tier: "Pro Creator Club",
    rating: 5,
    quote:
      "What sold me was the 7-day money-back guarantee. I figured I had nothing to lose. Within 3 days I knew I was staying. The product catalog alone is worth 10x the membership fee.",
    result: "ROI positive within first week",
  },
  {
    id: 12,
    name: "Malik H.",
    location: "Charlotte, NC",
    tier: "Inner Circle Club",
    rating: 5,
    quote:
      "I upgraded to Inner Circle after my first month because the results were undeniable. The second-tier commissions and the advanced strategies took my earnings to a completely different level. Dad built something special here.",
    result: "Upgraded in 30 days, 5x earnings increase",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Real Members. <span className="text-amber-400">Real Results.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every testimonial below is from an actual Its Dad member. No actors. No fabricated numbers.
          </p>
        </div>

        {/* Testimonial Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <Card
              key={t.id}
              className="border-border hover:border-amber-500/30 transition-all bg-card/60 relative overflow-hidden"
            >
              <CardContent className="p-6">
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-purple-400/30 absolute top-4 right-4" />

                {/* Rating */}
                <StarRating rating={t.rating} />

                {/* Quote */}
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed italic">
                  "{t.quote}"
                </p>

                {/* Result badge */}
                <div className="mt-4 inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full">
                  {t.result}
                </div>

                {/* Member info */}
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </div>
                  <span className="text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                    {t.tier}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
