import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables
dotenv.config({ path: resolve(__dirname, "../.env.local") });

async function testSupabaseConnection() {
  console.log("🔍 Testing Supabase Connection...\n");

  // Test 1: Check if environment variables exist
  console.log("1️⃣ Checking Environment Variables:");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? "✅ Set" : "❌ Missing"}`);
  if (supabaseUrl) {
    console.log(`   Value: ${supabaseUrl.substring(0, 30)}...`);
  }

  console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${serviceRoleKey ? "✅ Set" : "❌ Missing"}`);
  if (serviceRoleKey) {
    console.log(`   Value: ${serviceRoleKey.substring(0, 20)}...${serviceRoleKey.substring(serviceRoleKey.length - 10)}`);
    console.log(`   Length: ${serviceRoleKey.length} characters`);
    console.log(`   Starts with: ${serviceRoleKey.substring(0, 10)}`);
  }

  console.log(`   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: ${publishableKey ? "✅ Set" : "❌ Missing"}`);
  if (publishableKey) {
    console.log(`   Value: ${publishableKey.substring(0, 20)}...`);
  }

  console.log();

  // Test 2: Validate URL format
  if (supabaseUrl) {
    console.log("2️⃣ Validating URL Format:");
    try {
      const url = new URL(supabaseUrl);
      console.log(`   ✅ Valid URL format`);
      console.log(`   Protocol: ${url.protocol}`);
      console.log(`   Host: ${url.host}`);
    } catch (error) {
      console.log(`   ❌ Invalid URL format: ${error}`);
      return;
    }
    console.log();
  } else {
    console.log("2️⃣ ❌ Cannot validate URL - NEXT_PUBLIC_SUPABASE_URL is missing\n");
    return;
  }

  // Test 3: Test connection with anon/publishable key
  if (supabaseUrl && publishableKey) {
    console.log("3️⃣ Testing Connection with Publishable/Anon Key:");
    try {
      const client = createClient(supabaseUrl, publishableKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      // Try a simple query that doesn't require auth
      const { data, error } = await client.from("profiles").select("count").limit(0);
      
      if (error) {
        console.log(`   ❌ Connection failed: ${error.message}`);
        console.log(`   Error code: ${error.code}`);
        console.log(`   Error details: ${JSON.stringify(error, null, 2)}`);
      } else {
        console.log(`   ✅ Connection successful with publishable key`);
      }
    } catch (error: any) {
      console.log(`   ❌ Exception: ${error.message}`);
      console.log(`   Stack: ${error.stack}`);
    }
    console.log();
  } else {
    console.log("3️⃣ ⚠️  Skipping - Missing URL or publishable key\n");
  }

  // Test 4: Test connection with service role key
  if (supabaseUrl && serviceRoleKey) {
    console.log("4️⃣ Testing Connection with Service Role Key:");
    try {
      const admin = createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      // Test admin API access
      console.log("   Testing admin API access...");
      const { data: users, error: usersError } = await admin.auth.admin.listUsers({
        page: 1,
        perPage: 1,
      });

      if (usersError) {
        console.log(`   ❌ Admin API access failed: ${usersError.message}`);
        console.log(`   Error code: ${usersError.status}`);
        console.log(`   Error details: ${JSON.stringify(usersError, null, 2)}`);
      } else {
        console.log(`   ✅ Service role key works - Admin API accessible`);
        console.log(`   Found ${users?.users?.length || 0} users (first page)`);
      }
    } catch (error: any) {
      console.log(`   ❌ Exception: ${error.message}`);
      console.log(`   Stack: ${error.stack}`);
    }
    console.log();
  } else {
    console.log("4️⃣ ⚠️  Skipping - Missing URL or service role key\n");
  }

  // Test 5: Test generating magic link (what global-setup does)
  if (supabaseUrl && serviceRoleKey) {
    console.log("5️⃣ Testing Magic Link Generation (Global Setup):");
    const testEmail = process.env.PLAYWRIGHT_TEST_EMAIL || "test@example.com";
    console.log(`   Using test email: ${testEmail}`);

    try {
      const admin = createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      // First, ensure user exists
      console.log("   Creating/checking test user...");
      const { data: userData, error: createError } = await admin.auth.admin.createUser({
        email: testEmail,
        email_confirm: true,
      });

      if (createError) {
        const msg = String(createError.message || "").toLowerCase();
        const alreadyExists =
          msg.includes("already") ||
          msg.includes("exists") ||
          msg.includes("registered") ||
          msg.includes("duplicate");

        if (alreadyExists) {
          console.log("   ℹ️  User already exists (this is OK)");
        } else {
          console.log(`   ❌ Failed to create user: ${createError.message}`);
          return;
        }
      } else {
        console.log(`   ✅ User created/verified: ${userData.user?.id}`);
      }

      // Now test generating magic link
      console.log("   Generating magic link...");
      const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
        type: "magiclink",
        email: testEmail,
        options: {
          redirectTo: "http://localhost:3000/auth/callback",
        },
      });

      if (linkError) {
        console.log(`   ❌ Failed to generate magic link: ${linkError.message}`);
        console.log(`   Error code: ${linkError.status}`);
        console.log(`   Error details: ${JSON.stringify(linkError, null, 2)}`);
      } else {
        console.log(`   ✅ Magic link generated successfully!`);
        console.log(`   Action link: ${linkData?.properties?.action_link?.substring(0, 80)}...`);
      }
    } catch (error: any) {
      console.log(`   ❌ Exception: ${error.message}`);
      console.log(`   Stack: ${error.stack}`);
    }
    console.log();
  } else {
    console.log("5️⃣ ⚠️  Skipping - Missing URL or service role key\n");
  }

  console.log("✅ Diagnostic complete!");
}

testSupabaseConnection().catch(console.error);

