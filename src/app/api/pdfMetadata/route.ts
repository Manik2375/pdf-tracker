import { PDF } from "@/lib/db/models/pdf";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/connection";

export async function GET(): Promise<Response> {
   try {
     const session = await auth();
     if (!session) {
       return NextResponse.json({error: "Not logged in"}, {status: 401})
     };

     await connectToDatabase();

     const userId = session.user._id;
     const pdfs = await PDF.find({ userId: userId });

     return NextResponse.json(pdfs);
   } catch(error) {
     console.error(error)
     return NextResponse.json({error: "Internal server error"}, {status: 500})
   }

}