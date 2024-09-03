import React from 'react'
import { ShieldCheck, HelpCircle, Settings } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import SocialLinks from './SocialLinks'
import { Button } from "@/components/ui/button"

const Footer: React.FC = () => {
  const [isHeartRed, setIsHeartRed] = React.useState(false);

  const handleHeartClick = () => {
    setIsHeartRed(!isHeartRed);
  };

  return (
    <footer className="bg-white p-3 flex justify-between items-center z-20">
      <div className="flex items-center space-x-1 text-xs text-gray-600">
        <span>made with</span>
        <button
          onClick={handleHeartClick}
          aria-label="Heart"
        >
          <FontAwesomeIcon 
            icon={faHeart} 
            className={`h-3 w-3 ${isHeartRed ? 'text-red-500' : 'text-gray-400'}`}
          />
        </button>
        <span>by</span>
        <SocialLinks />
      </div>
      
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ShieldCheck className="h-4 w-4" />
          <span className="sr-only">Privacy Policy</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">Help Center</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
    </footer>
  )
}

export default Footer