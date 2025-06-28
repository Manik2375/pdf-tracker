import { getAllPdfMetaData } from "@/lib/actions";
import { NextResponse } from "next/server";

export async function GET(): Promise<Response> {
  try {
    const pdfs = await getAllPdfMetaData();
    return NextResponse.json(pdfs);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
