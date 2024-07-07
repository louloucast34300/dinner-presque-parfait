import React, { useEffect, useState } from "react";

import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { authenticator } from "~/auth.server";
import { clsx } from "clsx";
import {
  Form,
  json,
  Link,
  useActionData,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import UserSchema from "../models/User";
import Session from "../models/Session";

type Users = {
  _id: string;
  username: string;
  password: string;
  identifiant: string;
  __v: number;
}[];

type User = {
  _id: string;
  username: string;
  password: string;
  identifiant: string;
  __v: number;
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const users = await UserSchema.find({});

  const sessions = await Session.find({ participants: user.identifiant });
  return { users, sessions };
}

export default function Index() {
  const [openPopup, setOpenPopup] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [personName, setPersonName] = React.useState<string[]>([]);
  const data = useLoaderData<any>();
  const dataAction = useActionData<{ success?: boolean; error?: string }>();

  useEffect(() => {
    if (dataAction?.success === true) {
      setOpenPopup(false);
    }
  }, [dataAction]);

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setOpenPopup(true)}>
        Nouveau diner presque parfait
      </button>
      <div className={clsx(openPopup === true ? "popup popup-open" : "popup")}>
        <div className="popup-inner">
          <button
            className="btn btn-secondary"
            onClick={() => setOpenPopup(false)}
          >
            Fermer
          </button>
          <Form method="POST">
            <fieldset>
              <legend>test</legend>
              {data.users.map((user: User, i: number) => {
                return (
                  <label key={i} htmlFor={user.username}>
                    <input
                      type="checkbox"
                      name="participant"
                      value={user.identifiant}
                      id={user.username}
                    />
                    {user.username}
                  </label>
                );
              })}
            </fieldset>
            <button type="submit">submit</button>
          </Form>
        </div>
      </div>
      {data.sessions.map((session: any, i: number) => {
        return (
          <div key={i}>
            <Link to={`/session/${session._id}`}>
              Voir cette session{session._id} - {session.title}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
                                                                                                                                                                                                                                                                                                     
export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const participants = form.getAll("participant") as string[];
  const sessionParticipant: any[] = [];

  // Première boucle avec des opérations asynchrones
  const participantPromises = participants.map(async (participant) => {
    const user = await UserSchema.findOne({ identifiant: participant });
    if (user) {
      sessionParticipant.push({
        username: user.username,
        identifiant: participant,
        notes_concurrent: [],
        moyenne:{nourriture:0},
        total:0,
      });
    }
  });

  // Attendre que toutes les opérations asynchrones soient terminées
  await Promise.all(participantPromises);

  // Deuxième boucle pour ajouter les autres participants à notes_concurrent
  sessionParticipant.forEach((userSession) => {
    sessionParticipant.forEach((otherUserSession) => {
      if (userSession.identifiant !== otherUserSession.identifiant) {
        userSession.notes_concurrent.push({
          username: otherUserSession.username,
          identifiant: otherUserSession.identifiant,
          notes: {
            nourriture: 0 // ou une autre valeur par défaut ou calculée
          }
        });
      }
    });
  });

  console.log(sessionParticipant); // Vérifiez que les données sont correctes avant de les sauvegarder

  try {
    const session = new Session({
      title: "Diner presque parfait",
      participants,
      session: sessionParticipant
    });
    await session.save();
    return json({ success: true });
  } catch (err: any) {
    return json({ error: err.message });
  }
}

