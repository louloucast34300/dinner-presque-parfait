import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node'
import React, {useState, useEffect} from 'react'
import { useLoaderData } from 'react-router'
import SessionSchema from '../models/Session'
import UserSchema from '../models/User'
import { authenticator } from '~/auth.server'
import { clsx } from "clsx";
import { Form } from '@remix-run/react'

export const loader = async ({request, params}: LoaderFunctionArgs) => {
    const user = await authenticator.isAuthenticated(request, {failureRedirect:'/login'});
    const session = await SessionSchema.find({_id:params.id})
    return {session:session[0], user}
}


const Session = () => {
  const [openPopup, setOpenPopup] = useState(false)
  const [currentEdit, setCurrentEdit] = useState({
    username:"",
    identifiant:"",
    nourriture:0,

  })
  const data:any = useLoaderData();
  const currentSession = data.session as any;
  const userId = data.user.identifiant;
  const currentUserSession = currentSession.session.find((elem:any) => elem.identifiant === userId)
  const currentConcurrentSession = [] as any;

  currentSession.session.forEach((participant:any) => {
    participant.notes_concurrent.forEach((concurrent:any) => {
      if(concurrent.identifiant === userId){
        console.log(concurrent)
        currentConcurrentSession.push({
          concurrent_username:participant.username,
          concurrent_identifiant:participant.identifiant,
          user:concurrent
        })
      }
    })
  })
  console.log(currentConcurrentSession)
  // concurrent_identifiant
  // : 
  // "liliaJFn8"
  // concurrent_username
  // : 
  // "lili"
  // user
  // : 
  // {username: 'louis', identifiant: 'louisODIBQ', notes: {…}, _id: '668b1335b7e8c5019302c68e'

  const handleCurrentEdit = (e:any) => {
    const identifiant = e.target.value;
console.log('identifiant', identifiant)

    const current_concurrent = currentConcurrentSession.find((elem:any) => elem.concurrent_identifiant === identifiant)
    // const current_concurrent = currentConcurrentSession.notes_concurrent.find((elem:any) => elem.identifiant === identifiant);
    console.log("current_concurrent", current_concurrent)

    setCurrentEdit({
      username:current_concurrent.concurrent_username,
      identifiant: current_concurrent.concurrent_identifiant,
      nourriture:current_concurrent.user.notes.nourriture
    })
    setOpenPopup(true);
  }

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

        {currentConcurrentSession.map((concurrent:any, i:number) =>{
          return (
            <div key={i} className="border-2 p-4">
              <h2 className="font-bold">{concurrent.concurrent_username}</h2>
                <div>nourriture : {concurrent.user.notes.nourriture}</div>
                <button value={concurrent.concurrent_identifiant} className="btn btn-primary" onClick={handleCurrentEdit}>Editer</button>
            </div>
          )
        })}
        </div>
      </div>


      <div className="notes-global-wrapper p-4">
      <h2 className="font-bold">Les notes globales :</h2>
      <div className="flex gap-4 pt-2">
        {currentSession.session.map((user:any, i:number) => {
          return(
            <div key={i} className="border-2 p-4">
            <h2 className="font-bold">{user.username} <span>{user.total}/20</span></h2>
            <div>nourriture : {user.moyenne.nourriture}</div>
          </div>
          )
        })}
        </div>
      </div>


      <div className={clsx(openPopup === true ? "popup popup-open" : "popup")}>
        <div className="popup-inner">
          <button className="btn btn-secondary" onClick={() => setOpenPopup(false)}>
            Fermer
          </button>

          <Form method="POST">
            <div>
              <label htmlFor="nourriture">
                nourriture
                {currentEdit.username}
                <input min='0' max='20' className="border-2" id="nourriture" type="number" name="nourriture" defaultValue={currentEdit.nourriture} />

                <input type="hidden" name="identifiant_concurrent" defaultValue={currentEdit.identifiant} />
                <input type="hidden" name="username_user" defaultValue={data.user.username} />
                <input type="hidden" name="identifiant_user" defaultValue={userId}/>
                <input type="hidden" name="identifiant_session" defaultValue={currentSession._id}  />
                <input type="hidden" name="username_concurrent" defaultValue={currentEdit.username} />
              </label>
            </div>
            <button type="submit">submit</button>
          </Form>

        </div>
      </div>
    </div>
  )
}

export default Session




export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const sessionId = form.get("identifiant_session") as string;
  const userId = form.get("identifiant_user") as string;
  const userUsername = form.get("username_user") as string;
  const usernameConcurrent = form.get("username_concurrent") as string;
  const identifiantConcurrent = form.get("identifiant_concurrent") as string;
  const nourriture = Number(form.get("nourriture"));

  // Afficher les valeurs pour débogage
  console.log(usernameConcurrent, identifiantConcurrent, nourriture);

  try {
    // Trouver la session par son identifiant
    const session = await SessionSchema.findById(sessionId);

    if (session) {
      // Trouver le participant actuel dans la session en utilisant userId
      const participant = session.session.find(
        (p) => p.identifiant === identifiantConcurrent
      );

      if (participant) {
        // Ajouter ou mettre à jour les informations du concurrent
        const concurrentIndex = participant.notes_concurrent.findIndex(
          (c) => c.identifiant === userId
        );

        if (concurrentIndex > -1) {
          // Mettre à jour les informations du concurrent existant
          participant.notes_concurrent[concurrentIndex].notes.nourriture = nourriture;
        } else {
          // Ajouter un nouveau concurrent
          participant.notes_concurrent.push({
            username: usernameConcurrent,
            identifiant: identifiantConcurrent,
            notes: {
              nourriture: nourriture,
            },
          });
        }

        // Recalculer la moyenne et le total
        const totalNotes = participant.notes_concurrent.reduce((acc, curr) => acc + curr.notes.nourriture, 0);
        const nombreNotes = participant.notes_concurrent.length;
        const moyenneNotes = totalNotes / nombreNotes;

        // Mettre à jour les champs moyenne et total
        participant.moyenne = {
          nourriture: moyenneNotes
        };
        participant.total = (moyenneNotes / 20) * 20; // Assurez-vous que le total soit sur une base de 20

        // Sauvegarder la session mise à jour
        await session.save();
        console.log('Session updated:', session);
      } else {
        console.error('Participant not found');
      }
    } else {
      console.error('Session not found');
    }

    return json({ success: true });
  } catch (err: any) {
    console.error('Error updating session:', err.message);
    return json({ error: err.message });
  }
};
