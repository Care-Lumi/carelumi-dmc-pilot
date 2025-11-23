"use client"

import { useState } from "react"

interface AddStaffModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddStaffModal({ isOpen, onClose }: AddStaffModalProps) {
  const [syncMethod, setSyncMethod] = useState<"manual" | "payroll">("payroll")
  const [selectedSystem, setSelectedSystem] = useState("")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl max-h-[700px] overflow-y-auto rounded-lg bg-card p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">Add Staff Member</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </div>

        {/* Sync Method Selection */}
        <div className="mb-6 space-y-3">
          <label className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-4 hover:bg-gray-50">
            <input
              type="radio"
              name="syncMethod"
              value="payroll"
              checked={syncMethod === "payroll"}
              onChange={(e) => setSyncMethod(e.target.value as "payroll")}
              className="h-4 w-4"
            />
            <div>
              <p className="font-medium text-foreground">Sync from Payroll/HR System</p>
              <p className="text-sm text-muted-foreground">
                Import staff information automatically from your existing system
              </p>
            </div>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-4 hover:bg-gray-50">
            <input
              type="radio"
              name="syncMethod"
              value="manual"
              checked={syncMethod === "manual"}
              onChange={(e) => setSyncMethod(e.target.value as "manual")}
              className="h-4 w-4"
            />
            <div>
              <p className="font-medium text-foreground">Add Manually</p>
              <p className="text-sm text-muted-foreground">Fill in staff information using the form below</p>
            </div>
          </label>
        </div>

        {/* Payroll/HR Sync Option */}
        {syncMethod === "payroll" && (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Select System</label>
              <select
                value={selectedSystem}
                onChange={(e) => setSelectedSystem(e.target.value)}
                className="h-10 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Choose your payroll/HR system</option>
                <option value="adp">ADP Workforce Now</option>
                <option value="gusto">Gusto</option>
                <option value="bamboohr">BambooHR</option>
                <option value="paychex">Paychex</option>
                <option value="quickbooks">QuickBooks Payroll</option>
                <option value="other">Other</option>
              </select>
            </div>

            {selectedSystem && (
              <div className="rounded-lg border border-border bg-gray-50 p-4">
                <p className="mb-2 text-sm font-medium text-foreground">What will be synced:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Full name and employee ID</li>
                  <li>• Job title/role</li>
                  <li>• Email address</li>
                  <li>• Phone number</li>
                  <li>• Start date</li>
                  <li>• Department/location assignment</li>
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">
                  Note: Credentials and licenses must still be added separately
                </p>
              </div>
            )}

            <button
              disabled={!selectedSystem}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              Connect & Import Staff
            </button>
          </div>
        )}

        {/* Manual Entry Form */}
        {syncMethod === "manual" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">First Name *</label>
                <input
                  type="text"
                  className="h-10 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Last Name *</label>
                <input
                  type="text"
                  className="h-10 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Smith"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Role/Title *</label>
              <select className="h-10 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select role</option>
                <option value="LSW">Licensed Social Worker (LSW)</option>
                <option value="LCSW">Licensed Clinical Social Worker (LCSW)</option>
                <option value="LCPC">Licensed Clinical Professional Counselor (LCPC)</option>
                <option value="RBT">Registered Behavior Technician (RBT)</option>
                <option value="BCBA">Board Certified Behavior Analyst (BCBA)</option>
                <option value="Psychologist">Psychologist</option>
                <option value="Admin">Administrative Staff</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Email Address *</label>
              <input
                type="email"
                className="h-10 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="john.smith@email.com"
              />
              <p className="mt-1 text-xs text-muted-foreground">Used to send credential renewal reminders</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Phone Number *</label>
              <input
                type="tel"
                className="h-10 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="(555) 123-4567"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Used for SMS notifications about expiring credentials
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Location Assignment</label>
              <select className="h-10 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select location</option>
                <option value="1">Chicago, IL - Main Office</option>
                <option value="2">Springfield, IL - Outreach Center</option>
                <option value="3">Naperville, IL - North Clinic</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Start Date</label>
              <input
                type="date"
                className="h-10 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                Note: Staff members do not have user accounts. They will receive email and SMS notifications about
                credential renewals but cannot log in to the system.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Add Staff Member
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
