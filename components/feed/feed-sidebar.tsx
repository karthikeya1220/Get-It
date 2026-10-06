import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, Users, ChevronRight, Calendar, BookOpen, Star, Bell, Plus } from "lucide-react"
import { trendingTopics, suggestedConnections, upcomingEvents, learningResources } from "@/components/feed/mock-data"

export function FeedSidebar() {
  return (
    <div className="space-y-6 sticky top-20">
      {/* Profile Summary */}
      <Card className="border-border bg-card shadow-sm">
        <div className="relative">
          <div className="h-20 w-full rounded-t-lg bg-gradient-to-r from-primary to-primary/60"></div>
          <div className="absolute -bottom-12 left-4">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Your profile" />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <CardContent className="pt-14">
          <h3 className="text-lg font-semibold text-foreground">Alex Johnson</h3>
          <p className="text-sm text-muted-foreground">Computer Science Student</p>

          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-md bg-secondary p-2">
              <p className="font-medium text-foreground">142</p>
              <p className="text-muted-foreground">Connections</p>
            </div>
            <div className="rounded-md bg-secondary p-2">
              <p className="font-medium text-foreground">28</p>
              <p className="text-muted-foreground">Posts</p>
            </div>
            <div className="rounded-md bg-secondary p-2">
              <p className="font-medium text-foreground">4.8</p>
              <p className="text-muted-foreground">Rating</p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button variant="outline" className="flex-1">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
              <Badge className="ml-2">3</Badge>
            </Button>

            <Button variant="outline" className="flex-1">
              <Plus className="mr-2 h-4 w-4" />
              Create
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trending Topics */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <TrendingUp className="h-5 w-5 text-primary" />
            Trending in Tech
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <ul className="space-y-2">
            {trendingTopics.map((topic) => (
              <li key={topic.id}>
                <Button variant="ghost" className="w-full justify-start px-2 py-1 text-left">
                  <span className="flex-1 truncate">#{topic.name}</span>
                  <Badge variant="outline" className="ml-2 bg-secondary text-primary">
                    {topic.count}
                  </Badge>
                </Button>
              </li>
            ))}
          </ul>
          <Button variant="link" className="mt-2 h-auto p-0 text-sm text-primary hover:text-primary/80">
            See all trending topics
          </Button>
        </CardContent>
      </Card>

      {/* Suggested Connections */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Users className="h-5 w-5 text-primary" />
            People You May Know
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <ul className="space-y-3">
            {suggestedConnections.map((connection) => (
              <li key={connection.id} className="flex items-start gap-3">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src={connection.avatar} alt={connection.name} />
                  <AvatarFallback>
                    {connection.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">{connection.name}</h4>
                  <p className="text-xs text-muted-foreground truncate">{connection.role}</p>
                  <p className="text-xs text-muted-foreground">{connection.mutualConnections} mutual connections</p>
                </div>
                <Button size="sm" variant="outline" className="h-8">
                  Connect
                </Button>
              </li>
            ))}
          </ul>
          <Button variant="link" className="mt-2 h-auto p-0 text-sm text-primary hover:text-primary/80">
            View all suggestions
          </Button>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <ul className="space-y-3">
            {upcomingEvents.map((event) => (
              <li key={event.id} className="rounded-lg bg-secondary p-3">
                <div className="flex gap-3">
                  <div className="h-16 w-24 overflow-hidden rounded-md">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{event.title}</h4>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{event.date}</span>
                      <span className="text-xs text-muted-foreground">{event.attendees} attending</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="link"
                  className="mt-2 flex w-full items-center justify-center gap-1 text-sm text-primary hover:text-primary/80"
                >
                  <span>View details</span>
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </li>
            ))}
          </ul>
          <Button variant="link" className="mt-2 h-auto p-0 text-sm text-primary hover:text-primary/80">
            Browse all events
          </Button>
        </CardContent>
      </Card>

      {/* Learning Resources */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <BookOpen className="h-5 w-5 text-primary" />
            Learning Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="space-y-3">
            {learningResources.map((resource) => (
              <div key={resource.id} className="rounded-lg border border-border p-3">
                <div className="flex gap-3">
                  <div className="h-12 w-20 overflow-hidden rounded-md">
                    <img
                      src={resource.image || "/placeholder.svg"}
                      alt={resource.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{resource.title}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">{resource.description}</p>
                  </div>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <span>{resource.modules} modules</span>
                    <span>•</span>
                    <span>{resource.duration}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Star className="mr-1 h-3 w-3 fill-amber-400 text-amber-400" />
                      {resource.level}
                    </span>
                  </div>
                  <Badge variant={resource.isPremium ? "outline" : "secondary"}>
                    {resource.isPremium ? "Premium" : "Free"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <Button variant="link" className="mt-2 h-auto p-0 text-sm text-primary hover:text-primary/80">
            Explore all resources
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
