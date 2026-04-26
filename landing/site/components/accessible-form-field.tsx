"use client"

import React, { type ReactNode } from "react"
import { generateId, getA11yFocusStyles } from "@/lib/accessibility"

interface AccessibleFormFieldProps {
  label: string
  description?: string
  error?: string
  children: ReactNode
  required?: boolean
  htmlFor?: string
}

/**
 * Accessible form field wrapper component
 * Ensures proper label association and error handling
 */
export function AccessibleFormField({
  label,
  description,
  error,
  children,
  required,
  htmlFor: htmlForProp,
}: AccessibleFormFieldProps) {
  const fieldId = htmlForProp || generateId("field")
  const descriptionId = `${fieldId}-description`
  const errorId = `${fieldId}-error`

  return (
    <div className="space-y-2">
      <label htmlFor={fieldId} className="block text-sm font-medium">
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      {description && (
        <p id={descriptionId} className="text-xs text-muted-foreground">
          {description}
        </p>
      )}

      <div
        aria-describedby={`${description ? descriptionId : ""} ${error ? errorId : ""}`.trim()}
        className={error ? "ring-1 ring-red-500 rounded-md" : ""}
      >
        {React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement<any>, {
              id: fieldId,
              className: `${(children as React.ReactElement<any>).props.className || ""} ${getA11yFocusStyles()}`,
              "aria-invalid": !!error,
              "aria-describedby": `${description ? descriptionId : ""} ${error ? errorId : ""}`.trim(),
            })
          : children}
      </div>

      {error && (
        <p id={errorId} className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
