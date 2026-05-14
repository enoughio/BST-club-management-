"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save } from "lucide-react"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const [generalSettings, setGeneralSettings] = useState({
    organizationName: "Bharat Storytellers ",
    supportEmail: "contact@bharatstorytellers.com",
    contactPhone: "+1-234-567-8900",
    websiteUrl: "https://bharatstorytellers.com/",
    maxClubsPerAdmin: "3",
    maxMembersPerClub: "100",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    membershipReminders: true,
    eventReminders: true,
    requestNotifications: true,
    adminActivityAlerts: true,
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiryDays: "90",
    sessionTimeoutMinutes: "30",
    allowMultipleLogins: true,
  })

  const handleGeneralSettingsChange = (e) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationToggle = (name, checked) => {
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSecuritySettingsChange = (e) => {
    const { name, value } = e.target
    setSecuritySettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSecurityToggle = (name, checked) => {
    setSecuritySettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSaveSettings = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Settings Saved",
        description: "Your settings have been successfully updated.",
      })
    }, 1000)
  }

  return (
    // <AdminLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage system-wide settings and configurations.</p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure basic organization settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">Organization Name</Label>
                    <Input
                      id="organizationName"
                      name="organizationName"
                      value={generalSettings.organizationName}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      name="supportEmail"
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      value={generalSettings.contactPhone}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl">Website URL</Label>
                    <Input
                      id="websiteUrl"
                      name="websiteUrl"
                      type="url"
                      value={generalSettings.websiteUrl}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="maxClubsPerAdmin">Max Clubs Per Admin</Label>
                    <Input
                      id="maxClubsPerAdmin"
                      name="maxClubsPerAdmin"
                      type="number"
                      value={generalSettings.maxClubsPerAdmin}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxMembersPerClub">Max Members Per Club</Label>
                    <Input
                      id="maxMembersPerClub"
                      name="maxMembersPerClub"
                      type="number"
                      value={generalSettings.maxMembersPerClub}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Settings
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure system-wide notification preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Enable email notifications for system events.</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationToggle("emailNotifications", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="membershipReminders">Membership Reminders</Label>
                    <p className="text-sm text-muted-foreground">Send reminders for expiring memberships.</p>
                  </div>
                  <Switch
                    id="membershipReminders"
                    checked={notificationSettings.membershipReminders}
                    onCheckedChange={(checked) => handleNotificationToggle("membershipReminders", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="eventReminders">Event Reminders</Label>
                    <p className="text-sm text-muted-foreground">Send reminders for upcoming events.</p>
                  </div>
                  <Switch
                    id="eventReminders"
                    checked={notificationSettings.eventReminders}
                    onCheckedChange={(checked) => handleNotificationToggle("eventReminders", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="requestNotifications">Request Notifications</Label>
                    <p className="text-sm text-muted-foreground">Notify admins about new requests.</p>
                  </div>
                  <Switch
                    id="requestNotifications"
                    checked={notificationSettings.requestNotifications}
                    onCheckedChange={(checked) => handleNotificationToggle("requestNotifications", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="adminActivityAlerts">Admin Activity Alerts</Label>
                    <p className="text-sm text-muted-foreground">Send alerts for important admin activities.</p>
                  </div>
                  <Switch
                    id="adminActivityAlerts"
                    checked={notificationSettings.adminActivityAlerts}
                    onCheckedChange={(checked) => handleNotificationToggle("adminActivityAlerts", checked)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Settings
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure system-wide security settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require two-factor authentication for all users.</p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSecurityToggle("twoFactorAuth", checked)}
                  />
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiryDays">Password Expiry (Days)</Label>
                    <Input
                      id="passwordExpiryDays"
                      name="passwordExpiryDays"
                      type="number"
                      value={securitySettings.passwordExpiryDays}
                      onChange={handleSecuritySettingsChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Number of days before passwords expire. Set to 0 to disable.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeoutMinutes">Session Timeout (Minutes)</Label>
                    <Input
                      id="sessionTimeoutMinutes"
                      name="sessionTimeoutMinutes"
                      type="number"
                      value={securitySettings.sessionTimeoutMinutes}
                      onChange={handleSecuritySettingsChange}
                    />
                    <p className="text-xs text-muted-foreground">Minutes of inactivity before a user is logged out.</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowMultipleLogins">Allow Multiple Logins</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to be logged in from multiple devices simultaneously.
                    </p>
                  </div>
                  <Switch
                    id="allowMultipleLogins"
                    checked={securitySettings.allowMultipleLogins}
                    onCheckedChange={(checked) => handleSecurityToggle("allowMultipleLogins", checked)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Settings
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    // </AdminLayout>
  )
}

