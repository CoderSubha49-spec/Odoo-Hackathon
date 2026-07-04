import { Bell, Search } from "lucide-react";

export default function Navbar() {
  return (

    <div className="bg-white shadow rounded-xl p-5 flex justify-between items-center">

      <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-xl w-96">

        <Search size={18} />

        <input
          className="bg-transparent outline-none w-full"
          placeholder="Search employees..."
        />

      </div>

      <div className="flex items-center gap-6">

        <Bell size={22} className="cursor-pointer"/>

        <div className="flex items-center gap-3">

          <img
            src="https://i.pravatar.cc/45"
            className="rounded-full"
          />

          <div>

            <h2 className="font-semibold">
              Admin
            </h2>

            <p className="text-gray-500 text-sm">
              HR Manager
            </p>

          </div>

        </div>

      </div>

    </div>

  );
}