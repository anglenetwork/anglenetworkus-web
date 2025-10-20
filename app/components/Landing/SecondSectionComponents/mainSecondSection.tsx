"use client";

import { useRef } from "react";
import ArticleCard from "./article-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MainSecondSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const stories = [
    {
      id: 1,
      category: "Letter from Israel",
      title:
        "The 'Day After' Plan for Gaza That Netanyahu Doesn't Want to Talk About",
      description:
        "Despite what Netanyahu says, the West Bank business elite is ready and willing to govern and rebuild.",
      author: "Bernard Avishai",
      image: undefined,
      isDecorative: true,
    },
    {
      id: 2,
      category: "Letter from Israel",
      title:
        "The 'Day After' Plan for Gaza That Netanyahu Doesn't Want to Talk About",
      description:
        "Despite what Netanyahu says, the West Bank business elite is ready and willing to govern and rebuild.",
      author: "Bernard Avishai",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop",
      imageAlt: "Meeting hall with people and bunting",
      isDecorative: false,
    },
    {
      id: 3,
      category: "Politics",
      title:
        "Opinion | The Sydney Sweeney Saga Shows Why Republicans Keep Winning",
      description: "Democrats will struggle until the media ecosystem changes.",
      author: "Rob Flherty",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop",
      imageAlt: "Stylized portrait with geometric patterns",
      isDecorative: false,
    },
    {
      id: 4,
      category: "The Friday Read | Primary Source",
      title: "Nobody Is Making Deals in Trump's Washington",
      description:
        "The Senate used to run on deals involving everything from pipelines to feral cows. Reviving them could be the first step to fixing politics.",
      author: "Jim Secretto",
      image:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop",
      imageAlt: "Black cattle grazing in field",
      isDecorative: false,
    },
    {
      id: 5,
      category: "Technology",
      title: "The Future of Artificial Intelligence in Healthcare",
      description:
        "How AI is revolutionizing medical diagnosis and treatment planning across the globe.",
      author: "Sarah Chen",
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop",
      imageAlt: "Medical technology and AI visualization",
      isDecorative: false,
    },
    {
      id: 6,
      category: "Environment",
      title: "Climate Change Solutions That Actually Work",
      description:
        "Innovative approaches to carbon reduction that are making a real difference in communities worldwide.",
      author: "Michael Torres",
      image:
        "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?auto=format&fit=crop",
      imageAlt: "Solar panels and wind turbines",
      isDecorative: false,
    },
    {
      id: 7,
      category: "Business",
      title: "The Rise of Remote Work Culture",
      description:
        "How companies are adapting to permanent remote work and what it means for the future of employment.",
      author: "Lisa Rodriguez",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop",
      imageAlt: "Person working remotely with laptop",
      isDecorative: false,
    },
    {
      id: 8,
      category: "Culture",
      title: "The Renaissance of Independent Cinema",
      description:
        "Small budget films are making big impacts at international film festivals and streaming platforms.",
      author: "David Park",
      image:
        "https://images.unsplash.com/photo-1489599904472-c2d34d17c1b5?auto=format&fit=crop",
      imageAlt: "Film camera and movie equipment",
      isDecorative: false,
    },
  ];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -344, // Card width (320px) + gap (24px)
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 344, // Card width (320px) + gap (24px)
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-white">
      <div className="px-6 py-8">
        {/* Title Section */}
        <div className="flex items-center mb-4">
          <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
          <h2 className="text-xs font-medium text-neutral-900 uppercase tracking-wider font-inter">
            Featured Stories
          </h2>
        </div>

        <div className="border-b border-gray-300 mb-6"></div>

        <div className="relative">
          {/* Left Arrow */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-50"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Right Arrow */}
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-50"
            onClick={scrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Horizontal Scrolling Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-12"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {stories.map((story) => (
              <ArticleCard
                key={story.id}
                category={story.category}
                title={story.title}
                description={story.description}
                author={story.author}
                image={story.image}
                imageAlt={story.imageAlt}
                isDecorative={story.isDecorative}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
