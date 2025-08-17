import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, SkipForward } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
        { id: "Roja", label: "Carne Roja", emoji: "🥩" },
        { id: "Pollo", label: "Pollo", emoji: "🍗" },
        { id: "Pescado", label: "Pescado", emoji: "🐟" },
        { id: "Cualquiera", label: "Cualquiera", emoji: "🍽️" },
        { id: "Ninguna", label: "Ninguna", emoji: "🥗" }
      ]
    },
    {
      id: "dietary-restriction",
      question: "¿Tienes alguna restricción / preferencia especial?",
      options: [
        { id: "Vegetariano", label: "Vegetariano", emoji: "🥗" },
        { id: "Sin gluten", label: "Sin gluten", emoji: "🌾" },
        { id: "Keto (low carb)", label: "Keto (low carb)", emoji: "🥑" },
        { id: "Ninguna", label: "Ninguna", emoji: "🍽️" }
      ]
    },
    {
      id: "drink-preference",
      question: "¿Qué prefieres tomar?",
      options: [
        { id: "Vino", label: "Vino", emoji: "🍷" },
        { id: "Cerveza", label: "Cerveza", emoji: "🍺" },
        { id: "Tragos", label: "Tragos", emoji: "🍹" },
        { id: "Sin alcohol", label: "Sin alcohol", emoji: "🥤" }
      ]
    }
  ],
  steakhouse: [
    {
      id: "meat-preference",
      question: "¿Cómo prefieres tu carne?",
      options: [
        { id: "rare", label: "Poco hecha", emoji: "🥩" },
        { id: "medium-rare", label: "Al punto", emoji: "🥓" },
        { id: "medium", label: "Término medio", emoji: "🍖" },
        { id: "well-done", label: "Bien cocida", emoji: "🍗" }
      ]
    },
    {
      id: "cut-preference",
      question: "¿Qué corte prefieres?",
      options: [
        { id: "ribeye", label: "Ribeye", emoji: "🥩" },
        { id: "filet", label: "Filete", emoji: "💎" },
        { id: "sirloin", label: "Sirloin", emoji: "🍖" },
        { id: "t-bone", label: "T-Bone", emoji: "🦴" }
      ]
    }
  ]
};

export function PreferencesQuiz({ onComplete, onSkip, onBack, restaurantType }: PreferencesQuizProps) {
  const questions = questionsConfig[restaurantType] || questionsConfig.general;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (questionId: string, answerId: string) => {
    const newAnswers = { ...answers, [questionId]: answerId };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setTimeout(() => onComplete(newAnswers), 300);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      {/* Header */}
      <div className="nav-fixed px-4 py-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="btn-ghost p-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 mx-4">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1 text-center">
              {currentQuestion + 1} de {questions.length}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="btn-ghost text-xs"
          >
            <SkipForward className="h-4 w-4 mr-1" />
            Saltar
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-24 px-4 pb-8">
        <div className="max-w-md mx-auto">
          <Card className="card-elegant slide-up">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {question.question}
              </h2>
              <p className="text-sm text-muted-foreground">
                Selecciona la opción que más te guste
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {question.options.map((option) => (
                <Button
                  key={option.id}
                  variant="outline"
                  className={`h-20 flex-col space-y-2 transition-all duration-200 ${
                    answers[question.id] === option.id 
                      ? 'bg-gradient-ocean text-white border-transparent' 
                      : 'hover:border-primary hover:bg-muted'
                  }`}
                  onClick={() => handleAnswer(question.id, option.id)}
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="text-sm font-medium">{option.label}</span>
                </Button>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={onSkip}
                className="btn-ghost text-sm"
              >
                Saltar y ver menú completo
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}