"use client"; // yeh javascript puri ki puri browser pe ship hogi aur wahi pe render hoga

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession(); //useSession() Hook: This hook is called to retrieve the session data, which contains information about the user's authentication status and profile.
  // yeh jo User haina uske andar session ka saara ka saara data hota hai
  // yeh jo pura session hai woh pura pura ka User ke andar jaata hai
  // current user ke baare mai information tumhe User se hi milegi
  const user = session?.user as User // according to doc data ki jagah session ka use karna chaiye


  return (
    <nav className="p-4 md:p-6 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <a className="text-xl font-bold mb-4 md:mb-0" href="">Myestery Message</a>
            {
                session?(
                    <>
                    <span className="mr-4 ">Welcome {user?.username || user?.email}</span>
                    <Button className="w-full md:m-auto" onClick={()=>signOut()}>Logout</Button>
                    </>
                ):(
                    <Link href='sign-in'>
                        <Button className="w-full md:m-auto">Log In</Button>
                    </Link>
                )
            }
        </div>
    </nav>
  )
};

export default Navbar;
