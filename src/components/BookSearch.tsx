import { RadioGroup, RadioGroupItem } from "./shadcn/ui/radio-group";
import { useEffect, useState } from "react";

import { Button } from "./shadcn/ui/button";
import { Card } from "./shadcn/ui/card";
import { Input } from "./shadcn/ui/input";
import { Label } from "./shadcn/ui/label";
import { useRouter } from "next/router";

export type SearchType = 'title' | 'author' | 'isbn' | 'all'

export default function BookSearch() {
    const router = useRouter();
    const { query } = router;
    const [search, setSearch] = useState(query.q ? query.q.toString() : '')
    useEffect(() => { setSearch(query.q ? query.q.toString() : '') }, [query.q])

    const radioItems: { value: SearchType, label: string }[] = [
        { value: 'title', label: 'Title' },
        { value: 'author', label: 'Author' },
        { value: 'isbn', label: 'ISBN' },
        { value: 'all', label: 'All Fields' }
    ]

    const [selectedRadio, setSelectedRadio] = useState(query.search ? query.search.toString() : 'all')
    const handleRadioChange = (e: string) => {
        setSelectedRadio(e)
    }

    return (
        <Card className="flex items-start bg-white w-full flex-col gap-3 p-4">
            <div className="w-full flex items-center justify-center gap-3">
                <Input
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') router.push({ query: { ...query, q: search, page: '1', radio: selectedRadio } }) }}
                    className="bg-white"

                />

                <Button onClick={() => router.push({ query: { ...query, q: search, page: '1' } })}>Search</Button>
            </div>

            <RadioGroup className="flex items-center gap-3" defaultValue="all" value={selectedRadio} onValueChange={(value) => handleRadioChange(value)}>
                {radioItems.map((item, index) => (
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value={item.value} key={index} id={item.value} className={`${selectedRadio === item.value ? `bg-grey` : `bg-white`} text-transparent `} />
                        <Label htmlFor={item.value}>{item.label}</Label>
                    </div>
                ))}
            </RadioGroup>
        </Card>
    )
}