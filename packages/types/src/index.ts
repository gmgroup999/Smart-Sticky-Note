export type NoteType =
  | 'idea'
  | 'decision'
  | 'goal'
  | 'learning'
  | 'task'
  | 'insight'
  | 'question'

export interface Note {
  id: string
  boardId: string
  workspaceId: string
  userId: string
  noteType: NoteType
  title: string
  summary: string | null
  details: string | null
  tags: string[]
  posX: number
  posY: number
  width: number
  height: number
  rotation: number
  archivedAt: string | null
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateNoteBody {
  title: string
  noteType?: NoteType
  posX?: number
  posY?: number
}

export interface UpdateNoteBody {
  title?: string
  summary?: string | null
  details?: string | null
  noteType?: NoteType
  posX?: number
  posY?: number
  tags?: string[]
}
