import { useNavigate } from 'react-router';
import { useState, useRef } from 'react';
import { toast } from 'sonner';

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
import { deleteUserAndReinitialize } from '@/services/user-service';

export function AppSidebar() {
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const refreshSidebarHistory = useRef<(() => void) | null>(null);

  const handleDeleteAll = async () => {
    const deletePromise = deleteUserAndReinitialize();

    toast.promise(deletePromise, {
      loading: 'Deleting all data...',
      success: () => {
        setShowDeleteAllDialog(false);
        // Refresh the sidebar history
        if (refreshSidebarHistory.current) {
          refreshSidebarHistory.current();
        }
        // Redirect to home page to reinitialize user
        navigate('/');
        return 'All data deleted successfully';
      },
      error: 'Failed to delete data',
    });
  };

  return (
    <>
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
          <SidebarHistory 
            onRefreshNeeded={(refreshFn: () => void) => {
              refreshSidebarHistory.current = refreshFn;
            }}
          />
        </SidebarContent>
        <SidebarFooter>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setShowDeleteAllDialog(true)}
              >
                <TrashIcon size={16} />
                <span className="ml-2">Delete All</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete all conversations and start fresh</TooltipContent>
          </Tooltip>
        </SidebarFooter>
      </Sidebar>

      <AlertDialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Conversations?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all your
              conversations and messages. The page will refresh to start fresh.
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
    </>
  );
}
