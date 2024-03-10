import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "./ui/card"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './ui/tooltip'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from './ui/dialog'

type TCategories = "personal" | "home" | "business"

type TNotes = {
  id: number,
  title: string,
  category: TCategories,
  description?: string,
  createdAt?: string,
  completed?: number
}

type TProps = {
  data: TNotes,
  setTab: (tab: "personal" | "home" | "business") => void,
  deleteNote: (id: number) => void,
  editNote: (id: number) => void,
  changeStatus: (id: number) => void
}

const NoteCard = (props: TProps) => {
  const {
    data,
    setTab,
    deleteNote,
    editNote,
    changeStatus
  } = props

  const [openDialog, setOpenDialog] = useState(false)

  const onPressDelete = () => {
    setOpenDialog(false)

    setTimeout(() => {
      deleteNote(data.id)
    }, 200)
  }

  return (
    <Card className={`w-full flex flex-col justify-between ${data.completed ? 'opacity-35' : ''}`} key={data.id}>
      <div>
        <CardHeader className="flex flex-row justify-between align-middle pb-2">
          <Button
            variant={data.completed ? 'default' : data.category}
            onClick={() => setTab(data.category)}
            className={data.completed
              ? 'w-min capitalize rounded-full bg-gray-400 text-black font-normal'
              : 'w-min capitalize rounded-full'
            }
          >
            {data.category}
          </Button>

          <div className="flex flex-row justify-center items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger onClick={() => changeStatus(data.id)}>
                  <Checkbox className="mr-2" checked={Boolean(data.completed) || false} />
                </TooltipTrigger>

                <TooltipContent>
                  <p>Mark as completed</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    className="w-fit px-2 rounded-full"
                    onClick={() => editNote(data.id)}
                    disabled={Boolean(data.completed)}
                  >
                    <Pencil size={18} />
                  </Button>
                </TooltipTrigger>

                <TooltipContent>
                  <p>Edit</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    className="w-fit px-2 rounded-full"
                    onClick={() => setOpenDialog(true)}
                    disabled={Boolean(data.completed)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </TooltipTrigger>

                <TooltipContent>
                  <p>Delete</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>

        <CardContent>
          <CardTitle className={`font-semibold text-2xl mb-2 break-words ${data.completed && 'line-through'}`}>
            {data.title}
          </CardTitle>

          <p className={`font-normal text-base break-words ${data.completed && 'line-through'}`}>
            {data.description}
          </p>
        </CardContent>
      </div>

      <div>
        <CardFooter className="flex flex-row justify-end ">
          <p className="font-normal text-xs text-gray-600">{data.createdAt}</p>
        </CardFooter>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Delete note</DialogTitle>
          </DialogHeader>

          <p>Are you sure you want to delete this note?</p>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="link" className="text-black">Cancel</Button>
            </DialogClose>

            <Button
              onClick={() => onPressDelete()}
              variant="destructive"
              className="rounded-full"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default NoteCard