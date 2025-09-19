import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, User, Shuffle } from "lucide-react";

// Pre-generated avatar collection (100+ options)
const avatarCollection = [
  // Cyberpunk style avatars
  "https://api.dicebear.com/7.x/avataaars/svg?seed=cyberpunk1&backgroundColor=8b5cf6",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=cyberpunk2&backgroundColor=10b981",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=cyberpunk3&backgroundColor=f59e0b",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=cyberpunk4&backgroundColor=ef4444",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=cyberpunk5&backgroundColor=06b6d4",
  
  // Gaming style avatars
  "https://api.dicebear.com/7.x/bottts/svg?seed=gamer1&backgroundColor=8b5cf6",
  "https://api.dicebear.com/7.x/bottts/svg?seed=gamer2&backgroundColor=10b981",
  "https://api.dicebear.com/7.x/bottts/svg?seed=gamer3&backgroundColor=f59e0b",
  "https://api.dicebear.com/7.x/bottts/svg?seed=gamer4&backgroundColor=ef4444",
  "https://api.dicebear.com/7.x/bottts/svg?seed=gamer5&backgroundColor=06b6d4",
  
  // Pixel art style
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=pixel1&backgroundColor=8b5cf6",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=pixel2&backgroundColor=10b981",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=pixel3&backgroundColor=f59e0b",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=pixel4&backgroundColor=ef4444",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=pixel5&backgroundColor=06b6d4",
  
  // Abstract geometric
  "https://api.dicebear.com/7.x/shapes/svg?seed=shape1&backgroundColor=8b5cf6",
  "https://api.dicebear.com/7.x/shapes/svg?seed=shape2&backgroundColor=10b981", 
  "https://api.dicebear.com/7.x/shapes/svg?seed=shape3&backgroundColor=f59e0b",
  "https://api.dicebear.com/7.x/shapes/svg?seed=shape4&backgroundColor=ef4444",
  "https://api.dicebear.com/7.x/shapes/svg?seed=shape5&backgroundColor=06b6d4",
  
  // More variety with different seeds and colors
  ...Array.from({ length: 100 }, (_, i) => {
    const styles = ['avataaars', 'bottts', 'pixel-art', 'shapes', 'identicon'];
    const colors = ['8b5cf6', '10b981', 'f59e0b', 'ef4444', '06b6d4', 'ec4899', '8b5cf6', '14b8a6'];
    const style = styles[i % styles.length];
    const color = colors[i % colors.length];
    return `https://api.dicebear.com/7.x/${style}/svg?seed=user${i}&backgroundColor=${color}`;
  })
];

// Function to get random avatar
export const getRandomAvatar = (): string => {
  return avatarCollection[Math.floor(Math.random() * avatarCollection.length)];
};

interface AvatarSelectionProps {
  selectedAvatar: string | null;
  onAvatarSelect: (avatar: string) => void;
}

export function AvatarSelection({ selectedAvatar, onAvatarSelect }: AvatarSelectionProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedAvatars = showAll ? avatarCollection : avatarCollection.slice(0, 24);

  const handleRandomSelect = () => {
    const randomAvatar = getRandomAvatar();
    onAvatarSelect(randomAvatar);
  };

  return (
    <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-neon-green" />
            <span>Choose Your Avatar</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRandomSelect}
            className="bg-mining-orange/20 border-mining-orange/50 text-mining-orange hover:bg-mining-orange/30"
            data-testid="button-random-avatar"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Random
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selected Avatar Preview */}
        <div className="text-center">
          <div className="relative inline-block">
            <Avatar className="w-20 h-20 border-4 border-neon-green/50 shadow-lg">
              <AvatarImage 
                src={selectedAvatar || ""} 
                alt="Selected avatar"
              />
              <AvatarFallback className="bg-gradient-to-br from-neon-purple/30 to-neon-green/30 text-white text-xl font-bold">
                ?
              </AvatarFallback>
            </Avatar>
            {selectedAvatar && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-neon-green rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-black" />
              </div>
            )}
          </div>
          <p className="text-white/70 text-sm mt-2">
            {selectedAvatar ? "Looking good!" : "Select an avatar below"}
          </p>
        </div>

        {/* Avatar Grid */}
        <div className="grid grid-cols-6 gap-3 max-h-64 overflow-y-auto">
          {displayedAvatars.map((avatar, index) => (
            <button
              key={index}
              onClick={() => onAvatarSelect(avatar)}
              className={`relative p-1 rounded-xl transition-all duration-200 hover:scale-110 ${
                selectedAvatar === avatar 
                  ? 'ring-2 ring-neon-green bg-neon-green/20' 
                  : 'hover:ring-2 hover:ring-white/50'
              }`}
              data-testid={`avatar-option-${index}`}
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={avatar} alt={`Avatar ${index + 1}`} />
                <AvatarFallback className="bg-gradient-to-br from-neon-purple/30 to-neon-green/30 text-white text-xs">
                  {index + 1}
                </AvatarFallback>
              </Avatar>
              {selectedAvatar === avatar && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-neon-green rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-black" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Show More/Less Button */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => setShowAll(!showAll)}
            className="text-white/70 hover:text-white hover:bg-white/10"
            data-testid="button-toggle-avatars"
          >
            {showAll ? 'Show Less' : `Show All ${avatarCollection.length} Avatars`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}