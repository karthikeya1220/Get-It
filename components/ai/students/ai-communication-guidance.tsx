"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Users, UserCheck, ArrowRight, Sparkles, Mail, FileText } from "lucide-react"

interface UserData {
  name: string
  skills: any[]
  projects: any[]
  education: any[]
  experience: any[]
}

interface AiCommunicationGuidanceProps {
  studentId: string
  userData: UserData
}

export function AiCommunicationGuidance({ studentId, userData }: AiCommunicationGuidanceProps) {
  const [activeTab, setActiveTab] = useState("professional")
  const [emailText, setEmailText] = useState("")
  const [messageText, setMessageText] = useState("")
  const [showEmailFeedback, setShowEmailFeedback] = useState(false)
  const [showMessageFeedback, setShowMessageFeedback] = useState(false)

  const professionalCommunication = [
    {
      title: "Email Writing Assistant",
      description: "Get help crafting professional emails for different scenarios",
      icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
      category: "Written Communication",
    },
    {
      title: "Meeting Preparation",
      description: "Prepare for important meetings with talking points and questions",
      icon: <Users className="h-5 w-5 text-violet-500" />,
      category: "Verbal Communication",
    },
    {
      title: "Feedback Formulation",
      description: "Learn to give and receive constructive feedback effectively",
      icon: <UserCheck className="h-5 w-5 text-green-500" />,
      category: "Interpersonal Skills",
    },
  ]

  const teamCollaboration = [
    {
      title: "Conflict Resolution",
      description: "Strategies for addressing and resolving team conflicts professionally",
      icon: <Users className="h-5 w-5 text-amber-500" />,
      category: "Team Dynamics",
    },
    {
      title: "Remote Collaboration",
      description: "Best practices for effective communication in remote teams",
      icon: <MessageSquare className="h-5 w-5 text-rose-500" />,
      category: "Virtual Communication",
    },
  ]

  const handleAnalyzeEmail = () => {
    if (emailText.trim().length > 10) {
      setShowEmailFeedback(true)
    }
  }

  const handleAnalyzeMessage = () => {
    if (messageText.trim().length > 10) {
      setShowMessageFeedback(true)
    }
  }

  const emailTemplates = [
    {
      title: "Job Application Follow-up",
      content: `Subject: Following Up on [Position] Application at [Company]

Dear [Hiring Manager's Name],

I hope this email finds you well. I recently applied for the [Position] role at [Company] on [Date], and I wanted to follow up on my application.

I'm particularly excited about the opportunity to [specific aspect of the role or company that interests you]. My experience in [relevant experience] aligns well with the requirements of this position, and I believe I could make valuable contributions to your team.

I've attached my resume again for your convenience. Please let me know if you need any additional information from me.

Thank you for considering my application. I look forward to the possibility of discussing how my skills and experience could benefit [Company].

Best regards,
[Your Name]
[Your Phone Number]
[Your LinkedIn Profile]`,
    },
    {
      title: "Networking Introduction",
      content: `Subject: Introduction - [Your Name] ([Mutual Connection] Referral)

Dear [Recipient's Name],

I hope this email finds you well. My name is [Your Name], and I was referred to you by [Mutual Connection's Name], who thought we should connect due to our shared interest in [common interest/industry].

I'm currently [brief description of your current role/situation], and I'm particularly interested in learning more about [specific aspect of their work/experience]. I've been following your work on [specific project/publication/achievement], and I'm impressed by [specific aspect you admire].

I would greatly appreciate the opportunity to have a brief conversation with you to learn more about your experience in [their area of expertise]. I'm happy to work around your schedule for a 15-20 minute call if that would be convenient for you.

Thank you for considering my request. I look forward to potentially connecting.

Best regards,
[Your Name]
[Your LinkedIn Profile/Website (optional)]`,
    },
  ]

  const messageTemplates = [
    {
      title: "Project Collaboration Request",
      content: `Hi [Name],

I hope you're doing well. I recently came across your profile and was impressed by your experience with [specific skill/project]. I'm currently working on a project involving [brief project description], and I believe your expertise would be valuable.

Would you be interested in discussing a potential collaboration? I'd love to share more details about the project and explore how we might work together.

Looking forward to your response!

Best,
[Your Name]`,
    },
    {
      title: "Mentor Connection Request",
      content: `Hi [Name],

I hope this message finds you well. My name is [Your Name], and I'm a [your role/background]. I've been following your work in [their field/specialty] and have been inspired by your [specific achievement or quality you admire].

I'm reaching out because I'm looking to grow my skills in [specific area], and I believe your guidance would be invaluable. Would you be open to a brief conversation where I could learn more about your career journey and potentially receive some advice?

I understand you're busy, so even 15-20 minutes of your time would be greatly appreciated.

Thank you for considering my request.

Best regards,
[Your Name]`,
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-violet-900 dark:text-violet-300">Communication Guidance</h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Improve your professional communication and collaboration skills with AI assistance.
        </p>
      </div>

      <Tabs defaultValue="professional" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="professional" className="flex-1">
            Professional Communication
          </TabsTrigger>
          <TabsTrigger value="collaboration" className="flex-1">
            Team Collaboration
          </TabsTrigger>
          <TabsTrigger value="email" className="flex-1">
            Email Assistant
          </TabsTrigger>
          <TabsTrigger value="message" className="flex-1">
            Message Assistant
          </TabsTrigger>
        </TabsList>

        <TabsContent value="professional" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {professionalCommunication.map((item, index) => (
              <Card key={index} className="border-violet-100 dark:border-violet-800/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">{item.title}</CardTitle>
                    {item.icon}
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">Category:</span>
                    <span className="font-medium">{item.category}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <span>Open Assistant</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="collaboration" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2">
            {teamCollaboration.map((item, index) => (
              <Card key={index} className="border-violet-100 dark:border-violet-800/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">{item.title}</CardTitle>
                    {item.icon}
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">Category:</span>
                    <span className="font-medium">{item.category}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <span>View Strategies</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}

            <div className="md:col-span-2">
              <Card className="border-violet-100 dark:border-violet-800/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-violet-500" />
                    Effective Team Communication
                  </CardTitle>
                  <CardDescription>Key principles for clear and productive team communication</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border border-violet-100 p-4 dark:border-violet-800/30">
                      <h4 className="mb-2 font-medium text-violet-900 dark:text-violet-300">Active Listening</h4>
                      <ul className="ml-5 list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                        <li>Focus completely on the speaker</li>
                        <li>Avoid interrupting or formulating responses while others speak</li>
                        <li>Ask clarifying questions</li>
                        <li>Summarize to confirm understanding</li>
                      </ul>
                    </div>

                    <div className="rounded-lg border border-violet-100 p-4 dark:border-violet-800/30">
                      <h4 className="mb-2 font-medium text-violet-900 dark:text-violet-300">Clear Messaging</h4>
                      <ul className="ml-5 list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                        <li>Be concise and specific</li>
                        <li>Structure information logically</li>
                        <li>Tailor your message to your audience</li>
                        <li>Use examples to illustrate complex points</li>
                      </ul>
                    </div>

                    <div className="rounded-lg border border-violet-100 p-4 dark:border-violet-800/30">
                      <h4 className="mb-2 font-medium text-violet-900 dark:text-violet-300">Constructive Feedback</h4>
                      <ul className="ml-5 list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                        <li>Focus on specific behaviors, not personality</li>
                        <li>Balance positive observations with suggestions</li>
                        <li>Be timely and private when appropriate</li>
                        <li>Offer solutions, not just criticism</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="email" className="mt-0">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card className="border-violet-100 dark:border-violet-800/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-violet-500" />
                    Email Writing Assistant
                  </CardTitle>
                  <CardDescription>Get AI feedback on your professional emails before sending them</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Type or paste your email here..."
                      className="min-h-[200px] resize-none"
                      value={emailText}
                      onChange={(e) => setEmailText(e.target.value)}
                    />

                    {showEmailFeedback && (
                      <div className="rounded-lg border border-violet-200 bg-violet-50 p-4 dark:border-violet-800/30 dark:bg-violet-900/20">
                        <h4 className="mb-3 flex items-center gap-2 font-medium text-violet-900 dark:text-violet-300">
                          <Sparkles className="h-4 w-4 text-amber-600" />
                          AI Feedback
                        </h4>

                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <Badge className="mt-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              Tone
                            </Badge>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">
                              Your email has a professional tone. Consider adding a brief personal touch in the opening
                              to build rapport.
                            </p>
                          </div>

                          <div className="flex items-start gap-2">
                            <Badge className="mt-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                              Structure
                            </Badge>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">
                              Good structure with clear paragraphs. Consider adding bullet points for any list of items
                              to improve readability.
                            </p>
                          </div>

                          <div className="flex items-start gap-2">
                            <Badge className="mt-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                              Clarity
                            </Badge>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">
                              Your message is clear. Consider specifying a timeline for next steps or follow-up to set
                              clear expectations.
                            </p>
                          </div>

                          <div className="mt-3 rounded-lg border border-violet-200 bg-white p-3 dark:border-violet-800/30 dark:bg-violet-900/40">
                            <p className="text-sm font-medium text-violet-900 dark:text-violet-300">
                              Suggested Improvements:
                            </p>
                            <ul className="ml-5 list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                              <li>Add a specific call to action at the end</li>
                              <li>Include a proposed time for a follow-up call if applicable</li>
                              <li>Consider shortening some sentences for better readability</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setEmailText("")}>
                    Clear
                  </Button>
                  <Button onClick={handleAnalyzeEmail} disabled={emailText.trim().length < 10}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze Email
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card className="border-violet-100 dark:border-violet-800/30">
                <CardHeader>
                  <CardTitle className="text-lg">Email Templates</CardTitle>
                  <CardDescription>Professional templates to help you get started</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {emailTemplates.map((template, index) => (
                    <div
                      key={index}
                      className="cursor-pointer rounded-md border border-violet-200 p-3 transition-colors hover:bg-violet-50 dark:border-violet-800/30 dark:hover:bg-violet-900/20"
                      onClick={() => {
                        setEmailText(template.content)
                        setShowEmailFeedback(false)
                      }}
                    >
                      <div className="mb-1 font-medium text-violet-900 dark:text-violet-300">{template.title}</div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {template.content.split("\n\n")[0].replace("Subject: ", "")}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="message" className="mt-0">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card className="border-violet-100 dark:border-violet-800/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-violet-500" />
                    Message Writing Assistant
                  </CardTitle>
                  <CardDescription>Get AI feedback on your professional messages before sending them</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Type or paste your message here..."
                      className="min-h-[200px] resize-none"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                    />

                    {showMessageFeedback && (
                      <div className="rounded-lg border border-violet-200 bg-violet-50 p-4 dark:border-violet-800/30 dark:bg-violet-900/20">
                        <h4 className="mb-3 flex items-center gap-2 font-medium text-violet-900 dark:text-violet-300">
                          <Sparkles className="h-4 w-4 text-amber-600" />
                          AI Feedback
                        </h4>

                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <Badge className="mt-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              Tone
                            </Badge>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">
                              Your message has a friendly yet professional tone, which is appropriate for most
                              professional contexts.
                            </p>
                          </div>

                          <div className="flex items-start gap-2">
                            <Badge className="mt-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                              Clarity
                            </Badge>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">
                              Your message is generally clear, but consider being more specific about your request or
                              next steps.
                            </p>
                          </div>

                          <div className="flex items-start gap-2">
                            <Badge className="mt-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                              Conciseness
                            </Badge>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">
                              Good length for a professional message. Keep paragraphs short for better readability.
                            </p>
                          </div>

                          <div className="mt-3 rounded-lg border border-violet-200 bg-white p-3 dark:border-violet-800/30 dark:bg-violet-900/40">
                            <p className="text-sm font-medium text-violet-900 dark:text-violet-300">
                              Suggested Improvements:
                            </p>
                            <ul className="ml-5 list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                              <li>Add a clear call to action at the end</li>
                              <li>Consider adding a specific timeframe for response</li>
                              <li>Personalize the message more to the recipient</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setMessageText("")}>
                    Clear
                  </Button>
                  <Button onClick={handleAnalyzeMessage} disabled={messageText.trim().length < 10}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze Message
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card className="border-violet-100 dark:border-violet-800/30">
                <CardHeader>
                  <CardTitle className="text-lg">Message Templates</CardTitle>
                  <CardDescription>Professional templates to help you get started</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {messageTemplates.map((template, index) => (
                    <div
                      key={index}
                      className="cursor-pointer rounded-md border border-violet-200 p-3 transition-colors hover:bg-violet-50 dark:border-violet-800/30 dark:hover:bg-violet-900/20"
                      onClick={() => {
                        setMessageText(template.content)
                        setShowMessageFeedback(false)
                      }}
                    >
                      <div className="mb-1 font-medium text-violet-900 dark:text-violet-300">{template.title}</div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{template.content.split("\n\n")[0]}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="mt-4">
                <Card className="border-violet-100 dark:border-violet-800/30">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-amber-500" />
                      Communication Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <ArrowRight className="mt-0.5 h-4 w-4 text-violet-500" />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">
                          Be clear and concise in your communication
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="mt-0.5 h-4 w-4 text-violet-500" />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">
                          Tailor your message to your audience
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="mt-0.5 h-4 w-4 text-violet-500" />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">
                          Always include a clear call to action
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="mt-0.5 h-4 w-4 text-violet-500" />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">Proofread before sending</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
