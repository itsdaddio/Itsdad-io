/**
 * MembershipQuiz.tsx
 *
 * Interactive quiz that recommends a membership tier based on user responses.
 * Updated to match locked core configuration (4 tiers).
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Users, Zap, Star, Crown, RotateCcw } from "lucide-react";
import { Link } from "wouter";

interface QuizQuestion {
  id: string;
  question: string;
  options: { label: string; value: string; score: Record<string, number> }[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: "experience",
    question: "How much affiliate marketing experience do you have?",
    options: [
      { label: "I'm completely new to this", value: "new", score: { starter: 3, builder: 1, pro: 0, inner: 0 } },
      { label: "I've tried it but haven't earned yet", value: "tried", score: { starter: 2, builder: 2, pro: 1, inner: 0 } },
      { label: "I've earned some commissions before", value: "some", score: { starter: 0, builder: 2, pro: 3, inner: 1 } },
      { label: "I'm actively earning and want to scale", value: "active", score: { starter: 0, builder: 1, pro: 2, inner: 3 } },
    ],
  },
  {
    id: "goal",
    question: "What's your primary goal in the next 90 days?",
    options: [
      { label: "Earn my first commission", value: "first", score: { starter: 3, builder: 1, pro: 0, inner: 0 } },
      { label: "Build a consistent monthly income", value: "consistent", score: { starter: 1, builder: 3, pro: 1, inner: 0 } },
      { label: "Automate and scale my income", value: "automate", score: { starter: 0, builder: 1, pro: 3, inner: 2 } },
      { label: "Build advanced monetization systems", value: "advanced", score: { starter: 0, builder: 0, pro: 2, inner: 3 } },
    ],
  },
  {
    id: "resources",
    question: "How many done-for-you resources do you need?",
    options: [
      { label: "Just the basics — I'll figure the rest out", value: "minimal", score: { starter: 3, builder: 1, pro: 0, inner: 0 } },
      { label: "A solid toolkit to get me started", value: "moderate", score: { starter: 1, builder: 3, pro: 1, inner: 0 } },
      { label: "Automation and funnels ready to deploy", value: "full", score: { starter: 0, builder: 1, pro: 3, inner: 1 } },
      { label: "The complete system — everything pre-built", value: "complete", score: { starter: 0, builder: 0, pro: 1, inner: 3 } },
    ],
  },
  {
    id: "products",
    question: "How many products do you want to promote?",
    options: [
      { label: "Just one — keep it focused", value: "one", score: { starter: 3, builder: 1, pro: 0, inner: 0 } },
      { label: "A few across different niches", value: "few", score: { starter: 1, builder: 3, pro: 1, inner: 0 } },
      { label: "As many as possible — maximum earning potential", value: "all", score: { starter: 0, builder: 1, pro: 3, inner: 3 } },
    ],
  },
];

const TIER_DETAILS: Record<string, { name: string; price: string; icon: React.ReactNode; color: string; href: string }> = {
  starter: {
    name: "Starter Pack",
    price: "$7/mo",
    icon: <Zap className="w-5 h-5 text-blue-400" />,
    color: "border-blue-500/30 bg-blue-500/5",
    href: "/memberships?tier=starter",
  },
  builder: {
    name: "Builder Club",
    price: "$19/mo",
    icon: <Star className="w-5 h-5 text-amber-400" />,
    color: "border-amber-500/30 bg-amber-500/5",
    href: "/memberships?tier=builder",
  },
  pro: {
    name: "Pro Club",
    price: "$49.99/mo",
    icon: <Crown className="w-5 h-5 text-emerald-400" />,
    color: "border-emerald-500/30 bg-emerald-500/5",
    href: "/memberships?tier=pro",
  },
  inner: {
    name: "Inner Circle Club",
    price: "$99.99/mo",
    icon: <Users className="w-5 h-5 text-purple-400" />,
    color: "border-purple-500/30 bg-purple-500/5",
    href: "/memberships?tier=inner-circle",
  },
};

export function MembershipQuiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);

  function handleAnswer(questionId: string, value: string) {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((prev) => prev + 1);
    } else {
      // Calculate result
      const scores: Record<string, number> = { starter: 0, builder: 0, pro: 0, inner: 0 };
      for (const q of QUESTIONS) {
        const answer = newAnswers[q.id];
        const option = q.options.find((o) => o.value === answer);
        if (option) {
          for (const [tier, score] of Object.entries(option.score)) {
            scores[tier] = (scores[tier] || 0) + score;
          }
        }
      }
      const recommended = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
      setResult(recommended);
    }
  }

  function reset() {
    setCurrentQ(0);
    setAnswers({});
    setResult(null);
  }

  const question = QUESTIONS[currentQ];
  const progress = ((currentQ) / QUESTIONS.length) * 100;

  if (result) {
    const tier = TIER_DETAILS[result];
    return (
      <div className="rounded-2xl border border-border bg-card/60 p-8 max-w-lg mx-auto text-center">
        <p className="text-sm text-muted-foreground mb-3">Based on your answers, we recommend:</p>
        <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-xl border ${tier.color} mb-5`}>
          {tier.icon}
          <div className="text-left">
            <p className="font-bold text-foreground text-lg">{tier.name}</p>
            <p className="text-sm text-muted-foreground">{tier.price}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link href={tier.href}>
            <Button className="w-full btn-gold-gradient gold-shimmer hover:scale-105 transition-transform h-auto py-3 rounded-xl font-semibold">
              Join as {tier.name}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Button variant="ghost" onClick={reset} className="text-muted-foreground text-sm">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Retake the quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-8 max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="w-full h-1 bg-slate-800 rounded-full mb-6">
        <div
          className="h-1 bg-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-xs text-muted-foreground mb-2">
        Question {currentQ + 1} of {QUESTIONS.length}
      </p>
      <h3 className="text-lg font-semibold text-foreground mb-5">{question.question}</h3>

      <div className="flex flex-col gap-3">
        {question.options.map((option) => (
          <Button
            key={option.value}
            variant="outline"
            className="w-full justify-start text-left h-auto py-3 px-4 rounded-xl hover:border-amber-500/50 hover:bg-amber-500/5 transition-all"
            onClick={() => handleAnswer(question.id, option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {currentQ > 0 && (
        <Button
          variant="ghost"
          onClick={() => setCurrentQ((prev) => prev - 1)}
          className="mt-4 text-muted-foreground text-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Previous question
        </Button>
      )}
    </div>
  );
}
