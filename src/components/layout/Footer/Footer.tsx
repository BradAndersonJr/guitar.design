import React from 'react'
import { ShieldCheck, HelpCircle, Settings } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'
import SocialLinks from './SocialLinks'
import { Button } from "@/components/ui/button"
import { Toaster, toast } from 'sonner'

const Footer: React.FC = () => {
  const [isHeartRed, setIsHeartRed] = React.useState(false);

  const handleHeartClick = () => {
    setIsHeartRed((prev) => !prev);
    if (!isHeartRed) {
      toast.success("You love me!", {
        description: "Thanks for showing your appreciation!",
        duration: 3000,
      });
    } else {
      toast.error("Oh no!", {
        description: "Whelp, it was nice while it lasted...",
        duration: 3000,
      });
    }
  };

  return (
    <>
      <footer className="bg-white p-3 flex justify-between items-center z-20">
        <div className="flex items-center space-x-1 text-xs text-gray-600">
          <span>made with</span>
          <motion.button
            onClick={handleHeartClick}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.1 }}
            aria-label="Heart"
          >
            <FontAwesomeIcon 
              icon={faHeart} 
              className={`h-3 w-3 ${isHeartRed ? 'text-red-500' : 'text-gray-400'}`}
            />
          </motion.button>
          <span>by</span>
          <SocialLinks />
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 relative group"
          >
            <ShieldCheck className="h-4 w-4" />
            <span className="sr-only">Privacy Policy</span>
            <span className="absolute bottom-[120%] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Privacy Policy
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 relative group"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="sr-only">Help Center</span>
            <span className="absolute bottom-[120%] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Help Center
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 relative group"
          >
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
            <span className="absolute bottom-[120%] right-0 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Settings
            </span>
          </Button>
        </div>
      </footer>
      <Toaster />
    </>
  )
}

export default Footer