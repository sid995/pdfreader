import { NextResponse } from "next/server"

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json()
    const { file_key, file_name } = body
    console.log({ file_key, file_name })
    return NextResponse.json({ message: "success" })

  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    )
  }
}