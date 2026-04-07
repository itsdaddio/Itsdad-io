/**
 * MembershipQuiz.tsx
 *
 * Interactive quiz that recommends a membership tier based on user capability.
 * First Dollar Priority: The quiz does the thinking so the user doesn't have to.
 *
 * Questions focus on:
 * - Experience level
 * - Available time commitment
 * - Comfort with technology
 * - Goals and ambition
 *
 * Accepts optional onRecommend callback to notify parent of the result.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Users, Zap, Star, Crown, RotateCcw, CheckCircle2 } from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  subtext?: string;
  options: { label: string; value: string; score: Record<string, number> }[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: "experience",
    question: "Have you ever made money online before?",
    subtext: "Be honest — there's no wrong answer. This helps us meet you where you are.",
    options: [
      { label: "No, this is brand new to me", value: "new", score: { starter: 4, builder: 1, pro: 0, inner: 0 } },
      { label: "I've tried but haven't earned anything yet", value: "tried", score: { starter: 2, builder: 3, pro: 1, inner: 0 } },
      { label: "Yes, I've earned some commissions", value: "some", score: { starter: 0, builder: 2, pro: 3, inner: 1 } },
      { label: "Yes, I'm earning consistently and want more", value: "active", score: { starter: 0, builder: 0, pro: 2, inner: 4 } },
    ],
  },
  {
    id: "time",
    question: "How much time can you dedicate per day?",
    subtext: "Even 15 minutes a day can work — the system is built for busy people.",
    options: [
      { label: "15–30 minutes (I'm squeezing it in)", value: "minimal", score: { starter: 4, builder: 2, pro: 0, inner: 0 } },
      { label: "30–60 minutes (I can commit to this)", value: "moderate", score: { starter: 1, builder: 4, pro: 1, inner: 0 } },
      { label: "1–2 hours (I'm serious about this)", value: "good", score: { starter: 0, builder: 2, pro: 4, inner: 1 } },
      { label: "2+ hours (I'm going all in)", value: "full", score: { starter: 0, builder: 0, pro: 2, inner: 4 } },
    ],
  },
  {
    id: "comfort",
    question: "How comfortable are you with social media?",
    subtext: "We give you scripts and templates either way — this just helps us calibrate.",
    options: [
      { label: "I barely post — I mostly scroll", value: "low", score: { starter: 4, builder: 1, pro: 0, inner: 0 } },
      { label: "I post sometimes but nothing consistent", value: "some", score: { starter: 2, builder: 3, pro: 1, inner: 0 } },
      { label: "I post regularly and get some engagement", value: "regular", score: { starter: 0, builder: 2, pro: 3, inner: 1 } },
      { label: "I know how to create content that converts", value: "advanced", score: { starter: 0, builder: 0, pro: 2, inner: 4 } },
    ],
  },
  {
    id: "goal",
    question: "What would success look like for you in 90 days?",
    subtext: "Dream big or start small — both are valid.",
    options: [
      { label: "Just earn my first dollar online — prove it's real", value: "first", score: { starter: 4, builder: 1, pro: 0, inner: 0 } },
      { label: "Build a side income of $500–$1,000/month", value: "side", score: { starter: 1, builder: 4, pro: 1, inner: 0 } },
      { label: "Replace my job income with automated systems", value: "replace", score: { starter: 0, builder: 1, pro: 4, inner: 2 } },
      { label: "Build a full business with multiple income streams", value: "business", score: { starter: 0, builder: 0, pro: 2, inner: 4 } },
    ],
  },
];

const TIER_MAP: Record<string, string> = {
  starter: "starter",
  builder: "builder",
  pro: "pro",
  inner: "inner-circle",
};

const TIER_DETAILS: Record<string, { name: string; price: string; icon: React.ReactNode; color: string; description: string }> = {
  starter: {
    name: "Starter Pack",
    price: "$7/mo",
    icon: <Zap className="w-6 h-6 text-blue-400" />,
    color: "border-blue-500/30 bg-blue-500/5",
    description: "Perfect for you. One product, one script, one platform. You'll have everything you need to earn your first commission.",
  },
  builder: {
    name: "Builder Club",
    price: "$19/mo",
    icon: <Star className="w-6 h-6 text-amber-400" />,
    color: "border-amber-500/30 bg-amber-500/5",
    description: "You're ready to build consistency. Daily prompts, multiple products, and a scaling method to grow your income month over month.",
  },
  pro: {
    name: "Pro Creator Club",
    price: "$49.99/mo",
    icon: <Crown className="w-6 h-6 text-emerald-400" />,
    color: "border-emerald-500/30 bg-emerald-500/5",
    description: "You've got the skills — now automate them. Funnels, frameworks, and systems that work while you sleep.",
  },
  inner: {
    name: "Inner Circle Club",
    price: "$99.99/mo",
    icon: <Users className="w-6 h-6 text-purple-400" />,
    color: "border-purple-500/30 bg-purple-500/5",
    description: "The full arsenal. Advanced monetization, early access tools, and strategy drops from the top. You're building an empire.",
  },
};

interface MembershipQuizProps {
  onRecommend?: (tierId: string) => void;
}

export function MembershipQuiz({ onRecommend }: MembershipQuizProps) {
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

      // Notify parent with the tier ID used for checkout
      if (onRecommend) {
        onRecommend(TIER_MAP[recommended]);
      }
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
        <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground mb-4">Based on your answers, here's your perfect fit:</p>

        <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-xl border ${tier.color} mb-4`}>
          {tier.icon}
          <div className="text-left">
            <p className="font-bold text-foreground text-lg">{tier.name}</p>
            <p className="text-sm text-muted-foreground">{tier.price} — cancel anytime</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-6 max-w-sm mx-auto leading-relaxed">
          {tier.description}
        </p>

        <p className="text-xs text-muted-foreground mb-4">
          Scroll down to see your recommended plan highlighted below.
        </p>

        <Button variant="ghost" onClick={reset} className="text-muted-foreground text-sm">
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Retake the quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-8 max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full mb-6">
        <div
          className="h-1.5 bg-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-xs text-muted-foreground mb-1">
        Question {currentQ + 1} of {QUESTIONS.length}
      </p>
      <h3 className="text-lg font-semibold text-foreground mb-1">{question.question}</h3>
      {question.subtext && (
        <p className="text-sm text-muted-foreground mb-5">{question.subtext}</p>
      )}

      <div className="flex flex-col gap-3">
        {question.options.map((option) => (
          <Button
            key={option.value}
            variant="outline"
            className="w-full justify-start text-left h-auto py-3.5 px-4 rounded-xl hover:border-amber-500/50 hover:bg-amber-500/5 transition-all text-sm"
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
