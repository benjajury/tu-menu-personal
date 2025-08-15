import { useState } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { PreferencesQuiz } from "@/components/PreferencesQuiz";
import { MenuPage } from "@/components/MenuPage";

type AppState = "welcome" | "preferences" | "menu";

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("welcome");
  const [preferences, setPreferences] = useState<Record<string, string>>({});
  
  // Restaurant configuration - can be customized
  const restaurantConfig = {
    name: "La Tavola",
    type: "general" as const
  };

  const handlePreferencesComplete = (prefs: Record<string, string>) => {
    setPreferences(prefs);
    setCurrentState("menu");
  };

  const handleSkipPreferences = () => {
    setCurrentState("menu");
  };

  const handleBackToWelcome = () => {
    setCurrentState("welcome");
  };

  const handleContinueFromWelcome = () => {
    setCurrentState("preferences");
  };

  switch (currentState) {
    case "welcome":
      return (
        <WelcomeScreen 
          onContinue={handleContinueFromWelcome}
          restaurantName={restaurantConfig.name}
        />
      );
    
    case "preferences":
      return (
        <PreferencesQuiz
          onComplete={handlePreferencesComplete}
          onSkip={handleSkipPreferences}
          onBack={handleBackToWelcome}
          restaurantType={restaurantConfig.type}
        />
      );
    
    case "menu":
      return (
        <MenuPage 
          preferences={preferences}
          restaurantName={restaurantConfig.name}
        />
      );
    
    default:
      return null;
  }
};

export default Index;
