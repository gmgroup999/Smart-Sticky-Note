'use client'
import { useRef, useCallback } from 'react'
import { useBoardStore } from '../stores/board'
import NoteCard from './NoteCard'

export default function BoardCanvas() {
  const { notes, pan, zoom, setPan, setZoom, selectNote } = useBoardStore()
  const isPanning  = useRef(false)
  const lastMouse  = useRef({ x: 0, y: 0 })

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    isPanning.current  = true
    lastMouse.current  = { x: e.clientX, y: e.clientY }
    selectNote(null)
  }, [selectNote])

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning.current) return
    const dx = e.clientX - lastMouse.current.x
    const dy = e.clientY - lastMouse.current.y
    lastMouse.current  = { x: e.clientX, y: e.clientY }
    setPan({ x: pan.x + dx, y: pan.y + dy })
  }, [pan, setPan])

  const onMouseUp = useCallback(() => {
    isPanning.current = false
  }, [])

  const onWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault()
    const factor = e.deltaY > 0 ? 0.92 : 1.08
    setZoom(Math.min(3, Math.max(0.15, zoom * factor)))
  }, [zoom, setZoom])

  return (
    <div
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onWheel={onWheel}
      style={{
        width:    '100vw',
        height:   '100vh',
        overflow: 'hidden',
        position: 'relative',
        cursor:   'default',
      }}
    >
      <div
        style={{
          position:        'absolute',
          top:             0,
          left:            0,
          transformOrigin: '0 0',
          transform:       `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} zoom={zoom} />
        ))}
      </div>
    </div>
  )
}
