import React from 'react'
import type { ActionFunction, ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {Form, json, Link, useActionData, useLoaderData } from '@remix-run/react';
import Todo from '../../models/Todo'
import User from '../../models/User'
import { authenticator } from '~/auth.server';
import bcrypt from "bcryptjs"

export async function loader({request,}: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {successRedirect:'/'});
  return null;
}

const Loginroute = () => {
  const actionData = useActionData<{ success?: boolean; error?: string }>();
  return (
    <div>
      <h1 className="title">Login</h1>

        <Form action="/login" method="post">
          <label htmlFor="username">Username</label>
          <input id="username" type="text" className="border" name="username"/>
          <label htmlFor="password">Password</label>
          <input id="password" type="text" className="border" name="password"/>
          <button type="submit">submit</button>
        </Form>
      {actionData?.error && <p>Error: {actionData.error}</p>}
    </div>
  )
}


export async function action({
  request,
}: ActionFunctionArgs) {
    const form = await request.clone().formData()

      return await authenticator.authenticate("form", request, {
        successRedirect: "/",
        failureRedirect: "/login"
      });
};

export default Loginroute