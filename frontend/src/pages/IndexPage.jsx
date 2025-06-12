import { useUserContext } from "../contexts/UserContext";
import LandingLayout from "../layouts/LandingLayout";

export default function IndexPage() {
  const [user, setUser] = useUserContext();
  console.log(user);

  return (
    <LandingLayout>
      <div className="relative isolate px-6 py-60 sm:py-96 lg:px-8">
        <svg
          aria-hidden="true"
          className="absolute inset-0 -z-10 size-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        >
          <defs>
            <pattern
              x="50%"
              y={0}
              id="1d4240dd-898f-445f-932d-e2872fd12de3"
              width={200}
              height={200}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={0} className="overflow-visible fill-gray-800/20">
            <path
              d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect fill="url(#1d4240dd-898f-445f-932d-e2872fd12de3)" width="100%" height="100%" strokeWidth={0} />
        </svg>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-10 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
        >
          <div
            style={{
              clipPath:
                "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
            }}
            className="aspect-[1108/632] w-[69.25rem] flex-none bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"
          />
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Boost your productivity. Start using Bumper Buddy today.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg/8 text-gray-300">
            Bumper Buddy is an AI-powered auto insurance claims management tool.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {user?.id ? (
              <>
                <a
                  href="/dashboard"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Dashboard
                </a>
                <a href="/accounts/logout" className="text-sm/6 font-semibold text-white">
                  Log out
                </a>
              </>
            ) : (
              <>
                <a
                  href="/accounts/signup"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Sign up
                </a>
                <a href="/accounts/login" className="text-sm/6 font-semibold text-white">
                  Log in
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </LandingLayout>
  );
}
