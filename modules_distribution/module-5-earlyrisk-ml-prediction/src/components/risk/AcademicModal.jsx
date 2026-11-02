import { useEffect, useState } from 'react'
import Btn from '../Btn.jsx'
import { ACADEMIC_FIELDS } from '../../lib/earlyRisk.js'

export default function AcademicModal({
  open,
  onCancel,
  onContinue,
}) {
  const [values, setValues] = useState({
    cgpa: '',
    attendance: '',
    internalMarks: '',
    backlogs: '',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (open) {
      setValues({
        cgpa: '',
        attendance: '',
        internalMarks: '',
        backlogs: '',
      })

      setErrors({})
    }
  }, [open])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && open) {
        onCancel()
      }
    }

    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onCancel])

  if (!open) return null

  const handleChange = (key, val) => {
    setValues((prev) => ({
      ...prev,
      [key]: val,
    }))
  }

  const validate = () => {
    const newErrors = {}

    ACADEMIC_FIELDS.forEach((field) => {
      const raw = values[field.key]

      if (
        raw === '' ||
        raw === null ||
        raw === undefined
      ) {
        newErrors[field.key] = 'This field is required.'
        return
      }

      const num = Number(raw)

      if (Number.isNaN(num)) {
        newErrors[field.key] = 'Enter a valid number.'
        return
      }

      if (num < field.min || num > field.max) {
        newErrors[field.key] =
          `Must be between ${field.min} and ${field.max}.`
      }
    })

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (!validate()) return

    onContinue({
      cgpa: Number(values.cgpa),
      attendance: Number(values.attendance),
      internalMarks: Number(values.internalMarks),
      backlogs: Number(values.backlogs),
    })
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050814]/80 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onCancel()
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="academic-modal-title"
        className="w-full max-w-[520px] overflow-hidden rounded-sm border border-[#293653] bg-[#0B1020] shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >


        <div className="border-b border-[#293653] px-6 py-5">
          <div className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[#E8A33D]">
            Risk Prediction
          </div>

          <h2
            id="academic-modal-title"
            className="mt-2 font-display text-[1.5rem] font-semibold text-white"
          >
            Academic Details
          </h2>

          <p className="mt-2 text-[0.87rem] leading-relaxed text-slate-300">
            Enter your academic information. It will be combined
            with your learning activity to predict your risk.
          </p>
        </div>

        <div className="px-6 py-6">
          <div className="grid gap-4">
            {ACADEMIC_FIELDS.map((field) => (
              <div key={field.key}>
                <label
                  htmlFor={field.key}
                  className="flex items-baseline justify-between gap-4 text-[0.87rem] font-medium text-white"
                >
                  <span>
                    {field.label}
                  </span>

                  <span className="text-right text-[0.76rem] font-normal text-slate-300">
                    {field.hint}
                  </span>
                </label>

                <input
                  id={field.key}
                  type="number"
                  inputMode="decimal"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  placeholder={field.placeholder}
                  value={values[field.key]}
                  onChange={(e) =>
                    handleChange(
                      field.key,
                      e.target.value
                    )
                  }
                  aria-invalid={Boolean(
                    errors[field.key]
                  )}
                  className={`mt-1.5 w-full rounded-xl border bg-[#111a2b] px-4 py-2.5 text-[0.92rem] text-white outline-none transition-colors placeholder:text-slate-500 ${
                    errors[field.key]
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-[#263653] focus:border-gold'
                  }`}
                />

                {errors[field.key] && (
                  <p className="mt-1 text-[0.78rem] text-rose-400">
                    {errors[field.key]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-[#293653] pt-5">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl px-4 py-2 text-[0.86rem] font-medium text-slate-300 transition-colors hover:text-white"
            >
              Cancel
            </button>

            <Btn
              type="button"
              onClick={handleContinue}
            >
              Continue
            </Btn>

          </div>

        </div>
      </div>
    </div>
  )
} 

