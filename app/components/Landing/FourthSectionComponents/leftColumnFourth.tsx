import Image from "next/image";
import { Card } from "@/components/ui/card";

export function LeftColumnFourth() {
  return (
    <div className="border-gray-200 border-r pr-6 pl-4">
      <div className="sticky top-6">
        <p className="mb-4 text-center font-sans text-gray-500 text-sm">
          Advertisement
        </p>
        <div className="mb-4 border-black border-t"></div>
        <Card className="p-4">
          <Image
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop"
            alt="Generic placeholder"
            width={300}
            height={400}
            className="h-96 w-full rounded-sm object-cover"
          />
          <p className="mt-2 text-center font-sans text-gray-600 text-sm">
            Generic Content
          </p>
        </Card>
      </div>
    </div>
  );
}
