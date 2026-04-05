import React, { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Trash2, Sparkles, AlertTriangle, Clock, User, MapPin,
  Calendar as CalendarIconLucide, LayoutDashboard, BookOpen,
  Users as UsersIcon, Home as HomeIcon, Bell, X, CheckCircle,
} from "lucide-react"

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
})
api.interceptors.request.use((config) => {
  console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
  return config
}, (error) => Promise.reject(error))
api.interceptors.response.use((response) => response, (error) => {
  console.error("API Error:", error.response?.data || error.message)
  return Promise.reject(error)
})

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const TIME_SLOTS = [
  "09:00-10:00", "10:00-11:00", "11:15-12:15",
  "12:15-13:15", "14:15-15:15", "15:15-16:15", "16:30-17:30",
]

// ===== RESOLVE CONFLICT MODAL =====
function ResolveModal({ conflict, timetable, onClose, onResolved }) {
  const [resolving, setResolving] = useState(false)
  const [resolved, setResolved] = useState(false)

  const conflictedEntries = conflict.entries.map(idx => ({
    ...timetable.schedule[Number(idx)],
    idx: Number(idx)
  }))

  const allSlots = TIME_SLOTS.filter(s => s !== "12:15-13:15")
  const usedSlots = timetable.schedule.map(e => `${e.day}_${e.startTime}-${e.endTime}`)

  // Suggest karo available slot
  const suggestedSlot = (() => {
    for (const day of DAYS) {
      for (const slot of allSlots) {
        const key = `${day}_${slot}`
        if (!usedSlots.includes(key)) return { day, slot }
      }
    }
    return null
  })()

  async function handleResolve() {
    if (!suggestedSlot) return
    setResolving(true)

    // Second conflicting entry ko naye slot mein move karo
    const entryToMove = conflictedEntries[1]
    const [newStart, newEnd] = suggestedSlot.slot.split("-")

    const updatedSchedule = timetable.schedule.map((entry, idx) => {
      if (idx === entryToMove.idx) {
        return { ...entry, day: suggestedSlot.day, startTime: newStart, endTime: newEnd, timeSlot: suggestedSlot.slot }
      }
      return entry
    })

    // Conflicts recalculate karo
    const newConflicts = []
    const facultyMap = {}
    const roomMap = {}
    updatedSchedule.forEach((entry, index) => {
      const fKey = `${entry.facultyId}_${entry.day}_${entry.startTime}`
      const rKey = `${entry.roomId}_${entry.day}_${entry.startTime}`
      if (facultyMap[fKey] !== undefined) {
        newConflicts.push({ type: "faculty_conflict", message: `Faculty conflict on ${entry.day} at ${entry.startTime}`, entries: [String(facultyMap[fKey]), String(index)] })
      } else facultyMap[fKey] = index
      if (roomMap[rKey] !== undefined) {
        newConflicts.push({ type: "room_conflict", message: `Room conflict on ${entry.day} at ${entry.startTime}`, entries: [String(roomMap[rKey]), String(index)] })
      } else roomMap[rKey] = index
    })

    try {
      await api.put(`/timetables/${timetable._id}`, {
        ...timetable,
        schedule: updatedSchedule,
        conflicts: newConflicts,
        metadata: { ...timetable.metadata, conflictCount: newConflicts.length }
      })
      setResolved(true)
      setTimeout(() => { onResolved(); onClose() }, 1500)
    } catch (err) {
      console.error("Resolve failed:", err)
    } finally {
      setResolving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-600 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            Resolve Conflict
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Conflict type */}
        <div className="mb-4 p-3 bg-red-500/10 border border-red-400/30 rounded-xl">
          <p className="text-red-300 text-sm font-medium">{conflict.type.replace("_", " ").toUpperCase()}</p>
          <p className="text-red-200 text-sm mt-1">{conflict.message}</p>
        </div>

        {/* Conflicting classes */}
        <div className="mb-4">
          <p className="text-slate-300 text-sm font-medium mb-2">Conflicting Classes:</p>
          <div className="space-y-2">
            {conflictedEntries.map((entry, i) => (
              <div key={i} className={`p-3 rounded-xl border text-sm ${i === 0 ? "bg-slate-700/50 border-slate-600" : "bg-orange-500/10 border-orange-400/30"}`}>
                <div className="font-semibold text-white">{entry.courseName}</div>
                <div className="text-slate-400">{entry.facultyName} • {entry.roomName}</div>
                <div className="text-slate-400">{entry.day} {entry.startTime}–{entry.endTime}</div>
                {i === 1 && <Badge className="mt-1 bg-orange-500/80 text-white text-xs border-0">Will be moved</Badge>}
              </div>
            ))}
          </div>
        </div>

        {/* Suggested solution */}
        {suggestedSlot ? (
          <div className="mb-5 p-3 bg-emerald-500/10 border border-emerald-400/30 rounded-xl">
            <p className="text-emerald-300 text-sm font-medium mb-1">Suggested Fix:</p>
            <p className="text-emerald-200 text-sm">
              Move <strong>{conflictedEntries[1]?.courseName}</strong> to{" "}
              <strong>{suggestedSlot.day} {suggestedSlot.slot}</strong>
            </p>
          </div>
        ) : (
          <div className="mb-5 p-3 bg-yellow-500/10 border border-yellow-400/30 rounded-xl">
            <p className="text-yellow-300 text-sm">No available slots. Adjust Manually or use the bot.</p>
          </div>
        )}

        {/* Buttons */}
        {resolved ? (
          <div className="flex items-center justify-center gap-2 py-3 bg-emerald-500/20 rounded-xl">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <span className="text-emerald-300 font-medium">Conflict Resolved!</span>
          </div>
        ) : (
          <div className="flex gap-3">
            <Button onClick={handleResolve} disabled={resolving || !suggestedSlot}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white">
              {resolving ? "Resolving..." : "Apply Fix"}
            </Button>
            <Button onClick={onClose} variant="outline"
              className="bg-slate-700/50 text-slate-300 border border-slate-600">
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// ===== TIMETABLE GRID =====
function TimetableGrid({ timetable, courses, faculty, rooms, onTimetableUpdate }) {
  const [resolveConflict, setResolveConflict] = useState(null)

  const conflictIndices = new Set()
  if (timetable.conflicts) {
    timetable.conflicts.forEach(conflict => {
      conflict.entries.forEach(idx => conflictIndices.add(Number(idx)))
    })
  }

  const getEntry = (day, slot) => {
    if (!timetable || !timetable.schedule) return null
    const index = timetable.schedule.findIndex(
      (e) => e.day.toLowerCase() === day.toLowerCase() &&
        `${e.startTime}-${e.endTime}` === slot
    )
    if (index === -1) return null
    return { ...timetable.schedule[index], hasConflict: conflictIndices.has(index), index }
  }

  const findCourse = (id) => courses.find((c) => c._id === id) || null
  const findFaculty = (id) => faculty.find((f) => f._id === id) || null
  const findRoom = (id) => rooms.find((r) => r._id === id) || null

  const typeColor = (t, hasConflict) => {
    if (hasConflict) return "bg-gradient-to-br from-red-500/40 to-rose-600/40 text-red-100 border-2 border-red-500/80"
    switch (t) {
      case "lecture": return "bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-200 border border-cyan-500/30"
      case "lab": return "bg-gradient-to-br from-emerald-500/20 to-green-600/20 text-emerald-200 border border-emerald-500/30"
      case "tutorial": return "bg-gradient-to-br from-purple-500/20 to-violet-600/20 text-purple-200 border border-purple-500/30"
      default: return "bg-gradient-to-br from-slate-600/20 to-gray-700/20 text-slate-200 border border-slate-500/30"
    }
  }

  return (
    <>
      {resolveConflict && (
        <ResolveModal
          conflict={resolveConflict}
          timetable={timetable}
          onClose={() => setResolveConflict(null)}
          onResolved={onTimetableUpdate}
        />
      )}

      <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-cyan-500/10">
        <CardHeader className="border-b border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-cyan-100">{timetable.name}</CardTitle>
              <div className="text-sm text-slate-400">
                {timetable.department} • Semester {timetable.semester} • {timetable.year}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Badge className={timetable.status === "published"
                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0"
                : "bg-slate-700/50 text-slate-300 border border-slate-600/50"}>
                {timetable.status}
              </Badge>
              {timetable.conflicts && timetable.conflicts.length > 0 && (
                <Badge className="bg-gradient-to-r from-red-500 to-rose-600 text-white border-0">
                  ⚠ {timetable.conflicts.length} conflicts
                </Badge>
              )}
              <Badge className="bg-slate-700/50 text-slate-300 border border-slate-600/50">
                {timetable.metadata?.utilizationRate || 0}% utilized
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <div className="grid grid-cols-6 gap-3 min-w-[900px]">
              <div className="font-semibold text-center p-3 bg-slate-700/30 rounded-xl text-cyan-200 border border-slate-600/50">Time</div>
              {DAYS.map((d) => (
                <div key={d} className="font-semibold text-center p-3 bg-slate-700/30 rounded-xl text-cyan-200 border border-slate-600/50">{d}</div>
              ))}

              {TIME_SLOTS.map((slot) => (
                <div key={slot} className="contents">
                  <div className="text-sm text-center p-3 bg-slate-800/40 rounded-xl flex items-center justify-center text-slate-400 border border-slate-700/50">
                    <Clock className="h-3 w-3 mr-1" />{slot}
                  </div>
                  {DAYS.map((day) => {
                    const entry = getEntry(day, slot)
                    if (!entry) {
                      return (
                        <div key={`${day}-${slot}`} className="min-h-[80px] p-1">
                          <div className="h-full bg-slate-800/20 rounded-xl border-2 border-dashed border-slate-700/50 hover:border-cyan-500/50 transition-all" />
                        </div>
                      )
                    }
                    const course = findCourse(entry.courseId)
                    const prof = findFaculty(entry.facultyId)
                    const room = findRoom(entry.roomId)

                    return (
                      <div key={`${day}-${slot}`} className="min-h-[80px] p-1">
                        <div className={`p-3 rounded-xl text-xs h-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm ${typeColor(course?.type || "lecture", entry.hasConflict)}`}>
                          {entry.hasConflict && (
                            <div className="flex items-center gap-1 mb-2 bg-red-600/80 rounded-lg px-2 py-1">
                              <AlertTriangle className="h-3 w-3 text-white flex-shrink-0" />
                              <span className="text-white text-xs font-bold">Conflict!</span>
                            </div>
                          )}
                          <div className="font-semibold leading-tight mb-2 line-clamp-2 text-base">
                            {course ? course.name : entry.courseName || entry.courseId}
                          </div>
                          <div className="space-y-1 text-xs opacity-90">
                            <div className="flex items-center gap-1 truncate">
                              <User className="h-3 w-3" />
                              <span className="truncate">{prof ? prof.name : entry.facultyName || entry.facultyId}</span>
                            </div>
                            <div className="flex items-center gap-1 truncate">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{room ? room.name : entry.roomName || entry.roomId}</span>
                            </div>
                            <Badge variant="outline" className="text-xs px-1 py-0 text-white mt-1">
                              {course?.type || "lecture"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Conflict list with Resolve button */}
          {timetable.conflicts && timetable.conflicts.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-semibold text-red-400 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Conflicts Detected
              </h4>
              {timetable.conflicts.map((c, i) => (
                <div key={i} className="p-4 bg-red-500/10 border border-red-400/30 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-red-400 text-sm">{c.type.replace("_", " ").toUpperCase()}</span>
                    <div className="flex gap-2 items-center">
                      <Badge className="bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 text-xs">High</Badge>
                      <button
                        onClick={() => setResolveConflict(c)}
                        className="bg-yellow-500 hover:bg-yellow-400 text-black text-xs px-3 py-1 rounded-lg font-bold transition-all hover:scale-105"
                      >
                        🔧 Resolve
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-red-300 mb-2">{c.message}</p>
                  {/* Conflicting entries detail */}
                  <div className="flex gap-2 flex-wrap">
                    {c.entries.map(idx => {
                      const entry = timetable.schedule[Number(idx)]
                      return entry ? (
                        <span key={idx} className="bg-red-900/50 border border-red-500/50 text-red-200 text-xs px-2 py-1 rounded-lg">
                          📚 {entry.courseName} — {entry.day} {entry.startTime}
                        </span>
                      ) : null
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* All conflicts resolved */}
          {timetable.conflicts && timetable.conflicts.length === 0 && (
            <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-400/30 rounded-xl flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              <span className="text-emerald-300 font-medium">No conflicts.</span>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default function TimetablePage() {
  const [timetables, setTimetables] = useState([])
  const [selected, setSelected] = useState(null)
  const [loadingList, setLoadingList] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [courses, setCourses] = useState([])
  const [faculty, setFaculty] = useState([])
  const [rooms, setRooms] = useState([])
  const [error, setError] = useState(null)
  const [activeNavItem, setActiveNavItem] = useState("timetables")
  const [form, setForm] = useState({
    department: "Computer Science",
    semester: "4",
    academicYear: new Date().getFullYear(),
    constraintsText: "",
  })

  useEffect(() => {
    fetchTimetables()
    fetchSupportingData()
  }, [])

  async function fetchTimetables() {
    setLoadingList(true)
    setError(null)
    try {
      const response = await api.get("/timetables")
      setTimetables(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      setError(`Failed to load timetables: ${err.response?.data?.error || err.message}`)
      setTimetables([])
    } finally {
      setLoadingList(false)
    }
  }

  async function fetchSupportingData() {
    try {
      const [coursesRes, facultyRes, roomsRes] = await Promise.all([
        api.get("/courses"), api.get("/faculty"), api.get("/rooms"),
      ])
      setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : [])
      setFaculty(Array.isArray(facultyRes.data) ? facultyRes.data : [])
      setRooms(Array.isArray(roomsRes.data) ? roomsRes.data : [])
    } catch (err) {
      setError(`Failed to load supporting data: ${err.response?.data?.error || err.message}`)
    }
  }

  async function viewTimetable(id) {
    setLoadingDetail(true)
    setSelected(null)
    setError(null)
    try {
      const response = await api.get(`/timetables/${id}`)
      setSelected(response.data)
    } catch (err) {
      setError(`Failed to load timetable: ${err.response?.data?.error || err.message}`)
    } finally {
      setLoadingDetail(false)
    }
  }

  async function generateTimetable(e) {
    e.preventDefault()
    setGenerating(true)
    setError(null)
    try {
      let constraints = {}
      if (form.constraintsText.trim()) {
        try { constraints = JSON.parse(form.constraintsText) }
        catch { constraints = { notes: form.constraintsText } }
      }
      const payload = {
        department: form.department,
        semester: parseInt(form.semester),
        academicYear: parseInt(form.academicYear),
        constraints,
      }
      const response = await api.post("/timetables/generate", payload)
      await fetchTimetables()
      if (response.data._id) await viewTimetable(response.data._id)
      alert("Timetable generated successfully!")
    } catch (err) {
      setError(`Failed to generate timetable: ${err.response?.data?.error || err.message}`)
    } finally {
      setGenerating(false)
    }
  }

  async function togglePublish(timetable) {
    try {
      const newStatus = timetable.status === "published" ? "draft" : "published"
      await api.put(`/timetables/${timetable._id}`, { ...timetable, status: newStatus })
      await fetchTimetables()
      if (selected && selected._id === timetable._id) await viewTimetable(timetable._id)
    } catch (err) {
      setError(`Failed to update status: ${err.response?.data?.error || err.message}`)
    }
  }

  async function deleteTimetable(timetable) {
    if (!confirm(`Delete "${timetable.name}"?`)) return
    try {
      await api.delete(`/timetables/${timetable._id}`)
      await fetchTimetables()
      if (selected && selected._id === timetable._id) setSelected(null)
    } catch (err) {
      setError(`Failed to delete: ${err.response?.data?.error || err.message}`)
    }
  }

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { id: "courses", label: "Courses", icon: BookOpen, path: "/courses" },
    { id: "faculty", label: "Faculty", icon: UsersIcon, path: "/faculty" },
    { id: "rooms", label: "Rooms", icon: HomeIcon, path: "/rooms" },
    { id: "timetables", label: "Timetables", icon: CalendarIconLucide, path: "/timetables" },
    { id: "notifications", label: "Notifications", icon: Bell, path: "/notifications" },
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <aside className="relative z-10 w-64 bg-slate-800/40 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl p-6 flex flex-col">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <CalendarIconLucide className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-cyan-100">Scheduler</h2>
              <p className="text-xs text-slate-400">Smart Classroom</p>
            </div>
          </div>
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon
              const isActive = activeNavItem === item.id
              return (
                <Link key={item.id} to={item.path} onClick={() => setActiveNavItem(item.id)}>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer ${isActive
                    ? "bg-gradient-to-r from-cyan-600/30 to-blue-600/30 text-cyan-100 border border-cyan-500/30"
                    : "text-slate-300 hover:bg-slate-700/30 hover:text-cyan-200 border border-transparent"}`}>
                    <IconComponent className={`w-5 h-5 ${isActive ? "text-cyan-300" : "text-slate-400 group-hover:text-cyan-400"}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-6 relative z-10 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent mb-4">
                  Timetable Generator
                </h1>
                <p className="text-cyan-200 text-lg">Generate, optimize and manage academic timetables with AI assistance</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-400/30 text-red-300 px-4 py-3 rounded-xl flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Sparkles className="h-5 w-5 text-cyan-300" />
                      Generate New Timetable
                    </CardTitle>
                    <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0">AI Powered</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={generateTimetable} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-cyan-200 mb-2">Department</label>
                        <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
                          placeholder="e.g., Computer Science" required
                          className="bg-slate-800/50 border-slate-600/50 text-slate-200 placeholder-slate-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-cyan-200 mb-2">Semester</label>
                        <Select value={form.semester} onValueChange={(value) => setForm({ ...form, semester: value })}>
                          <SelectTrigger className="bg-slate-800/50 border-slate-600/50 text-slate-200">
                            <SelectValue placeholder="Select semester" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800/90 border-slate-600/50 text-slate-200">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                              <SelectItem key={sem} value={sem.toString()}>{sem}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-cyan-200 mb-2">Academic Year</label>
                        <Input type="number" value={form.academicYear}
                          onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                          min="2020" max="2030"
                          className="bg-slate-800/50 border-slate-600/50 text-slate-200" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-cyan-200 mb-2">Constraints (Optional)</label>
                      <Textarea value={form.constraintsText}
                        onChange={(e) => setForm({ ...form, constraintsText: e.target.value })}
                        placeholder='"Avoid Friday Afternoon Classes"' rows={3}
                        className="bg-slate-800/50 border-slate-600/50 text-slate-200 placeholder-slate-500" />
                    </div>
                    <div className="flex gap-3">
                      <Button type="submit" disabled={generating}
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white">
                        <Sparkles className="h-4 w-4 mr-2" />
                        {generating ? "Generating..." : "Generate Timetable"}
                      </Button>
                      <Button type="button" variant="outline"
                        onClick={() => setForm({ department: "Computer Science", semester: "4", academicYear: new Date().getFullYear(), constraintsText: "" })}
                        className="bg-slate-700/50 text-slate-300 border border-slate-600/50">
                        Reset
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50">
                <CardHeader className="border-b border-slate-700/50 p-6">
                  <CardTitle className="text-cyan-100">Existing Timetables ({timetables.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {loadingList ? (
                    <div className="text-center py-8">
                      <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-cyan-200">Loading...</p>
                    </div>
                  ) : timetables.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p>No timetables found. Generate your first one above!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {timetables.map((t) => (
                        <div key={t._id} className="flex items-center justify-between gap-3 p-4 rounded-xl bg-slate-800/30 hover:bg-slate-700/40 transition-all border border-slate-700/50 hover:border-cyan-500/30">
                          <div className="flex-1">
                            <div className="font-semibold text-white">{t.name}</div>
                            <div className="text-sm text-slate-400">{t.department} • Semester {t.semester} • {t.year}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={t.status === "published"
                                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0"
                                : "bg-slate-700/50 text-slate-300 border border-slate-600/50"}>
                                {t.status}
                              </Badge>
                              <Badge className="bg-slate-700/50 text-slate-300 border border-slate-600/50 text-xs">
                                {t.metadata?.totalHours || 0} hours
                              </Badge>
                              {t.conflicts && t.conflicts.length > 0 && (
                                <Badge className="bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 text-xs">
                                  ⚠ {t.conflicts.length} conflicts
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" onClick={() => viewTimetable(t._id)}
                              className="text-cyan-300 hover:text-white hover:bg-cyan-500/20">View</Button>
                            <Button size="sm" variant="outline" onClick={() => togglePublish(t)}
                              className="bg-slate-700/50 text-slate-300 border border-slate-600/50">
                              {t.status === "published" ? "Unpublish" : "Publish"}
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteTimetable(t)}
                              className="bg-gradient-to-r from-red-600 to-rose-600 text-white border-0">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="w-[720px] max-w-full space-y-4">
              {loadingDetail ? (
                <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50">
                  <CardContent className="text-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-cyan-200">Loading timetable details...</p>
                  </CardContent>
                </Card>
              ) : !selected ? (
                <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-cyan-100">Timetable Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center py-12">
                    <CalendarIconLucide className="h-16 w-16 mx-auto mb-4 opacity-30 text-slate-500" />
                    <p className="text-lg font-medium mb-2 text-slate-300">No Timetable Selected</p>
                    <p className="text-sm text-slate-500">Select a timetable from the list to view details.</p>
                  </CardContent>
                </Card>
              ) : (
                <TimetableGrid
                  timetable={selected}
                  courses={courses}
                  faculty={faculty}
                  rooms={rooms}
                  onTimetableUpdate={() => viewTimetable(selected._id)}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}