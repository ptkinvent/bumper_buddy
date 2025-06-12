export default function LandingLayout({ children }) {
  return (
    <div className="bg-gray-900">
      <main>{children}</main>

      <footer className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="border-t border-white/10 py-12 md:flex md:items-center md:justify-between">
          <div className="flex justify-center gap-x-6 md:order-2"></div>
          <p className="mt-8 text-center text-sm/6 text-gray-400 md:order-1 md:mt-0">
            &copy; 2025 Prateek Sahay. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
