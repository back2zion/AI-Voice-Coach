import { Button } from "@/components/ui/button";
import { UserButton } from "@stackframe/stack";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h2>Home</h2>

      <Button variant={'destructive'}>Don't Click</Button>
      <UserButton />
    </div>
  );
}
