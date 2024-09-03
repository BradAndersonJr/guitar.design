import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, MessageCircle } from "lucide-react"

export function AlphaWarning() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const hasSeenWarning = localStorage.getItem('hasSeenAlphaWarning');
    if (hasSeenWarning !== 'true') {
      setIsOpen(true);
    }
  }, [])

  const handleDiscordClick = () => {
    // Replace this URL with your actual Discord invite link
    window.open('https://discord.com/channels/418532207003435018/1266077756110930000', '_blank')
  }

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenAlphaWarning', 'true');
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-warning">
            <AlertTriangle className="h-5 w-5" />
            Alpha Version Warning
          </DialogTitle>
          <DialogDescription>
            This application is currently in Alpha. Please be aware of the following:
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ul className="list-disc pl-4 space-y-2">
            <li>Features may be incomplete or subject to change</li>
            <li>You may encounter bugs or unexpected behavior</li>
            <li>Data persistence is not guaranteed</li>
            <li>Your feedback is valuable for improvements</li>
          </ul>
        </div>
        <div className="bg-secondary p-4 rounded-md mb-4">
          <h4 className="font-semibold flex items-center gap-2 mb-2">
            <MessageCircle className="h-5 w-5" />
            Stay Updated
          </h4>
          <p className="text-sm mb-3">
            Join our Discord community to stay up to date with the latest developments, share feedback, and connect with other users!
          </p>
          <Button onClick={handleDiscordClick} variant="outline" className="w-full">
            Join Our Discord
          </Button>
        </div>
        <DialogFooter>
          <Button onClick={handleDismiss} variant="default" className="ml-auto">
            I Understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}