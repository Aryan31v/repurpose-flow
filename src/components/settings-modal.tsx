"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Key, Globe, Palette, User, MessageSquare, Zap } from "lucide-react"
import { useUserSettings } from "@/context/user-settings-context"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SettingsModal() {
  const { settings, setSettings } = useUserSettings()
  const [localSettings, setLocalSettings] = useState(settings)

  const handleSave = () => {
    setSettings(localSettings)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Project Settings</DialogTitle>
          <DialogDescription>
            Configure your AI and Branding. Premium features are active for early builders.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai" className="flex items-center gap-2"><Key className="h-4 w-4" /> AI Engine</TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center gap-2"><Palette className="h-4 w-4" /> Custom Branding</TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="space-y-6 pt-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="use-user-key" className="flex flex-col space-y-1">
                <span>Enable Personal API Keys</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Override system defaults with your own keys.
                </span>
              </Label>
              <Switch
                id="use-user-key"
                checked={localSettings.useUserKey}
                onCheckedChange={(checked) => setLocalSettings({...localSettings, useUserKey: checked})}
              />
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Preferred AI Provider</Label>
                <Select 
                  disabled={!localSettings.useUserKey}
                  value={localSettings.preferredProvider} 
                  onValueChange={(val: any) => setLocalSettings({...localSettings, preferredProvider: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="groq">Groq (Llama 3.3)</SelectItem>
                    <SelectItem value="gemini">Google Gemini</SelectItem>
                    <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                    <SelectItem value="custom">Custom (OpenAI Compatible)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Tabs defaultValue="groq" className="w-full border p-4 rounded-lg">
                <TabsList className="grid w-full grid-cols-4 bg-muted/50">
                  <TabsTrigger value="groq">Groq</TabsTrigger>
                  <TabsTrigger value="gemini">Gemini</TabsTrigger>
                  <TabsTrigger value="anthropic">Claude</TabsTrigger>
                  <TabsTrigger value="custom">Custom</TabsTrigger>
                </TabsList>
                <TabsContent value="groq" className="space-y-4 pt-4">
                  <div className="grid gap-2">
                    <Label className="flex items-center gap-2 text-xs"><Key className="h-3 w-3" /> Groq API Key</Label>
                    <Input 
                      type="password" 
                      placeholder="gsk_..." 
                      value={localSettings.groqApiKey}
                      onChange={(e) => setLocalSettings({...localSettings, groqApiKey: e.target.value})}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="gemini" className="space-y-4 pt-4">
                  <div className="grid gap-2">
                    <Label className="flex items-center gap-2 text-xs"><Key className="h-3 w-3" /> Gemini API Key</Label>
                    <Input 
                      type="password" 
                      placeholder="AIza..." 
                      value={localSettings.geminiApiKey}
                      onChange={(e) => setLocalSettings({...localSettings, geminiApiKey: e.target.value})}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="anthropic" className="space-y-4 pt-4">
                  <div className="grid gap-2">
                    <Label className="flex items-center gap-2 text-xs"><Key className="h-3 w-3" /> Claude API Key</Label>
                    <Input 
                      type="password" 
                      placeholder="sk-ant-..." 
                      value={localSettings.anthropicApiKey}
                      onChange={(e) => setLocalSettings({...localSettings, anthropicApiKey: e.target.value})}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="custom" className="space-y-4 pt-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label className="flex items-center gap-2 text-xs"><Key className="h-3 w-3" /> API Key</Label>
                      <Input 
                        type="password" 
                        placeholder="sk-..." 
                        value={localSettings.customApiKey}
                        onChange={(e) => setLocalSettings({...localSettings, customApiKey: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="flex items-center gap-2 text-xs"><Globe className="h-3 w-3" /> Base URL</Label>
                      <Input 
                        placeholder="https://api.openai.com/v1" 
                        value={localSettings.customBaseUrl}
                        onChange={(e) => setLocalSettings({...localSettings, customBaseUrl: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="flex items-center gap-2 text-xs"><Globe className="h-3 w-3" /> Model Name</Label>
                      <Input 
                        placeholder="gpt-4o" 
                        value={localSettings.customModelName}
                        onChange={(e) => setLocalSettings({...localSettings, customModelName: e.target.value})}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="branding" className="space-y-6 pt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label className="flex items-center gap-2"><User className="h-4 w-4" /> Brand Name</Label>
                <Input 
                  placeholder="e.g. The Architect" 
                  value={localSettings.brandName}
                  onChange={(e) => setLocalSettings({...localSettings, brandName: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label className="flex items-center gap-2"><Palette className="h-4 w-4" /> Brand Color</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    className="w-12 h-10 p-1"
                    value={localSettings.brandColor}
                    onChange={(e) => setLocalSettings({...localSettings, brandColor: e.target.value})}
                  />
                  <Input 
                    placeholder="#00ffcc" 
                    value={localSettings.brandColor}
                    onChange={(e) => setLocalSettings({...localSettings, brandColor: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Brand Voice / Tone</Label>
                <Select 
                  value={localSettings.brandVoice} 
                  onValueChange={(val) => setLocalSettings({...localSettings, brandVoice: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professional and authoritative">Professional and authoritative</SelectItem>
                    <SelectItem value="Savage and aggressive builder">Savage and aggressive builder</SelectItem>
                    <SelectItem value="Friendly and educational">Friendly and educational</SelectItem>
                    <SelectItem value="Minimalist and direct">Minimalist and direct</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="flex items-center gap-2"><Zap className="h-4 w-4" /> Repurpose Strategy (Pro)</Label>
                <Select 
                  value={localSettings.repurposeStrategy} 
                  onValueChange={(val: any) => setLocalSettings({...localSettings, repurposeStrategy: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Standard Balanced</SelectItem>
                    <SelectItem value="garyvee">The GaryVee Content Model (Volume)</SelectItem>
                    <SelectItem value="hormozi">The Alex Hormozi Script (Value-First)</SelectItem>
                    <SelectItem value="architect">The Architect Framework (Technical Alpha)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <span className="text-xs font-bold text-primary uppercase">Pro Insight:</span>
              <p className="text-xs text-muted-foreground mt-1">
                Custom branding ensures that every piece of repurposed content aligns with your unique identity. The AI will use your "Brand Voice" during generation.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-4">
          <Button onClick={handleSave} className="w-full font-bold">Save Empire Configuration</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
