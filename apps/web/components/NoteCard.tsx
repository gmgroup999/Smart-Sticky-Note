'use client'
import { useRef, useState } from 'react'
import type { Note } from '@neo/types'
import { useBoardStore } from '../stores/board'

const NOTE_COLORS: Record<string, string> = {
  idea:     '#fef08a',
  decision: '#93c5fd',
  goal:     '#86efac',
  learning: '#d8b4fe',
  task:     '#fdba74',
  insight:  '#f9a8d4',
  question: '#fca5a5',
}

function getNoteRotation(id: string): number {
  const hex = id.replace(/-/g, '')
  return ((parseInt(hex.slice(-8), 16) % 401) - 200) / 100
}

const API = process.env.NEXT_PUBLIC_API_URL ?? '/api'

interface Props {
  note: Note
  zoom: number
}

export default function NoteCard({ note, zoom }: Props) {
  const { updateNote, selectNote, selectedNoteId } = useBoardStore()
  const [editing, setEditing]   = useState(false)
  const [draft, setDraft]       = useState(note.title)
  const dragStart = useRef<{ mx: number; my: number; px: number; py: number } | null>(null)

  const rotation   = getNoteRotation(note.id)
  const bg         = NOTE_COLORS[note.noteType] ?? '#fef08a'
  const isSelected = selectedNoteId === note.id

  function onMouseDown(e: React.MouseEvent) {
    if (editing) return
    e.stopPropagation()
    selectNote(note.id)
    dragStart.current = { mx: e.clientX, my: e.clientY, px: note.posX, py: note.posY }

    function onMove(e: MouseEvent) {
      if (!dragStart.current) return
      const dx = (e.clientX - dragStart.current.mx) / zoom
      const dy = (e.clientY - dragStart.current.my) / zoom
      updateNote(note.id, {
        posX: dragStart.current.px + dx,
        posY: dragStart.current.py + dy,
      })
    }

    function onUp(e: MouseEvent) {
      if (!dragStart.current) return
      const dx    = (e.clientX - dragStart.current.mx) / zoom
      const dy    = (e.clientY - dragStart.current.my) / zoom
      const posX  = dragStart.current.px + dx
      const posY  = dragStart.current.py + dy
      dragStart.current = null
      fetch(`${API}/notes/${note.id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ posX, posY }),
      })
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  function onDoubleClick(e: React.MouseEvent) {
    e.stopPropagation()
    setEditing(true)
    setDraft(note.title)
  }

  async function commitEdit() {
    setEditing(false)
    const title = draft.trim() || note.title
    if (title === note.title) return
    updateNote(note.id, { title })
    fetch(`${API}/notes/${note.id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ title }),
    })
  }

  return (
    <div
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
      style={{
        position:        'absolute',
        left:            note.posX,
        top:             note.posY,
        width:           note.width  || 240,
        minHeight:       note.height || 160,
        background:      bg,
        borderRadius:    4,
        padding:         '12px 14px 28px',
        transform:       `rotate(${rotation}deg)`,
        transformOrigin: 'center center',
        cursor:          editing ? 'text' : 'grab',
        boxShadow:       isSelected
          ? '0 0 0 2px #6366f1, 0 6px 20px rgba(0,0,0,0.5)'
          : '2px 4px 14px rgba(0,0,0,0.35)',
        userSelect:      'none',
        zIndex:          isSelected ? 10 : 1,
        boxSizing:       'border-box',
      }}
    >
      {editing ? (
        <textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitEdit() }
            if (e.key === 'Escape') { setEditing(false); setDraft(note.title) }
          }}
          style={{
            width:       '100%',
            minHeight:   80,
            background:  'transparent',
            border:      'none',
            outline:     'none',
            resize:      'none',
            fontFamily:  'inherit',
            fontSize:    14,
            fontWeight:  600,
            color:       '#1e293b',
            cursor:      'text',
            lineHeight:  1.5,
          }}
        />
      ) : (
        <p style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', lineHeight: 1.5 }}>
          {note.title}
        </p>
      )}

      <div style={{
        position:   'absolute',
        bottom:     8,
        right:      10,
        fontSize:   10,
        color:      '#475569',
        opacity:    0.7,
        fontWeight: 500,
      }}>
        {note.noteType}
      </div>
    </div>
  )
}
