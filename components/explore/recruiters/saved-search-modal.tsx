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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">Save Current Search</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="search-name" className="text-primary">
                Search Name
              </Label>
              <Input
                id="search-name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="e.g., Frontend Developers 2024"
                className="border-border"
                required
              />
            </div>

            <div className="rounded-lg border border-border bg-primary/5 p-3">
              <h3 className="text-sm font-medium text-foreground">Current Filters ({getActiveFilterCount()})</h3>

              <div className="mt-2 space-y-2">
                {currentFilters.searchQuery && (
                  <div>
                    <span className="text-xs text-primary">Search Query:</span>
                    <Badge className="ml-2 bg-primary/10 text-primary">{currentFilters.searchQuery}</Badge>
                  </div>
                )}

                {currentFilters.skills.length > 0 && (
                  <div>
                    <span className="text-xs text-primary">Skills:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {currentFilters.skills.map((skill: string) => (
                        <Badge key={skill} className="bg-primary/10 text-primary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {currentFilters.universities.length > 0 && (
                  <div>
                    <span className="text-xs text-primary">Universities:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {currentFilters.universities.map((university: string) => (
                        <Badge key={university} className="bg-primary/10 text-primary">
                          {university}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {currentFilters.graduationYears.length > 0 && (
                  <div>
                    <span className="text-xs text-primary">Graduation Years:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {currentFilters.graduationYears.map((year: number) => (
                        <Badge key={year} className="bg-primary/10 text-primary">
                          {year}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {currentFilters.locations.length > 0 && (
                  <div>
                    <span className="text-xs text-primary">Locations:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {currentFilters.locations.map((location: string) => (
                        <Badge key={location} className="bg-primary/10 text-primary">
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {currentFilters.roles.length > 0 && (
                  <div>
                    <span className="text-xs text-primary">Roles:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {currentFilters.roles.map((role: string) => (
                        <Badge key={role} className="bg-primary/10 text-primary">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {currentFilters.availability !== "all" && (
                  <div>
                    <span className="text-xs text-primary">Availability:</span>
                    <Badge className="ml-2 bg-primary/10 text-primary">
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
              className="border-border text-primary hover:bg-primary/5 hover:text-primary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !searchName}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
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
