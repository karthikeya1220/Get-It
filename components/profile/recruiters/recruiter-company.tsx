"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RecruiterCompanyProps {
  recruiter: any
  isEditable?: boolean
  onUpdate?: (section: string, data: any) => void
}

export function RecruiterCompany({ recruiter, isEditable = false, onUpdate }: RecruiterCompanyProps) {
  const [isEditCompanyOpen, setIsEditCompanyOpen] = useState(false)
  const [isEditCultureOpen, setIsEditCultureOpen] = useState(false)

  const [editedCompanyData, setEditedCompanyData] = useState({
    companyName: recruiter.companyName || "",
    industry: recruiter.industry || "",
    companySize: recruiter.companySize || "",
    companyLocation: recruiter.companyLocation || "",
    companyWebsite: recruiter.companyWebsite || "",
    companyDescription: recruiter.companyDescription || "",
  })

  const [editedCultureData, setEditedCultureData] = useState({
    companyValues: recruiter.companyValues || [],
    workEnvironment: recruiter.workEnvironment || "",
    teamStructure: recruiter.teamStructure || "",
    benefits: recruiter.benefits || [],
  })

  const [newValue, setNewValue] = useState("")
  const [newBenefit, setNewBenefit] = useState("")

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const getIndustryLabel = (industry: string) => {
    const industryMap: Record<string, string> = {
      technology: "Technology",
      finance: "Finance & Banking",
      healthcare: "Healthcare",
      education: "Education",
      retail: "Retail & E-commerce",
      manufacturing: "Manufacturing",
      media: "Media & Entertainment",
      consulting: "Consulting",
      nonprofit: "Nonprofit",
      other: "Other",
    }

    return industryMap[industry] || industry
  }

  const handleCompanyDataChange = (field: string, value: string) => {
    setEditedCompanyData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCultureDataChange = (field: string, value: string) => {
    setEditedCultureData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddValue = () => {
    if (!newValue.trim()) return
    setEditedCultureData((prev) => ({
      ...prev,
      companyValues: [...prev.companyValues, newValue.trim()],
    }))
    setNewValue("")
  }

  const handleRemoveValue = (index: number) => {
    const updated = [...editedCultureData.companyValues]
    updated.splice(index, 1)
    setEditedCultureData((prev) => ({
      ...prev,
      companyValues: updated,
    }))
  }

  const handleAddBenefit = () => {
    if (!newBenefit.trim()) return
    setEditedCultureData((prev) => ({
      ...prev,
      benefits: [...prev.benefits, newBenefit.trim()],
    }))
    setNewBenefit("")
  }

  const handleRemoveBenefit = (index: number) => {
    const updated = [...editedCultureData.benefits]
    updated.splice(index, 1)
    setEditedCultureData((prev) => ({
      ...prev,
      benefits: updated,
    }))
  }

  const handleSaveCompany = () => {
    if (!onUpdate) return
    onUpdate("", editedCompanyData)
    setIsEditCompanyOpen(false)
  }

  const handleSaveCulture = () => {
    if (!onUpdate) return
    onUpdate("", editedCultureData)
    setIsEditCultureOpen(false)
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="space-y-6"
    >
      <motion.div variants={fadeIn}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Company Overview</CardTitle>
              <CardDescription>Information about {recruiter.companyName}</CardDescription>
            </div>

            {isEditable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditCompanyOpen(true)}
                className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
              >
                <Icons.edit className="h-4 w-4" />
                <span className="ml-1">Edit</span>
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Company Name</p>
                <p className="font-medium">{recruiter.companyName}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Industry</p>
                <p className="font-medium">{getIndustryLabel(recruiter.industry)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Company Size</p>
                <p className="font-medium">{recruiter.companySize} employees</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Location</p>
                <div className="flex items-center gap-2">
                  <Icons.mapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{recruiter.companyLocation}</p>
                </div>
              </div>

              {recruiter.companyWebsite && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Website</p>
                  <div className="flex items-center gap-2">
                    <Icons.globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={recruiter.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-amber-600 transition-colors"
                    >
                      {recruiter.companyWebsite.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {recruiter.companyDescription && (
              <div className="pt-4 border-t">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Company Description</p>
                  <p className="text-sm leading-relaxed">{recruiter.companyDescription}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeIn}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Company Culture</CardTitle>
              <CardDescription>Values, work environment, and team structure</CardDescription>
            </div>

            {isEditable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditCultureOpen(true)}
                className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
              >
                <Icons.edit className="h-4 w-4" />
                <span className="ml-1">Edit</span>
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Company Values</h3>
                {recruiter.companyValues && recruiter.companyValues.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {recruiter.companyValues.map((value: string, index: number) => (
                      <Badge
                        key={index}
                        className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                      >
                        {value}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No company values provided</p>
                )}
              </div>

              {recruiter.workEnvironment && (
                <div>
                  <h3 className="font-medium mb-2">Work Environment</h3>
                  <p className="text-sm leading-relaxed">{recruiter.workEnvironment}</p>
                </div>
              )}

              {recruiter.teamStructure && (
                <div>
                  <h3 className="font-medium mb-2">Team Structure</h3>
                  <p className="text-sm leading-relaxed">{recruiter.teamStructure}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Benefits & Perks</h3>
              {recruiter.benefits && recruiter.benefits.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {recruiter.benefits.map((benefit: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Icons.check className="h-4 w-4 text-amber-600" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No benefits provided</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Company Dialog */}
      {isEditable && (
        <Dialog open={isEditCompanyOpen} onOpenChange={setIsEditCompanyOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Company Information</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={editedCompanyData.companyName}
                  onChange={(e) => handleCompanyDataChange("companyName", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={editedCompanyData.industry}
                  onValueChange={(value) => handleCompanyDataChange("industry", value)}
                >
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance & Banking</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="retail">Retail & E-commerce</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="media">Media & Entertainment</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="nonprofit">Nonprofit</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="companySize">Company Size</Label>
                <Select
                  value={editedCompanyData.companySize}
                  onValueChange={(value) => handleCompanyDataChange("companySize", value)}
                >
                  <SelectTrigger id="companySize">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="501-1000">501-1000 employees</SelectItem>
                    <SelectItem value="1001-5000">1001-5000 employees</SelectItem>
                    <SelectItem value="5001+">5001+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="companyLocation">Location</Label>
                <Input
                  id="companyLocation"
                  value={editedCompanyData.companyLocation}
                  onChange={(e) => handleCompanyDataChange("companyLocation", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="companyWebsite">Website</Label>
                <Input
                  id="companyWebsite"
                  value={editedCompanyData.companyWebsite}
                  onChange={(e) => handleCompanyDataChange("companyWebsite", e.target.value)}
                  placeholder="https://"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="companyDescription">Company Description</Label>
                <Textarea
                  id="companyDescription"
                  value={editedCompanyData.companyDescription}
                  onChange={(e) => handleCompanyDataChange("companyDescription", e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditCompanyOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCompany}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Culture Dialog */}
      {isEditable && (
        <Dialog open={isEditCultureOpen} onOpenChange={setIsEditCultureOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Company Culture</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="companyValues">Company Values</Label>
                <div className="flex gap-2">
                  <Input
                    id="companyValues"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="Add a value"
                  />
                  <Button onClick={handleAddValue}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editedCultureData.companyValues.map((value: string, index: number) => (
                    <Badge
                      key={index}
                      className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                    >
                      {value}
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleRemoveValue(index)}
                        className="ml-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Icons.x className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="workEnvironment">Work Environment</Label>
                <Textarea
                  id="workEnvironment"
                  value={editedCultureData.workEnvironment}
                  onChange={(e) => handleCultureDataChange("workEnvironment", e.target.value)}
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="teamStructure">Team Structure</Label>
                <Textarea
                  id="teamStructure"
                  value={editedCultureData.teamStructure}
                  onChange={(e) => handleCultureDataChange("teamStructure", e.target.value)}
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="benefits">Benefits & Perks</Label>
                <div className="flex gap-2">
                  <Input
                    id="benefits"
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    placeholder="Add a benefit"
                  />
                  <Button onClick={handleAddBenefit}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editedCultureData.benefits.map((benefit: string, index: number) => (
                    <Badge
                      key={index}
                      className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                    >
                      {benefit}
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleRemoveBenefit(index)}
                        className="ml-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Icons.x className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditCultureOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCulture}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  )
}
