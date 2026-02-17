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
import { Settings, Key, Globe } from "lucide-react"
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
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>API Settings</DialogTitle>
          <DialogDescription>
            Configure your AI provider. Use "Custom" for OpenAI, Mistral, Ollama, etc.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
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

          <div className="space-y-4 pt-2">
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

            <Tabs defaultValue="groq" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
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
        </div>
        <DialogFooter>
          <Button onClick={handleSave} className="w-full">Save Configuration</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
