"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { SettingsIcon } from "@/app/components/icons/settings-icon";
import {
  LogOutIcon,
  Trash2Icon,
  LockIcon,
  HelpCircleIcon,
  MailIcon,
  MessageSquareIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteUser } from "@/app/api/users";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const supportPhone =
    process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+4917632795851";

  const handleCopy = async (text: string, type: "email" | "phone") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "email") {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else {
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
      }
    } catch (err) {
      // Silently fail if clipboard access is denied
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const handleDeleteAccount = async () => {
    if (!session?.user?.email) return;

    try {
      await deleteUser(session.user.email);
      toast.success("Account deleted successfully");
      // Sign out and redirect to home page
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center gap-2 pl-4">
          <SettingsIcon currentColor="hsl(var(--foreground))" />
          <h1 className="text-2xl font-semibold">Settings</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">
                  Cannot be changed when signed in with a third-party provider
                </p>
              </div>
              <Button variant="outline" disabled>
                <LockIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-[1px] w-full bg-border" />
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="font-medium">Password</p>
                <p className="text-sm text-muted-foreground">
                  Managed by your third-party provider
                </p>
              </div>
              <Button variant="outline" disabled>
                <LockIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Support</CardTitle>
            <CardDescription>Get help with your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MailIcon className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">Email Support</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Send us an email and we'll get back to you as soon as
                    possible
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">peermaute@gmail.com</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="gap-2 w-full sm:w-auto"
                    onClick={() => handleCopy("peermaute@gmail.com", "email")}
                  >
                    <MailIcon className="h-4 w-4" />
                    {copiedEmail ? "Copied!" : "Copy Email"}
                  </Button>
                </div>
              </div>
            </div>
            <div className="h-[1px] w-full bg-border" />
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MessageSquareIcon className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">Text Support</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Send us a text message for quick assistance
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{supportPhone}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="gap-2 w-full sm:w-auto"
                    onClick={() => handleCopy(supportPhone, "phone")}
                  >
                    <MessageSquareIcon className="h-4 w-4" />
                    {copiedPhone ? "Copied!" : "Copy Phone"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button
                variant="destructive"
                className="gap-2"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2Icon className="h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOutIcon className="h-4 w-4" />
          Log Out
        </Button>
      </div>

      {/* Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold mb-2">
              Are you absolutely sure?
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
