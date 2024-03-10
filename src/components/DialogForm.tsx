import { useEffect, useState } from "react"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CaretSortIcon, CheckIcon, PlusIcon } from "@radix-ui/react-icons"

import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "./ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "./ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from "./ui/command"
import { cn } from "../lib/utils"
import { Input } from "./ui/input"

type TCategories = "personal" | "home" | "business"

type TEditNote = {
  id: number,
  title: string,
  category: TCategories,
  description?: string,
  createdAt?: string,
  completed: number
}

type TNotes = {
  id?: number,
  title: string,
  category: TCategories,
  description?: string,
  createdAt?: string,
  completed: number
}

type TProps = {
  open: boolean,
  setOpen: (value: boolean) => void,
  editNoteData: TEditNote | null,
  sendNoteData: (values: TNotes) => void
}

const formSchema = z.object({
  title: z.string().max(50).min(3, {
    message: 'Insert a title'
  }),
  category: z.string().min(1, {
    message: 'Select a category'
  }),
  description: z.string().optional()
})

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

const DialogForm = (props: TProps) => {
  const { open, setOpen, editNoteData, sendNoteData } = props

  const [openCombobox, setOpenCombobox] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      category: '',
      description: '',
    }
  })

  useEffect(() => {
    if (!editNoteData?.id) form.reset()
  }, [editNoteData, form])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    sendNoteData({
      ...editNoteData,
      ...values,
      category: values.category as TCategories,
      completed: 0
    })
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => form.reset()}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editNoteData ? 'Edit' : 'Add'} note</DialogTitle>
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
                                    form.setValue(
                                      'category',
                                      currentValue === field.value ? '' : currentValue
                                    )
                                    setOpenCombobox(false)
                                  }}
                                >
                                  {option.label}

                                  <CheckIcon
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      field.value === option.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
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
  )
}

export default DialogForm