import { Fragment, useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, Menu, Transition, TransitionChild } from "@headlessui/react";
import { useUserContext } from "../contexts/UserContext";
import { SwitchField, Switch } from "../elements/switch";
import { Avatar } from "../elements/avatar";
import {
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  ChevronUpDownIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  MoonIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function MultiColumnLayout({ currentTab, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useUserContext();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon, current: currentTab === "dashboard" },
    { name: "Claims", href: "/claims", icon: DocumentDuplicateIcon, current: currentTab === "claims" },
    { name: "Library", href: "/library", icon: FolderIcon, current: currentTab === "library" },
  ];

  return (
    <>
      <div>
        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-secondary-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                  </button>
                </div>
              </TransitionChild>

              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                <div className="flex h-16 shrink-0 items-center">
                  <a href="/">
                    <img
                      alt="Your Company"
                      src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                      className="h-8 w-auto"
                    />
                  </a>
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className={`${
                                item.current
                                  ? "bg-secondary-50 text-primary-600"
                                  : "text-secondary-700 hover:bg-secondary-50 hover:text-primary-600"
                              } group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold`}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={`${
                                  item.current ? "text-primary-600" : "text-secondary-400 group-hover:text-primary-600"
                                } size-6 shrink-0`}
                              />
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-secondary-200 dark:border-secondary-900 bg-primary-950 dark:bg-secondary-900 px-6">
            <div className="flex h-16 shrink-0 items-center">
              <a href="/">
                <img
                  alt="Your Company"
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                  className="h-8 w-auto"
                />
              </a>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={`${
                            item.current
                              ? "bg-primary-900 text-secondary-50"
                              : "text-secondary-400 hover:bg-primary-900 hover:text-secondary-50"
                          } group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold`}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={`${
                              item.current ? "text-secondary-50" : "text-secondary-400 group-hover:text-secondary-50"
                            } size-6 shrink-0`}
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="-mx-6 mt-auto">
                  <UserMenu />
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-secondary-700 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
          <div className="flex-1 text-sm/6 font-semibold text-secondary-900">Dashboard</div>
          <a href="#">
            <span className="sr-only">Your profile</span>
            <img
              alt=""
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              className="size-8 rounded-full bg-secondary-50"
            />
          </a>
        </div>

        {children}
      </div>
    </>
  );
}

function UserMenu() {
  const [user, setUser] = useUserContext();
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const roles = [
    { name: "Claims Agent", value: "agent" },
    { name: "Senior Claims Adjuster", value: "adjuster" },
  ];

  const displayRole = roles.find((role) => role.value === user.role)?.name;

  function handleChangeDarkMode(checked) {
    setDarkMode(checked);
  }

  return (
    <Menu as="div">
      <Menu.Button className="w-full cursor-pointer relative flex items-center gap-x-4 px-6 py-3 hover:bg-primary-900 data-[active]:bg-primary-900 dark:hover:bg-secondary-950 data-[active]:dark:bg-secondary-950 outline-none">
        <div className="size-8 bg-white dark:bg-secondary-900 rounded-full">
          <Avatar className="size-8" initials={`${user.firstName[0]}${user.lastName[0]}`} />
        </div>
        <div className="flex flex-col text-left flex-grow">
          <span className="block text-secondary-50 text-sm font-medium">
            {user.firstName} {user.lastName}
          </span>
          <span className="flex gap-1 items-center text-secondary-400 text-xs truncate">{displayRole}</span>
        </div>
        <ChevronUpDownIcon className="size-4 stroke-secondary-400" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`absolute overflow-hidden bg-primary-950 dark:bg-secondary-800 bottom-0 left-4 mb-16 z-10 w-64 border border-primary-800 dark:border-secondary-700 origin-bottom rounded-md shadow-lg ring
    -1 ring-black ring-opacity-5 focus:outline-none`}
        >
          <SwitchField className="px-4 py-2">
            <div className="flex items-center gap-3 text-secondary-300 dark:text-white text-sm">
              <MoonIcon className="size-4 stroke-white" /> Dark mode
            </div>
            <Switch color="indigo" name="darkMode" checked={darkMode} onChange={handleChangeDarkMode} />
          </SwitchField>

          <Menu.Item>
            {({ active }) => (
              <a
                className={`${
                  active
                    ? "bg-primary-900 text-secondary-50 dark:bg-secondary-900"
                    : "text-secondary-300 dark:text-white"
                } w-full text-left px-4 py-2 text-sm flex items-center gap-3 dark:text-white`}
                href="/accounts/logout"
              >
                <ArrowRightStartOnRectangleIcon className="size-4 stroke-white" />
                Log out
              </a>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export function MainColumn({ children }) {
  return (
    <main className="lg:pl-72">
      <div className="xl:pr-96">
        <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">{children}</div>
      </div>
    </main>
  );
}

export function AsideColumn({ children }) {
  return (
    <aside className="fixed inset-y-0 right-0 hidden w-96 overflow-y-auto border-l border-secondary-200 dark:border-secondary-900 bg-secondary-50 dark:bg-secondary-800 px-4 py-6 sm:px-6 lg:px-8 xl:block">
      {children}
    </aside>
  );
}
