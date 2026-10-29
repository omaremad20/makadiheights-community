// Verifies, with the PUBLIC (publishable) key, that visitors can read the
// portal data and documents but cannot write anything.
//
//   node --env-file=.env.local scripts/verify-readonly.mjs
//
// Every write attempt below must be rejected. The probes target rows and
// files that do not exist, so even if a policy were wrong no real data or
// document could be changed. Table writes are expected to fail with a
// privilege error (42501) because anon has SELECT-only grants.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (e.g. via --env-file=.env.local).");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });
const BUCKET = "makadiheights-data";
let failures = 0;
const pass = (msg) => console.log(`  ✓ ${msg}`);
const fail = (msg) => {
  failures++;
  console.log(`  ✗ ${msg}`);
};

console.log("Reads (should succeed)");
for (const table of ["departments", "businesses", "bank_accounts", "membership_prices", "penalties", "documents"]) {
  const { data, error } = await supabase.from(table).select("*").limit(1);
  if (error) fail(`select ${table}: ${error.message}`);
  else pass(`select ${table} (${data.length} row)`);
}
const pub = await fetch(`${url}/storage/v1/object/public/${BUCKET}/security-awareness-.pdf`, { method: "HEAD" });
if (pub.ok) pass(`public download (HTTP ${pub.status})`);
else fail(`public download returned HTTP ${pub.status}`);

console.log("Database writes (should be denied)");
{
  const { error } = await supabase.from("site_settings").insert({ key: "__probe__", value: "x" });
  if (error) pass(`insert denied: ${error.code ?? error.message}`);
  else fail("INSERT into site_settings succeeded");
}
{
  const { error } = await supabase.from("membership_prices").update({ base_price: 0 }).eq("package_id", "__no_such_package__");
  if (error) pass(`update denied: ${error.code ?? error.message}`);
  else fail("UPDATE on membership_prices was not rejected");
}
{
  const { error } = await supabase.from("penalties").delete().eq("id", -1);
  if (error) pass(`delete denied: ${error.code ?? error.message}`);
  else fail("DELETE on penalties was not rejected");
}

console.log("Storage writes (should be denied)");
{
  const { error } = await supabase.storage.from(BUCKET).upload(`__probe__/${Date.now()}.txt`, new Blob(["probe"]), { upsert: false });
  if (error) pass(`upload denied: ${error.message}`);
  else fail("UPLOAD succeeded");
}
{
  const { error } = await supabase.storage.from(BUCKET).update("__probe__/overwrite.txt", new Blob(["probe"]), { upsert: true });
  if (error) pass(`overwrite denied: ${error.message}`);
  else fail("OVERWRITE succeeded");
}
{
  const { data, error } = await supabase.storage.from(BUCKET).remove(["__probe__/does-not-exist.txt"]);
  if (error || (data ?? []).length === 0) pass("delete denied / removed 0 files");
  else fail(`DELETE removed ${data.length} file(s)`);
}
{
  const { error } = await supabase.storage.createBucket(`probe-${Date.now()}`);
  if (error) pass(`create bucket denied: ${error.message}`);
  else fail("CREATE BUCKET succeeded");
}

console.log(failures === 0 ? "\nAll checks passed: public access is read-only." : `\n${failures} check(s) FAILED — review the policies.`);
process.exit(failures === 0 ? 0 : 1);
