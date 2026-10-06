"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Icons } from "@/components/icons"

interface RecruiterFiltersProps {
  filters: {
    skills: string[]
    universities: string[]
    graduationYears: number[]
    locations: string[]
    roles: string[]
    searchQuery: string
    availability: string
  }
  onFilterChange: (filters: any) => void
  availableSkills: string[]
  universities: string[]
  graduationYears: number[]
  locations: string[]
  roles: string[]
}

export function RecruiterFilters({
  filters,
  onFilterChange,
  availableSkills,
  universities,
  graduationYears,
  locations,
  roles,
}: RecruiterFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.searchQuery)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilterChange({ searchQuery: searchInput })
  }

  const handleSkillToggle = (skill: string) => {
    const updatedSkills = filters.skills.includes(skill)
      ? filters.skills.filter((s) => s !== skill)
      : [...filters.skills, skill]

    onFilterChange({ skills: updatedSkills })
  }

  const handleUniversityToggle = (university: string) => {
    const updatedUniversities = filters.universities.includes(university)
      ? filters.universities.filter((u) => u !== university)
      : [...filters.universities, university]

    onFilterChange({ universities: updatedUniversities })
  }

  const handleGraduationYearToggle = (year: number) => {
    const updatedYears = filters.graduationYears.includes(year)
      ? filters.graduationYears.filter((y) => y !== year)
      : [...filters.graduationYears, year]

    onFilterChange({ graduationYears: updatedYears })
  }

  const handleLocationToggle = (location: string) => {
    const updatedLocations = filters.locations.includes(location)
      ? filters.locations.filter((l) => l !== location)
      : [...filters.locations, location]

    onFilterChange({ locations: updatedLocations })
  }

  const handleRoleToggle = (role: string) => {
    const updatedRoles = filters.roles.includes(role)
      ? filters.roles.filter((r) => r !== role)
      : [...filters.roles, role]

    onFilterChange({ roles: updatedRoles })
  }

  const handleAvailabilityChange = (value: string) => {
    onFilterChange({ availability: value })
  }

  const handleClearFilters = () => {
    setSearchInput("")
    onFilterChange({
      skills: [],
      universities: [],
      graduationYears: [],
      locations: [],
      roles: [],
      searchQuery: "",
      availability: "all",
    })
  }

  const hasActiveFilters = () => {
    return (
      filters.skills.length > 0 ||
      filters.universities.length > 0 ||
      filters.graduationYears.length > 0 ||
      filters.locations.length > 0 ||
      filters.roles.length > 0 ||
      filters.searchQuery !== "" ||
      filters.availability !== "all"
    )
  }

  return (
    <div className="rounded-lg border border-amber-100 bg-white p-4 shadow-sm dark:border-amber-800/30 dark:bg-black/20">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-300">Filters</h2>
        {hasActiveFilters() && (
          <Button
            variant="link"
            onClick={handleClearFilters}
            className="mt-1 h-auto p-0 text-amber-600 dark:text-amber-400"
          >
            Clear all filters
          </Button>
        )}
      </div>

      <form onSubmit={handleSearchSubmit} className="mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search by name, skill, or university..."
            value={searchInput}
            onChange={handleSearchChange}
            className="border-amber-200 pr-10 dark:border-amber-800/50"
          />
          <Button
            type="submit"
            size="sm"
            variant="ghost"
            className="absolute right-0 top-0 h-full px-3 text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
          >
            <Icons.search className="h-4 w-4" />
          </Button>
        </div>
      </form>

      <Accordion type="multiple" defaultValue={["availability", "skills"]}>
        <AccordionItem value="availability" className="border-amber-100 dark:border-amber-800/30">
          <AccordionTrigger className="text-amber-800 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-200">
            Availability
          </AccordionTrigger>
          <AccordionContent>
            <RadioGroup value={filters.availability} onValueChange={handleAvailabilityChange} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="all"
                  id="all"
                  className="border-amber-400 text-amber-600 dark:border-amber-700"
                />
                <Label htmlFor="all" className="text-amber-700 dark:text-amber-400">
                  All candidates
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="immediate"
                  id="immediate"
                  className="border-amber-400 text-amber-600 dark:border-amber-700"
                />
                <Label htmlFor="immediate" className="text-amber-700 dark:text-amber-400">
                  Immediately available
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="internship"
                  id="internship"
                  className="border-amber-400 text-amber-600 dark:border-amber-700"
                />
                <Label htmlFor="internship" className="text-amber-700 dark:text-amber-400">
                  Available for internships
                </Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="skills" className="border-amber-100 dark:border-amber-800/30">
          <AccordionTrigger className="text-amber-800 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-200">
            Skills
          </AccordionTrigger>
          <AccordionContent>
            <div className="max-h-48 space-y-2 overflow-y-auto pr-2">
              {availableSkills.slice(0, 15).map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={`skill-${skill}`}
                    checked={filters.skills.includes(skill)}
                    onCheckedChange={() => handleSkillToggle(skill)}
                    className="border-amber-400 text-amber-600 dark:border-amber-700"
                  />
                  <Label htmlFor={`skill-${skill}`} className="text-amber-700 dark:text-amber-400">
                    {skill}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="universities" className="border-amber-100 dark:border-amber-800/30">
          <AccordionTrigger className="text-amber-800 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-200">
            Universities
          </AccordionTrigger>
          <AccordionContent>
            <div className="max-h-48 space-y-2 overflow-y-auto pr-2">
              {universities.slice(0, 10).map((university) => (
                <div key={university} className="flex items-center space-x-2">
                  <Checkbox
                    id={`university-${university}`}
                    checked={filters.universities.includes(university)}
                    onCheckedChange={() => handleUniversityToggle(university)}
                    className="border-amber-400 text-amber-600 dark:border-amber-700"
                  />
                  <Label htmlFor={`university-${university}`} className="text-amber-700 dark:text-amber-400">
                    {university}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="graduationYears" className="border-amber-100 dark:border-amber-800/30">
          <AccordionTrigger className="text-amber-800 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-200">
            Graduation Year
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {graduationYears.map((year) => (
                <div key={year} className="flex items-center space-x-2">
                  <Checkbox
                    id={`year-${year}`}
                    checked={filters.graduationYears.includes(year)}
                    onCheckedChange={() => handleGraduationYearToggle(year)}
                    className="border-amber-400 text-amber-600 dark:border-amber-700"
                  />
                  <Label htmlFor={`year-${year}`} className="text-amber-700 dark:text-amber-400">
                    {year}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="locations" className="border-amber-100 dark:border-amber-800/30">
          <AccordionTrigger className="text-amber-800 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-200">
            Preferred Locations
          </AccordionTrigger>
          <AccordionContent>
            <div className="max-h-48 space-y-2 overflow-y-auto pr-2">
              {locations.map((location) => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={`location-${location}`}
                    checked={filters.locations.includes(location)}
                    onCheckedChange={() => handleLocationToggle(location)}
                    className="border-amber-400 text-amber-600 dark:border-amber-700"
                  />
                  <Label htmlFor={`location-${location}`} className="text-amber-700 dark:text-amber-400">
                    {location}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="roles" className="border-amber-100 dark:border-amber-800/30">
          <AccordionTrigger className="text-amber-800 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-200">
            Preferred Roles
          </AccordionTrigger>
          <AccordionContent>
            <div className="max-h-48 space-y-2 overflow-y-auto pr-2">
              {roles.map((role) => (
                <div key={role} className="flex items-center space-x-2">
                  <Checkbox
                    id={`role-${role}`}
                    checked={filters.roles.includes(role)}
                    onCheckedChange={() => handleRoleToggle(role)}
                    className="border-amber-400 text-amber-600 dark:border-amber-700"
                  />
                  <Label htmlFor={`role-${role}`} className="text-amber-700 dark:text-amber-400">
                    {role}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
