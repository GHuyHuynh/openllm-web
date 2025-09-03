//import type { Chat } from '@/lib/db/schema';
import {
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon, TrashIcon } from "@/components/ui/icons";
import { memo, useRef, useState } from "react";
import { type Chat } from "@/lib/db/schema";
import { PencilIcon } from "lucide-react";
import { Input } from "../ui/input";

const PureChatItem = ({
    chat,
    isActive,
    onDelete,
    setOpenMobile,
    onEditTitle,
}: {
    chat: Chat;
    isActive: boolean;
    onDelete: (chatId: string) => void;
    onEditTitle: (chatId: string, title: string) => void;
    setOpenMobile: (open: boolean) => void;
}) => {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState(chat.title);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmitEditTitle = () => {
        setIsEditingTitle(false);
        if (title.trim()) {
            onEditTitle(chat.id, title);
        }
    };

    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive}>
                {isEditingTitle ? (
                    <Input
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSubmitEditTitle();
                            }
                        }}
                        ref={inputRef}
                        value={title}
                        onFocus={(e) => e.currentTarget.select()}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={handleSubmitEditTitle}
                    />
                ) : (
                    <Link
                        to={`/chat/${chat.id}`}
                        onClick={() => setOpenMobile(false)}
                    >
                        <span>{chat.title}</span>
                    </Link>
                )}
            </SidebarMenuButton>

            <DropdownMenu modal={true}>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuAction
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground mr-0.5"
                        showOnHover={!isActive}
                    >
                        <MoreHorizontalIcon />
                        <span className="sr-only">More</span>
                    </SidebarMenuAction>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    side="bottom"
                    align="end"
                >
                    <DropdownMenuItem
                        className="cursor-pointer text-destructive focus:bg-destructive/15 focus:text-destructive dark:text-red-500"
                        onSelect={() => onDelete(chat.id)}
                    >
                        <TrashIcon />
                        <span>Delete</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer text-primary focus:bg-primary/15 focus:text-primary"
                        onSelect={() => {
                            setIsEditingTitle(true);
                            setTimeout(() => {
                                inputRef.current?.focus();
                            }, 0);
                        }}
                    >
                        <PencilIcon />
                        <span>Rename</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    );
};

export const ChatItem = memo(PureChatItem, (prevProps, nextProps) => {
    if (
        prevProps.isActive !== nextProps.isActive ||
        prevProps.chat.title !== nextProps.chat.title
    )
        return false;
    return true;
});
