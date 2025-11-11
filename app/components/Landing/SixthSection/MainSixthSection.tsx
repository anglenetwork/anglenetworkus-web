"use client";

import { useState, useRef, useEffect } from "react";
import { Play, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Video {
  id: string;
  title: string;
  category: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
}

const mockVideos: Video[] = [
  {
    id: "1",
    title: "Bad Bunny ends his two-month residency in Puerto Rico",
    category: "Entertainment",
    duration: "4:03",
    thumbnail:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop",
    videoUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Delta flight reported bird strike",
    category: "Lifestyle",
    duration: "0:22",
    thumbnail:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop",
    videoUrl:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Snowboarder speaks out after incredible rescue",
    category: "Lifestyle",
    duration: "2:22",
    thumbnail:
      "https://images.unsplash.com/photo-1551524164-6cf2ac531400?auto=format&fit=crop",
    videoUrl:
      "https://images.unsplash.com/photo-1551524164-6cf2ac531400?auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Qing Bao the panda turns 4",
    category: "Lifestyle",
    duration: "0:34",
    thumbnail:
      "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop",
    videoUrl:
      "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop",
  },
  {
    id: "5",
    title: "Why a friend group has a special bond",
    category: "Lifestyle",
    duration: "1:45",
    thumbnail:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop",
    videoUrl:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop",
  },
  {
    id: "6",
    title: "Ocean waves crash against rocky shore",
    category: "Nature",
    duration: "3:12",
    thumbnail:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop",
    videoUrl:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop",
  },
  {
    id: "7",
    title: "City lights illuminate the night sky",
    category: "Urban",
    duration: "2:08",
    thumbnail:
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop",
    videoUrl:
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop",
  },
  {
    id: "8",
    title: "Mountain hiking adventure begins",
    category: "Adventure",
    duration: "5:30",
    thumbnail:
      "https://images.unsplash.com/photo-1464822759844-d150baec93d5?auto=format&fit=crop",
    videoUrl:
      "https://images.unsplash.com/photo-1464822759844-d150baec93d5?auto=format&fit=crop",
  },
  {
    id: "9",
    title: "Wildlife documentary captures rare moment",
    category: "Nature",
    duration: "4:15",
    thumbnail:
      "https://images.unsplash.com/photo-1549366021-9f761d7d3136?auto=format&fit=crop",
    videoUrl:
      "https://images.unsplash.com/photo-1549366021-9f761d7d3136?auto=format&fit=crop",
  },
  {
    id: "10",
    title: "Tech startup revolutionizes industry",
    category: "Technology",
    duration: "6:42",
    thumbnail:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop",
    videoUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop",
  },
  {
    id: "11",
    title: "Chef creates innovative fusion cuisine",
    category: "Food",
    duration: "3:28",
    thumbnail:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop",
    videoUrl:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop",
  },
  {
    id: "12",
    title: "Artist unveils stunning street mural",
    category: "Art",
    duration: "2:55",
    thumbnail:
      "https://images.unsplash.com/photo-1541961017774-20c1d3a81b06?auto=format&fit=crop",
    videoUrl:
      "https://images.unsplash.com/photo-1541961017774-20c1d3a81b06?auto=format&fit=crop",
  },
  {
    id: "13",
    title: "Space exploration reaches new milestone",
    category: "Science",
    duration: "7:18",
    thumbnail:
      "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?auto=format&fit=crop",
    videoUrl:
      "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?auto=format&fit=crop",
  },
  {
    id: "14",
    title: "Fashion week showcases sustainable designs",
    category: "Fashion",
    duration: "4:33",
    thumbnail:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop",
    videoUrl:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop",
  },
  {
    id: "15",
    title: "Marathon runner breaks world record",
    category: "Sports",
    duration: "5:07",
    thumbnail:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop",
    videoUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop",
  },
];

export function VideoPlayer() {
  const [selectedVideo, setSelectedVideo] = useState<Video>(mockVideos[0]);
  const [canScrollUp, setCanScrollUp] = useState(false); // Added state to track if user can scroll up
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setCanScrollUp(container.scrollTop > 0);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollDown = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({ top: scrollAmount, behavior: "smooth" });
    }
  };

  const handleScrollUp = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({ top: -scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-slate-900 text-white lg:h-[60vh]">
      {/* Main Video Player - Mobile First */}
      <div className="flex-1 relative p-4 lg:p-8 order-2 lg:order-2 aspect-video lg:aspect-auto bg-slate-900">
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={selectedVideo.videoUrl || "/placeholder.svg"}
            alt={selectedVideo.title}
            fill
            className="object-cover"
          />

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="lg"
              className="w-20 h-20 rounded-full bg-black/50 hover:bg-black/70 border-2 border-white/20"
            >
              <Play className="w-8 h-8 text-white ml-1" />
            </Button>
          </div>

          {/* Video Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 lg:p-8">
            <div
              className="text-sm text-blue-400 mb-2 font-sans drop-shadow-lg"
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
            >
              {selectedVideo.category}
            </div>
            <h1
              className="text-xl lg:text-2xl font-bold text-white mb-2 font-sans drop-shadow-lg"
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
            >
              {selectedVideo.title}
            </h1>
            <div
              className="text-sm text-slate-300 font-sans drop-shadow-lg"
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
            >
              Duration: {selectedVideo.duration}
            </div>
          </div>
        </div>
      </div>

      {/* Left Sidebar - Video List */}
      <div className="w-full lg:w-96 bg-slate-800/50 p-4 lg:p-6 flex flex-col order-1 lg:order-1 max-h-[60vh] lg:max-h-none">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white font-sans">
            Trending Videos
          </h2>
          {canScrollUp && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleScrollUp}
              className="text-white hover:bg-slate-700 hover:text-blue-400 transition-all duration-200 rounded-full p-2"
            >
              <ChevronUp className="w-5 h-5" />
            </Button>
          )}
        </div>

        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto space-y-4 scrollbar-hide max-h-[calc(60vh-140px)] lg:max-h-[calc(100vh-200px)]"
        >
          {mockVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => handleVideoSelect(video)}
              className={cn(
                "flex gap-3 p-2 rounded-lg cursor-pointer transition-all hover:bg-slate-700/50",
                selectedVideo.id === video.id && "bg-slate-700/70"
              )}
            >
              <div className="relative flex-shrink-0 w-20 h-14">
                <Image
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  fill
                  className="object-cover rounded-xl"
                />
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                  <Play className="w-2 h-2 inline mr-1" />
                  {video.duration}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-blue-400 mb-1 font-sans">
                  {video.category}
                </div>
                <h3 className="text-sm font-medium text-white leading-tight line-clamp-2 font-sans">
                  {video.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span className="font-sans">
              Playlist - {mockVideos.length} Videos
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleScrollDown}
              className="text-slate-400 hover:bg-slate-700 hover:text-blue-400 transition-all duration-200 rounded-full p-1"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MainSixthSection() {
  return <VideoPlayer />;
}
