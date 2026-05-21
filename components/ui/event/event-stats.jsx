export default function EventStats() {
    return (
      <div className="grid grid-cols-3 gap-4 max-w-md">
        <div className="bg-white rounded-lg p-4 text-center shadow">
          <div className="text-2xl font-bold">92</div>
          <div className="text-xs text-muted-foreground">Events</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow">
          <div className="text-2xl font-bold">60</div>
          <div className="text-xs text-muted-foreground">Speakers</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow">
          <div className="text-2xl font-bold">75</div>
          <div className="text-xs text-muted-foreground">Partners</div>
        </div>
      </div>
    )
  }
  
  