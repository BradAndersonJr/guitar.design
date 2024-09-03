import React from 'react'
import { Badge } from "@/components/ui/badge"
import { NavigationMenuComponent } from './NavigationMenu'
import { FaHashtag, FaGithub, FaDiscord } from "react-icons/fa6"
import { Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import ShinyButton from "@/components/ui/magicui/shiny-button" // Import ShinyButton

export function ShinyButtonSupport() {
  return (
    <a href="https://ko-fi.com/bradandersonjr" target="_blank" rel="noopener noreferrer">
      <ShinyButton text="Support" className="" />
    </a>
  );
}

const Header: React.FC = () => {
  return (
    <header className="bg-background p-3 px-4 flex items-center z-10">
      <div className="flex items-center space-x-2 w-1/4">
        <h1 className="text-xl font-bold">guitar.design</h1>
        <Badge variant="secondary" className="text-xs">ALPHA</Badge>
      </div>
      <div className="flex-1 flex justify-center w-1/2">
        <NavigationMenuComponent />
      </div>
      <div className="flex justify-end items-center space-x-3 w-1/4">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Moon className="h-4 w-4" />
          <span className="sr-only">Theme toggle placeholder</span>
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <a href="https://www.instagram.com/explore/tags/guitardotdesign/" target="_blank" rel="noopener noreferrer">
          <FaHashtag className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
        </a>
        <a href="https://github.com/bradandersonjr/guitar.design" target="_blank" rel="noopener noreferrer">
          <FaGithub className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
        </a>
        <a href="https://discord.com/channels/418532207003435018/1266077756110930000" target="_blank" rel="noopener noreferrer">
          <FaDiscord className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
        </a>
        <Separator orientation="vertical" className="h-6" /> {/* Add separator */}
        <ShinyButtonSupport /> {/* Add ShinyButtonSupport */}
      </div>
    </header>
  )
}

export default Header