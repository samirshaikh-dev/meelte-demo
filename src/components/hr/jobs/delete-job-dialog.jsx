"use client";

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle } from "@/lib/icons";
import { Button } from "@/components/ui/button";

export function DeleteJobDialog({ isOpen, onClose, onConfirm, jobTitle }) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/40 transition-opacity duration-150 ease-out starting:opacity-0" />

        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-2xl border border-border bg-surface p-6 shadow-card transition duration-150 ease-out starting:scale-95 starting:opacity-0 focus-visible:outline-none">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-error-bg text-error">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            </div>

            <div className="flex-1">
              <Dialog.Title className="text-base font-semibold text-foreground">
                Delete Job Posting?
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-xs leading-5 text-foreground-secondary">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-foreground">&ldquo;{jobTitle || "this job"}&rdquo;</span>?
                This action cannot be undone and will remove all associated application links.
              </Dialog.Description>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-2.5">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-error px-4 text-xs font-semibold text-white transition-colors hover:bg-error/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2"
            >
              Delete Job
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default DeleteJobDialog;

