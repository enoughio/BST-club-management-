"use server"

import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function logout() {
    
    console.log("action logout called ")

    const cookiestore  = await cookies(); 
    cookiestore.delete("x-bst-user-role") 
    cookiestore.delete("x-bst-token") 

    redirect("/login")

    
}