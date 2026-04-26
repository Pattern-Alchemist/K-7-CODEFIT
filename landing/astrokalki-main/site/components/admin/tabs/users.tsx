"use client"

import { useState } from "react"
import { MapPin, Calendar, Trash2, Edit } from "lucide-react"

interface UserManagementProps {
  profiles: any[]
}

export default function UserManagement({ profiles }: UserManagementProps) {
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProfiles = profiles.filter(
    (p: any) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div>
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full glass focus-ring rounded-xl px-4 py-3 text-white placeholder-white/40"
        />
      </div>

      {/* Users Grid */}
      <div className="grid gap-4">
        {filteredProfiles.length === 0 ? (
          <div className="glass glow rounded-2xl p-8 text-center">
            <p className="text-white/60">No users found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block glass glow rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left py-3 px-4 text-white/70">Name</th>
                    <th className="text-left py-3 px-4 text-white/70">Email</th>
                    <th className="text-left py-3 px-4 text-white/70">Location</th>
                    <th className="text-left py-3 px-4 text-white/70">Joined</th>
                    <th className="text-left py-3 px-4 text-white/70">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProfiles.map((profile: any) => (
                    <tr key={profile.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-3 px-4 text-white font-medium">{profile.name || "—"}</td>
                      <td className="py-3 px-4 text-cyan-300 text-xs">{profile.email}</td>
                      <td className="py-3 px-4 text-white/70 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {profile.location || "—"}
                      </td>
                      <td className="py-3 px-4 text-white/70 text-xs">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        <button
                          onClick={() => setSelectedUser(profile)}
                          className="p-2 rounded-lg hover:bg-cyan-500/20 text-cyan-300 transition"
                          title="View"
                        >
                          <Edit className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-red-500/20 text-red-300 transition" title="Delete">
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden grid gap-4">
              {filteredProfiles.map((profile: any) => (
                <div key={profile.id} className="glass glow rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-white">{profile.name || "User"}</h4>
                      <p className="text-xs text-cyan-300">{profile.email}</p>
                    </div>
                    <button
                      onClick={() => setSelectedUser(profile)}
                      className="p-2 rounded-lg hover:bg-cyan-500/20 text-cyan-300"
                    >
                      <Edit className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                  <div className="space-y-1 text-sm text-white/70">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {profile.location || "No location"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      Joined {new Date(profile.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur" onClick={() => setSelectedUser(null)} />
          <div className="glass glow rounded-2xl p-6 max-w-md w-full relative z-10">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-cinzel text-xl font-semibold text-white">User Details</h3>
              <button onClick={() => setSelectedUser(null)} className="text-white/60 hover:text-white">
                ✕
              </button>
            </div>
            <div className="space-y-3 text-sm text-white/80">
              <div>
                <p className="text-white/60 text-xs mb-1">Name</p>
                <p className="text-white">{selectedUser.name || "—"}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs mb-1">Email</p>
                <p className="text-cyan-300 break-all">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs mb-1">Location</p>
                <p className="text-white">{selectedUser.location || "—"}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs mb-1">DOB</p>
                <p className="text-white">{selectedUser.dob || "—"}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs mb-1">Joined</p>
                <p className="text-white">{new Date(selectedUser.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
