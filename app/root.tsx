import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import "./tailwind.css";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "./auth.server";
import LogoutBtn from "./components/logout";
import Navigation from "./components/navigation";


type User = {
  _id: string,
  username: string,
  password: string,
  __v: number
}

export async function loader({ request}: LoaderFunctionArgs){
    let user = await authenticator.isAuthenticated(request, {});
    console.log(user)
    return user;
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.clone().formData();
  if(form.get('action') === 'logout'){
    await authenticator.logout(request, { redirectTo: "/login" });
  }
};


export function Layout({ children }: { children: React.ReactNode }) {
  const user = useLoaderData<User>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Navigation user={user}/>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
