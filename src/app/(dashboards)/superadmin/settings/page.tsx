"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
// import { useToast } from "@/hooks/use-toast"

type GeneralSettings = { organizationName: string; supportEmail: string; contactPhone: string; websiteUrl: string; maxClubsPerAdmin: string; maxMembersPerClub: string }
type NotificationSettings = { emailNotifications: boolean; membershipReminders: boolean; eventReminders: boolean; requestNotifications: boolean; adminActivityAlerts: boolean }
type SecuritySettings = { twoFactorAuth: boolean; passwordExpiryDays: string; sessionTimeoutMinutes: string; allowMultipleLogins: boolean }

export default function SettingsPage() {
//   const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({ organizationName: "Bharat Storytellers", supportEmail: "contact@bharatstorytellers.com", contactPhone: "+1-234-567-8900", websiteUrl: "https://bharatstorytellers.com/", maxClubsPerAdmin: "3", maxMembersPerClub: "100" })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({ emailNotifications: true, membershipReminders: true, eventReminders: true, requestNotifications: true, adminActivityAlerts: true })

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({ twoFactorAuth: false, passwordExpiryDays: "90", sessionTimeoutMinutes: "30", allowMultipleLogins: true })

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => { const { name, value } = e.target; setGeneralSettings((p) => ({ ...p, [name]: value } as any)) }
  const handleNotificationToggle = (name: keyof NotificationSettings, checked: boolean) => setNotificationSettings((p) => ({ ...p, [name]: checked }))
  const handleSecuritySettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => { const { name, value } = e.target; setSecuritySettings((p) => ({ ...p, [name]: value } as any)) }
  const handleSecurityToggle = (name: keyof SecuritySettings, checked: boolean) => setSecuritySettings((p) => ({ ...p, [name]: checked }))

// //   const handleSaveSettings = async () => { setIsSaving(true); try { toast({ title: "Saved", description: "Settings saved." }) } catch (err) { toast({ title: "Error", description: "Failed to save.", variant: "destructive" }) } finally { setIsSaving(false) } }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Application-wide settings for the organization.</p>
      </div>

      <div className="space-y-6">
        <Card>
          <div className="p-4 space-y-4">
            <h2 className="font-semibold">General</h2>
            <Input name="organizationName" value={generalSettings.organizationName} onChange={handleGeneralSettingsChange} />
            <Input name="supportEmail" value={generalSettings.supportEmail} onChange={handleGeneralSettingsChange} />
          </div>
        </Card>

        <Card>
          <div className="p-4 space-y-4">
            <h2 className="font-semibold">Notifications</h2>
            {/* toggles omitted for brevity */}
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} disabled={isSaving}>{isSaving ? "Saving..." : "Save Settings"}</Button>
        </div>
      </div>
    </div>
  )
}
