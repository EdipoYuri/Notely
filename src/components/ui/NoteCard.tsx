import { Pencil, Trash2 } from 'lucide-react'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "../ui/card"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"

type TCategories = "personal" | "home" | "business"

type TCards = {
  id: number,
  title: string,
  category: TCategories,
  description?: string,
  createdAt?: string,
}

type TProps = {
  cardValues: TCards,
  setTab: (tab: "personal" | "home" | "business") => void
}

const NoteCard = (props: TProps) => {
  const { cardValues, setTab } = props

  return (
    <Card className="w-full" key={cardValues.id}>
      <CardHeader className="flex flex-row justify-between align-middle pb-2">
        <Button
          variant={cardValues.category}
          onClick={() => setTab(cardValues.category)}
          className="w-min capitalize rounded-full">
          {cardValues.category}
        </Button>

        <div className="flex flex-row justify-center items-center gap-1">
          <Checkbox className="mr-2" />

          <Button variant="ghost" className="w-fit px-2">
            <Pencil size={18} />
          </Button>

          <Button variant="ghost" className="w-fit px-2">
            <Trash2 size={18} />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <CardTitle className="font-semibold text-2xl mb-2">{cardValues.title}</CardTitle>
        <p className="font-normal text-base">{cardValues.description}</p>
      </CardContent >

      <CardFooter className="flex flex-row justify-end">
        <p className="font-normal text-xs text-gray-600">{cardValues.createdAt}</p>
      </CardFooter>
    </Card>
  )
}

export default NoteCard