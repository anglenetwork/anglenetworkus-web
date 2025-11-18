import { NewsTickerScrollControls } from "./news-ticker-scroll-controls";

export function NewsTicker() {
  const newsItems = [
    { text: "Strikes pound Kyiv", link: "#" },
    { text: "Maduro calls for peace", link: "#" },
    { text: "Marjorie Taylor Greene", link: "#" },
    { text: "US pressure on Venezuela", link: "#" },
    { text: "Hidden canyon in Mediterranean", link: "#" },
    { text: "Russian robot falls", link: "#" },
  ];

  return (
    <nav className="w-full bg-white">
      <div className="relative">
        <div
          id="news-ticker-scroll"
          className="mx-auto flex items-center justify-start overflow-x-auto py-4 scrollbar-hide md:justify-center md:overflow-x-visible"
        >
          {newsItems.map((item, index) => (
            <div key={index} className="flex items-center">
              <a
                href={item.link}
                className="whitespace-nowrap px-4 text-base font-light tracking-normal font-sans hover:underline"
              >
                {item.text}
              </a>
              {index < newsItems.length - 1 && (
                <span className="text-muted-foreground">|</span>
              )}
            </div>
          ))}
        </div>
        <NewsTickerScrollControls itemCount={newsItems.length} />
      </div>
    </nav>
  );
}
