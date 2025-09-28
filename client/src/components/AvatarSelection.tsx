import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, User, Shuffle } from "lucide-react";

// Profile avatar collection using coinmaining.game profile images (pr-1 to pr-85)
const profileAvatarCollection = Array.from({ length: 85 }, (_, i) => 
  `https://coinmaining.game/profiles/pr-${i + 1}.jpeg`
);

// Use the profile collection as the main avatar collection
const avatarCollection = profileAvatarCollection;

// Function to get random avatar
const getRandomAvatar = (): string => {
  return avatarCollection[Math.floor(Math.random() * avatarCollection.length)];
};

interface AvatarSelectionProps {
  selectedAvatar: string | null;
  onAvatarSelect: (avatar: string) => void;
}

export { getRandomAvatar };

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
            <span>Choose Your Profile Avatar</span>
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
            <Avatar className="w-24 h-24 border-4 border-neon-green/50 shadow-lg">
              <AvatarImage 
                src={selectedAvatar || ""} 
                alt="Selected avatar"
                className="object-cover"
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
            {selectedAvatar ? "Profile looks great!" : "Select your profile avatar below"}
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
              <Avatar className="w-14 h-14">
                <AvatarImage 
                  src={avatar} 
                  alt={`Profile ${index + 1}`} 
                  className="object-cover"
                />
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
            {showAll ? 'Show Less' : `Show All ${avatarCollection.length} Profile Avatars`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}