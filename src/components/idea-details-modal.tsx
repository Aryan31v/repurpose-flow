"use client"

import { useState, useEffect } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Copy, RefreshCw, Check, Loader2 } from "lucide-react"
import { RepurposingIdea } from "@/types"
import { useUserSettings } from "@/context/user-settings-context"

interface IdeaDetailsModalProps {
  idea: RepurposingIdea
  originalContent: string
  isOpen: boolean
  onClose: () => void
}

export function IdeaDetailsModal({ idea, originalContent, isOpen, onClose }: IdeaDetailsModalProps) {
  const { settings } = useUserSettings()
  const [content, setContent] = useState(idea.content)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  // Update local state when idea changes
  useEffect(() => {
    setContent(idea.content)
  }, [idea.content])

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleRegenerate = async () => {
    setIsRegenerating(true)
    try {
      const response = await fetch("/api/repurpose", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(settings.useUserKey ? { 
            "x-user-key": settings.preferredProvider === 'groq' ? settings.groqApiKey : settings.preferredProvider === 'gemini' ? settings.geminiApiKey : settings.preferredProvider === 'anthropic' ? settings.anthropicApiKey : settings.customApiKey,
            "x-user-provider": settings.preferredProvider,
            "x-user-base-url": settings.customBaseUrl,
            "x-user-model": settings.customModelName,
            "x-brand-voice": settings.brandVoice,
            "x-strategy": settings.repurposeStrategy
          } : {
            "x-brand-voice": settings.brandVoice,
            "x-strategy": settings.repurposeStrategy
          })
        },
        body: JSON.stringify({ 
          content: originalContent,
          type: idea.type,
          currentContent: content
        }),
      })
      
      if (!response.ok) throw new Error("Failed to regenerate")
      
      const result = await response.json()
      setContent(result.content)
    } catch (error) {
      console.error(error)
      alert("Regeneration failed. Please try again.")
    } finally {
      setIsRegenerating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl border-2 shadow-2xl">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary border-primary/20">
              {idea.type}
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight">{idea.title}</DialogTitle>
          <DialogDescription className="text-base">
            Refine the generated short-form content below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 px-6 py-2 overflow-hidden">
          <div className="rounded-xl border-2 bg-muted/20 overflow-hidden focus-within:border-primary/50 transition-colors">
            <ScrollArea className="h-[400px] w-full">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[396px] text-lg leading-relaxed resize-none border-0 focus-visible:ring-0 p-6 bg-transparent whitespace-pre-wrap"
                placeholder="Content goes here..."
              />
            </ScrollArea>
          </div>
        </div>

        <div className="px-6 py-2">
          <div className="flex flex-wrap gap-2">
            {idea.hashtags.map((tag) => (
              <Badge key={tag} variant="outline" className="px-2 py-0.5 text-xs font-medium border-muted-foreground/30 text-muted-foreground">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <DialogFooter className="p-6 pt-2 bg-muted/30 border-t flex flex-col sm:flex-row gap-4">
          <div className="flex flex-1 gap-2">
            <Button 
              variant="outline" 
              className="flex-1 sm:flex-none h-11 px-4 font-semibold border-2 hover:bg-background"
              onClick={handleRegenerate}
              disabled={isRegenerating}
            >
              {isRegenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Regenerate
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 sm:flex-none h-11 px-4 font-semibold border-2 hover:bg-background"
              onClick={handleCopy}
            >
              {isCopied ? (
                <Check className="mr-2 h-4 w-4 text-green-500" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              {isCopied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <Button onClick={onClose} className="h-11 px-8 font-bold text-base shadow-lg shadow-primary/20">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
