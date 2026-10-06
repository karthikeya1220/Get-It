"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"

interface SavedSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (searchName: string) => void
  currentFilters: any
}

export function SavedSearchModal({ isOpen, onClose, onSave, currentFilters }: SavedSearchModalProps) {
  const [searchName, setSearchName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      onSave(searchName)
      setIsSubmitting(false)
      setSearchName("")
    }, 1000)
  }

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0
    if (currentFilters.skills.length > 0) count++
    if (currentFilters.universities.length > 0) count++
    if (currentFilters.graduationYears.length > 0) count++
    if (currentFilters.locations.length > 0) count++
    if (currentFilters.roles.length > 0) count++
    if (currentFilters.searchQuery) count++
    if (currentFilters.availability !== "all") count++
    return count
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md dark:bg-zinc-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-amber-900 dark:text-white">Save Current Search</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="search-name" className="text-amber-700 dark:text-amber-400">
                Search Name
              </Label>
              <Input
                id="search-name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="e.g., Frontend Developers 2024"
                className="border-amber-200 dark:border-amber-800/50"
                required
              />
            </div>

            <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-3 dark:border-amber-800/30 dark:bg-amber-900/10">
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Current Filters ({getActiveFilterCount()})
              </h3>

              <div className="mt-2 space-y-2">
                {currentFilters.searchQuery && (
                  <div>
                    <span className="text-xs text-amber-600 dark:text-amber-500">Search Query:</span>
                    <Badge className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                      {currentFilters.searchQuery}
                    </Badge>
                  </div>
                )}

                {currentFilters.skills.length > 0 && (
                  <div>
                    <span className="text-xs text-amber-600 dark:text-amber-500">Skills:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {currentFilters.skills.map((skill: string) => (
                        <Badge
                          key={skill}
                          className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {currentFilters.universities.length > 0 && (
                  <div>
                    <span className="text-xs text-amber-600 dark:text-amber-500">Universities:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {currentFilters.universities.map((university: string) => (
                        <Badge
                          key={university}
                          className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                        >
                          {university}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {currentFilters.graduationYears.length > 0 && (
                  <div>
                    <span className="text-xs text-amber-600 dark:text-amber-500">Graduation Years:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {currentFilters.graduationYears.map((year: number) => (
                        <Badge
                          key={year}
                          className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                        >
                          {year}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {currentFilters.locations.length > 0 && (
                  <div>
                    <span className="text-xs text-amber-600 dark:text-amber-500">Locations:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {currentFilters.locations.map((location: string) => (
                        <Badge
                          key={location}
                          className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                        >
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {currentFilters.roles.length > 0 && (
                  <div>
                    <span className="text-xs text-amber-600 dark:text-amber-500">Roles:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {currentFilters.roles.map((role: string) => (
                        <Badge
                          key={role}
                          className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {currentFilters.availability !== "all" && (
                  <div>
                    <span className="text-xs text-amber-600 dark:text-amber-500">Availability:</span>
                    <Badge className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                      {currentFilters.availability === "immediate"
                        ? "Immediately available"
                        : "Available for internships"}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/20 dark:hover:text-amber-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !searchName}
              className="bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-700 hover:to-amber-600"
            >
              {isSubmitting ? (
                <>
                  <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Icons.save className="mr-2 h-4 w-4" />
                  Save Search
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
