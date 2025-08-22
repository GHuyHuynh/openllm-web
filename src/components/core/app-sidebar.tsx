import { useNavigate } from 'react-router';
import { PlusIcon, TrashIcon } from '@/components/ui/icons';
import { SidebarHistory } from '@/components/core/sidebar-history';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Link } from 'react-router';
import { useUserId } from '@/hooks/use-user-id';
import { deleteAllUserDataAction } from '@/actions/commons';
import { toast } from 'sonner';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();
  const userId = useUserId();
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);

  const handleDeleteAll = async () => {
    if (!userId) return;

    const deletePromise = deleteAllUserDataAction({ userId });

    toast.promise(deletePromise, {
      loading: 'Deleting all chat history...',
      success: () => {
        navigate('/');
        setShowDeleteAllDialog(false);
        // Force refresh the page to clear any cached data
        window.location.reload();
        return 'All chat history deleted successfully';
      },
      error: 'Failed to delete chat history',
    });
  };

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link
              to="/"
              onClick={() => {
                setOpenMobile(false);
              }}
              className="flex flex-row gap-3 items-center"
            >
              <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
                Chatbot
              </span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 h-fit"
                  onClick={() => {
                    setOpenMobile(false);
                    navigate('/');
                  }}
                >
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end">New Chat</TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarHistory userId={userId} />
      </SidebarContent>
      <SidebarFooter className="pb-safe-area-inset-bottom md:pb-0 mb-4 md:mb-0">
        <SidebarMenu>
          <div className="flex flex-row justify-center items-center">
                          <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className={cn("w-full justify-start cursor-pointer text-destructive focus:bg-destructive/15 focus:text-destructive dark:text-red-500 hover:bg-destructive/15 hover:text-destructive h-8 px-2 text-sm font-normal bg-transparent border-0 rounded-sm gap-2")}
                    onClick={() => setShowDeleteAllDialog(true)}
                  >
                    <TrashIcon />
                    <span>Delete All</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent align="center">Delete All Chats</TooltipContent>
              </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarFooter>

      <AlertDialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Chat History?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all your
              chat conversations and remove them from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
}
