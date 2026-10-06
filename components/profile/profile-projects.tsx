"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

interface Project {
  title: string
  description: string
  technologies: string[]
  links: {
    github?: string
    demo?: string
  }
  role: string
  contributions: string
  ratings: number
  reviews: number
  image: string
}

interface ProfileProjectsProps {
  projects: Project[]
  onUpdate?: (projects: Project[]) => void
  viewAll?: boolean
  onViewAllClick?: () => void
  isEditable?: boolean
}

export function ProfileProjects({
  projects,
  onUpdate,
  viewAll = false,
  onViewAllClick,
  isEditable = false,
}: ProfileProjectsProps) {
  // Ensure projects is always an array
  const projectsArray = Array.isArray(projects) ? projects : []

  const [isAddingProject, setIsAddingProject] = useState(false)
  const [newProject, setNewProject] = useState<Project>({
    title: "",
    description: "",
    technologies: [],
    links: {},
    role: "",
    contributions: "",
    ratings: 0,
    reviews: 0,
    image: "/placeholder.svg?height=300&width=500",
  })
  const [newTechnology, setNewTechnology] = useState("")
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  const [isEditingProject, setIsEditingProject] = useState<string | null>(null)
  const [editedProject, setEditedProject] = useState<Project | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const projectsEndRef = useRef<HTMLDivElement>(null)

  // Use projectsArray instead of projects directly
  const displayedProjects = viewAll ? projectsArray : projectsArray.slice(0, 1)

  // Scroll to the newly added project
  useEffect(() => {
    if (projectsEndRef.current) {
      projectsEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [projects.length])

  // Handle adding a new project
  const handleAddProject = () => {
    if (newProject.title.trim() === "") {
      toast({
        title: "Error",
        description: "Project title is required",
        variant: "destructive",
      })
      return
    }

    // Make a deep copy of the current projects array
    const updatedProjects = [...projects]

    // Add the new project with all its details
    updatedProjects.push({
      ...newProject,
      // Ensure technologies is an array
      technologies: [...newProject.technologies],
      // Ensure links is an object
      links: { ...newProject.links },
      // Set default values for ratings and reviews if not provided
      ratings: newProject.ratings || 0,
      reviews: newProject.reviews || 0,
      // Set a default image if not provided
      image: newProject.image || "/placeholder.svg?height=300&width=500",
    })

    // Update the projects state
    onUpdate?.(updatedProjects)

    // Reset the form
    setNewProject({
      title: "",
      description: "",
      technologies: [],
      links: {},
      role: "",
      contributions: "",
      ratings: 0,
      reviews: 0,
      image: "/placeholder.svg?height=300&width=500",
    })

    setIsAddingProject(false)
    setNewTechnology("")

    // Show success toast
    toast({
      title: "Project added",
      description: `Your project has been added successfully.`,
      variant: "default",
    })

    // Set current index to show the newly added project
    if (!viewAll && updatedProjects.length > 0) {
      setCurrentIndex(Math.min(2, updatedProjects.length - 1))
    }
  }

  // Handle adding a technology to a project
  const handleAddTechnology = () => {
    if (newTechnology.trim() === "") return

    // Create a new array with the existing technologies plus the new one
    const updatedTechnologies = [...newProject.technologies, newTechnology.trim()]

    // Update the newProject state with the updated technologies array
    setNewProject({
      ...newProject,
      technologies: updatedTechnologies,
    })

    // Clear the input field
    setNewTechnology("")
  }

  // Handle deleting a project
  const handleDeleteProject = (projectTitle: string) => {
    const updatedProjects = projects.filter((project) => project.title !== projectTitle)
    onUpdate?.(updatedProjects)
    setProjectToDelete(null)

    // Adjust current index if needed
    if (currentIndex >= updatedProjects.length && currentIndex > 0) {
      setCurrentIndex(updatedProjects.length - 1)
    }

    toast({
      title: "Project deleted",
      description: `${projectTitle} has been removed from your projects.`,
      variant: "default",
    })
  }

  // Handle removing a technology from a project
  const handleRemoveTechnology = (tech: string) => {
    setNewProject({
      ...newProject,
      technologies: newProject.technologies.filter((t) => t !== tech),
    })
  }

  // Start editing a project
  const startEditingProject = (project: Project) => {
    setIsEditingProject(project.title)
    setEditedProject({ ...project })
  }

  // Handle saving edited project
  const handleEditProject = () => {
    if (!editedProject || !isEditingProject) return

    const updatedProjects = projects.map((project) => (project.title === isEditingProject ? editedProject : project))

    onUpdate?.(updatedProjects)
    setIsEditingProject(null)
    setEditedProject(null)

    toast({
      title: "Project updated",
      description: `${editedProject.title} has been updated successfully.`,
      variant: "default",
    })
  }

  // Handle changes to edited project fields
  const handleEditedProjectChange = (field: string, value: any) => {
    if (!editedProject) return

    setEditedProject({
      ...editedProject,
      [field]: value,
    })
  }

  // Handle changes to edited project links
  const handleEditedProjectLinkChange = (field: string, value: string) => {
    if (!editedProject) return

    setEditedProject({
      ...editedProject,
      links: {
        ...editedProject.links,
        [field]: value,
      },
    })
  }

  // Handle adding a technology to an edited project
  const handleEditedTechnologyAdd = () => {
    if (!editedProject || !newTechnology.trim()) return

    setEditedProject({
      ...editedProject,
      technologies: [...editedProject.technologies, newTechnology.trim()],
    })
    setNewTechnology("")
  }

  // Handle removing a technology from an edited project
  const handleEditedTechnologyRemove = (tech: string) => {
    if (!editedProject) return

    setEditedProject({
      ...editedProject,
      technologies: editedProject.technologies.filter((t) => t !== tech),
    })
  }

  // Handle next project in carousel
  const handleNextProject = () => {
    if (currentIndex < displayedProjects.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(0) // Loop back to the first project
    }
  }

  // Handle previous project in carousel
  const handlePrevProject = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else {
      setCurrentIndex(displayedProjects.length - 1) // Loop to the last project
    }
  }

  return (
    <Card className="overflow-hidden border-violet-100 shadow-md dark:border-violet-800/30">
      <CardHeader className="bg-gradient-to-r from-violet-100/50 to-violet-50/50 dark:from-violet-900/20 dark:to-violet-800/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icons.briefcase className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <CardTitle>Projects</CardTitle>
          </div>
          {isEditable && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="bg-gradient-to-r from-violet-600 to-amber-600 text-white hover:from-violet-700 hover:to-amber-700"
                  size="sm"
                  aria-label="Add Project"
                >
                  <Icons.plus className="mr-1 h-4 w-4" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Project</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="projectTitle">Project Title</Label>
                    <Input
                      id="projectTitle"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      placeholder="e.g., E-commerce Platform, AI Assistant"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="projectDescription">Description</Label>
                    <Textarea
                      id="projectDescription"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      placeholder="Describe your project, its purpose, and key features..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Technologies Used</Label>
                    <div className="flex flex-wrap gap-2">
                      {newProject.technologies.map((tech) => (
                        <Badge
                          key={tech}
                          className="flex items-center gap-1 bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300"
                        >
                          {tech}
                          <button
                            onClick={() => handleRemoveTechnology(tech)}
                            className="ml-1 rounded-full hover:text-red-500"
                          >
                            <Icons.x className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newTechnology}
                        onChange={(e) => setNewTechnology(e.target.value)}
                        placeholder="e.g., React, Node.js, Python"
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddTechnology()
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddTechnology} variant="outline">
                        Add
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="projectRole">Your Role</Label>
                    <Input
                      id="projectRole"
                      value={newProject.role}
                      onChange={(e) => setNewProject({ ...newProject, role: e.target.value })}
                      placeholder="e.g., Lead Developer, UI Designer"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="projectContributions">Your Contributions</Label>
                    <Textarea
                      id="projectContributions"
                      value={newProject.contributions}
                      onChange={(e) => setNewProject({ ...newProject, contributions: e.target.value })}
                      placeholder="Describe your specific contributions to the project..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="githubLink">GitHub Link</Label>
                      <Input
                        id="githubLink"
                        value={newProject.links.github || ""}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            links: { ...newProject.links, github: e.target.value },
                          })
                        }
                        placeholder="https://github.com/username/repo"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="demoLink">Demo Link</Label>
                      <Input
                        id="demoLink"
                        value={newProject.links.demo || ""}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            links: { ...newProject.links, demo: e.target.value },
                          })
                        }
                        placeholder="https://demo-site.com"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleAddProject}>Add Project</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <CardDescription>Showcase your work and accomplishments</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-violet-200 bg-violet-50/50 p-8 text-center dark:border-violet-800/30 dark:bg-violet-900/10">
            <Icons.briefcase className="mb-2 h-10 w-10 text-violet-400 dark:text-violet-500" />
            <h3 className="mb-1 text-lg font-medium text-violet-900 dark:text-white">No projects yet</h3>
            <p className="mb-4 text-sm text-violet-700 dark:text-violet-300">
              Showcase your work by adding your first project
            </p>
            {/* <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="bg-gradient-to-r from-violet-600 to-amber-600 text-white hover:from-violet-700 hover:to-amber-700"
                  size="sm"
                >
                  <Icons.plus className="mr-1 h-4 w-4" />
                  Add Project
                </Button>
              </DialogTrigger>
            </Dialog> */}
          </div>
        ) : viewAll ? (
          <div className="grid gap-6 md:grid-cols-2">
            <AnimatePresence>
              {displayedProjects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-xl border border-violet-100 bg-white shadow-md transition-all hover:shadow-lg hover:-translate-y-1 dark:border-violet-800/30 dark:bg-zinc-900/80"
                >
                  <div className="absolute right-2 top-2 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white/80 text-violet-600 backdrop-blur-sm hover:bg-white hover:text-violet-700 dark:bg-zinc-900/80 dark:text-violet-400 dark:hover:bg-zinc-800/80 dark:hover:text-violet-300"
                      onClick={() => startEditingProject(project)}
                    >
                      <Icons.edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white/80 text-red-600 backdrop-blur-sm hover:bg-white hover:text-red-700 dark:bg-zinc-900/80 dark:text-red-400 dark:hover:bg-zinc-800/80 dark:hover:text-red-300"
                      onClick={() => setProjectToDelete(project.title)}
                    >
                      <Icons.trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>

                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={project.image || "/placeholder.svg?height=300&width=500"}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white">{project.title}</h3>
                      <p className="text-sm text-white/80">{project.role}</p>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {project.technologies &&
                        project.technologies.map((tech) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className="bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                          >
                            {tech}
                          </Badge>
                        ))}
                    </div>

                    <p className="mb-4 text-sm text-violet-800 dark:text-violet-200">
                      {project.description && project.description.length > 150
                        ? `${project.description.substring(0, 150)}...`
                        : project.description}
                    </p>

                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Icons.star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(project.ratings) ? "fill-current" : "fill-none"}`}
                          />
                        ))}
                        <span className="ml-1 text-xs text-violet-700 dark:text-violet-300">({project.reviews})</span>
                      </div>

                      <div className="flex gap-2">
                        {project.links && project.links.github && (
                          <a
                            href={project.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-violet-100 p-1.5 text-violet-800 transition-colors hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:hover:bg-violet-800/40"
                          >
                            <Icons.github className="h-4 w-4" />
                            <span className="sr-only">GitHub</span>
                          </a>
                        )}
                        {project.links && project.links.demo && (
                          <a
                            href={project.links.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-violet-100 p-1.5 text-violet-800 transition-colors hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:hover:bg-violet-800/40"
                          >
                            <Icons.globe className="h-4 w-4" />
                            <span className="sr-only">Demo</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="link"
                      className="p-0 text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                    >
                      View Details
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={projectsEndRef} />
          </div>
        ) : (
          <>
            {displayedProjects.length > 0 ? (
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="group relative overflow-hidden rounded-xl border border-violet-100 bg-white shadow-md transition-all hover:shadow-lg dark:border-violet-800/30 dark:bg-zinc-900/80"
                  >
                    <div className="absolute right-2 top-2 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/80 text-violet-600 backdrop-blur-sm hover:bg-white hover:text-violet-700 dark:bg-zinc-900/80 dark:text-violet-400 dark:hover:bg-zinc-800/80 dark:hover:text-violet-300"
                        onClick={() => startEditingProject(displayedProjects[currentIndex])}
                      >
                        <Icons.edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/80 text-red-600 backdrop-blur-sm hover:bg-white hover:text-red-700 dark:bg-zinc-900/80 dark:text-red-400 dark:hover:bg-zinc-800/80 dark:hover:text-red-300"
                        onClick={() => setProjectToDelete(displayedProjects[currentIndex].title)}
                      >
                        <Icons.trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>

                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={displayedProjects[currentIndex].image || "/placeholder.svg?height=300&width=500"}
                        alt={displayedProjects[currentIndex].title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white">{displayedProjects[currentIndex].title}</h3>
                        <p className="text-sm text-white/80">{displayedProjects[currentIndex].role}</p>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="mb-3 flex flex-wrap gap-2">
                        {displayedProjects[currentIndex].technologies &&
                          displayedProjects[currentIndex].technologies.map((tech) => (
                            <Badge
                              key={tech}
                              variant="outline"
                              className="bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                            >
                              {tech}
                            </Badge>
                          ))}
                      </div>

                      <p className="mb-4 text-sm text-violet-800 dark:text-violet-200">
                        {displayedProjects[currentIndex].description &&
                        displayedProjects[currentIndex].description.length > 150
                          ? `${displayedProjects[currentIndex].description.substring(0, 150)}...`
                          : displayedProjects[currentIndex].description}
                      </p>

                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Icons.star
                              key={i}
                              className={`h-4 w-4 ${i < Math.floor(displayedProjects[currentIndex].ratings) ? "fill-current" : "fill-none"}`}
                            />
                          ))}
                          <span className="ml-1 text-xs text-violet-700 dark:text-violet-300">
                            ({displayedProjects[currentIndex].reviews})
                          </span>
                        </div>

                        <div className="flex gap-2">
                          {displayedProjects[currentIndex].links && displayedProjects[currentIndex].links.github && (
                            <a
                              href={displayedProjects[currentIndex].links.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full bg-violet-100 p-1.5 text-violet-800 transition-colors hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:hover:bg-violet-800/40"
                            >
                              <Icons.github className="h-4 w-4" />
                              <span className="sr-only">GitHub</span>
                            </a>
                          )}
                          {displayedProjects[currentIndex].links && displayedProjects[currentIndex].links.demo && (
                            <a
                              href={displayedProjects[currentIndex].links.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full bg-violet-100 p-1.5 text-violet-800 transition-colors hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:hover:bg-violet-800/40"
                            >
                              <Icons.globe className="h-4 w-4" />
                              <span className="sr-only">Demo</span>
                            </a>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="link"
                        className="p-0 text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                      >
                        View Details
                      </Button>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation buttons */}
                <div className="absolute left-0 right-0 top-1/2 flex -translate-y-1/2 justify-between px-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevProject}
                    className="h-8 w-8 rounded-full bg-white/80 text-violet-600 shadow-md backdrop-blur-sm hover:bg-white hover:text-violet-700 dark:bg-zinc-900/80 dark:text-violet-400 dark:hover:bg-zinc-800/80 dark:hover:text-violet-300"
                  >
                    <Icons.chevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNextProject}
                    className="h-8 w-8 rounded-full bg-white/80 text-violet-600 shadow-md backdrop-blur-sm hover:bg-white hover:text-violet-700 dark:bg-zinc-900/80 dark:text-violet-400 dark:hover:bg-zinc-800/80 dark:hover:text-violet-300"
                  >
                    <Icons.chevronRight className="h-4 w-4" />
                    <span className="sr-only">Next</span>
                  </Button>
                </div>

                {/* Pagination indicators */}
                <div className="mt-4 flex justify-center gap-2">
                  {displayedProjects.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index === currentIndex
                          ? "w-6 bg-violet-600 dark:bg-violet-500"
                          : "w-2 bg-violet-200 dark:bg-violet-800"
                      }`}
                      onClick={() => setCurrentIndex(index)}
                      aria-label={`Go to project ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-violet-200 bg-violet-50/50 p-8 text-center dark:border-violet-800/30 dark:bg-violet-900/10">
                <Icons.briefcase className="mb-2 h-10 w-10 text-violet-400 dark:text-violet-500" />
                <h3 className="mb-1 text-lg font-medium text-violet-900 dark:text-white">No projects yet</h3>
                <p className="mb-4 text-sm text-violet-700 dark:text-violet-300">
                  Showcase your work by adding your first project
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-gradient-to-r from-violet-600 to-amber-600 text-white hover:from-violet-700 hover:to-amber-700"
                      size="sm"
                    >
                      <Icons.plus className="mr-1 h-4 w-4" />
                      Add Project
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            )}
          </>
        )}

        {!viewAll && projects.length > 3 && (
          <div className="mt-4 text-center">
            <Button
              variant="link"
              className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
              onClick={onViewAllClick}
            >
              View all {projects.length} projects
            </Button>
          </div>
        )}

        {/* Edit Project Dialog */}
        <Dialog open={isEditingProject !== null} onOpenChange={(open) => !open && setIsEditingProject(null)}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>
            {editedProject && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="editProjectTitle">Project Title</Label>
                  <Input
                    id="editProjectTitle"
                    value={editedProject.title}
                    onChange={(e) => handleEditedProjectChange("title", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editProjectDescription">Description</Label>
                  <Textarea
                    id="editProjectDescription"
                    value={editedProject.description}
                    onChange={(e) => handleEditedProjectChange("description", e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Technologies Used</Label>
                  <div className="flex flex-wrap gap-2">
                    {editedProject.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        className="flex items-center gap-1 bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300"
                      >
                        {tech}
                        <button
                          onClick={() => handleEditedTechnologyRemove(tech)}
                          className="ml-1 rounded-full hover:text-red-500"
                        >
                          <Icons.x className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTechnology}
                      onChange={(e) => setNewTechnology(e.target.value)}
                      placeholder="e.g., React, Node.js, Python"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleEditedTechnologyAdd()
                        }
                      }}
                    />
                    <Button type="button" onClick={handleEditedTechnologyAdd} variant="outline">
                      Add
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editProjectRole">Your Role</Label>
                  <Input
                    id="editProjectRole"
                    value={editedProject.role}
                    onChange={(e) => handleEditedProjectChange("role", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editProjectContributions">Your Contributions</Label>
                  <Textarea
                    id="editProjectContributions"
                    value={editedProject.contributions}
                    onChange={(e) => handleEditedProjectChange("contributions", e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="editGithubLink">GitHub Link</Label>
                    <Input
                      id="editGithubLink"
                      value={editedProject.links.github || ""}
                      onChange={(e) => handleEditedProjectLinkChange("github", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="editDemoLink">Demo Link</Label>
                    <Input
                      id="editDemoLink"
                      value={editedProject.links.demo || ""}
                      onChange={(e) => handleEditedProjectLinkChange("demo", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <Button onClick={handleEditProject}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={projectToDelete !== null} onOpenChange={(open) => !open && setProjectToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Project</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Are you sure you want to delete this project? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setProjectToDelete(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => projectToDelete && handleDeleteProject(projectToDelete)}>
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
