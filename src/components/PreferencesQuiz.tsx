import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, SkipForward } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { isDebug } from "@/lib/debug"; // 👈 agregado

interface Question {
  id: string;
  question: string;
  options: { id: string; label: string; emoji: string }[];
}

interface PreferencesQuizProps {
  onComplete: (preferences: Record<string, string>) => void;
  onSkip: () => void;
  onBack: () => void;
  restaurantType: "general" | "steakhouse" | "seafood" | "italian";
}

const questionsConfig = {
  general: [
    {
      id: "meat-preference",
      question: "¿Qué prefieres comer hoy?",
      options: [
        { id: "roja", label: "Carne Roja", emoji: "🥩" },
        { id: "pollo", label: "Pollo", emoji: "🍗" },
        { id: "pescado", label: "Pescado", emoji: "🐟" },
        { id: "mariscos", label: "Mariscos", emoji: "🦐" },
        { id: "Cualquiera", label: "Cualquiera", emoji: "🍽️" },
      ],
    },
    // ...resto de preguntas
  ],
  // steakhouse, seafood, italian...
};

export function PreferencesQuiz({
  onComplete,
  onSkip,
  onBack,
  restaurantType,
}: PreferencesQuizProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = questionsConfig[restaurantType] || [];

  const handleOptionSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      if (isDebug) {
        console.log("[DEBUG] quiz answers →", answers);
      }
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const handleSkip = () => {
    if (isDebug) {
      console.log("[DEBUG] quiz skipped");
    }
    onSkip();
  };

  const currentQuestion: Question | undefined = questions[step];

  return (
    <Card className="p-4 max-w-md mx-auto">
      {currentQuestion && (
        <>
          <h2 className="text-lg font-semibold mb-4">
            {currentQuestion.question}
          </h2>
          <div className="space-y-2 mb-4">
            {currentQuestion.options.map((option) => (
              <Button
                key={option.id}
                variant={
                  answers[currentQuestion.id] === option.id
                    ? "default"
                    : "outline"
                }
                className="w-full flex items-center justify-start"
                onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
              >
                <span className="mr-2">{option.emoji}</span>
                {option.label}
              </Button>
            ))}
          </div>
          <Progress
            value={((step + 1) / questions.length) * 100}
            className="mb-4"
          />
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Atrás
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={handleSkip}>
                <SkipForward className="w-4 h-4 mr-1" /> Saltar
              </Button>
              <Button onClick={handleNext}>
                {step === questions.length - 1 ? "Finalizar" : "Siguiente"}{" "}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
