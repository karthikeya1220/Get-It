export function getMockAgreementData(recruiterId: string, studentId: string) {
  return {
    agreementId: `AGR-${Math.floor(Math.random() * 10000)}`,
    companyName: "TechInnovate Solutions",
    companyLogo: "/placeholder.svg?height=200&width=200",
    studentName: "Alex Johnson",
    studentAvatar: "/placeholder.svg?height=200&width=200",
    recruiterName: "Sarah Williams",
    recruiterSignature: "Sarah Williams",
    recruiterSignedAt: new Date().toISOString(),
    position: "Frontend Developer",
    salary: "$85,000 per year + benefits",
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
    duration: "Full-time (Permanent)",
    workType: "Hybrid",
    location: "San Francisco, CA (2 days in office)",
    additionalNotes: "",
    createdAt: new Date().toISOString(),
    terms: [
      {
        title: "Employment Terms",
        content:
          "This agreement constitutes a binding contract between TechInnovate Solutions ('the Company') and Alex Johnson ('the Employee'). The employment relationship is at-will, meaning either party may terminate the relationship at any time, with or without cause, subject to applicable laws and the notice periods specified herein.",
      },
      {
        title: "Compensation & Benefits",
        content:
          "The Employee will receive an annual salary of $85,000, paid bi-weekly. Benefits include health insurance (medical, dental, vision), 401(k) with 4% company match, 15 days of paid time off annually, and professional development allowance of $2,000 per year.",
      },
      {
        title: "Work Schedule & Location",
        content:
          "The Employee will work in a hybrid arrangement, with 2 days per week required in the San Francisco office and 3 days remote. Standard working hours are 9:00 AM to 5:00 PM Pacific Time, Monday through Friday, with flexibility as approved by management.",
      },
      {
        title: "Intellectual Property",
        content:
          "All work product, inventions, and intellectual property created during employment and related to the Company's business shall be the sole and exclusive property of the Company. The Employee agrees to execute all documents necessary to perfect the Company's rights in such intellectual property.",
      },
      {
        title: "Confidentiality",
        content:
          "The Employee agrees to maintain the confidentiality of all proprietary information, trade secrets, and non-public information of the Company during and after employment. This includes customer lists, business strategies, technical data, and any other information not generally known to the public.",
      },
      {
        title: "Non-Solicitation",
        content:
          "For a period of twelve (12) months following termination of employment, the Employee agrees not to solicit any employees, contractors, or customers of the Company for any competing business purpose.",
      },
      {
        title: "Termination & Notice",
        content:
          "Either party may terminate this agreement with two weeks' written notice. The Company reserves the right to terminate employment immediately for cause, including but not limited to: violation of company policies, dishonesty, or unsatisfactory performance.",
      },
      {
        title: "Dispute Resolution",
        content:
          "Any disputes arising from this agreement shall first be addressed through mediation. If mediation is unsuccessful, disputes shall be resolved through binding arbitration in San Francisco, California, in accordance with the rules of the American Arbitration Association.",
      },
    ],
  }
}
