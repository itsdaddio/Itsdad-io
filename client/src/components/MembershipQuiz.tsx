/**
 * MembershipQuiz.tsx
 *
 * Interactive quiz that recommends a membership tier based on user responses.
 * Reduces decision fatigue and increases conversion by guiding visitors
 * to the right plan for their situation.
 *
 * MANIFEST PATCH (item 19):
 *   - Changed "How important is personal support?" to
 *     "How many done-for-you resources do you need?"
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Crown, Zap, Star, RotateCcw } from "lucide-react";
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
      { label: "I'm completely new to this", value: "new", score: { boss: 3, chief: 1, kingpin: 0 } },
      { label: "I've tried it but haven't earned yet", value: "tried", score: { boss: 2, chief: 2, kingpin: 1 } },
      { label: "I've earned some commissions before", value: "some", score: { boss: 1, chief: 3, kingpin: 2 } },
      { label: "I'm actively earning and want to scale", value: "active", score: { boss: 0, chief: 2, kingpin: 3 } },
    ],
  },
  {
    id: "goal",
    question: "What's your primary goal in the next 90 days?",
    options: [
      { label: "Earn my first commission", value: "first", score: { boss: 3, chief: 1, kingpin: 0 } },
      { label: "Build a consistent monthly income", value: "consistent", score: { boss: 1, chief: 3, kingpin: 2 } },
      { label: "Replace my current income", value: "replace", score: { boss: 0, chief: 2, kingpin: 3 } },
      { label: "Build a passive income stream", value: "passive", score: { boss: 1, chief: 2, kingpin: 3 } },
    ],
  },
  {
    // MANIFEST PATCH: was "How important is personal support?"
    id: "resources",
    question: "How many done-for-you resources do you need?",
    options: [
      { label: "Just the basics — I'll figure the rest out", value: "minimal", score: { boss: 3, chief: 1, kingpin: 0 } },
      { label: "A solid toolkit to get me started", value: "moderate", score: { boss: 2, chief: 3, kingpin: 1 } },
      { label: "Everything pre-built and ready to deploy", value: "full", score: { boss: 0, chief: 2, kingpin: 3 } },
      { label: "The complete system — funnels, templates, prompts", value: "complete", score: { boss: 0, chief: 1, kingpin: 3 } },
    ],
  },
  {
    id: "products",
    question: "How many products do you want to promote?",
    options: [
      { label: "A few to start — keep it simple", value: "few", score: { boss: 3, chief: 1, kingpin: 0 } },
      { label: "A solid selection across a few niches", value: "medium", score: { boss: 1, chief: 3, kingpin: 1 } },
      { label: "As many as possible — maximum earning potential", value: "all", score: { boss: 0, chief: 1, kingpin: 3 } },
    ],
  },
];

const TIER_DETAILS: Record<string, { name: string; price: string; icon: React.ReactNode; color: string; href: string }> = {
  boss: {
    name: "Boss",
    price: "$9.99/mo",
    icon: <Zap className="w-5 h-5 text-blue-400" />,
    color: "border-blue-500/30 bg-blue-500/5",
    href: "/memberships?tier=boss",
  },
  chief: {
    name: "Chief",
    price: "$19.99/mo",
    icon: <Star className="w-5 h-5 text-amber-400" />,
    color: "border-amber-500/30 bg-amber-500/5",
    href: "/memberships?tier=chief",
  },
  kingpin: {
    name: "Kingpin",
    price: "$24.99/mo",
    icon: <Crown className="w-5 h-5 text-purple-400" />,
    color: "border-purple-500/30 bg-purple-500/5",
    href: "/memberships?tier=kingpin",
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
      const scores: Record<string, number> = { boss: 0, chief: 0, kingpin: 0 };
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

      {/* Question counter */}
      <p className="text-xs text-muted-foreground mb-3">
        Question {currentQ + 1} of {QUESTIONS.length}
      </p>

      {/* Question */}
      <h3 className="text-lg font-bold text-foreground mb-5">{question.question}</h3>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleAnswer(question.id, option.value)}
            className="w-full text-left px-4 py-3 rounded-xl border border-border hover:border-amber-500/40 hover:bg-amber-500/5 transition-all text-sm text-muted-foreground hover:text-foreground"
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Back button */}
      {currentQ > 0 && (
        <button
          onClick={() => setCurrentQ((prev) => prev - 1)}
          className="mt-4 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
      )}
    </div>
  );
}
