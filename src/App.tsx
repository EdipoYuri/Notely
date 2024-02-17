import { useEffect, useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CaretSortIcon, CheckIcon, PlusIcon } from "@radix-ui/react-icons"
import { format } from 'date-fns'

import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Textarea } from "./components/ui/textarea"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "./components/ui/form"
import {
  Tabs,
  TabsList,
  TabsTrigger
} from "./components/ui/tabs"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "./components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from "./components/ui/command"
import { Checkbox } from "./components/ui/checkbox"
import NoteCard from "./components/ui/NoteCard"
import { cn } from "./lib/utils"
import NotesSVG from './assets/notes.svg'
import SearchSVG from './assets/search-results.svg'
import { SearchIcon } from "lucide-react"

const formSchema = z.object({
  title: z.string().max(50).min(3, {
    message: 'Insert a title'
  }),
  category: z.string().min(1, {
    message: 'Select a category'
  }),
  description: z.string().optional()
})

type TCategories = "personal" | "home" | "business"

type TCards = {
  id: number,
  title: string,
  category: TCategories,
  description?: string,
  createdAt?: string,
}

const options = [
  {
    value: 'personal',
    label: 'Personal',
    bgColor: 'orange-200',
    fontColor: 'orange-900'
  },
  {
    value: 'home',
    label: 'Home',
    bgColor: '#A5D6A7',
    fontColor: '#1B5E20'
  },
  {
    value: 'business',
    label: 'Business',
    bgColor: '#B39DDB',
    fontColor: '#4527A0'
  },
]

const gridCardsClass = "grid grid-flow-row gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"

const noCardsClass = "w-full pt-20 flex flex-row justify-center items-center"

function App() {
  const [cards, setCards] = useState<TCards[]>([])
  const [filteredCards, setFilteredCards] = useState<TCards[]>([])
  const [searchText, setSearchText] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [openCombobox, setOpenCombobox] = useState(false)
  const [tab, setTab] = useState('all')

  const getTodayDate = () => {
    const today = new Date();
    const formattedDate = format(today, 'dd/MM/yyyy');
    return formattedDate;
  }

  useEffect(() => {
    setFilteredCards(cards)
    setTab('all')
  }, [cards])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      category: '',
      description: ''
    }
  })

  const onChangeSearch = (value: string) => {
    setSearchText(value)

    if (tab !== 'all' && value !== '') {
      const cardsByCategory = cards.filter(item => item.category === tab && item.title.toUpperCase().includes(value.toUpperCase()))
      setFilteredCards(cardsByCategory)
      return
    }

    if (tab === 'all' && value !== '') {
      const cardsByCategory = cards.filter(item => item.title.toUpperCase().includes(value.toUpperCase()))
      setFilteredCards(cardsByCategory)
      return
    }

    if (tab !== 'all' && value === '') {
      const cardsByCategory = cards.filter(item => item.category === tab)
      setFilteredCards(cardsByCategory)
      return
    }

    setFilteredCards(cards)
  }

  const onChangeTab = (value: string) => {
    setTab(value)

    if (value !== 'all' && searchText !== '') {
      const cardsByCategory = cards.filter(item => item.category === value && item.title.toUpperCase().includes(searchText.toUpperCase()))
      setFilteredCards(cardsByCategory)
      return
    }

    if (value === 'all' && searchText !== '') {
      const cardsByCategory = cards.filter(item => item.title.toUpperCase().includes(searchText.toUpperCase()))
      setFilteredCards(cardsByCategory)
      return
    }

    if (value !== 'all' && searchText === '') {
      const cardsByCategory = cards.filter(item => item.category === value)
      setFilteredCards(cardsByCategory)
      return
    }

    setFilteredCards(cards)
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const id = cards.length === 0 ? 1 : cards[cards.length - 1].id + 1

    setCards([...cards, {
      ...values,
      id,
      category: values.category as TCategories,
      createdAt: getTodayDate()
    }])
    setOpenDialog(false)
    form.reset()
  }

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

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => form.reset()}>
              <PlusIcon className="mr-2 h-4 w-4" /> Add
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add note</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-x-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>

                        <FormControl>
                          <Input {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>

                        <FormControl>
                          <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openCombobox}
                                className="w-full justify-between font-normal"
                              >
                                {field.value
                                  ? options.find((options) => options.value === field.value)?.label
                                  : "Select framework..."}
                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent className="p-1 PopoverContent">
                              <Command>
                                <CommandEmpty>Options not found.</CommandEmpty>

                                <CommandGroup>
                                  {options.map(option => (
                                    <CommandItem
                                      key={option.value}
                                      value={option.value}
                                      onSelect={currentValue => {
                                        form.setValue('category', currentValue === field.value ? '' : currentValue)
                                        setOpenCombobox(false)
                                      }}
                                    >
                                      {option.label}

                                      <CheckIcon
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          field.value === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>

                          {/* <Input {...field} /> */}
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="col-span-2  mt-8">
                        <FormLabel className="flex flex-row items-center justify-between">
                          <p>
                            Description <span className="font-normal text-gray-300">(optional)</span>
                          </p>

                          <span className="font-normal text-gray-300">
                            {field.value?.length}/200
                          </span>
                        </FormLabel>

                        <FormControl>
                          <Textarea {...field} maxLength={200} rows={4} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="link" className="text-black">Cancel</Button>
                  </DialogClose>

                  <Button type="submit">Add</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
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
              <Checkbox id="terms" />

              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none text-gray-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Show only completed notes
              </label>
            </div>
          </div>

          <div className={cards.length === 0 || filteredCards.length === 0 ? noCardsClass : gridCardsClass}>
            {cards.length === 0 ? (
              <div className="flex flex-col justify-center items-center">
                <img src={NotesSVG} />
                <h2 className="mt-4 text-xl font-semibold">You don't have any notes</h2>
              </div>
            ) : filteredCards.length === 0 ? (
              <div className="flex flex-col justify-center items-center">
                <img src={SearchSVG} />
                <h2 className="mt-4 text-xl font-semibold">No notes found</h2>
              </div>
            ) : filteredCards.map(item => (
              <NoteCard cardValues={item} setTab={onChangeTab} />))}
          </div>
        </Tabs>
      </main>
    </div>
  )
}

export default App
