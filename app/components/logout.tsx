import { ActionFunctionArgs } from '@remix-run/node';
import { Form } from '@remix-run/react';
import React from 'react'
import { authenticator } from '~/auth.server';

const LogoutBtn = () => {
  return (
    <Form action="/" method="POST">
    <button className="btn btn-primary" type="submit" name="action" value="logout">Déconnexion</button>
  </Form>
  )
}

export default LogoutBtn