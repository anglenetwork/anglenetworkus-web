import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function isValidDateYYYYMMDD(value: string) {
  // Basic validation; DB constraint can enforce more.
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  const user = userData?.user;

  if (userErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const firstNameRaw =
    typeof body?.firstName === "string" ? body.firstName : "";
  const lastNameRaw = typeof body?.lastName === "string" ? body.lastName : "";
  const dobRaw =
    body?.dateOfBirth === null || body?.dateOfBirth === undefined
      ? null
      : String(body.dateOfBirth);

  const first_name = firstNameRaw.trim() || null;
  const last_name = lastNameRaw.trim() || null;

  let date_of_birth: string | null = null;
  if (dobRaw) {
    if (!isValidDateYYYYMMDD(dobRaw)) {
      return NextResponse.json(
        { error: "Invalid dateOfBirth format. Expected YYYY-MM-DD." },
        { status: 400 },
      );
    }
    date_of_birth = dobRaw;
  }

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id, // always use authenticated user id
        first_name,
        last_name,
        date_of_birth,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )
    .select("first_name,last_name,date_of_birth")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    );
  }

  return NextResponse.json(
    { profile: data ?? null },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  );
}
