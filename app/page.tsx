'use client'


import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { X, XCircle } from "lucide-react";


interface Formation {
  name: string,
  positions: Position[]
}

interface Position {
  name: string,
  position_number: number
}

interface PlayerPosition {
  player_name: string,
  position_number: number,
  position_name: string
}

const formations : Formation[] = [
  {
    name: "4-3-3",
    positions: [
      { name: "Keeper", position_number: 1 },
      { name: "Right back", position_number: 2 },
      { name: "Left back", position_number: 3 },
      { name: "Center back 1", position_number: 4 },
      { name: "Center back 2", position_number: 5 },
      { name: "Defensive Midfielder", position_number: 6 },
      { name: "Central Midfielder 1", position_number: 7 },
      { name: "Central Midfielder 2", position_number: 8 },
      { name: "Right Winger", position_number: 9 },
      { name: "Left Winger", position_number: 10 },
      { name: "Striker", position_number: 11 }
    ]
  },
  {
    name: "4-4-2",
    positions: [
      { name: "Keeper", position_number: 1 },
      { name: "Right back", position_number: 2 },
      { name: "Left back", position_number: 3 },
      { name: "Center back 1", position_number: 4 },
      { name: "Center back 2", position_number: 5 },
      { name: "Right Midfielder", position_number: 6 },
      { name: "Central Midfielder 1", position_number: 7 },
      { name: "Central Midfielder 2", position_number: 8 },
      { name: "Left Midfielder", position_number: 9 },
      { name: "Striker 1", position_number: 10 },
      { name: "Striker 2", position_number: 11 }
    ]
  },
];


export default function Home() {

  const [names, setNames] = useState("")
  const [formation, setFormation] = useState<number>(-1)
  const [isPending, startTransition] = useTransition()
  const [generatedFormation, setGeneratedFormation] = useState<PlayerPosition[]>([])

  const generateFormation = () => {
    startTransition(async () => {
      if(formation < 0 || names === "") {
        toast.error("Some fields are not filled..")
        return
      }

      const currentFormation = formations[formation!]
      const currentNames = shuffle(names.split("\n"))

      let positionSet: PlayerPosition[] = []

      for(let i = 0; currentNames.length > i; i++) {
        if (currentFormation.positions[i]) {
          positionSet.push({position_name: currentFormation.positions[i].name, position_number: currentFormation.positions[i].position_number, player_name: currentNames[i] })
          continue
        }
        positionSet.push({position_name: "Bench", position_number: -1, player_name: currentNames[i] })
      }
      setGeneratedFormation((prev) => prev = positionSet)
      toast.success("Formation succesfully created!")
    })
  }

  const shuffle = (array: string[]) => { 
    for (let i = array.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]]; 
    } 
    return array; 
  }; 

  return (
    <>
    <main className="flex min-h-screen flex-col items-center p-24 gap-6">
      <div className="text-center w-1/3">
        <h2 className="font-bold text-xl">Random position picker for Football</h2>
        <p className="opacity-75">A random position picker for football. Especially for teams that don't know how to play</p>
      </div>

      <div className="bg-white w-1/3 rounded-md p-12 shadow-md">
        <h3 className="font-bold">Generate a position for your team</h3>

        {generatedFormation.length > 0 && (
        <div className="p-6 bg-orange-100 my-3 rounded-md shadow-sm">
            <div className="flex justify-between">
              <h4 className="font-bold mb-2">Generated formation:</h4>
              <button onClick={() => setGeneratedFormation((prev) => prev = [])} className="bg-white ease-in-out transition-all duration-300 hover:bg-gray-100 bg p-1.5 rounded-xl"><X /></button>
            </div>
            {
              generatedFormation.map(({player_name, position_name, position_number}, index) => (
                <div key={index}>{position_name} ({position_number}) - {player_name}</div>
              ))
            }
        </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="py-3">
            <label className="text-sm">Names</label>
            <Textarea onChange={(e) => setNames(e.target.value)} placeholder="Names splitted by Enter"></Textarea>
          </div>

          <div className="py-3">
            <label className="text-sm">Formation</label>
            <Select onValueChange={(value) => setFormation(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select formation" />
              </SelectTrigger>
              <SelectContent>
                {formations.map((item, index) => (
                  <SelectItem key={index} value={String(index)}>{item.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={generateFormation} disabled={isPending} className="p-4 transition-all ease-in-out">{isPending ? "Generating.." : "Generate"}</Button>
        </div>
      </div>

    </main>
    <Toaster />
    </>
  );
}
