import { sanitizeUserData } from "@/lib/sanitize"
import { auth, db } from "@/firebase"
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  limit as firestoreLimit,
  startAfter,
  getDocs,
  orderBy,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
  DocumentData,
  addDoc,
} from "firebase/firestore"
import { ref, getDatabase, Database, get } from "firebase/database"
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"

export interface UserDetails {
  fullName: string
  Role: string
  email: string
  university: string
  degree: string
  year: string
  coursework?: string
  certifications?: string
  skills: { name: string; proficiency: string }[]
  interests: string[]
  portfolioLinks?: {
    github?: string
    linkedin?: string
    behance?: string
    dribbble?: string
  }
  experience?: string
  jobType: string
  preferences: {
    notifications: boolean
    updates: boolean
  }
  createdAt: Date
  updatedAt: Date
}

// Add this interface for student data
export interface StudentData extends UserDetails {
  id?: string
  matchScore?: number
}

// Add this interface for recruiter details
export interface RecruiterDetails {
  fullName: string
  Role: string
  email: string
  jobTitle: string
  phoneNumber: string
  companyName: string
  companyWebsite: string
  industry: string
  companySize: string
  companyDescription: string
  companyLocation: string
  hiringRoles: string[]
  skillsNeeded: { name: string; proficiency: string }[]
  hiringTimeline: string
  employmentTypes: string[]
  remoteOptions: string[]
  companyValues: string[]
  benefits: string[]
  workEnvironment: string
  teamStructure: string
  linkedinProfile: string
  howHeard: string
  marketingConsent: boolean
  termsAgreed: boolean
  createdAt: Date
  updatedAt: Date
}

// Add a job interface
export interface JobData {
  jobId?: string
  postedBy: string
  title: string
  description: string
  requirements: string[]
  payment: number
  currency: string
  status: "open" | "closed"
  applicants: string[]
  createdAt: Date
  updatedAt: Date
}

// Interface for student job application
export interface JobApplication {
  id?: string
  studentId: string
  jobId: string
  coverLetter: string
  phoneNumber: string
  availability: string
  portfolioLink?: string
  status: "pending" | "viewed" | "contacted" | "rejected"
  appliedAt: Date
  updatedAt: Date
}

// Interface for student saved jobs (can be added to StudentData)
export interface StudentJobPreferences {
  savedJobs: string[]
  appliedJobs: string[]
  recentSearches?: string[]
}

export async function registerRecruiterUser(email: string, password: string, userData: UserDetails) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const { user } = userCredential

    const userDoc = doc(db, `users/recruiter/${user.uid}/user_details`)
    await setDoc(userDoc, {
      ...sanitizeUserData(userData),
      Verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return { success: true, userId: user.uid }
  } catch (error: any) {
    let message = "An error occurred during registration"
    if (error.code === "auth/email-already-in-use") {
      message = "This email is already registered"
    }
    throw new Error(message)
  }
}
export async function registerStudentUser(email: string, password: string, userData: UserDetails) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const { user } = userCredential

    // Store the user data directly in the users collection
    const userDoc = doc(db, `users/student/${user.uid}/user_details`)
    await setDoc(userDoc, {
      ...sanitizeUserData(userData),
      Role: "student",
      Verified: false,
      savedJobs: [],
      appliedJobs: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return { success: true, userId: user.uid }
  } catch (error: any) {
    let message = "An error occurred during registration"
    if (error.code === "auth/email-already-in-use") {
      message = "This email is already registered"
    }
    throw new Error(message)
  }
}

export async function registerRecruiter(email: string, password: string, userData: RecruiterDetails) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const { user } = userCredential

    // Store the user data directly in the users collection - consistent with findOrCreateStudentDocument
    const userDoc = doc(db, `users/recruiter/${user.uid}/user_details`)
    await setDoc(userDoc, {
      ...sanitizeUserData(userData),
      Role: "recruiter",
      Verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return { success: true, userId: user.uid }
  } catch (error: any) {
    console.error("Error during recruiter registration:", error)
    let message = "An error occurred during registration"

    if (error.code === "auth/email-already-in-use") {
      message = "This email is already registered"
    } else if (error.code === "auth/invalid-email") {
      message = "Invalid email address"
    } else if (error.code === "auth/weak-password") {
      message = "Password is too weak"
    }

    throw new Error(message)
  }
}

// Function to create a new job
export async function createJob(jobData: JobData) {
  try {
    // Create a new document with auto-generated ID
    const jobsCollectionRef = collection(db, "jobs")
    const newJobRef = doc(jobsCollectionRef)

    // Add the jobId to the data
    const jobWithId = {
      ...jobData,
      jobId: newJobRef.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      applicants: [], // Initialize with empty applicants
    }

    // Set the document data
    await setDoc(newJobRef, jobWithId)

    return {
      success: true,
      jobId: newJobRef.id,
    }
  } catch (error) {
    console.error("Error creating job:", error)
    throw new Error("Failed to create job")
  }
}

// Function to get jobs posted by a recruiter
export async function getRecruiterJobs(recruiterId: string) {
  try {
    const jobsRef = collection(db, "jobs")
    const jobsQuery = query(jobsRef, where("postedBy", "==", recruiterId))

    const querySnapshot = await getDocs(jobsQuery)

    const jobs: JobData[] = querySnapshot.docs.map((doc): JobData => {
      const data = doc.data()
      return {
        ...data,
        jobId: doc.id,
        createdAt: data.createdAt?.toDate() ?? new Date(0),
        updatedAt: data.updatedAt?.toDate() ?? new Date(0),
      } as JobData
    })

    return jobs
  } catch (error) {
    console.error("Error fetching recruiter jobs:", error)
    throw new Error("Failed to fetch jobs")
  }
}

// Function to apply for a job
export async function applyForJob(jobId: string, userId: string) {
  try {
    const jobRef = doc(db, "jobs", jobId)
    const jobDoc = await getDoc(jobRef)

    if (!jobDoc.exists()) {
      throw new Error("Job not found")
    }

    const jobData = jobDoc.data()

    if (jobData.status === "closed") {
      throw new Error("This job is no longer accepting applications")
    }

    // Check if user already applied
    if (jobData.applicants.includes(userId)) {
      throw new Error("You have already applied for this job")
    }

    // Add user to applicants
    await setDoc(jobRef, {
      ...jobData,
      applicants: [...jobData.applicants, userId],
      updatedAt: new Date(),
    })

    return { success: true }
  } catch (error: any) {
    console.error("Error applying for job:", error)
    throw new Error(error.message || "Failed to apply for job")
  }
}

// Export the calculateMatchScore function
export function calculateMatchScore(data: any): number {
  let score = 0

  // Profile completeness (50 points)
  if (data.fullName) score += 10
  if (data.email) score += 5
  if (data.university) score += 5
  if (data.degree) score += 5
  if (data.skills?.length > 0) score += 10
  if (data.experience) score += 5
  if (data.portfolioLinks?.github || data.portfolioLinks?.linkedin) score += 5
  if (data.certifications) score += 5

  // Skills and interests (30 points)
  if (data.skills?.length >= 3) score += 15
  if (data.interests?.length >= 2) score += 15

  // Recent activity (20 points)
  if (data.updatedAt) {
    const daysSinceUpdate = (Date.now() - data.updatedAt.toDate().getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceUpdate < 7) score += 20
    else if (daysSinceUpdate < 30) score += 10
    else if (daysSinceUpdate < 90) score += 5
  }

  return score
}

// Function to get all students
export async function getAllStudents() {
  try {
    console.log("Fetching all students from the database")
    const students: any[] = []

    // Get all documents from the "users" collection where the path indicates they're students
    // First, get all user IDs from the users/student path
    const studentCollectionRef = collection(db, "users", "student")
    const studentCollectionSnapshot = await getDocs(studentCollectionRef)

    // If no student directory exists
    if (studentCollectionSnapshot.empty) {
      console.log("No student directory found in users collection")
      return []
    }

    // One fan-out per student, fired in parallel: N reads in a single wave
    // instead of N sequential round trips.
    const batches = await Promise.all(
      studentCollectionSnapshot.docs.map(async (studentDoc) => {
        const studentId = studentDoc.id
        const userDetailsRef = collection(db, "users", "student", studentId, "user_details")
        const userDetailsSnapshot = await getDocs(userDetailsRef)

        return userDetailsSnapshot.docs.map((detailDoc) => ({
          id: studentId,
          ...detailDoc.data(),
        }))
      }),
    )

    students.push(...batches.flat())

    if (students.length === 0) {
      console.log("No students found in the database")
    } else {
      console.log(`Found ${students.length} students`)
    }

    return students
  } catch (error) {
    console.error("Error getting students:", error)
    throw new Error("Failed to fetch students")
  }
}

// Function to get a specific job by ID
export async function getJobById(jobId: string) {
  try {
    const jobRef = doc(db, "jobs", jobId)
    const jobDoc = await getDoc(jobRef)

    if (!jobDoc.exists()) {
      return null
    }

    const data = jobDoc.data()
    return {
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as JobData
  } catch (error) {
    console.error("Error fetching job:", error)
    throw new Error("Failed to fetch job")
  }
}

// Function to update job status
export async function updateJobStatus(jobId: string, status: "open" | "closed") {
  try {
    const jobRef = doc(db, "jobs", jobId)

    await updateDoc(jobRef, {
      status,
      updatedAt: new Date(),
    })

    return { success: true }
  } catch (error) {
    console.error("Error updating job status:", error)
    throw new Error("Failed to update job status")
  }
}

// Function to update job details
export async function updateJob(jobId: string, jobData: JobData) {
  try {
    const jobRef = doc(db, "jobs", jobId)

    await updateDoc(jobRef, {
      ...jobData,
      updatedAt: new Date(),
    })

    return { success: true }
  } catch (error) {
    console.error("Error updating job:", error)
    throw new Error("Failed to update job")
  }
}

// Function to get multiple students by their IDs
export async function getStudentsByIds(studentIds: string[]) {
  try {
    if (!studentIds.length) return []

    console.log(`Fetching details for ${studentIds.length} student applicants`)

    // Lookups run concurrently; Promise.all keeps the input order and a single
    // failed student is skipped rather than failing the whole batch.
    const settled = await Promise.allSettled(
      studentIds.map(async (studentId) => {
        const studentDoc = await findOrCreateStudentDocument(studentId)
        if (!studentDoc?.data) {
          console.warn(`Student document found but data is invalid for ID: ${studentId}`)
          return null
        }

        const data = studentDoc.data
        return {
          ...data,
          id: studentId,
          fullName: data.fullName || "Unnamed Student",
          email: data.email || "",
          university: data.university || "",
          skills: data.skills || [],
          createdAt: data.createdAt instanceof Date ? data.createdAt : new Date(),
          updatedAt: data.updatedAt instanceof Date ? data.updatedAt : new Date(),
          matchScore: calculateMatchScore(data),
        } as StudentData
      }),
    )

    const students: StudentData[] = []
    for (const result of settled) {
      if (result.status === "rejected") {
        console.error("Error fetching student details:", result.reason)
      } else if (result.value) {
        students.push(result.value)
      }
    }

    console.log(`Successfully retrieved ${students.length} out of ${studentIds.length} students`)
    return students
  } catch (error) {
    console.error("Error fetching students by IDs:", error)
    throw new Error("Failed to fetch student information")
  }
}

// Function to get all available jobs
export async function getAllJobs(lastVisible: string | null = null, limit: number = 10) {
  try {
    const jobsRef = collection(db, "jobs")
    console.log("Fetching jobs with limit:", limit, "last visible:", jobsRef)
    let jobQuery

    if (lastVisible) {
      const lastDoc = await getDoc(doc(db, "jobs", lastVisible))
      if (lastDoc.exists()) {
        jobQuery = query(
          jobsRef,
          where("status", "==", "open"),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          firestoreLimit(limit),
        )
      } else {
        jobQuery = query(jobsRef, where("status", "==", "open"), orderBy("createdAt", "desc"), firestoreLimit(limit))
      }
    } else {
      jobQuery = query(jobsRef, where("status", "==", "open"), orderBy("createdAt", "desc"), firestoreLimit(limit))
    }

    const querySnapshot = await getDocs(jobQuery)

    const jobs = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        ...data,
        jobId: doc.id,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as JobData
    })

    return {
      jobs,
      lastVisible: querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1].id : null,
      hasMore: querySnapshot.docs.length === limit,
    }
  } catch (error) {
    console.error("Error fetching jobs:", error)
    throw new Error("Failed to fetch jobs")
  }
}

// Update the findOrCreateStudentDocument function to prioritize the users/student/{id}/user_details path
export async function findOrCreateStudentDocument(studentId: string) {
  // Primary path that should be used first
  const primaryPath = doc(db, "users", "student", studentId, "user_details")

  // Check the primary path first
  console.log(`Checking primary path for student ID: ${studentId} at ${primaryPath.path}`)

  try {
    const docSnapshot = await getDoc(primaryPath)

    if (docSnapshot.exists()) {
      console.log(`Found existing student document at ${primaryPath.path}`)

      // If document exists but doesn't have verified field, add it
      const data = docSnapshot.data()
      if (data && typeof data.verified === "undefined") {
        console.log("Document exists but doesn't have verified field, adding it as false")
        await updateDoc(primaryPath, {
          verified: false,
          updatedAt: new Date(),
        })

        // Return the updated data
        return {
          ref: primaryPath,
          isNew: false,
          data: {
            ...data,
            verified: false,
          },
        }
      }

      return {
        ref: primaryPath,
        isNew: false,
        data: data,
      }
    }
  } catch (error) {
    console.warn(`Error checking primary path ${primaryPath.path}:`, error)
    // Continue to fallback paths
  }

  // Try fallback paths if primary path doesn't exist
  const fallbackPaths = [doc(db, "users", studentId), doc(db, "students", studentId)]

  // Check fallback paths
  let existingDoc = null
  let existingPath = null

  for (let i = 0; i < fallbackPaths.length; i++) {
    const pathRef = fallbackPaths[i]
    console.log(`Checking fallback path ${i + 1}: ${pathRef.path}`)

    try {
      const docSnapshot = await getDoc(pathRef)

      if (docSnapshot.exists()) {
        console.log(`Found existing student document at ${pathRef.path}`)
        existingDoc = docSnapshot
        existingPath = pathRef

        // If document exists but doesn't have verified field, add it
        const data = docSnapshot.data()
        if (data && typeof data.verified === "undefined") {
          console.log("Document exists but doesn't have verified field, adding it as false")
          await updateDoc(pathRef, {
            verified: false,
            updatedAt: new Date(),
          })

          // Return the updated data
          return {
            ref: pathRef,
            isNew: false,
            data: {
              ...data,
              verified: false,
            },
          }
        }

        break
      }
    } catch (error) {
      console.warn(`Error checking path ${pathRef.path}:`, error)
      // Continue to next path
    }
  }

  if (!existingDoc) {
    // Create a new document at the primary path with verified: false
    console.log(`No existing document found. Creating new student document at ${primaryPath.path}`)

    try {
      // Create a minimal student record with verified: false
      await setDoc(primaryPath, {
        fullName: "",
        email: "",
        savedJobs: [],
        appliedJobs: [],
        verified: false, // Explicitly set to false for new users
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      return {
        ref: primaryPath,
        isNew: true,
        data: {
          savedJobs: [],
          appliedJobs: [],
          verified: false,
        },
      }
    } catch (error) {
      console.error("Error creating new student document:", error)
      throw new Error("Failed to create student document")
    }
  }

  if (!existingDoc || !existingPath) {
    throw new Error("Failed to resolve student document")
  }

  return {
    ref: existingPath,
    isNew: false,
    data: existingDoc.data(),
  }
}

// Now update the getStudentJobPreferences function to use our helper
export async function getStudentJobPreferences(studentId: string): Promise<StudentJobPreferences> {
  try {
    console.log(`Getting job preferences for student ID: ${studentId}`)
    const studentDoc = await findOrCreateStudentDocument(studentId)

    return {
      savedJobs: studentDoc.data.savedJobs || [],
      appliedJobs: studentDoc.data.appliedJobs || [],
      recentSearches: studentDoc.data.recentSearches || [],
    }
  } catch (error) {
    console.error("Error fetching student job preferences:", error)
    // Return default empty values instead of throwing
    return {
      savedJobs: [],
      appliedJobs: [],
      recentSearches: [],
    }
  }
}

// Update toggleSaveJob with better error handling
export async function toggleSaveJob(studentId: string, jobId: string, save: boolean) {
  try {
    console.log(`Toggling job save status. Student: ${studentId}, Job: ${jobId}, Save: ${save}`)
    const studentDoc = await findOrCreateStudentDocument(studentId)

    // Make sure the job exists before saving it
    if (save) {
      const jobExists = await getJobById(jobId)
      if (!jobExists) {
        throw new Error("Job not found")
      }
    }

    // Use try-catch here to handle any potential errors during the update
    try {
      if (save) {
        await updateDoc(studentDoc.ref, {
          savedJobs: arrayUnion(jobId),
          updatedAt: new Date(),
        })
        console.log(`Job ${jobId} added to student ${studentId}'s saved jobs`)
      } else {
        await updateDoc(studentDoc.ref, {
          savedJobs: arrayRemove(jobId),
          updatedAt: new Date(),
        })
        console.log(`Job ${jobId} removed from student ${studentId}'s saved jobs`)
      }

      return { success: true }
    } catch (updateError) {
      console.error("Error updating student document:", updateError)

      // Try setting the document with merge if updateDoc fails
      // This can handle cases where the savedJobs array doesn't exist yet
      if (save) {
        await setDoc(
          studentDoc.ref,
          {
            savedJobs: [jobId],
            updatedAt: new Date(),
          },
          { merge: true },
        )
        console.log(`Created savedJobs array with job ${jobId} for student ${studentId}`)
      }

      return { success: true }
    }
  } catch (error) {
    console.error("Error toggling job save status:", error)
    throw new Error("Failed to update saved jobs")
  }
}

// Update submitJobApplication to use our helper
export async function submitJobApplication(application: Omit<JobApplication, "id" | "status" | "updatedAt">) {
  try {
    console.log(`Submitting job application. Student: ${application.studentId}, Job: ${application.jobId}`)

    // First check if the job exists
    const job = await getJobById(application.jobId)
    if (!job) {
      throw new Error("Job not found")
    }

    // Check if student has already applied
    const hasApplied = await hasStudentAppliedToJob(application.studentId, application.jobId)
    if (hasApplied) {
      console.log("Student has already applied to this job")
      return { success: true, alreadyApplied: true }
    }

    // Apply to the job (add student to applicants list)
    try {
      await applyForJob(application.jobId, application.studentId)
    } catch (error: any) {
      // If error is because student already applied, continue with creating the application
      if (!error.message?.includes("already applied")) {
        throw error
      }
    }

    // Create a detailed application document
    const applicationData = {
      ...application,
      status: "pending" as const,
      appliedAt: application.appliedAt || new Date(),
      updatedAt: new Date(),
    }

    // Add application to applications collection
    const applicationsRef = collection(db, "applications")
    const docRef = await addDoc(applicationsRef, applicationData)

    // Update student's applied jobs list
    const studentDoc = await findOrCreateStudentDocument(application.studentId)

    try {
      await updateDoc(studentDoc.ref, {
        appliedJobs: arrayUnion(application.jobId),
        updatedAt: new Date(),
      })
    } catch (error) {
      // If updateDoc fails, try setting with merge
      await setDoc(
        studentDoc.ref,
        {
          appliedJobs: [application.jobId],
          updatedAt: new Date(),
        },
        { merge: true },
      )
    }

    return {
      success: true,
      applicationId: docRef.id,
    }
  } catch (error) {
    console.error("Error submitting application:", error)
    throw new Error("Failed to submit application")
  }
}

// Function to get a student's applied jobs
export async function getStudentAppliedJobs(studentId: string) {
  try {
    // First get the student's applied job IDs
    const studentRef = doc(db, "users", "student", studentId, "user_details")
    const studentDoc = await getDoc(studentRef)

    if (!studentDoc.exists()) {
      throw new Error("Student not found")
    }

    const data = studentDoc.data()
    const appliedJobIds = data.appliedJobs || []

    if (!appliedJobIds.length) {
      return []
    }

    // Then get the details of each job
    const jobs: JobData[] = []

    for (const jobId of appliedJobIds) {
      const jobData = await getJobById(jobId)
      if (jobData) {
        jobs.push(jobData)
      }
    }

    return jobs
  } catch (error) {
    console.error("Error fetching student's applied jobs:", error)
    throw new Error("Failed to fetch applied jobs")
  }
}

// Function to get a student's saved jobs
export async function getStudentSavedJobs(studentId: string) {
  try {
    // First get the student's saved job IDs
    const studentRef = doc(db, "users", "student", studentId, "user_details")
    const studentDoc = await getDoc(studentRef)

    if (!studentDoc.exists()) {
      throw new Error("Student not found")
    }

    const data = studentDoc.data()
    const savedJobIds = data.savedJobs || []

    if (!savedJobIds.length) {
      return []
    }

    // Then get the details of each job
    const jobs: JobData[] = []

    for (const jobId of savedJobIds) {
      const jobData = await getJobById(jobId)
      if (jobData) {
        jobs.push(jobData)
      }
    }

    return jobs
  } catch (error) {
    console.error("Error fetching student's saved jobs:", error)
    throw new Error("Failed to fetch saved jobs")
  }
}

// Function to check if student has applied to a job
export async function hasStudentAppliedToJob(studentId: string, jobId: string): Promise<boolean> {
  try {
    // First check if student is in the job's applicants list
    const jobRef = doc(db, "jobs", jobId)
    const jobDoc = await getDoc(jobRef)

    if (!jobDoc.exists()) {
      return false
    }

    const jobData = jobDoc.data()
    if (jobData.applicants?.includes(studentId)) {
      return true
    }

    // If not found in job document, check student's appliedJobs list
    try {
      const studentDoc = await findOrCreateStudentDocument(studentId)
      const appliedJobs = studentDoc.data.appliedJobs || []
      return appliedJobs.includes(jobId)
    } catch (error) {
      console.error("Error checking student's applied jobs:", error)
      return false
    }
  } catch (error) {
    console.error("Error checking job application status:", error)
    return false
  }
}

// Function to search jobs by criteria
export async function searchJobs(criteria: {
  query?: string
  skills?: string[]
  payment?: { min?: number; max?: number }
  status?: "open" | "closed"
}) {
  try {
    const jobsRef = collection(db, "jobs")

    // Start with basic query for open jobs
    let jobQuery = query(jobsRef, where("status", "==", criteria.status || "open"), orderBy("createdAt", "desc"))

    // Execute query
    const querySnapshot = await getDocs(jobQuery)

    // Filter results client-side for complex filtering (e.g., search, skills, payment)
    let filteredJobs = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        ...data,
        jobId: doc.id,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as JobData
    })

    // Apply additional filters
    if (criteria.query) {
      const searchQuery = criteria.query.toLowerCase()
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery) ||
          job.description.toLowerCase().includes(searchQuery) ||
          job.requirements.some((req) => req.toLowerCase().includes(searchQuery)),
      )
    }

    if (criteria.skills && criteria.skills.length > 0) {
      filteredJobs = filteredJobs.filter((job) =>
        job.requirements.some((requirement) =>
          criteria.skills!.some((skill) => requirement.toLowerCase().includes(skill.toLowerCase())),
        ),
      )
    }

    const payment = criteria.payment
    if (payment) {
      if (payment.min !== undefined) {
        filteredJobs = filteredJobs.filter((job) => job.payment >= payment.min!)
      }
      if (payment.max !== undefined) {
        filteredJobs = filteredJobs.filter((job) => job.payment <= payment.max!)
      }
    }

    return filteredJobs
  } catch (error) {
    console.error("Error searching jobs:", error)
    throw new Error("Failed to search jobs")
  }
}

// Function to get all applications for a job
export async function getJobApplications(jobId: string) {
  try {
    const applicationsRef = collection(db, "applications")
    const applicationsQuery = query(applicationsRef, where("jobId", "==", jobId))
    const querySnapshot = await getDocs(applicationsQuery)

    const applications = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        appliedAt: data.appliedAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as JobApplication
    })

    return applications
  } catch (error) {
    console.error("Error fetching job applications:", error)
    throw new Error("Failed to fetch applications")
  }
}

// Function to update application status
export async function updateApplicationStatus(
  applicationId: string,
  status: "pending" | "viewed" | "contacted" | "rejected",
) {
  try {
    const applicationRef = doc(db, "applications", applicationId)

    await updateDoc(applicationRef, {
      status,
      updatedAt: new Date(),
    })

    return { success: true }
  } catch (error) {
    console.error("Error updating application status:", error)
    throw new Error("Failed to update application status")
  }
}

// Update the getUserProfile function in firebase-service.ts
export async function getUserProfile(userId: string) {
  try {
    // Handle undefined userId case
    if (!userId) {
      throw new Error("User ID is undefined")
    }

    console.log(`Fetching user profile for ID: ${userId}`)

    // First try to get the user document
    const userDoc = await findOrCreateStudentDocument(userId)

    if (!userDoc || !userDoc.data) {
      console.error("Failed to find or create student document")
      throw new Error("Failed to load profile data")
    }

    // If verified is undefined, update it to false
    if (typeof userDoc.data.verified === "undefined") {
      console.log("Profile doesn't have verified status, setting to false")
      await updateDoc(userDoc.ref, {
        verified: false,
        updatedAt: new Date(),
      })

      // Update the local data object
      userDoc.data.verified = false
    }

    // Return the profile data
    console.log(`Successfully fetched profile for ${userId}, verified status:`, userDoc.data.verified)
    return {
      id: userId,
      fullName: userDoc.data.fullName || "",
      email: userDoc.data.email || "",
      title: userDoc.data.title || "",
      university: userDoc.data.university || "",
      about: userDoc.data.about || "",
      skills: userDoc.data.skills || [],
      projects: userDoc.data.projects || [],
      experience: userDoc.data.experience || [],
      connections: userDoc.data.connections || { followers: 0, following: 0 },
      achievements: userDoc.data.achievements || [],
      growthSuggestions: userDoc.data.growthSuggestions || [],
      collaborationProjects: userDoc.data.collaborationProjects || [],
      reviews: userDoc.data.reviews || [],
      activity: userDoc.data.activity || [],
      analytics: userDoc.data.analytics || {
        profileViews: 0,
        jobApplications: 0,
        projectInquiries: 0,
        endorsementsReceived: 0,
      },
      socialLinks: userDoc.data.socialLinks || {},
      avatar: userDoc.data.avatar || "/placeholder.svg?height=200&width=200",
      coverImage: userDoc.data.coverImage || "/placeholder.svg?height=400&width=1200",
      verified: userDoc.data.verified === true, // Ensure it's a boolean
      phoneNumber: userDoc.data.phoneNumber || "",
      address: userDoc.data.address || "",
      pincode: userDoc.data.pincode || "",
      createdAt: userDoc.data.createdAt instanceof Date ? userDoc.data.createdAt : new Date(),
      updatedAt: userDoc.data.updatedAt instanceof Date ? userDoc.data.updatedAt : new Date(),
    }
  } catch (error) {
    console.error("Error in getUserProfile:", error)
    throw error
  }
}

// Function to update specific sections of the user profile
export async function updateUserProfile(userId: string, section: string, data: any) {
  try {
    if (!userId) {
      throw new Error("User ID is undefined")
    }

    console.log(`Updating profile for ${userId}, section: ${section || "multiple fields"}`, data)

    const userDoc = await findOrCreateStudentDocument(userId)

    if (!userDoc || !userDoc.ref) {
      throw new Error("Failed to find or create user document")
    }

    // Prepare the update data - normalize to account for nested properties
    const updateData: any = {}

    if (!section) {
      // Simple field updates
      Object.keys(data).forEach((key) => {
        updateData[key] = data[key]
      })
    } else if (section === "socialLinks") {
      // Handle socialLinks as a special case for merging
      updateData["socialLinks"] = data
    } else {
      // Update a specific section
      updateData[section] = data
    }

    // Always update the timestamp
    updateData.updatedAt = new Date()

    // Perform the update
    await updateDoc(userDoc.ref, updateData)

    console.log(`Successfully updated ${section || "multiple fields"} for user ${userId}`)
    return { success: true }
  } catch (error) {
    console.error(`Error updating user profile section ${section}:`, error)
    throw new Error(`Failed to update ${section || "profile"}`)
  }
}

// Add this export function to get user details based on user ID
export async function getUserDetails(userId: string | undefined) {
  try {
    // Handle undefined userId case
    if (!userId) {
      throw new Error("User ID is undefined")
    }

    console.log(`Fetching user details for ID: ${userId}`)

    // First try to get the user from the users collection directly (simplest path)
    const directUserPath = doc(db, "users", userId)
    const directUserSnap = await getDoc(directUserPath)

    if (directUserSnap.exists()) {
      console.log(`Found user document at users/${userId}`)
      const data = directUserSnap.data()
      return {
        ...data,
        id: userId,
        Role: data.Role || "Student", // Ensure Role is set
      }
    }

    // If direct path doesn't work, try alternative paths
    // Check student paths
    const studentPaths = [doc(db, "users", "student", userId, "user_details"), doc(db, "students", userId)]

    for (const path of studentPaths) {
      try {
        const docSnap = await getDoc(path)
        if (docSnap.exists()) {
          console.log(`Found student document at ${path.path}`)
          const data = docSnap.data()
          return {
            ...data,
            id: userId,
            Role: data.Role || "Student", // Ensure Role is set
          }
        }
      } catch (error) {
        console.warn(`Error checking path ${path.path}:`, error)
      }
    }

    // Check recruiter paths
    const recruiterPaths = [doc(db, "users", "recruiter", userId, "user_details"), doc(db, "recruiters", userId)]

    for (const path of recruiterPaths) {
      try {
        const docSnap = await getDoc(path)
        if (docSnap.exists()) {
          console.log(`Found recruiter document at ${path.path}`)
          const data = docSnap.data()
          return {
            ...data,
            id: userId,
            Role: data.Role || "Recruiter", // Ensure Role is set
          }
        }
      } catch (error) {
        console.warn(`Error checking path ${path.path}:`, error)
      }
    }

    // If we still don't have a document, create a bare minimum one based on auth user data
    const auth = getAuth()
    const user = auth.currentUser

    if (user) {
      // Default to student Role if we can't determine
      const defaultUserData = {
        id: userId,
        email: user.email || "",
        fullName: user.displayName || "",
        Role: "Student", // Default role
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Store this basic profile
      await setDoc(doc(db, "users", userId), defaultUserData, { merge: true })
      console.log(`Created default user document for ${userId}`)

      return defaultUserData
    }

    throw new Error("User document not found and could not create default")
  } catch (error) {
    console.error("Error in getUserDetails:", error)
    throw error
  }
}

// Function to get recruiter profile data
export async function getRecruiterProfile(recruiterId: string) {
  try {
    if (!recruiterId) {
      throw new Error("Recruiter ID is undefined")
    }

    console.log(`Fetching recruiter profile for ID: ${recruiterId}`)

    // Path to the recruiter's profile data
    const recruiterDocRef = doc(db, "users", "recruiter", recruiterId, "user_details")
    const docSnapshot = await getDoc(recruiterDocRef)

    if (!docSnapshot.exists()) {
      console.error(`Recruiter document not found for ID: ${recruiterId}`)
      throw new Error("Recruiter profile not found")
    }

    const recruiterData = docSnapshot.data()

    // Return the profile data with proper defaults
    const result = {
      id: recruiterId,
      fullName: recruiterData.fullName || "",
      email: recruiterData.email || "",
      jobTitle: recruiterData.jobTitle || "",
      phoneNumber: recruiterData.phoneNumber || "",
      linkedinProfile: recruiterData.linkedinProfile || "",
      companyName: recruiterData.companyName || "",
      companyWebsite: recruiterData.companyWebsite || "",
      industry: recruiterData.industry || "",
      companySize: recruiterData.companySize || "",
      companyDescription: recruiterData.companyDescription || "",
      companyLocation: recruiterData.companyLocation || "",
      hiringRoles: recruiterData.hiringRoles || [],
      skillsNeeded: recruiterData.skillsNeeded || [],
      hiringTimeline: recruiterData.hiringTimeline || "",
      employmentTypes: recruiterData.employmentTypes || [],
      remoteOptions: recruiterData.remoteOptions || [],
      companyValues: recruiterData.companyValues || [],
      benefits: recruiterData.benefits || [],
      workEnvironment: recruiterData.workEnvironment || "",
      teamStructure: recruiterData.teamStructure || "",
      marketingConsent: recruiterData.marketingConsent || false,
      termsAgreed: recruiterData.termsAgreed || false,
      howHeard: recruiterData.howHeard || "",
      joinDate: recruiterData.createdAt ? recruiterData.createdAt.toDate().toISOString() : new Date().toISOString(),
      lastActive: recruiterData.updatedAt ? recruiterData.updatedAt.toDate().toISOString() : new Date().toISOString(),
      profileViews: recruiterData.profileViews || 0,
      candidatesPlaced: recruiterData.candidatesPlaced || 0,
      activeJobs: recruiterData.activeJobs || 0,
      savedCandidates: recruiterData.savedCandidates || 0,
      averageResponseTime: recruiterData.averageResponseTime || "24 hours",
      profileCompleteness: recruiterData.profileCompleteness || calculateProfileCompleteness(recruiterData),
      verified: recruiterData.verified === true,
      specializations: recruiterData.specializations || [],
      preferredCommunication: recruiterData.preferredCommunication || "email",
      testimonials: recruiterData.testimonials || [],
      createdAt: recruiterData.createdAt instanceof Date ? recruiterData.createdAt : new Date(),
      updatedAt: recruiterData.updatedAt instanceof Date ? recruiterData.updatedAt : new Date(),
    }

    console.log(`Successfully fetched recruiter profile for ${recruiterId}`)
    return result
  } catch (error) {
    console.error("Error in getRecruiterProfile:", error)
    throw error
  }
}

// Function to calculate profile completeness percentage
function calculateProfileCompleteness(recruiterData: any): number {
  const requiredFields = [
    "fullName",
    "email",
    "jobTitle",
    "companyName",
    "industry",
    "companySize",
    "companyLocation",
    "hiringRoles",
  ]

  const optionalFields = [
    "phoneNumber",
    "linkedinProfile",
    "companyWebsite",
    "companyDescription",
    "skillsNeeded",
    "hiringTimeline",
    "employmentTypes",
    "remoteOptions",
    "companyValues",
    "benefits",
    "workEnvironment",
    "teamStructure",
  ]

  let completedRequired = 0
  requiredFields.forEach((field) => {
    if (
      recruiterData[field] &&
      (typeof recruiterData[field] !== "string" || recruiterData[field].trim() !== "") &&
      (!Array.isArray(recruiterData[field]) || recruiterData[field].length > 0)
    ) {
      completedRequired++
    }
  })

  let completedOptional = 0
  optionalFields.forEach((field) => {
    if (
      recruiterData[field] &&
      (typeof recruiterData[field] !== "string" || recruiterData[field].trim() !== "") &&
      (!Array.isArray(recruiterData[field]) || recruiterData[field].length > 0)
    ) {
      completedOptional++
    }
  })

  const requiredWeight = 0.7
  const optionalWeight = 0.3

  const requiredPercentage = (completedRequired / requiredFields.length) * requiredWeight * 100
  const optionalPercentage = (completedOptional / optionalFields.length) * optionalWeight * 100

  return Math.round(requiredPercentage + optionalPercentage)
}

// Function to update recruiter profile
export async function updateRecruiterProfile(recruiterId: string, section: string, data: any) {
  try {
    if (!recruiterId) {
      throw new Error("Recruiter ID is undefined")
    }

    console.log(`Updating recruiter profile for ${recruiterId}, section: ${section || "multiple fields"}`)

    // Path to the recruiter's profile
    const recruiterDocRef = doc(db, "users", "recruiter", recruiterId, "user_details")

    // Check if document exists
    const docSnapshot = await getDoc(recruiterDocRef)

    if (!docSnapshot.exists()) {
      console.error(`Recruiter document not found for ID: ${recruiterId}`)
      throw new Error("Recruiter profile not found")
    }

    // Prepare the update data
    let updateData: any = {}

    if (!section) {
      // Update multiple fields directly
      updateData = { ...data }
    } else {
      // Update a specific section
      updateData[section] = data
    }

    // Always update the timestamp
    updateData.updatedAt = new Date()

    // Perform the update
    await updateDoc(recruiterDocRef, updateData)

    console.log(`Successfully updated ${section || "multiple fields"} for recruiter ${recruiterId}`)
    return { success: true }
  } catch (error) {
    console.error(`Error updating recruiter profile section ${section}:`, error)
    throw new Error(`Failed to update ${section || "profile"}`)
  }
}

// Function to analyze interview video with Gemini
export async function analyzeInterviewVideo(videoFile: File, userId: string) {
  try {
    if (!videoFile || !userId) {
      throw new Error("Video file or user ID is missing")
    }

    console.log(`Starting interview analysis for user ${userId}`)

    // Create a unique filename
    const timestamp = Date.now()
    const filename = `${userId}_${timestamp}${videoFile.name.substring(videoFile.name.lastIndexOf("."))}`
    const videoPath = `videos/${filename}`

    console.log(`Uploading video to ${videoPath}`)

    // Upload to Firebase Storage
    const storage = getStorage()
    const videoStorageRef = storageRef(storage, videoPath)
    await uploadBytes(videoStorageRef, videoFile)
    const downloadUrl = await getDownloadURL(videoStorageRef)

    console.log(`Video uploaded successfully to ${downloadUrl}`)

    // Get auth token for API call
    const token = await auth.currentUser?.getIdToken()
    if (!token) {
      throw new Error("User not authenticated")
    }

    // Call our API endpoint to analyze the video with Gemini
    console.log("Calling Gemini API via endpoint...")

    // Create form data with video file
    const formData = new FormData()
    formData.append("video", videoFile)

    // Make API request
    const response = await fetch("/api/interview-analysis", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("API error:", errorData)
      throw new Error(`API error: ${errorData.error || response.statusText}`)
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || "Failed to analyze video")
    }

    // Store the analysis result in Firestore
    const analysisRef = doc(db, "users", userId, "interview_analyses", timestamp.toString())

    const analysisData = {
      videoUrl: downloadUrl,
      timestamp: timestamp,
      date: new Date(),
      analyzed: true,
      analysis: result.analysis,
    }

    await setDoc(analysisRef, analysisData)

    return {
      success: true,
      analysisId: timestamp.toString(),
      analysis: result.analysis,
      videoUrl: downloadUrl,
    }
  } catch (error) {
    console.error("Error analyzing interview video:", error)
    throw new Error("Failed to analyze interview video")
  }
}

// Function to get a user's interview analyses
export async function getUserInterviewAnalyses(userId: string) {
  try {
    if (!userId) {
      throw new Error("User ID is missing")
    }

    console.log(`Fetching interview analyses for user ${userId}`)

    const analysesRef = collection(db, "users", userId, "interview_analyses")
    const analysesQuery = query(analysesRef, orderBy("timestamp", "desc"))
    const querySnapshot = await getDocs(analysesQuery)

    const analyses = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate() || new Date(),
      }
    })

    return analyses
  } catch (error) {
    console.error("Error fetching interview analyses:", error)
    throw new Error("Failed to fetch interview analyses")
  }
}
