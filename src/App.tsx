import { useEffect, useState } from "react"

import { format } from 'date-fns'
import { SearchIcon } from "lucide-react"

import { Input } from "./components/ui/input"

import {
  Tabs,
  TabsList,
  TabsTrigger
} from "./components/ui/tabs"
import { Checkbox } from "./components/ui/checkbox"
import NoteCard from "./components/NoteCard"
import NotesSVG from './assets/notes.svg'
import SearchSVG from './assets/search-results.svg'
import DialogForm from "./components/DialogForm"

type TCategories = "personal" | "home" | "business"

type TNote = {
  id: number,
  title: string,
  category: TCategories,
  description?: string,
  createdAt?: string,
  completed: number
}

type TEditNote = {
  id?: number,
  title: string,
  category: TCategories,
  description?: string,
  createdAt?: string,
  completed: number
}

const hasNotesClass = "grid grid-flow-row gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"

const noNotesClass = "w-full pt-20 flex flex-row justify-center items-center"

function App() {
  const [notes, setNotes] = useState<TNote[]>([])
  const [filteredNotes, setFilteredNotes] = useState<TNote[]>([])
  const [searchText, setSearchText] = useState('')
  const [onlyCompleted, setOnlyCompleted] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [tab, setTab] = useState('all')
  const [editId, setEditId] = useState<number | null>(null)
  const [editItem, setEditItem] = useState<TNote | null>(null)

  const getTodayDate = () => {
    const today = new Date();
    const formattedDate = format(today, 'dd/MM/yyyy');
    return formattedDate;
  }

  useEffect(() => {
    setFilteredNotes(notes)
    setTab('all')
  }, [notes])

  useEffect(() => {
    const localNotes = localStorage.getItem('notes')

    if (!localNotes) return

    setNotes(JSON.parse(localNotes))
    setFilteredNotes(JSON.parse(localNotes))
    setTab('all')
  }, [])

  const onChangeSearch = (value: string) => {
    setSearchText(value)

    if (tab !== 'all' && value !== '') {
      const notesByCategory = notes.filter(
        item => item.category === tab && item.title.toUpperCase().includes(value.toUpperCase())
      )
      setFilteredNotes(notesByCategory)
      return
    }

    if (tab === 'all' && value !== '') {
      const notesByCategory = notes.filter(
        item => item.title.toUpperCase().includes(value.toUpperCase())
      )
      setFilteredNotes(notesByCategory)
      return
    }

    if (tab !== 'all' && value === '') {
      const notesByCategory = notes.filter(item => item.category === tab)
      setFilteredNotes(notesByCategory)
      return
    }

    setFilteredNotes(notes)
  }

  const onChangeTab = (value: string) => {
    setTab(value)

    if (value !== 'all' && searchText !== '') {
      const notesByCategory = notes.filter(
        item => item.category === value && item.title.toUpperCase().includes(searchText.toUpperCase())
      )
      setFilteredNotes(notesByCategory)
      return
    }

    if (value === 'all' && searchText !== '') {
      const notesByCategory = notes.filter(
        item => item.title.toUpperCase().includes(searchText.toUpperCase())
      )
      setFilteredNotes(notesByCategory)
      return
    }

    if (value !== 'all' && searchText === '') {
      const notesByCategory = notes.filter(item => item.category === value)
      setFilteredNotes(notesByCategory)
      return
    }

    setFilteredNotes(notes)
  }

  const onSubmit = (data: TEditNote) => {
    if (data.id) {
      const edittedNotes = notes.map(item => item.id === editId
        ? {
          ...item,
          ...data,
          category: data.category as TCategories
        }
        : item
      )

      setNotes(edittedNotes)
      localStorage.setItem('notes', JSON.stringify(edittedNotes))
      setOpenDialog(false)
      setEditId(null)

      return
    }

    const orderedId = notes.sort((a, b) => a.id - b.id)

    const id = orderedId.length === 0 ? 1 : orderedId[orderedId.length - 1].id + 1

    const newNotes = [...notes, {
      ...data,
      id,
      category: data.category as TCategories,
      createdAt: getTodayDate(),
      completed: 0
    }]

    setNotes(newNotes)

    localStorage.setItem('notes', JSON.stringify(newNotes))

    setOpenDialog(false)
  }

  const onClickDeleteNote = (id: number) => {
    const filteredNotes = notes.filter(item => item.id !== id)

    setNotes(filteredNotes)
    localStorage.setItem('notes', JSON.stringify(filteredNotes))
  }

  const onClickEditNote = (id: number) => {
    const editNoteValues = notes.find(item => item.id === id)

    if (!editNoteValues) return

    setEditId(id)
    setEditItem(editNoteValues)
    setOpenDialog(true)
  }

  const onClickChangeStatus = (id: number) => {
    const noteCompleteFilter = notes.map(item => item.id === id
      ? { ...item, completed: item.completed ? 0 : 1 }
      : item
    )

    setNotes(noteCompleteFilter)
    localStorage.setItem('notes', JSON.stringify(noteCompleteFilter))
  }

  const completedNotes = filteredNotes.filter(note => note.completed)

  return (
    <div className="w-full h-full min-h-screen bg-gray-200 m">
      <header className="bg-white sticky w-full top-0 p-4 px-10 flex flex-row align-middle justify-between shadow-md">
        <div className="relative flex items-center w-full">
          <SearchIcon className="absolute text-gray-500 left-3 cursor-text pointer-events-none" />

          <Input
            className="mr-5 pl-10 pr-3 py-2 text-md w-full border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6E23DD] focus:border-transparent"
            id="searchInput"
            value={searchText}
            onChange={e => onChangeSearch(e.target.value)}
          />
        </div>

        <DialogForm
          editNoteData={editItem}
          sendNoteData={onSubmit}
          open={openDialog}
          setOpen={setOpenDialog}
        />
      </header>

      <main className="p-12 pt-8">
        <h1 className="font-semibold text-2xl mb-4">Your notes</h1>

        <Tabs value={tab} onValueChange={onChangeTab}>
          <div className="flex flex-row flex-wrap justify-between items-center w-full h-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="home">Home</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2 pl-6 mb-4">
              <Checkbox
                id="terms"
                onCheckedChange={() => setOnlyCompleted(!onlyCompleted)}
                checked={onlyCompleted}
              />

              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none text-gray-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Show only completed notes
              </label>
            </div>
          </div>

          <div className={notes.length === 0 || filteredNotes.length === 0 || (onlyCompleted && completedNotes.length === 0)
            ? noNotesClass
            : hasNotesClass
          }>
            {notes.length === 0 || (onlyCompleted && completedNotes.length === 0) ? (
              <div className="flex flex-col justify-center items-center">
                <img src={NotesSVG} />
                <h2 className="mt-4 text-xl font-semibold">
                  {onlyCompleted ? 'You don\'t have any completed notes' : 'You don\'t have any notes'}
                </h2>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="flex flex-col justify-center items-center">
                <img src={SearchSVG} />
                <h2 className="mt-4 text-xl font-semibold">No notes found</h2>
              </div>
            ) : onlyCompleted ? completedNotes.map(item => (
              <NoteCard
                data={item}
                setTab={onChangeTab}
                deleteNote={onClickDeleteNote}
                editNote={onClickEditNote}
                changeStatus={onClickChangeStatus}
              />
            )) : filteredNotes
              .sort((a, b) => b.id - a.id)
              .sort((a, b) => a.completed - b.completed)
              .map(item => {
                if (onlyCompleted && !item.completed) return

                return (
                  <NoteCard
                    data={item}
                    setTab={onChangeTab}
                    deleteNote={onClickDeleteNote}
                    editNote={onClickEditNote}
                    changeStatus={onClickChangeStatus}
                  />
                )
              })
            }
          </div>
        </Tabs>
      </main>
    </div>
  )
}

export default App
