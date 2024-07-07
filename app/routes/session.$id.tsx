import { json, LoaderFunctionArgs } from '@remix-run/node'
import React from 'react'
import { useLoaderData } from 'react-router'
import SessionSchema from '../models/Session'
import { authenticator } from '~/auth.server'

export const loader = async ({request, params}: LoaderFunctionArgs) => {
    const user = await authenticator.isAuthenticated(request, {failureRedirect:'/login'});
    const session = await SessionSchema.find({_id:params.id})
    return {session:session[0], user}
}


const Session = () => {
  const data:any = useLoaderData();
  const currentSession = data.session as any;
  const userId = data.user.identifiant;
  const currentUserSession = currentSession.session.find((elem:any) => elem.identifiant === userId)

  console.log(userId, currentSession)

  return (
    <div className="p-8">
      <h1 className="title">{currentSession.title}</h1> 
      <div className="flex gap-4">
        <h2 className="font-bold">Participants :</h2>
        {currentSession.participants.map((participant:any,i:number) => {
          return(
            <div key={i}>{participant}</div>
          )
        })}
      </div>


      <div className="my-notes-wrapper p-4">
          <h2 className="font-bold">Mes notes :</h2>
          <div className="flex gap-4 pt-2">
        {currentUserSession.notes_concurrent.map((concurrent:any, i:number) =>{
          return (
            <div key={i} className="border-2 p-4">
              <h2 className="font-bold">{concurrent.username}</h2>
                <div>nourriture : {concurrent.notes.nourriture}</div>
                <button className="btn btn-primary">Editer</button>
            </div>
          )
        })}
        </div>
      </div>


      <div className="notes-global-wrapper p-4">
      <h2 className="font-bold">Les notes globales :</h2>
      <div className="flex gap-4 pt-2">
        {currentSession.session.map((user:any, i:number) => {
          console.log(user)
          return(
            <div key={i} className="border-2 p-4">
            <h2 className="font-bold">{user.username} <span>{user.total}/20</span></h2>
            <div>nourriture : {user.moyenne.nourriture}</div>
            
          </div>
          )
        })}
        </div>
      </div>
    </div>
  )
}

export default Session