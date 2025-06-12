import { useEffect, useState } from "react";
import { useUserContext } from "../contexts/UserContext";
import { Input } from "../elements/input";
import { Button } from "../elements/button";

export default function SignupPage() {
  const [user, setUser] = useUserContext();
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="flex min-h-full flex-1 bg-white dark:bg-secondary-800">
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
              Sign up for a new account
            </h2>
          </div>

          <div className="mt-10">
            <div>
              <form method="POST" action="/accounts/signup/" className="space-y-6">
                <input type="hidden" name="csrfmiddlewaretoken" value={user.csrfToken} />

                <div className="flex gap-4">
                  <div>
                    <label
                      htmlFor="id_first_name"
                      className="block text-sm/6 font-medium text-secondary-900 dark:text-secondary-100"
                    >
                      First name
                    </label>
                    <div className="mt-2">
                      <Input
                        type="text"
                        name="first_name"
                        autoComplete="first_name"
                        maxLength="30"
                        required
                        id="id_first_name"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="id_last_name"
                      className="block text-sm/6 font-medium text-secondary-900 dark:text-secondary-100"
                    >
                      Last name
                    </label>
                    <div className="mt-2">
                      <Input
                        type="text"
                        name="last_name"
                        autoComplete="last_name"
                        maxLength="30"
                        required
                        id="id_last_name"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="id_email"
                    className="block text-sm/6 font-medium text-secondary-900 dark:text-secondary-100"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <Input type="email" name="email" autoComplete="email" maxLength="320" required id="id_email" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="id_password1"
                    className="block text-sm/6 font-medium text-secondary-900 dark:text-secondary-100"
                  >
                    Password
                  </label>
                  <div className="mt-2">
                    <Input
                      type="password"
                      name="password1"
                      autocCmplete="current-password"
                      required
                      id="id_password1"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm/6">
                    <a
                      href="/accounts/login"
                      className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-500"
                    >
                      Already have an account? Log in
                    </a>
                  </div>
                </div>

                <div>
                  <Button color="indigo" type="submit" className="w-full">
                    Sign up
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
