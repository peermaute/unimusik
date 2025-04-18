"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUsers } from "@/app/api/users";
import { User } from "@/app/types/User";
import { Skeleton } from "@/app/components/ui/skeleton";
import UserCard from "@/app/components/UserCard";
import { useRouter } from "next/navigation";

const UserCardSkeleton = () => (
  <div className="w-full max-w-[400px] mx-auto md:max-w-none">
    <div className="rounded-lg bg-card shadow-sm h-[350px] overflow-hidden">
      <Skeleton className="h-full w-full" />
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-5 w-32" />
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
      <div className="grid gap-6 max-w-7xl mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            <UserCardSkeleton />
            <UserCardSkeleton />
            <UserCardSkeleton />
          </>
        ) : userList.length === 0 ? (
          <div className="flex items-center justify-center h-32 col-span-full">
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          userList.map((user) => (
            <div
              className="w-full max-w-[400px] mx-auto md:max-w-none cursor-pointer"
              key={user.id}
              onClick={() => router.push(`/users/${user.id}`)}
            >
              <UserCard user={user} className="h-[350px]" showDetails={true} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
