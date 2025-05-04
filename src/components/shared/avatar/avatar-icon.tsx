import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const AvatarIcon = () => (
<div className="flex justify-end mr-2 p-3">
    <Avatar className="w-10 h-10">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
    </Avatar>
</div>
)