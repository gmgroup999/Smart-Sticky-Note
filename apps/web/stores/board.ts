import { create } from 'zustand'
import type { Note } from '@neo/types'

interface BoardState {
  notes: Note[]
  pan: { x: number; y: number }
  zoom: number
  selectedNoteId: string | null
  setNotes:    (notes: Note[]) => void
  addNote:     (note: Note) => void
  updateNote:  (id: string, patch: Partial<Note>) => void
  removeNote:  (id: string) => void
  setPan:      (pan: { x: number; y: number }) => void
  setZoom:     (zoom: number) => void
  selectNote:  (id: string | null) => void
}

export const useBoardStore = create<BoardState>((set) => ({
  notes:          [],
  pan:            { x: 0, y: 0 },
  zoom:           1,
  selectedNoteId: null,

  setNotes:   (notes) => set({ notes }),
  addNote:    (note)  => set((s) => ({ notes: [...s.notes, note] })),
  removeNote: (id)    => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
  selectNote: (id)    => set({ selectedNoteId: id }),

  updateNote: (id, patch) =>
    set((s) => ({
      notes: s.notes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    })),

  setPan:  (pan)  => set({ pan }),
  setZoom: (zoom) => set({ zoom }),
}))
