import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { signup } from "../services/authApi";
import { useAuthStore } from "../store/useAuthStore";

export default function SignupPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Create account</h1>
            <p className="text-sm text-slate-500">
              Join your workspace in under a minute.
            </p>
          </div>
          <form
            className="space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              setError(null);
              setLoading(true);
              const formData = new FormData(event.currentTarget);
              try {
                const payload = {
                  name: String(formData.get("name")),
                  email: String(formData.get("email")),
                  password: String(formData.get("password"))
                };
                const response = await signup(payload);
                setAuth(response.user, response.token);
                navigate("/dashboard");
              } catch (err: any) {
                setError(err?.response?.data?.message || "Signup failed");
              } finally {
                setLoading(false);
              }
            }}
          >
            <div>
              <label className="text-xs font-semibold text-slate-500">Full name</label>
              <Input name="name" placeholder="Ava Daniels" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Email</label>
              <Input name="email" type="email" placeholder="you@company.com" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Password</label>
              <Input name="password" type="password" placeholder="••••••••" required />
              <p className="mt-1 text-xs text-slate-400">
                Password must be at least 8 characters.
              </p>
            </div>
            {error ? (
              <p className="text-xs font-semibold text-danger">{error}</p>
            ) : null}
            <Button className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </Button>
            <p className="text-xs text-slate-500">
              Already have an account? <Link className="text-primary" to="/login">Sign in</Link>
            </p>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
