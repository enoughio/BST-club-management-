import Image from "next/image"

export default function EventHero() {
  return (
    <div className="relative rounded-lg overflow-hidden">
      <Image
        src="/placeholder.svg?height=400&width=1000"
        alt="Event hero"
        width={1000}
        height={400}
        className="w-full h-[400px] object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
        <div className="p-8">
          <div className="bg-white/90 rounded-lg p-4 max-w-[200px]">
            <h2 className="text-4xl font-bold">5k+</h2>
            <p className="text-xs mt-1">
              Et eius eligendi qui soluta facere et nemo adipisci non nobis voluptates et molestiae
            </p>
          </div>
          <div className="flex gap-4 mt-6">
            <div className="bg-white/90 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">92</div>
              <div className="text-xs">Lorem ipsum dolor sit amet</div>
            </div>
            <div className="bg-white/90 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">60</div>
              <div className="text-xs">Lorem ipsum dolor sit amet</div>
            </div>
            <div className="bg-white/90 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">75</div>
              <div className="text-xs">Lorem ipsum dolor sit amet</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

