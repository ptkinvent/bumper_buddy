import { useEffect, useState } from "react";
import { useUserContext } from "../contexts/UserContext";
import { Input } from "../elements/input";
import { CheckboxField, Checkbox } from "../elements/checkbox";
import { Label } from "../elements/fieldset";
import { Button } from "../elements/button";

export default function LoginPage() {
  const [user, setUser] = useUserContext();
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="flex min-h-full flex-1">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <a href="/">
              <img
                alt="Your Company"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                className="h-10 w-auto"
              />
            </a>
            <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-secondary-900 dark:text-secondary-100">
              Log in to your account
            </h2>
          </div>

          <div className="mt-10">
            <div>
              <form method="POST" className="space-y-6">
                <input type="hidden" name="csrfmiddlewaretoken" value={user.csrfToken} />
                <div>
                  <label
                    htmlFor="id_login"
                    className="block text-sm/6 font-medium text-secondary-900 dark:text-secondary-100"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <Input type="email" name="login" autoComplete="email" maxLength="320" required id="id_login" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="id_password"
                    className="block text-sm/6 font-medium text-secondary-900 dark:text-secondary-100"
                  >
                    Password
                  </label>
                  <div className="mt-2">
                    <Input type="password" name="password" autoComplete="current-password" required id="id_password" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <CheckboxField>
                      <Checkbox name="remember" id="id_remember" color="indigo" />
                      <Label htmlFor="id_remember">Remember me</Label>
                    </CheckboxField>
                  </div>

                  <div className="text-sm/6">
                    <a
                      href="/accounts/signup"
                      className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-500"
                    >
                      Don't have an account? Sign up
                    </a>
                  </div>
                </div>

                <div>
                  <Button color="indigo" type="submit" className="w-full">
                    Log in
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
          className="absolute inset-0 size-full object-cover"
        />
      </div>
    </div>
  );
}
