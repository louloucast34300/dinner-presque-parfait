import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, Link, Form } from "@remix-run/react";
import User from "~/models/User";
import bcrypt from "bcryptjs"
import { authenticator } from "~/auth.server";


export async function loader({
  request,
}: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {successRedirect:'/'});
  return null;
}



const RegisterRoute = () => {
    return (
      <div>
        <h1 className="title">Register</h1>
          <Form action="/register" method="post">
            <label htmlFor="username">Username</label>
            <input id="username" type="text" className="border" name="username"/>
            <label htmlFor="password">Password</label>
            <input id="password" type="text" className="border" name="password"/>
            <button type="submit">submit</button>
          </Form>
      </div>
    )
  }
  
  
  export async function action({
    request,
  }: ActionFunctionArgs) {
    const form = await request.clone().formData();
    const username = form.get("username") as string;
    const password = form.get("password") as string;
  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    const user = new User({ username, password: hashedPassword });
    await user.save();

    return await authenticator.authenticate("form", request, {
      successRedirect: "/",
      failureRedirect: "/register",
      context:{formData: form}
    });
  }
  
  
  
  
  export default RegisterRoute