import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/auth.server";
import { Link } from "@remix-run/react";
import LogoutBtn from "~/components/logout";

type User = {
  _id: string,
  username: string,
  password: string,
  __v: number
}

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
export async function loader({ request }: LoaderFunctionArgs) {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect:"/login"
  });
  return null;
};


export default function Index() {
  // const data = useLoaderData<User>();
  
  return (
    <div>
      <div>
      </div>
      {/* {data.username} */}
    </div>
  );

}
  export async function action({ request }: ActionFunctionArgs) {
    await authenticator.logout(request, { redirectTo: "/login" });
  };