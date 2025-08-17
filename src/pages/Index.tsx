import { useState } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { PreferencesQuiz } from "@/components/PreferencesQuiz";
import { MenuPage } from "@/components/MenuPage";
import { usePreferences } from "@/hooks/usePreferences";

type AppState = "welcome" | "preferences" | "menu";

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("welcome");
  const { preferences, savePreferences } = usePreferences();
  
  // Restaurant configuration - can be customized
  const restaurantConfig = {
    name: "Yacht Club Chile",
    type: "general" as const
  };

  const handlePreferencesComplete = async (prefs: Record<string, string>) => {
    console.log('🎮 Index: Quiz completed with preferences:', prefs);
    await savePreferences(prefs);
    console.log('🎮 Index: Preferences saved, navigating to menu');
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
          preferences={preferences as Record<string, string>}
          restaurantName={restaurantConfig.name}
        />
      );
    
    default:
      return null;
  }
};

export default Index;
