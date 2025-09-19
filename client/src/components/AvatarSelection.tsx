import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, User, Shuffle } from "lucide-react";

// NFT-Style Avatar Collection (150+ options)
// Using DiceBear's fun-emoji and lorelei styles for cartoon/NFT aesthetic
const nftAvatarCollection = [
  // Ape/Monkey style NFTs with various backgrounds and accessories
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=ape1&backgroundColor=00d4aa",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=ape2&backgroundColor=ffb800",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=ape3&backgroundColor=c0392b",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=ape4&backgroundColor=8e44ad",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=ape5&backgroundColor=2980b9",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=monkey1&backgroundColor=e67e22",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=monkey2&backgroundColor=27ae60",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=monkey3&backgroundColor=f39c12",
  
  // Cat style NFTs
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=cat1&backgroundColor=3498db",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=cat2&backgroundColor=e91e63",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=cat3&backgroundColor=9c27b0",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=cat4&backgroundColor=ff5722",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=kitty1&backgroundColor=4caf50",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=kitty2&backgroundColor=ff9800",
  
  // Cartoon character style NFTs using lorelei
  "https://api.dicebear.com/7.x/lorelei/svg?seed=nft1&backgroundColor=ff6b6b",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=nft2&backgroundColor=4ecdc4",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=nft3&backgroundColor=45b7d1",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=nft4&backgroundColor=f9ca24",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=nft5&backgroundColor=f0932b",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=nft6&backgroundColor=eb4d4b",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=nft7&backgroundColor=6ab04c",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=nft8&backgroundColor=130f40",
  
  // More character variations with vibrant NFT backgrounds
  "https://api.dicebear.com/7.x/lorelei/svg?seed=crypto1&backgroundColor=ff9ff3",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=crypto2&backgroundColor=54a0ff",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=crypto3&backgroundColor=5f27cd",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=crypto4&backgroundColor=00d2d3",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=crypto5&backgroundColor=ff9f43",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=crypto6&backgroundColor=10ac84",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=crypto7&backgroundColor=ee5a24",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=crypto8&backgroundColor=0984e3",
  
  // Additional NFT-style variations
  ...Array.from({ length: 120 }, (_, i) => {
    const seeds = [
      'legend', 'epic', 'rare', 'cool', 'fresh', 'cyber', 'neon', 'galaxy', 
      'cosmic', 'digital', 'pixel', 'mint', 'gold', 'diamond', 'ruby', 'emerald',
      'blazing', 'storm', 'thunder', 'lightning', 'fire', 'ice', 'shadow', 'light',
      'hero', 'warrior', 'knight', 'mage', 'ninja', 'samurai', 'robot', 'android'
    ];
    const nftColors = [
      'ff6b6b', '4ecdc4', '45b7d1', 'f9ca24', 'f0932b', 'eb4d4b', '6ab04c',
      'ff9ff3', '54a0ff', '5f27cd', '00d2d3', 'ff9f43', '10ac84', 'ee5a24',
      '0984e3', 'a29bfe', 'fd79a8', '00cec9', 'e17055', '74b9ff', 'e84393',
      '00b894', 'fdcb6e', 'e55039', '4834d4', '686de0', 'ff7675', '00b2ee'
    ];
    
    const styles = ['lorelei', 'fun-emoji'];
    const style = styles[i % 2]; // Alternate between styles
    const seed = seeds[i % seeds.length] + (i + 1);
    const color = nftColors[i % nftColors.length];
    
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=${color}`;
  })
];

// Use the NFT collection as the main avatar collection
const avatarCollection = nftAvatarCollection;

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
            <span>Choose Your NFT Avatar</span>
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
            {selectedAvatar ? "NFT style looks great!" : "Select your NFT-style avatar below"}
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
            {showAll ? 'Show Less' : `Show All ${avatarCollection.length} NFT Avatars`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}