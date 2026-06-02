'use client'
import { useEffect, useState } from 'react'
import type { Note, CreateNoteBody } from '@neo/types'
import { useBoardStore } from '../stores/board'
import BoardCanvas from '../components/BoardCanvas'

const API = process.env.NEXT_PUBLIC_API_URL ?? '/api'

export default function HomePage() {
  const { setNotes, addNote } = useBoardStore()
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API}/notes`)
      .then((r) => {
        if (!r.ok) throw new Error(`API ${r.status}`)
        return r.json()
      })
      .then((data: Note[]) => { setNotes(data); setLoading(false) })
      .catch((err) => { setError(err.message); setLoading(false) })
  }, [setNotes])

  async function createNote() {
    const body: CreateNoteBody = {
      title: 'New Note',
      posX:  Math.round(Math.random() * 600 + 200),
      posY:  Math.round(Math.random() * 400 + 100),
    }
    const res  = await fetch(`${API}/notes`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    })
    const note: Note = await res.json()
    addNote(note)
  }

  if (loading) {
    return (
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        height:         '100vh',
        color:          '#94a3b8',
        fontSize:       15,
      }}>
        Loading…
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        height:         '100vh',
        color:          '#f87171',
        gap:            12,
      }}>
        <p style={{ fontSize: 15 }}>Cannot reach API</p>
        <code style={{ fontSize: 12, color: '#94a3b8' }}>{error}</code>
      </div>
    )
  }

  return (
    <>
      <BoardCanvas />
      <button
        onClick={createNote}
        style={{
          position:   'fixed',
          bottom:     32,
          right:      32,
          zIndex:     100,
          background: '#6366f1',
          color:      '#fff',
          border:     'none',
          borderRadius: 8,
          padding:    '12px 22px',
          fontSize:   15,
          fontWeight: 600,
          cursor:     'pointer',
          boxShadow:  '0 4px 16px rgba(99,102,241,0.45)',
          transition: 'transform 0.1s',
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
        onMouseUp={(e)   => (e.currentTarget.style.transform = 'scale(1)')}
      >
        + New Note
      </button>
    </>
  )
}
