import { Icons } from "@/components/icons"
import { Reveal } from "@/components/motion/text-reveal"

const FEATURES = [
  {
    icon: Icons.users,
    title: "Skill showcase",
    description:
      "A profile that shows your skills, coursework and past work, so a recruiter can judge you in one pass.",
  },
  {
    icon: Icons.briefcase,
    title: "Paid gigs, not exposure",
    description: "Every listing has a budget and a closing date. Nothing on the board pays in experience.",
  },
  {
    icon: Icons.lightbulb,
    title: "AI skill matching",
    description: "Tell GetIT what you are good at and it surfaces the gigs that fit, instead of an endless scroll.",
  },
  {
    icon: Icons.dollar,
    title: "Secure payments",
    description: "Terms are agreed in writing before the work starts, and payment follows an approved delivery.",
  },
  {
    icon: Icons.star,
    title: "Reputation that travels",
    description: "Reviews from each completed gig build up on your profile, so the next client can trust you faster.",
  },
  {
    icon: Icons.compass,
    title: "Career guidance",
    description: "GetIT points at the skills worth learning next, based on the work people keep hiring for.",
  },
]

export function PremiumFeatures() {
  return (
    <section id="features" className="border-b border-border bg-background py-16 md:py-24">
      <div className="container px-4 md:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
                Built for students who want paying work
              </h2>
              <p className="mt-4 max-w-[40ch] text-muted-foreground">
                Six things GetIT does. No features you will never open.
              </p>
            </Reveal>
          </div>

          <ul className="border-t border-border">
            {FEATURES.map((feature, index) => (
              <li key={feature.title} className="border-b border-border">
                <Reveal delay={index * 0.05} className="flex gap-4 py-6 sm:gap-5">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                    <feature.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-semibold leading-snug">{feature.title}</h3>
                    <p className="mt-1.5 max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
