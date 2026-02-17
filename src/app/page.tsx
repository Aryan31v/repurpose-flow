"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sparkles, ArrowLeft, Trash2 } from "lucide-react"
import { RepurposeResponse } from "@/types"
import { FlowCanvas } from "@/components/flow-canvas"
import { useUserSettings } from "@/context/user-settings-context"

export default function Home() {
  const { settings } = useUserSettings()
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<RepurposeResponse | null>(null)
  const [view, setView] = useState<"input" | "flow">("input")

  const handleGenerate = async () => {
    if (!content.trim()) return
    
    // API Key Validation before starting
    const hasApiKey = settings.useUserKey ? (
      (settings.preferredProvider === 'groq' && settings.groqApiKey) ||
      (settings.preferredProvider === 'gemini' && settings.geminiApiKey) ||
      (settings.preferredProvider === 'anthropic' && settings.anthropicApiKey) ||
      (settings.preferredProvider === 'custom' && settings.customApiKey)
    ) : true; // Assume master key exists if not using user key

    if (settings.useUserKey && !hasApiKey) {
      alert(`Please enter your ${settings.preferredProvider.toUpperCase()} API key in Settings before generating.`);
      return;
    }

    setIsLoading(true)
    
    try {
      const response = await fetch("/api/repurpose", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(settings.useUserKey ? { 
            "x-user-key": settings.preferredProvider === 'groq' ? settings.groqApiKey : settings.preferredProvider === 'gemini' ? settings.geminiApiKey : settings.preferredProvider === 'anthropic' ? settings.anthropicApiKey : settings.customApiKey,
            "x-user-provider": settings.preferredProvider,
            "x-user-base-url": settings.customBaseUrl,
            "x-user-model": settings.customModelName
          } : {})
        },
        body: JSON.stringify({ content }),
      })
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate flow");
      }
      
      const result = await response.json()
      
      // Safety check: ensure result has the expected structure
      if (!result.repurposing_ideas || !result.original_title) {
        throw new Error("Invalid response from API")
      }
      
      setData(result)
      setView("flow")
    } catch (error: any) {
      console.error("Generation error:", error)
      alert(error.message || "Failed to generate flow. Check the console for more details.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setView("input")
  }

  const handleClear = () => {
    setContent("")
    setData(null)
    setView("input")
  }

  return (
    <div className="h-screen flex flex-col bg-background selection:bg-primary/20 overflow-hidden">
      <Header />
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {view === "input" ? (
          <div className="container py-8 md:py-12 flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-center space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                  Repurpose <span className="text-primary">Smarter</span>
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl max-w-[600px] mx-auto">
                  Transform your long-form content into a strategic ecosystem of short-form ideas instantly.
                </p>
              </div>

              <Card className="shadow-2xl border-2 overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Source Content</CardTitle>
                      <CardDescription>
                        Paste your transcript or article
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleClear} title="Clear all">
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <Textarea
                    placeholder="E.g., Your latest 20-minute podcast transcript..."
                    className="min-h-[300px] text-base leading-relaxed resize-none bg-background focus-visible:ring-primary/50"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={12}
                  />
                  <Button 
                    size="xl" 
                    className="w-full text-lg h-14 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]"
                    onClick={handleGenerate}
                    disabled={isLoading || !content.trim()}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        Processing with AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-3 h-5 w-5" />
                        Visualize My Content Tree
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex-1 relative animate-in fade-in duration-500 w-full h-full bg-background">
            <div className="absolute top-6 left-6 z-10 flex gap-2">
              <Button variant="secondary" size="sm" onClick={handleReset} className="shadow-md">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Edit Source
              </Button>
              <Button variant="outline" size="sm" onClick={handleClear} className="shadow-md bg-background">
                Start Fresh
              </Button>
            </div>
            <div className="w-full h-full">
              {data && <FlowCanvas data={data} originalContent={content} />}
            </div>
          </div>
        )}
      </main>
      
      <footer className="py-2 border-t bg-muted/20 z-20">
        <div className="container flex flex-col items-center justify-between gap-2 md:h-10 md:flex-row">
          <p className="text-[10px] text-muted-foreground">
            &copy; 2026 RepurposeFlow. Built for creators.
          </p>
          <div className="flex items-center gap-4 text-[10px] font-medium text-muted-foreground">
            <span>Powered by Gemini AI</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
