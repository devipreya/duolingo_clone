"use client";
import { useParams } from "next/navigation";
import { useFetch } from "@/lib/hooks";
import LessonPlayer from "@/components/lesson/LessonPlayer";
import { Duo } from "@/components/ui/Duo";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { data, error } = useFetch<any>(`/api/lessons/${id}`);
  if (error) return <p className="p-10 text-center font-bold text-duo-red">{error}</p>;
  if (!data) return <div className="grid min-h-screen place-items-center"><div className="animate-bob"><Duo size={96} /></div></div>;
  return <LessonPlayer lesson={data} />;
}
