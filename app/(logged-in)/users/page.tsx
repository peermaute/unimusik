"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUsers } from "@/app/api/users";
import { User } from "@/app/types/User";
import { Skeleton } from "@/app/components/ui/skeleton";
import UserCard from "@/app/components/UserCard";
import { useRouter } from "next/navigation";

const UserCardSkeleton = () => (
  <div className="rounded-lg bg-card p-4 shadow-sm">
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0">
        <Skeleton className="h-14 w-14 rounded-full" />
      </div>
      <div className="flex flex-col min-w-0 flex-1 space-y-2">
        <Skeleton className="h-5 w-32" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  </div>
);

export default function UsersPage() {
  const router = useRouter();
  const [userList, setUserList] = useState<User[]>([]);
  const [dbUsers, setDbUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const handleFilterChange = (value: string) => {
    setActiveTab(value);
    if (value === "all") {
      setUserList(dbUsers);
    } else {
      setUserList(
        dbUsers.filter(
          (user) =>
            user.ensemble?.toLowerCase() === value ||
            user.ensemble === "Kammerchor & Orchester"
        )
      );
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsers();
        // Sort users with peermaute@gmail.com at the top, then alphabetically by name
        const sortedUsers = users.sort((a, b) => {
          if (a.email === "peermaute@gmail.com") return -1;
          if (b.email === "peermaute@gmail.com") return 1;
          return a.name.localeCompare(b.name);
        });
        setDbUsers(sortedUsers);
        setUserList(sortedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-col gap-4 items-center">
        <Tabs
          value={activeTab}
          onValueChange={handleFilterChange}
          className="w-full flex justify-center"
        >
          <TabsList className="grid grid-cols-3 min-w-[280px]">
            <TabsTrigger value="all">Alle</TabsTrigger>
            <TabsTrigger value="kammerchor">Kammerchor</TabsTrigger>
            <TabsTrigger value="orchester">Orchester</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="grid gap-6 max-w-2xl mx-auto">
        {isLoading ? (
          <>
            <UserCardSkeleton />
            <UserCardSkeleton />
            <UserCardSkeleton />
          </>
        ) : userList.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          userList.map((user) => (
            <div
              className="w-full cursor-pointer"
              key={user.id}
              onClick={() => router.push(`/users/${user.id}`)}
            >
              <UserCard user={user} className="h-[300px]" showDetails={true} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
