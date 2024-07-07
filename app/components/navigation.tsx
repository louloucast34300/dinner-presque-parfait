import React from "react";
import LogoutBtn from "./logout";
import { Link } from "@remix-run/react";

type User = {
  _id: string;
  username: string;
  password: string;
  identifiant:string;
  __v: number;
};
const Navigation = ({ user }: { user: User | null }) => {
  return (
    <header>
      <nav className="flex">
        {user ? (
          <div className="flex justify-between w-full p-4 border-b-2 items-center">
            <Link to="/" className="w-[150px]">
              <img src="/image/logo.webp" alt="" />
            </Link>
            <div className="flex gap-4 items-center">
              <div className="user">{user.username} <span className="text-base ">id: ({user.identifiant})</span></div>
              <LogoutBtn />
            </div>
          </div>
        ) : (
          <div className="flex justify-between w-full p-4 border-b-2 items-center">
            <div className="w-[150px]">
              <img src="/image/logo.webp" alt="" />
            </div>
            <div className="flex gap-4">
              <Link className="btn btn-primary inline-flex" to="/login">Connexion</Link>
              <Link className="btn btn-secondary block" to="/register">S'enregistrer</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navigation;
