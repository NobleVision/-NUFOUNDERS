import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { toast } from "sonner";
import { 
  Calendar, 
  MapPin,
  Clock,
  Users,
  Video,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  ExternalLink
} from "lucide-react";

// Mock events data
const MOCK_EVENTS = [
  {
    id: 1,
    title: "Weekly Founder Meetup",
    description: "Join us for our weekly virtual meetup where founders share wins, challenges, and support each other.",
    type: "virtual",
    date: new Date("2026-01-25T14:00:00"),
    duration: 60,
    location: "Zoom",
    maxAttendees: 50,
    currentAttendees: 32,
    host: "NuFounders Team",
    isRegistered: true,
  },
  {
    id: 2,
    title: "Atlanta Networking Brunch",
    description: "In-person networking brunch for Atlanta-based NuFounders members. Build connections over great food!",
    type: "in_person",
    date: new Date("2026-01-28T11:00:00"),
    duration: 120,
    location: "The Gathering Spot, Atlanta, GA",
    maxAttendees: 30,
    currentAttendees: 24,
    host: "Destiny Carter",
    isRegistered: false,
  },
  {
    id: 3,
    title: "Pitch Practice Workshop",
    description: "Practice your pitch and get feedback from experienced entrepreneurs and investors.",
    type: "virtual",
    date: new Date("2026-01-30T18:00:00"),
    duration: 90,
    location: "Google Meet",
    maxAttendees: 20,
    currentAttendees: 15,
    host: "Michelle Roberts",
    isRegistered: false,
  },
  {
    id: 4,
    title: "Digital Marketing Masterclass",
    description: "Deep dive into advanced digital marketing strategies with industry experts.",
    type: "virtual",
    date: new Date("2026-02-01T15:00:00"),
    duration: 120,
    location: "Zoom",
    maxAttendees: 100,
    currentAttendees: 67,
    host: "Dr. Sarah Chen",
    isRegistered: true,
  },
  {
    id: 5,
    title: "Houston Founder Dinner",
    description: "Exclusive dinner event for NuFounders members in the Houston area.",
    type: "in_person",
    date: new Date("2026-02-05T19:00:00"),
    duration: 180,
    location: "Pappas Bros. Steakhouse, Houston, TX",
    maxAttendees: 20,
    currentAttendees: 12,
    host: "Tamara Johnson",
    isRegistered: false,
  },
  {
    id: 6,
    title: "Q1 Pitch Competition Finals",
    description: "Watch the top 10 finalists pitch their businesses to our panel of investors.",
    type: "hybrid",
    date: new Date("2026-03-01T13:00:00"),
    duration: 240,
    location: "Atlanta Tech Village + Virtual",
    maxAttendees: 500,
    currentAttendees: 234,
    host: "NuFounders Team",
    isRegistered: false,
  },
];

export default function Events() {
  const { isAuthenticated } = useAuth();
  const [selectedType, setSelectedType] = useState("all");

  const filteredEvents = MOCK_EVENTS.filter(event => {
    if (selectedType === "all") return true;
    return event.type === selectedType;
  });

  const upcomingEvents = filteredEvents.filter(e => e.date > new Date());
  const myEvents = MOCK_EVENTS.filter(e => e.isRegistered);

  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case 'virtual': return <Badge className="bg-blue-100 text-blue-700">Virtual</Badge>;
      case 'in_person': return <Badge className="bg-green-100 text-green-700">In Person</Badge>;
      case 'hybrid': return <Badge className="bg-purple-100 text-purple-700">Hybrid</Badge>;
      default: return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">NuFounders</span>
              </div>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Events</h1>
          <p className="text-lg text-muted-foreground">
            Connect with the community through virtual and in-person events
          </p>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <TabsList className="grid w-full max-w-sm grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="my-events">My Events</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              {["all", "virtual", "in_person", "hybrid"].map(type => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                >
                  {type === "all" ? "All" : type === "in_person" ? "In Person" : type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Upcoming Events Tab */}
          <TabsContent value="upcoming" className="space-y-6">
            {upcomingEvents.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No upcoming events</h3>
                  <p className="text-muted-foreground">Check back soon for new events!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        {getEventTypeBadge(event.type)}
                        {event.isRegistered && (
                          <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Registered
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription>{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(event.date)} ({event.duration} min)</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {event.type === 'virtual' ? (
                          <Video className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{event.currentAttendees}/{event.maxAttendees} attendees</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Hosted by <span className="font-medium text-foreground">{event.host}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      {event.isRegistered ? (
                        <Button className="w-full" variant="outline">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Join Event
                        </Button>
                      ) : (
                        <Button 
                          className="w-full"
                          disabled={event.currentAttendees >= event.maxAttendees || !isAuthenticated}
                        >
                          {event.currentAttendees >= event.maxAttendees 
                            ? "Event Full" 
                            : "Register Now"}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* My Events Tab */}
          <TabsContent value="my-events" className="space-y-6">
            {myEvents.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No registered events</h3>
                  <p className="text-muted-foreground mb-4">Browse upcoming events and register to attend</p>
                  <Button onClick={() => {}}>Browse Events</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {myEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow border-primary/20">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        {getEventTypeBadge(event.type)}
                        <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Registered
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription>{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(event.date)} ({event.duration} min)</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {event.type === 'virtual' ? (
                          <Video className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                        <span>{event.location}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="gap-2">
                      <Button className="flex-1" variant="outline">
                        Cancel Registration
                      </Button>
                      <Button className="flex-1">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Join Event
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
