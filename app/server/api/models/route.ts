import { NextResponse } from "next/server";

const testData = [
  {id: 'test1', content: 'return available models here'},
  {id: 'test2', content: 'i love you'},
]

export async function GET() {
  return NextResponse.json(testData)
}