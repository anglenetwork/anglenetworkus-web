import Image from "next/image";
import { Card } from "@/components/ui/card";

export function LeftColumnSixth() {
  return (
    <div className="border-r border-gray-200 pr-6 pl-4">
      <div className="sticky top-6">
        <p className="text-sm text-gray-500 mb-4 text-center font-outfit">
          Advertisement
        </p>
        <div className="border-t border-black mb-4"></div>
        <Card className="p-4">
          <Image
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop"
            alt="Generic placeholder"
            width={300}
            height={400}
            className="w-full h-96 object-cover rounded-xl"
          />
          <p className="text-sm text-gray-600 mt-2 text-center font-outfit">
            Generic Content
          </p>
        </Card>
      </div>
    </div>
  );
}
