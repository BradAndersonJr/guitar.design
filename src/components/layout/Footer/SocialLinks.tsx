import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faYoutube, faInstagram, faThreads, faFacebookF, faDiscord, faRedditAlien } from '@fortawesome/free-brands-svg-icons'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const SocialLinks: React.FC = () => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="hover:underline cursor-default">
          @bradandersonjr
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/bradandersonjr.png" />
            <AvatarFallback>BA</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">brad anderson jr</h4>
            <p className="text-sm">
              Developer and creator. Connect with me on social media!
            </p>
            <div className="flex items-center space-x-2 pt-2 flex-wrap">
              {[
                { href: "https://www.bradandersonjr.com", icon: faGlobe },
                { href: "https://github.com/bradandersonjr", icon: faGithub },
                { href: "https://youtube.com/@bradandersonjr", icon: faYoutube },
                { href: "https://instagram.com/bradandersonjr", icon: faInstagram },
                { href: "https://www.threads.net/@bradandersonjr", icon: faThreads },
                { href: "https://facebook.com/bradandersonjr", icon: faFacebookF },
                { href: "https://discord.gg/yourdiscordinvite", icon: faDiscord },
                { href: "https://www.reddit.com/user/bradandersonjr", icon: faRedditAlien },
              ].map((link, index) => (
                <a key={index} href={link.href} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={link.icon} className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default SocialLinks