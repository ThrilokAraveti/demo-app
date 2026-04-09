import Link from "next/link";

export default function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome</h1>

      <div style={{ marginTop: "20px" }}>
        <Link href="/login">Go to Login</Link>
      </div>

      <div style={{ marginTop: "10px" }}>
        <Link href="/register">Go to Register</Link>
      </div>
    </div>
  );
}