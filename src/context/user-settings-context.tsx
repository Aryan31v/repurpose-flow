"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

interface UserSettings {
  groqApiKey: string;
  geminiApiKey: string;
  anthropicApiKey: string;
  customApiKey: string;
  customBaseUrl: string;
  customModelName: string;
  preferredProvider: "groq" | "gemini" | "anthropic" | "custom";
  useUserKey: boolean;
  // Branding
  brandName: string;
  brandColor: string;
  brandLogo: string; // Base64 or URL
  brandVoice: string;
}

interface UserSettingsContextType {
  settings: UserSettings;
  setSettings: (settings: UserSettings) => void;
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

export function UserSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>({
    groqApiKey: "",
    geminiApiKey: "",
    anthropicApiKey: "",
    customApiKey: "",
    customBaseUrl: "https://api.openai.com/v1",
    customModelName: "gpt-4o",
    preferredProvider: "groq",
    useUserKey: false,
    brandName: "",
    brandColor: "#00ffcc",
    brandLogo: "",
    brandVoice: "Professional and authoritative",
  });

  useEffect(() => {
    const saved = localStorage.getItem("repurpose-flow-settings");
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    }
  }, []);

  const updateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    localStorage.setItem("repurpose-flow-settings", JSON.stringify(newSettings));
  };

  return (
    <UserSettingsContext.Provider value={{ settings, setSettings: updateSettings }}>
      {children}
    </UserSettingsContext.Provider>
  );
}

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);
  if (!context) throw new Error("useUserSettings must be used within UserSettingsProvider");
  return context;
};
